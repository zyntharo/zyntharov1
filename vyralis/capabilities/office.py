"""Office document automation: Word, Excel, PowerPoint, PDF, Access.

Reads and writes real Office file formats natively (docx, xlsx, pptx, pdf) with
no Microsoft Office installation required, so it works on any machine. When
Microsoft Office (or LibreOffice) *is* present, extra capabilities unlock:
recalculating formulas, exporting to PDF and printing go through COM/UNO and
are reported honestly when unavailable.

Access databases are the one genuinely Windows-bound case: they need the
Microsoft Access ODBC driver, and the error message says exactly which one.
"""

from __future__ import annotations

import json
import logging
import platform
import subprocess
import tempfile
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Iterable, Sequence

from ..config import Settings
from ..safety.permissions import PathGuard
from ..tools.registry import ToolRegistry, obj, prop

log = logging.getLogger("vyralis.office")

SYSTEM = platform.system()
IS_WINDOWS = SYSTEM == "Windows"

DOCX = XLSX = PPTX = PDF = CSV = None
IMPORT_ERRORS: dict[str, str] = {}

try:
    import docx  # type: ignore

    DOCX = docx
except Exception as exc:  # noqa: BLE001
    IMPORT_ERRORS["docx"] = str(exc)

try:
    import openpyxl  # type: ignore

    XLSX = openpyxl
except Exception as exc:  # noqa: BLE001
    IMPORT_ERRORS["xlsx"] = str(exc)

try:
    import pptx  # type: ignore

    PPTX = pptx
except Exception as exc:  # noqa: BLE001
    IMPORT_ERRORS["pptx"] = str(exc)

try:
    import pypdf  # type: ignore

    PDF = pypdf
except Exception as exc:  # noqa: BLE001
    IMPORT_ERRORS["pdf"] = str(exc)

try:
    import csv as _csv

    CSV = _csv
except Exception as exc:  # noqa: BLE001
    IMPORT_ERRORS["csv"] = str(exc)


@dataclass
class CellRange:
    sheet: str
    values: list[list[Any]]

    def to_json(self) -> dict[str, Any]:
        return {"sheet": self.sheet, "rows": len(self.values),
                "cols": max((len(row) for row in self.values), default=0),
                "values": self.values}


class OfficeController:
    """Document creation, editing and conversion across the Office formats."""

    def __init__(self, settings: Settings, guard: PathGuard | None = None) -> None:
        self.settings = settings
        self.guard = guard or PathGuard(settings)

    # -- availability ---------------------------------------------------
    @staticmethod
    def capabilities() -> dict[str, Any]:
        return {
            "word": DOCX is not None,
            "excel": XLSX is not None,
            "powerpoint": PPTX is not None,
            "pdf": PDF is not None,
            "errors": IMPORT_ERRORS,
            "microsoft_office_installed": _has_microsoft_office(),
            "libreoffice": _find_libreoffice(),
            "access_driver": _access_driver(),
            "platform": SYSTEM,
        }

    def _resolve(self, path: str, *, must_exist: bool = False) -> Path:
        target = self.guard.check(path, must_exist=must_exist)
        target.parent.mkdir(parents=True, exist_ok=True)
        return target

    @staticmethod
    def _need(module: Any, name: str, extra: str) -> None:
        if module is None:
            raise RuntimeError(
                f"{name} support is not installed ({IMPORT_ERRORS.get(extra, 'missing module')}). "
                f"Install it with: pip install 'vyralis[office]'"
            )

    # ==================================================================
    # Word
    # ==================================================================
    def word_create(
        self, path: str, *, title: str = "", paragraphs: Sequence[str] = (),
        headings: Sequence[dict[str, Any]] = (), tables: Sequence[dict[str, Any]] = (),
        overwrite: bool = True,
    ) -> dict[str, Any]:
        self._need(DOCX, "Word", "docx")
        target = self._resolve(path)
        if target.exists() and not overwrite:
            raise FileExistsError(f"'{target}' already exists.")
        document = DOCX.Document()
        if title:
            document.add_heading(title, level=0)
        for heading in headings:
            document.add_heading(str(heading.get("text", "")), level=int(heading.get("level", 1)))
        for text in paragraphs:
            document.add_paragraph(text)
        for table_spec in tables:
            rows = table_spec.get("rows") or []
            if not rows:
                continue
            table = document.add_table(rows=len(rows), cols=max(len(row) for row in rows))
            table.style = table_spec.get("style", "Table Grid")
            for row_index, row in enumerate(rows):
                for column_index, value in enumerate(row):
                    table.cell(row_index, column_index).text = str(value)
            if table_spec.get("caption"):
                document.add_paragraph(str(table_spec["caption"]))
        document.save(str(target))
        return {"path": str(target), "bytes": target.stat().st_size}

    def word_read(self, path: str, *, include_tables: bool = True, limit: int = 2000) -> dict[str, Any]:
        self._need(DOCX, "Word", "docx")
        target = self._resolve(path, must_exist=True)
        document = DOCX.Document(str(target))
        paragraphs = [paragraph.text for paragraph in document.paragraphs if paragraph.text.strip()]
        style_map = [
            {"index": index, "text": paragraph.text, "style": paragraph.style.name if paragraph.style else ""}
            for index, paragraph in enumerate(document.paragraphs[:limit])
        ]
        tables: list[list[list[str]]] = []
        if include_tables:
            for table in document.tables:
                tables.append([[cell.text for cell in row.cells] for row in table.rows])
        return {
            "path": str(target), "paragraph_count": len(paragraphs),
            "text": "\n".join(paragraphs[:limit])[:40000],
            "outline": [item for item in style_map if item["style"].lower().startswith(("heading", "title"))],
            "tables": tables,
        }

    def word_edit(
        self, path: str, *, replace: dict[str, str] | None = None,
        append_paragraphs: Sequence[str] = (), headings: Sequence[dict[str, Any]] = (),
        add_table: dict[str, Any] | None = None,
    ) -> dict[str, Any]:
        self._need(DOCX, "Word", "docx")
        target = self._resolve(path, must_exist=True)
        document = DOCX.Document(str(target))
        replaced = 0
        if replace:
            for paragraph in document.paragraphs:
                for needle, value in replace.items():
                    if needle in paragraph.text:
                        replaced += 1
                        paragraph.text = paragraph.text.replace(needle, value)
            for table in document.tables:
                for row in table.rows:
                    for cell in row.cells:
                        for needle, value in replace.items():
                            if needle in cell.text:
                                cell.text = cell.text.replace(needle, value)
                                replaced += 1
        for heading in headings:
            document.add_heading(str(heading.get("text", "")), level=int(heading.get("level", 1)))
        for text in append_paragraphs:
            document.add_paragraph(text)
        if add_table and add_table.get("rows"):
            rows = add_table["rows"]
            table = document.add_table(rows=len(rows), cols=max(len(row) for row in rows))
            table.style = add_table.get("style", "Table Grid")
            for row_index, row in enumerate(rows):
                for column_index, value in enumerate(row):
                    table.cell(row_index, column_index).text = str(value)
        document.save(str(target))
        return {"path": str(target), "replacements": replaced}

    # ==================================================================
    # Excel
    # ==================================================================
    def excel_create(
        self, path: str, *, sheets: Sequence[dict[str, Any]] = (), overwrite: bool = True,
    ) -> dict[str, Any]:
        self._need(XLSX, "Excel", "xlsx")
        target = self._resolve(path)
        if target.exists() and not overwrite:
            raise FileExistsError(f"'{target}' already exists.")
        workbook = XLSX.Workbook()
        workbook.remove(workbook.active)
        for spec in (sheets or [{"name": "Sheet1"}]):
            worksheet = workbook.create_sheet(title=str(spec.get("name", "Sheet")))
            rows = spec.get("rows") or []
            if spec.get("headers"):
                worksheet.append(list(spec["headers"]))
            for row in rows:
                worksheet.append(list(row))
            _style_workbook_sheet(worksheet, header=bool(spec.get("headers")))
        workbook.save(str(target))
        return {"path": str(target), "sheets": [sheet.title for sheet in workbook.worksheets]}

    def excel_read(
        self, path: str, *, sheet: str | None = None, cell_range: str | None = None,
        formulas: bool = False, limit: int = 5000,
    ) -> dict[str, Any]:
        self._need(XLSX, "Excel", "xlsx")
        target = self._resolve(path, must_exist=True)
        workbook = XLSX.load_workbook(str(target), data_only=not formulas)
        worksheets = [workbook[sheet]] if sheet else list(workbook.worksheets)
        out: list[dict[str, Any]] = []
        for worksheet in worksheets:
            if cell_range:
                rows = [
                    [cell.value for cell in row]
                    for row in worksheet[cell_range]
                ]
            else:
                rows = [
                    [cell.value for cell in row]
                    for row in worksheet.iter_rows(max_row=limit)
                ]
            out.append({"sheet": worksheet.title, "rows": len(rows),
                        "cols": max((len(row) for row in rows), default=0), "values": rows[:limit]})
        return {"path": str(target), "sheets": out,
                "sheet_names": [worksheet.title for worksheet in workbook.worksheets]}

    def excel_write(
        self, path: str, *, sheet: str = "Sheet1", cells: Sequence[dict[str, Any]] = (),
        rows: Sequence[Sequence[Any]] = (), append: bool = True,
        formulas: Sequence[Sequence[str]] | None = None, number_formats: dict[str, str] | None = None,
        autofit: bool = True,
    ) -> dict[str, Any]:
        """Write into an existing workbook (or create it) without losing other sheets."""
        self._need(XLSX, "Excel", "xlsx")
        target = self._resolve(path)
        if target.exists():
            workbook = XLSX.load_workbook(str(target))
        else:
            workbook = XLSX.Workbook()
            if "Sheet" in workbook.sheetnames and sheet != "Sheet":
                workbook.remove(workbook.active)
        worksheet = workbook[sheet] if sheet in workbook.sheetnames else workbook.create_sheet(sheet)

        written = 0
        for cell in cells:
            worksheet[str(cell["address"])] = cell.get("value")
            written += 1
        if rows:
            if append:
                for row in rows:
                    worksheet.append(list(row))
                    written += 1
            else:
                for row_index, row in enumerate(rows, 1):
                    for column_index, value in enumerate(row, 1):
                        worksheet.cell(row=row_index, column=column_index, value=value)
                        written += 1
        if formulas:
            for formula_row in formulas:
                for column_index, expression in enumerate(formula_row, 1):
                    worksheet.cell(
                        row=worksheet.max_row + 1 if append else 1, column=column_index, value=expression
                    )
        for address, fmt in (number_formats or {}).items():
            if address in worksheet:
                worksheet[address].number_format = fmt
        if autofit:
            _style_workbook_sheet(worksheet)
        workbook.save(str(target))
        return {"path": str(target), "sheet": sheet, "cells_written": written,
                "rows_total": worksheet.max_row, "cols_total": worksheet.max_column}

    def excel_formula(self, path: str, *, sheet: str, cell: str, formula: str) -> dict[str, Any]:
        return self.excel_write(path, sheet=sheet, cells=[{"address": cell, "value": formula}])

    def excel_add_chart(self, path: str, *, sheet: str, kind: str = "bar",
                        data_range: str = "A1:B10", anchor: str = "E2",
                        title: str = "") -> dict[str, Any]:
        self._need(XLSX, "Excel", "xlsx")
        target = self._resolve(path, must_exist=True)
        workbook = XLSX.load_workbook(str(target))
        worksheet = workbook[sheet]
        chart_class = {
            "bar": XLSX.chart.BarChart, "line": XLSX.chart.LineChart,
            "pie": XLSX.chart.PieChart, "scatter": XLSX.chart.ScatterChart,
        }.get(kind, XLSX.chart.BarChart)
        chart = chart_class()
        chart.title = title or f"{kind} chart"
        chart.add_data(XLSX.chart.Reference(worksheet, range_string=f"'{sheet}'!{data_range}"), titles_from_data=True)
        worksheet.add_chart(chart, anchor)
        workbook.save(str(target))
        return {"path": str(target), "chart": kind, "anchor": anchor}

    def excel_convert(self, source: str, destination: str, *, delimiter: str = ",") -> dict[str, Any]:
        """CSV <-> XLSX in either direction, sniffing which way to go."""
        src = self._resolve(source, must_exist=True)
        dst = self._resolve(destination)
        if src.suffix.lower() in {".csv", ".tsv"} and dst.suffix.lower() in {".xlsx", ".xlsm"}:
            self._need(XLSX, "Excel", "xlsx")
            workbook = XLSX.Workbook()
            worksheet = workbook.active
            with src.open("r", encoding="utf-8-sig", newline="") as handle:
                for row in CSV.reader(handle, delimiter="\t" if src.suffix.lower() == ".tsv" else delimiter):
                    worksheet.append(row)
            _style_workbook_sheet(worksheet, header=True)
            workbook.save(str(dst))
            return {"converted": "csv->xlsx", "path": str(dst), "rows": worksheet.max_row}
        if src.suffix.lower() in {".xlsx", ".xlsm"} and dst.suffix.lower() in {".csv", ".tsv"}:
            self._need(XLSX, "Excel", "xlsx")
            workbook = XLSX.load_workbook(str(src), data_only=True)
            worksheet = workbook.active
            with dst.open("w", encoding="utf-8", newline="") as handle:
                writer = CSV.writer(handle, delimiter="\t" if dst.suffix.lower() == ".tsv" else delimiter)
                for row in worksheet.iter_rows(values_only=True):
                    writer.writerow(["" if value is None else value for value in row])
            return {"converted": "xlsx->csv", "path": str(dst), "rows": worksheet.max_row}
        raise ValueError("Supported conversions: csv/tsv -> xlsx, xlsx -> csv/tsv.")

    def excel_recalculate(self, path: str) -> dict[str, Any]:
        """Ask real Excel to recalculate (only possible when Office is installed)."""
        if not IS_WINDOWS or not _has_microsoft_office():
            return {
                "recalculated": False,
                "reason": "Recalculation needs Microsoft Excel. Calculated values are read as the "
                          "file's last saved cache; open the file in Excel once and save it.",
            }
        try:
            import win32com.client  # type: ignore

            target = self._resolve(path, must_exist=True)
            application = win32com.client.Dispatch("Excel.Application")
            application.Visible = False
            workbook = application.Workbooks.Open(str(target))
            application.CalculateFullRebuild()
            workbook.Save()
            workbook.Close(SaveChanges=True)
            application.Quit()
            return {"recalculated": True, "path": str(target)}
        except Exception as exc:  # noqa: BLE001
            return {"recalculated": False, "reason": f"Excel automation failed: {exc}"}

    # ==================================================================
    # PowerPoint
    # ==================================================================
    def slides_create(
        self, path: str, *, title: str = "", subtitle: str = "",
        slides: Sequence[dict[str, Any]] = (), overwrite: bool = True,
    ) -> dict[str, Any]:
        self._need(PPTX, "PowerPoint", "pptx")
        target = self._resolve(path)
        if target.exists() and not overwrite:
            raise FileExistsError(f"'{target}' already exists.")
        presentation = PPTX.Presentation()
        if title:
            cover = presentation.slides.add_slide(presentation.slide_layouts[0])
            cover.shapes.title.text = title
            if subtitle and len(cover.placeholders) > 1:
                cover.placeholders[1].text = subtitle
        for spec in slides:
            layout_index = int(spec.get("layout", 1))
            slide = presentation.slides.add_slide(
                presentation.slide_layouts[min(layout_index, len(presentation.slide_layouts) - 1)]
            )
            if spec.get("title") and slide.shapes.title is not None:
                slide.shapes.title.text = str(spec["title"])
            body = spec.get("bullets") or ([spec["body"]] if spec.get("body") else [])
            if body:
                placeholder = _body_placeholder(slide)
                if placeholder is not None:
                    frame = placeholder.text_frame
                    frame.text = str(body[0])
                    for bullet in body[1:]:
                        frame.add_paragraph().text = str(bullet)
            if spec.get("notes"):
                slide.notes_slide.notes_text_frame.text = str(spec["notes"])
            if spec.get("image") and Path(str(spec["image"])).exists():
                slide.shapes.add_picture(str(spec["image"]), left=0, top=0)
        presentation.save(str(target))
        return {"path": str(target), "slides": len(presentation.slides._sldIdLst)}  # type: ignore[attr-defined]

    def slides_read(self, path: str) -> dict[str, Any]:
        self._need(PPTX, "PowerPoint", "pptx")
        target = self._resolve(path, must_exist=True)
        presentation = PPTX.Presentation(str(target))
        slides: list[dict[str, Any]] = []
        for index, slide in enumerate(presentation.slides, 1):
            texts = []
            for shape in slide.shapes:
                if shape.has_text_frame:
                    texts.append(shape.text_frame.text)
            slides.append({
                "index": index, "title": slide.shapes.title.text if slide.shapes.title else "",
                "text": "\n".join(text for text in texts if text.strip()),
            })
        return {"path": str(target), "slide_count": len(slides), "slides": slides}

    # ==================================================================
    # PDF
    # ==================================================================
    def pdf_read(self, path: str, *, pages: str | None = None) -> dict[str, Any]:
        self._need(PDF, "PDF", "pdf")
        target = self._resolve(path, must_exist=True)
        reader = PDF.PdfReader(str(target))
        indices = _parse_pages(pages, len(reader.pages))
        extracted = []
        for index in indices:
            try:
                text = reader.pages[index].extract_text() or ""
            except Exception as exc:  # noqa: BLE001
                text = f"[could not extract: {exc}]"
            extracted.append({"page": index + 1, "text": text})
        return {
            "path": str(target), "page_count": len(reader.pages),
            "metadata": _pdf_metadata(reader), "pages": extracted,
            "text": "\n\n".join(item["text"] for item in extracted)[:60000],
        }

    def pdf_merge(self, sources: Sequence[str], destination: str) -> dict[str, Any]:
        self._need(PDF, "PDF", "pdf")
        writer = PDF.PdfWriter()
        for source in sources:
            reader = PDF.PdfReader(str(self._resolve(source, must_exist=True)))
            for page in reader.pages:
                writer.add_page(page)
        target = self._resolve(destination)
        with target.open("wb") as handle:
            writer.write(handle)
        return {"path": str(target), "sources": len(sources), "pages": len(writer.pages)}

    def pdf_split(self, source: str, *, pages: str = "1", destination: str | None = None) -> dict[str, Any]:
        self._need(PDF, "PDF", "pdf")
        src = self._resolve(source, must_exist=True)
        reader = PDF.PdfReader(str(src))
        indices = _parse_pages(pages, len(reader.pages))
        target = self._resolve(destination or str(src.with_name(f"{src.stem}-extract.pdf")))
        writer = PDF.PdfWriter()
        for index in indices:
            writer.add_page(reader.pages[index])
        with target.open("wb") as handle:
            writer.write(handle)
        return {"path": str(target), "pages": [index + 1 for index in indices]}

    def pdf_rotate(self, source: str, *, degrees: int = 90, pages: str | None = None,
                   destination: str | None = None) -> dict[str, Any]:
        self._need(PDF, "PDF", "pdf")
        src = self._resolve(source, must_exist=True)
        reader = PDF.PdfReader(str(src))
        writer = PDF.PdfWriter()
        indices = set(_parse_pages(pages, len(reader.pages)))
        for index, page in enumerate(reader.pages):
            if index in indices:
                page.rotate(degrees)
            writer.add_page(page)
        target = self._resolve(destination or str(src.with_name(f"{src.stem}-rotated.pdf")))
        with target.open("wb") as handle:
            writer.write(handle)
        return {"path": str(target), "rotated": sorted(index + 1 for index in indices), "degrees": degrees}

    def office_to_pdf(self, source: str, destination: str | None = None) -> dict[str, Any]:
        """Export a Word/Excel/PowerPoint file to PDF using Office, LibreOffice,
        or a pure-python path for text documents."""
        src = self._resolve(source, must_exist=True)
        target = self._resolve(destination or str(src.with_suffix(".pdf")))

        if IS_WINDOWS and _has_microsoft_office():
            try:
                import win32com.client  # type: ignore

                application_name = {
                    ".docx": "Word.Application", ".doc": "Word.Application",
                    ".xlsx": "Excel.Application", ".xls": "Excel.Application",
                    ".pptx": "PowerPoint.Application", ".ppt": "PowerPoint.Application",
                }.get(src.suffix.lower())
                if application_name:
                    application = win32com.client.Dispatch(application_name)
                    application.Visible = False
                    if "Word" in application_name:
                        document = application.Documents.Open(str(src))
                        document.SaveAs(str(target), FileFormat=17)
                        document.Close()
                    elif "Excel" in application_name:
                        workbook = application.Workbooks.Open(str(src))
                        workbook.ExportAsFixedFormat(0, str(target))
                        workbook.Close(False)
                    else:
                        presentation = application.Presentations.Open(str(src), WithWindow=False)
                        presentation.SaveAs(str(target), 32)
                        presentation.Close()
                    application.Quit()
                    return {"path": str(target), "method": "microsoft_office", "bytes": target.stat().st_size}
            except Exception as exc:  # noqa: BLE001
                log.warning("Office COM export failed: %s", exc)

        libreoffice = _find_libreoffice()
        if libreoffice:
            with tempfile.TemporaryDirectory() as workdir:
                subprocess.run(
                    [libreoffice, "--headless", "--convert-to", "pdf", "--outdir", workdir, str(src)],
                    capture_output=True, timeout=180, check=False,
                )
                produced = Path(workdir) / (src.stem + ".pdf")
                if produced.exists():
                    target.write_bytes(produced.read_bytes())
                    return {"path": str(target), "method": "libreoffice", "bytes": target.stat().st_size}

        if src.suffix.lower() == ".docx":
            self._need(DOCX, "Word", "docx")
            document = DOCX.Document(str(src))
            text = "\n".join(paragraph.text for paragraph in document.paragraphs)
            minimal_pdf = _text_to_pdf(text)
            if minimal_pdf is not None:
                target.write_bytes(minimal_pdf)
                return {
                    "path": str(target), "method": "python_text_only",
                    "warning": "Text-only PDF without original layout. Install Microsoft Office or "
                               "LibreOffice for a faithful export.",
                }

        raise RuntimeError(
            "No PDF exporter available. Install Microsoft Office or LibreOffice, "
            "or run `soffice --headless --convert-to pdf` manually."
        )

    # ==================================================================
    # Access / databases
    # ==================================================================
    def access_query(self, database: str, *, sql: str, fetch: int = 500,
                     parameters: Sequence[Any] = ()) -> dict[str, Any]:
        target = self._resolve(database, must_exist=True)
        driver = _access_driver()
        if driver is None:
            raise RuntimeError(
                "Access databases need the Microsoft Access ODBC driver. Install "
                "'Microsoft Access Database Engine 2016 Redistributable' (matching your Python's "
                "bitness), or export the .accdb to .xlsx/.csv from Access and read that instead."
            )
        try:
            import pyodbc  # type: ignore
        except ImportError as exc:
            raise RuntimeError("Install pyodbc to query Access databases: pip install pyodbc") from exc
        connection = pyodbc.connect(f"DRIVER={{{driver}}};DBQ={target};")
        try:
            cursor = connection.cursor()
            cursor.execute(sql, *parameters)
            if cursor.description is None:
                connection.commit()
                return {"rowcount": cursor.rowcount, "rows": [], "columns": []}
            columns = [column[0] for column in cursor.description]
            rows = [
                [str(value) for value in row]
                for _, row in zip(range(fetch), cursor.fetchall())
            ]
            return {"columns": columns, "rows": rows, "rowcount": len(rows)}
        finally:
            connection.close()

    def access_tables(self, database: str) -> dict[str, Any]:
        target = self._resolve(database, must_exist=True)
        driver = _access_driver()
        if driver is None:
            return {"driver": None, "tables": [],
                    "note": "Install the Microsoft Access Database Engine to list tables."}
        try:
            import pyodbc  # type: ignore

            connection = pyodbc.connect(f"DRIVER={{{driver}}};DBQ={target};")
            try:
                tables = [
                    row.table_name
                    for row in connection.cursor().tables(tableType="TABLE")
                    if not row.table_name.startswith("MSys")
                ]
                return {"driver": driver, "tables": tables}
            finally:
                connection.close()
        except Exception as exc:  # noqa: BLE001
            return {"driver": driver, "tables": [], "error": str(exc)}

    def csv_to_json(self, source: str, destination: str) -> dict[str, Any]:
        src = self._resolve(source, must_exist=True)
        dst = self._resolve(destination)
        with src.open("r", encoding="utf-8-sig", newline="") as handle:
            rows = list(CSV.DictReader(handle))
        dst.write_text(json.dumps(rows, indent=2, ensure_ascii=False), "utf-8")
        return {"path": str(dst), "records": len(rows)}


# ---------------------------------------------------------------------------
def _parse_pages(spec: str | None, total: int) -> list[int]:
    if not spec:
        return list(range(total))
    pages: list[int] = []
    for chunk in spec.split(","):
        chunk = chunk.strip()
        if not chunk:
            continue
        if "-" in chunk:
            start, _, end = chunk.partition("-")
            first = int(start) if start.strip() else 1
            last = int(end) if end.strip() else total
            pages.extend(range(first - 1, min(last, total)))
        else:
            pages.append(int(chunk) - 1)
    return [page for page in pages if 0 <= page < total]


def _pdf_metadata(reader: Any) -> dict[str, Any]:
    try:
        info = reader.metadata or {}
        return {key.lstrip("/"): str(value) for key, value in info.items()}
    except Exception:  # noqa: BLE001
        return {}


def _style_workbook_sheet(worksheet: Any, *, header: bool = False) -> None:
    if XLSX is None:
        return
    from openpyxl.styles import Alignment, Font, PatternFill

    widths: dict[int, int] = {}
    for row in worksheet.iter_rows():
        for cell in row:
            length = len(str(cell.value)) if cell.value is not None else 0
            widths[cell.column] = min(60, max(widths.get(cell.column, 8), length + 2))
    for column, width in widths.items():
        worksheet.column_dimensions[XLSX.utils.get_column_letter(column)].width = width
    if header and worksheet.max_row >= 1:
        for cell in worksheet[1]:
            cell.font = Font(bold=True)
            cell.fill = PatternFill("solid", fgColor="E8EEF7")
            cell.alignment = Alignment(vertical="center")
    worksheet.freeze_panes = "A2" if header else worksheet.freeze_panes


def _body_placeholder(slide: Any) -> Any:
    for placeholder in slide.placeholders:
        if placeholder.placeholder_format.idx == 1:
            return placeholder
    for shape in slide.shapes:
        if shape.has_text_frame and shape is not slide.shapes.title:
            return shape
    return None


def _has_microsoft_office() -> bool:
    if not IS_WINDOWS:
        return False
    try:
        import winreg  # type: ignore

        for hive, path in (
            (winreg.HKEY_CLASSES_ROOT, "Excel.Application"),
            (winreg.HKEY_CLASSES_ROOT, "Word.Application"),
        ):
            try:
                winreg.OpenKey(hive, path).Close()
                return True
            except OSError:
                continue
    except Exception:  # noqa: BLE001
        return False
    return False


def _find_libreoffice() -> str | None:
    candidates = ["soffice", "soffice.exe", "libreoffice"]
    import shutil

    for candidate in candidates:
        found = shutil.which(candidate)
        if found:
            return found
    if IS_WINDOWS:
        for path in (
            r"C:\Program Files\LibreOffice\program\soffice.exe",
            r"C:\Program Files (x86)\LibreOffice\program\soffice.exe",
        ):
            if Path(path).exists():
                return path
    if platform.system() == "Darwin":
        mac_path = "/Applications/LibreOffice.app/Contents/MacOS/soffice"
        if Path(mac_path).exists():
            return mac_path
    return None


def _access_driver() -> str | None:
    try:
        import pyodbc  # type: ignore

        for driver in pyodbc.drivers():
            if "Access" in driver:
                return driver
    except Exception:  # noqa: BLE001
        return None
    return None


def _text_to_pdf(text: str) -> bytes | None:
    """Minimal built-in PDF writer so export still works without Office."""
    try:
        lines = [line[:95] for line in text.splitlines()[:2000] or [""]]
        content_parts = ["BT", "/F1 11 Tf", "14 TL", "40 806 Td"]
        for line in lines:
            escaped = line.replace("\\", r"\\").replace("(", r"\(").replace(")", r"\)")
            content_parts.append(f"({escaped}) Tj T*")
        content_parts.append("ET")
        content = "\n".join(content_parts).encode("latin-1", "replace")

        objects: list[bytes] = [
            b"<< /Type /Catalog /Pages 2 0 R >>",
            b"<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
            b"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] "
            b"/Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>",
            b"<< /Length " + str(len(content)).encode() + b" >>\nstream\n" + content + b"\nendstream",
            b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
        ]
        buffer = bytearray(b"%PDF-1.4\n")
        offsets: list[int] = []
        for index, body in enumerate(objects, 1):
            offsets.append(len(buffer))
            buffer += f"{index} 0 obj\n".encode() + body + b"\nendobj\n"
        xref_offset = len(buffer)
        buffer += f"xref\n0 {len(objects) + 1}\n".encode()
        buffer += b"0000000000 65535 f \n"
        for offset in offsets:
            buffer += f"{offset:010d} 00000 n \n".encode()
        buffer += (
            f"trailer\n<< /Size {len(objects) + 1} /Root 1 0 R >>\nstartxref\n{xref_offset}\n%%EOF\n"
        ).encode()
        return bytes(buffer)
    except Exception:  # noqa: BLE001
        return None


# ---------------------------------------------------------------------------
# Tool registration
# ---------------------------------------------------------------------------
def register(registry: ToolRegistry, settings: Settings, office: OfficeController) -> None:
    def office_for(_: Any) -> OfficeController:
        return office

    @registry.tool(
        "office.word_create",
        "Create a Word document with headings, paragraphs and tables. "
        "Maps to Word's New Document + typing.",
        obj(
            {
                "path": prop("string", "Destination .docx path."),
                "title": prop("string", "Document title."),
                "paragraphs": prop("array", "Body paragraphs.", items={"type": "string"}),
                "headings": prop("array", "List of {text, level} headings.",
                                 items={"type": "object"}),
                "tables": prop("array", "List of {rows: [[...]], style, caption}.",
                               items={"type": "object"}),
            },
            ["path"],
        ),
        category="office", permission="sensitive",
    )
    def word_create(path: str, title: str = "", paragraphs: list[str] | None = None,
                    headings: list[dict[str, Any]] | None = None,
                    tables: list[dict[str, Any]] | None = None, ctx: Any = None) -> dict[str, Any]:
        return office_for(ctx).word_create(
            path, title=title, paragraphs=paragraphs or (), headings=headings or (), tables=tables or ()
        )

    @registry.tool(
        "office.word_read",
        "Read a Word document: full text, a heading outline, and every table as rows.",
        obj({"path": prop("string", "Path to the .docx."),
             "include_tables": prop("boolean", "Include tables.")}, ["path"]),
        category="office", permission="safe",
    )
    def word_read(path: str, include_tables: bool = True, ctx: Any = None) -> dict[str, Any]:
        return office_for(ctx).word_read(path, include_tables=include_tables)

    @registry.tool(
        "office.word_edit",
        "Edit a Word document: find and replace text, append paragraphs, add headings, add a table.",
        obj(
            {
                "path": prop("string", "Path to the .docx."),
                "replace": prop("object", "Mapping of text to replace, e.g. {\"{{name}}\": \"Ada\"}."),
                "append_paragraphs": prop("array", "Paragraphs to add at the end.",
                                          items={"type": "string"}),
                "headings": prop("array", "Headings to add.", items={"type": "object"}),
                "add_table": prop("object", "Table to append: {rows, style}."),
            },
            ["path"],
        ),
        category="office", permission="sensitive",
    )
    def word_edit(path: str, replace: dict[str, str] | None = None,
                  append_paragraphs: list[str] | None = None,
                  headings: list[dict[str, Any]] | None = None,
                  add_table: dict[str, Any] | None = None, ctx: Any = None) -> dict[str, Any]:
        return office_for(ctx).word_edit(
            path, replace=replace, append_paragraphs=append_paragraphs or (),
            headings=headings or (), add_table=add_table,
        )

    @registry.tool(
        "office.excel_create",
        "Create a spreadsheet with one or more sheets and optional styled header rows.",
        obj(
            {
                "path": prop("string", "Destination .xlsx path."),
                "sheets": prop("array", "List of {name, headers, rows}.", items={"type": "object"}),
            },
            ["path"],
        ),
        category="office", permission="sensitive",
    )
    def excel_create(path: str, sheets: list[dict[str, Any]] | None = None, ctx: Any = None) -> dict[str, Any]:
        return office_for(ctx).excel_create(path, sheets=sheets or [])

    @registry.tool(
        "office.excel_read",
        "Read spreadsheet data. Choose a sheet and an A1 range like 'A1:D20'. Set formulas=true to "
        "see formulas instead of cached values.",
        obj(
            {
                "path": prop("string", "Path to the .xlsx."),
                "sheet": prop("string", "Sheet name; omit for every sheet."),
                "cell_range": prop("string", "A1-style range such as A1:F100."),
                "formulas": prop("boolean", "Return formulas rather than values."),
            },
            ["path"],
        ),
        category="office", permission="safe",
    )
    def excel_read(path: str, sheet: str | None = None, cell_range: str | None = None,
                   formulas: bool = False, ctx: Any = None) -> dict[str, Any]:
        return office_for(ctx).excel_read(path, sheet=sheet, cell_range=cell_range, formulas=formulas)

    @registry.tool(
        "office.excel_write",
        "Write into a spreadsheet without destroying other sheets: set individual cells (with an "
        "A1 address), append rows, add formulas, apply number formats.",
        obj(
            {
                "path": prop("string", "Path to the .xlsx (created if missing)."),
                "sheet": prop("string", "Sheet name."),
                "cells": prop("array", "List of {address, value}.", items={"type": "object"}),
                "rows": prop("array", "Rows of values to append or place.", items={"type": "array"}),
                "formulas": prop("array", "Rows of formula strings.", items={"type": "array"}),
                "number_formats": prop("object", "Address -> Excel number format, e.g. '#,##0.00'."),
                "append": prop("boolean", "Append rows at the end (default true)."),
            },
            ["path"],
        ),
        category="office", permission="sensitive",
    )
    def excel_write(path: str, sheet: str = "Sheet1", cells: list[dict[str, Any]] | None = None,
                    rows: list[list[Any]] | None = None,
                    formulas: list[list[str]] | None = None,
                    number_formats: dict[str, str] | None = None, append: bool = True,
                    ctx: Any = None) -> dict[str, Any]:
        return office_for(ctx).excel_write(
            path, sheet=sheet, cells=cells or (), rows=rows or (), formulas=formulas,
            number_formats=number_formats, append=append,
        )

    @registry.tool(
        "office.excel_chart",
        "Insert a chart (bar, line, pie, scatter) into a spreadsheet from a data range.",
        obj(
            {
                "path": prop("string", "Spreadsheet path."),
                "sheet": prop("string", "Sheet containing the data."),
                "kind": prop("string", "bar | line | pie | scatter"),
                "data_range": prop("string", "A1 range containing the series."),
                "anchor": prop("string", "Cell where the chart is placed, e.g. E2."),
                "title": prop("string", "Chart title."),
            },
            ["path", "sheet"],
        ),
        category="office", permission="sensitive",
    )
    def excel_chart(path: str, sheet: str, kind: str = "bar", data_range: str = "A1:B10",
                    anchor: str = "E2", title: str = "", ctx: Any = None) -> dict[str, Any]:
        return office_for(ctx).excel_add_chart(
            path, sheet=sheet, kind=kind, data_range=data_range, anchor=anchor, title=title
        )

    @registry.tool(
        "office.excel_convert",
        "Convert between CSV/TSV and Excel in either direction.",
        obj({"source": prop("string", "Input file."), "destination": prop("string", "Output file."),
             "delimiter": prop("string", "CSV delimiter.")}, ["source", "destination"]),
        category="office", permission="sensitive",
    )
    def excel_convert(source: str, destination: str, delimiter: str = ",", ctx: Any = None) -> dict[str, Any]:
        return office_for(ctx).excel_convert(source, destination, delimiter=delimiter)

    @registry.tool(
        "office.excel_recalculate",
        "Force Excel to recalculate a workbook's formulas (requires Microsoft Excel).",
        obj({"path": prop("string", "Spreadsheet path.")}, ["path"]),
        category="office", permission="sensitive",
    )
    def excel_recalculate(path: str, ctx: Any = None) -> dict[str, Any]:
        return office_for(ctx).excel_recalculate(path)

    @registry.tool(
        "office.slides_create",
        "Build a PowerPoint deck: title slide plus content slides with bullets, speaker notes and "
        "images.",
        obj(
            {
                "path": prop("string", "Destination .pptx path."),
                "title": prop("string", "Deck title."),
                "subtitle": prop("string", "Deck subtitle."),
                "slides": prop("array", "List of {title, bullets, body, notes, image}.",
                               items={"type": "object"}),
            },
            ["path"],
        ),
        category="office", permission="sensitive",
    )
    def slides_create(path: str, title: str = "", subtitle: str = "",
                      slides: list[dict[str, Any]] | None = None, ctx: Any = None) -> dict[str, Any]:
        return office_for(ctx).slides_create(
            path, title=title, subtitle=subtitle, slides=slides or ()
        )

    @registry.tool(
        "office.slides_read",
        "Read a PowerPoint deck: slide count and the text of every slide.",
        obj({"path": prop("string", "Path to the .pptx.")}, ["path"]),
        category="office", permission="safe",
    )
    def slides_read(path: str, ctx: Any = None) -> dict[str, Any]:
        return office_for(ctx).slides_read(path)

    @registry.tool(
        "office.pdf_read",
        "Extract text and metadata from a PDF. Pass pages='1-3,7' for specific pages.",
        obj({"path": prop("string", "Path to the PDF."),
             "pages": prop("string", "Page selection, e.g. '1-3,7'.")}, ["path"]),
        category="office", permission="safe",
    )
    def pdf_read(path: str, pages: str | None = None, ctx: Any = None) -> dict[str, Any]:
        return office_for(ctx).pdf_read(path, pages=pages)

    @registry.tool(
        "office.pdf_merge", "Combine several PDFs into one file in the given order.",
        obj({"sources": prop("array", "PDF paths in order.", items={"type": "string"}),
             "destination": prop("string", "Output PDF path.")}, ["sources", "destination"]),
        category="office", permission="sensitive",
    )
    def pdf_merge(sources: list[str], destination: str, ctx: Any = None) -> dict[str, Any]:
        return office_for(ctx).pdf_merge(sources, destination)

    @registry.tool(
        "office.pdf_split", "Extract pages from a PDF into a new file.",
        obj({"source": prop("string", "Input PDF."), "pages": prop("string", "Pages, e.g. '2-5'."),
             "destination": prop("string", "Output PDF (optional).")}, ["source"]),
        category="office", permission="sensitive",
    )
    def pdf_split(source: str, pages: str = "1", destination: str | None = None,
                  ctx: Any = None) -> dict[str, Any]:
        return office_for(ctx).pdf_split(source, pages=pages, destination=destination)

    @registry.tool(
        "office.to_pdf",
        "Export a Word, Excel or PowerPoint file to PDF. Uses Microsoft Office, then LibreOffice, "
        "and reports which method was used.",
        obj({"source": prop("string", "Office file to export."),
             "destination": prop("string", "Output PDF path.")}, ["source"]),
        category="office", permission="sensitive", timeout=300.0,
    )
    def to_pdf(source: str, destination: str | None = None, ctx: Any = None) -> dict[str, Any]:
        return office_for(ctx).office_to_pdf(source, destination)

    @registry.tool(
        "office.access_query",
        "Run SQL against a Microsoft Access .accdb/.mdb database (needs the Access ODBC driver). "
        "SELECT returns rows; INSERT/UPDATE/DELETE commit.",
        obj(
            {
                "database": prop("string", "Path to the .accdb or .mdb."),
                "sql": prop("string", "SQL statement."),
                "fetch": prop("integer", "Maximum rows to return."),
            },
            ["database", "sql"],
        ),
        category="office", permission="destructive",
    )
    def access_query(database: str, sql: str, fetch: int = 500, ctx: Any = None) -> dict[str, Any]:
        return office_for(ctx).access_query(database, sql=sql, fetch=fetch)

    @registry.tool(
        "office.access_tables", "List the tables in an Access database.",
        obj({"database": prop("string", "Path to the .accdb or .mdb.")}, ["database"]),
        category="office", permission="safe",
    )
    def access_tables(database: str, ctx: Any = None) -> dict[str, Any]:
        return office_for(ctx).access_tables(database)

    @registry.tool(
        "office.capabilities",
        "Report which Office features work on this machine: native Word/Excel/PowerPoint/PDF "
        "support, whether Microsoft Office or LibreOffice is installed, and the Access driver.",
        obj({}), category="office", permission="safe",
    )
    def capabilities(ctx: Any = None) -> dict[str, Any]:
        return OfficeController.capabilities()
