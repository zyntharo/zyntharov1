"""Filesystem control.

Covers what a human does to files, not just read/write:

create, read (any line range), write, append, insert, surgical edit
(literal or regex), delete, move, copy, rename, truncate, mkdir, list,
recursive tree, glob search, content grep, diff, hash, stat, permissions,
archive (zip/tar/gz) and extraction, and format-aware readers for CSV, JSON,
YAML, TOML, XML, spreadsheets and code.

Everything is confined by :class:`PathGuard`, so a stray path outside the
user's allowlist is refused with an actionable message instead of being
executed. Text operations auto-detect encoding (UTF-8, UTF-16, cp1252...) and
never mangle a file they cannot decode: they fail loudly and suggest binary
handling instead.
"""

from __future__ import annotations

import base64
import difflib
import fnmatch
import hashlib
import json
import logging
import mimetypes
import os
import re
import shutil
import stat as stat_module
import tarfile
import time
import zipfile
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Iterator, Sequence

from ..config import Settings
from ..safety.permissions import PathGuard
from ..tools.registry import ToolRegistry, obj, prop

log = logging.getLogger("vyralis.files")

TEXT_SUFFIXES = {
    ".txt", ".md", ".markdown", ".rst", ".log", ".csv", ".tsv", ".json", ".jsonl",
    ".yaml", ".yml", ".toml", ".ini", ".cfg", ".conf", ".env", ".xml", ".html",
    ".htm", ".css", ".scss", ".js", ".jsx", ".ts", ".tsx", ".vue", ".svelte",
    ".py", ".rs", ".go", ".java", ".kt", ".swift", ".c", ".h", ".cpp", ".hpp",
    ".cs", ".rb", ".php", ".pl", ".lua", ".sh", ".bash", ".ps1", ".bat", ".cmd",
    ".sql", ".r", ".m", ".jl", ".dart", ".scala", ".clj", ".ex", ".exs", ".hs",
    ".zig", ".nim", ".asm", ".s", ".v", ".vhd", ".gradle", ".cmake", ".dockerfile",
    ".gitignore", ".editorconfig", ".csv", ".diff", ".patch",
}

MAX_READ_BYTES = 8 * 1024 * 1024
MAX_WRITE_BYTES = 64 * 1024 * 1024


# ---------------------------------------------------------------------------
@dataclass
class FileEntry:
    path: str
    name: str
    is_dir: bool
    size: int = 0
    modified: float = 0.0
    suffix: str = ""

    def to_json(self) -> dict[str, Any]:
        return {
            "path": self.path, "name": self.name, "is_dir": self.is_dir,
            "size": self.size, "modified": self.modified, "suffix": self.suffix,
        }


def detect_encoding(raw: bytes) -> str:
    if raw.startswith(b"\xef\xbb\xbf"):
        return "utf-8-sig"
    if raw.startswith(b"\xff\xfe") or raw.startswith(b"\xfe\xff"):
        return "utf-16"
    try:
        raw.decode("utf-8")
        return "utf-8"
    except UnicodeDecodeError:
        pass
    for candidate in ("cp1252", "latin-1"):
        try:
            raw.decode(candidate)
            return candidate
        except UnicodeDecodeError:
            continue
    return "utf-8"


def looks_binary(path: Path, sample: bytes) -> bool:
    if path.suffix.lower() in TEXT_SUFFIXES:
        return False
    if b"\x00" in sample:
        return True
    try:
        sample.decode("utf-8")
        return False
    except UnicodeDecodeError:
        return True


class FileTools:
    """All filesystem operations, guarded by :class:`PathGuard`."""

    def __init__(self, settings: Settings, guard: PathGuard | None = None) -> None:
        self.settings = settings
        self.guard = guard or PathGuard(settings)

    # -- helpers --------------------------------------------------------
    def _resolve(self, path: str, *, must_exist: bool = False) -> Path:
        return self.guard.check(path, must_exist=must_exist)

    @staticmethod
    def _read_text(path: Path) -> tuple[str, str]:
        raw = path.read_bytes()
        encoding = detect_encoding(raw)
        return raw.decode(encoding, errors="strict"), encoding

    @staticmethod
    def _write_text(path: Path, text: str, encoding: str = "utf-8") -> int:
        data = text.encode(encoding, errors="strict")
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(data)
        return len(data)

    # -- reading --------------------------------------------------------
    def read(
        self, path: str, *, start_line: int | None = None, end_line: int | None = None,
        max_lines: int = 2000, with_line_numbers: bool = True,
    ) -> dict[str, Any]:
        target = self._resolve(path, must_exist=True)
        if target.is_dir():
            raise IsADirectoryError(f"'{target}' is a directory. Use files.list.")
        size = target.stat().st_size
        if size > MAX_READ_BYTES:
            raise ValueError(
                f"File is {size} bytes (limit {MAX_READ_BYTES}). Read a line range "
                f"(start_line/end_line) or use files.grep."
            )
        raw = target.read_bytes()
        if looks_binary(target, raw[:4096]):
            return {
                "path": str(target), "binary": True, "size": size,
                "base64": base64.b64encode(raw[:200_000]).decode("ascii"),
                "note": "Binary file: returned base64 of the first 200 KB.",
            }
        text, encoding = self._read_text(target)
        lines = text.splitlines()
        first = max(1, start_line or 1)
        last = min(len(lines), end_line or (first + max_lines - 1))
        window = lines[first - 1:last]
        body = (
            "\n".join(f"{first + offset:>6} | {line}" for offset, line in enumerate(window))
            if with_line_numbers else "\n".join(window)
        )
        return {
            "path": str(target), "encoding": encoding, "total_lines": len(lines),
            "size": size, "start_line": first, "end_line": last,
            "truncated": last < len(lines), "content": body,
        }

    def tail(self, path: str, *, lines: int = 50) -> dict[str, Any]:
        target = self._resolve(path, must_exist=True)
        text, _ = self._read_text(target)
        all_lines = text.splitlines()
        return {"path": str(target), "content": "\n".join(all_lines[-lines:]), "total_lines": len(all_lines)}

    def read_structured(self, path: str, *, limit: int = 500) -> Any:
        """Format-aware read for data files the agent will reason about."""
        target = self._resolve(path, must_exist=True)
        suffix = target.suffix.lower()
        text, _ = self._read_text(target)
        if suffix in {".json", ".jsonl"}:
            return json.loads(text) if suffix == ".json" else [
                json.loads(line) for line in text.splitlines() if line.strip()
            ][:limit]
        if suffix in {".yaml", ".yml"}:
            try:
                import yaml  # type: ignore

                return yaml.safe_load(text)
            except Exception:  # noqa: BLE001
                return {"raw": text[:20000], "note": "PyYAML not installed; returned raw text."}
        if suffix == ".toml":
            import tomllib

            return tomllib.loads(text)
        if suffix in {".csv", ".tsv"}:
            return {"rows": self._csv_rows(target, limit=limit)}
        if suffix == ".xml":
            import xml.etree.ElementTree as elementtree

            root = elementtree.fromstring(text)
            return {root.tag: [child.tag for child in list(root)[:limit]]}
        return {"raw": text[:20000]}

    @staticmethod
    def _csv_rows(path: Path, *, limit: int = 500) -> list[list[str]]:
        import csv

        delimiter = "\t" if path.suffix.lower() == ".tsv" else ","
        with path.open("r", encoding=detect_encoding(path.read_bytes()[:4096]), newline="") as handle:
            reader = csv.reader(handle, delimiter=delimiter)
            return [row for _, row in zip(range(limit), reader)]

    # -- writing --------------------------------------------------------
    def write(self, path: str, content: str, *, encoding: str = "utf-8",
              backup: bool = False, overwrite: bool = True) -> dict[str, Any]:
        target = self._resolve(path)
        if target.exists() and not overwrite:
            raise FileExistsError(f"'{target}' exists and overwrite=false.")
        if len(content.encode("utf-8", "ignore")) > MAX_WRITE_BYTES:
            raise ValueError(f"Refusing to write more than {MAX_WRITE_BYTES} bytes in one call.")
        if backup and target.exists():
            shutil.copy2(target, target.with_suffix(target.suffix + ".bak"))
        written = self._write_text(target, content, encoding)
        return {"path": str(target), "bytes": written, "created": True, "encoding": encoding}

    def append(self, path: str, content: str, *, newline: bool = True) -> dict[str, Any]:
        target = self._resolve(path)
        target.parent.mkdir(parents=True, exist_ok=True)
        encoding = detect_encoding(target.read_bytes()[:4096]) if target.exists() else "utf-8"
        payload = ("\n" if newline and target.exists() and target.stat().st_size else "") + content
        with target.open("a", encoding=encoding, newline="") as handle:
            handle.write(payload)
        return {"path": str(target), "appended": len(payload), "size": target.stat().st_size}

    def insert_lines(self, path: str, content: str, *, after_line: int) -> dict[str, Any]:
        target = self._resolve(path, must_exist=True)
        text, encoding = self._read_text(target)
        lines = text.splitlines(keepends=True)
        index = min(max(0, after_line), len(lines))
        lines.insert(index, content if content.endswith("\n") else content + "\n")
        self._write_text(target, "".join(lines), encoding)
        return {"path": str(target), "inserted_at": index}

    def edit(
        self, path: str, *, find: str | None = None, replace: str = "",
        regex: str | None = None, count: int = 1, all_occurrences: bool = False,
        backup: bool = True,
    ) -> dict[str, Any]:
        """Surgical edit: exact literal or regex, with a backup by default."""
        target = self._resolve(path, must_exist=True)
        text, encoding = self._read_text(target)
        if backup:
            shutil.copy2(target, target.with_suffix(target.suffix + ".bak"))
        if regex:
            pattern = re.compile(regex, re.MULTILINE)
            matches = pattern.findall(text)
            new_text, replaced = pattern.subn(replace, text, count=0 if all_occurrences else count)
        else:
            if find is None:
                raise ValueError("files.edit needs either 'find' or 'regex'.")
            occurrences = text.count(find)
            if occurrences == 0:
                return {"path": str(target), "replaced": 0, "found": False,
                        "hint": "The search text was not found; read the file first to match it exactly."}
            new_text = text.replace(find, replace, -1 if all_occurrences else count)
            replaced = occurrences if all_occurrences else min(count, occurrences)
            matches = [find] * replaced
        self._write_text(target, new_text, encoding)
        return {"path": str(target), "replaced": replaced, "matches": len(matches),
                "backup": str(target.with_suffix(target.suffix + ".bak")) if backup else None}

    # -- structure ------------------------------------------------------
    def mkdir(self, path: str, *, parents: bool = True) -> dict[str, Any]:
        target = self._resolve(path)
        target.mkdir(parents=parents, exist_ok=True)
        return {"path": str(target), "created": True}

    def list_dir(self, path: str, *, pattern: str | None = None, recursive: bool = False,
                 include_hidden: bool = False, limit: int = 500) -> list[dict[str, Any]]:
        target = self._resolve(path, must_exist=True)
        if not target.is_dir():
            return [FileEntry(str(target), target.name, False,
                              target.stat().st_size, target.stat().st_mtime,
                              target.suffix).to_json()]
        iterator: Iterator[Path] = target.rglob("*") if recursive else target.iterdir()
        entries: list[FileEntry] = []
        for item in iterator:
            if not include_hidden and any(part.startswith(".") for part in item.relative_to(target).parts):
                continue
            if pattern and not fnmatch.fnmatch(item.name, pattern):
                continue
            try:
                info = item.stat()
            except OSError:
                continue
            entries.append(
                FileEntry(str(item), item.name, item.is_dir(), info.st_size, info.st_mtime, item.suffix)
            )
            if len(entries) >= limit:
                break
        entries.sort(key=lambda entry: (not entry.is_dir, entry.name.lower()))
        return [entry.to_json() for entry in entries]

    def tree(self, path: str, *, depth: int = 3, limit: int = 400) -> str:
        root = self._resolve(path, must_exist=True)
        lines: list[str] = [str(root)]
        counter = 0

        def walk(directory: Path, prefix: str, remaining: int) -> None:
            nonlocal counter
            if remaining <= 0:
                return
            try:
                children = sorted(
                    (child for child in directory.iterdir() if not child.name.startswith(".")),
                    key=lambda child: (not child.is_dir(), child.name.lower()),
                )
            except OSError:
                return
            for index, child in enumerate(children):
                if counter >= limit:
                    lines.append(f"{prefix}... (truncated)")
                    return
                counter += 1
                last = index == len(children) - 1
                marker = "└── " if last else "├── "
                suffix = "/" if child.is_dir() else ""
                size = ""
                if child.is_file():
                    try:
                        size = f"  ({child.stat().st_size} B)"
                    except OSError:
                        size = ""
                lines.append(f"{prefix}{marker}{child.name}{suffix}{size}")
                if child.is_dir():
                    walk(child, prefix + ("    " if last else "│   "), remaining - 1)

        walk(root, "", depth)
        return "\n".join(lines)

    def glob(self, path: str, pattern: str, *, limit: int = 300) -> list[str]:
        root = self._resolve(path, must_exist=True)
        return [str(match) for _, match in zip(range(limit), root.rglob(pattern))]

    def search(
        self, path: str, query: str, *, regex: bool = False, pattern: str | None = None,
        case_sensitive: bool = False, limit: int = 200, context_lines: int = 0,
    ) -> list[dict[str, Any]]:
        """Content search across a directory tree (the agent's own grep)."""
        root = self._resolve(path, must_exist=True)
        matcher = (
            re.compile(query, 0 if case_sensitive else re.IGNORECASE) if regex
            else re.compile(re.escape(query), 0 if case_sensitive else re.IGNORECASE)
        )
        results: list[dict[str, Any]] = []
        files = root.rglob(pattern) if pattern else root.rglob("*")
        for file in files:
            if len(results) >= limit:
                break
            if not file.is_file():
                continue
            try:
                raw = file.read_bytes()
            except OSError:
                continue
            if len(raw) > MAX_READ_BYTES or looks_binary(file, raw[:2048]):
                continue
            text = raw.decode(detect_encoding(raw), errors="replace")
            lines = text.splitlines()
            for number, line in enumerate(lines, 1):
                if matcher.search(line):
                    snippet = {"file": str(file), "line": number, "text": line.strip()[:400]}
                    if context_lines:
                        start = max(0, number - 1 - context_lines)
                        end = min(len(lines), number + context_lines)
                        snippet["context"] = lines[start:end]
                    results.append(snippet)
                    if len(results) >= limit:
                        break
        return results

    def replace_in_files(
        self, path: str, find: str, replace: str, *, pattern: str = "*", regex: bool = False,
        dry_run: bool = True,
    ) -> dict[str, Any]:
        root = self._resolve(path, must_exist=True)
        touched: list[str] = []
        total = 0
        for file in root.rglob(pattern):
            if not file.is_file():
                continue
            try:
                text, encoding = self._read_text(file)
            except (OSError, UnicodeDecodeError):
                continue
            if regex:
                new_text, count = re.subn(find, replace, text)
            else:
                count = text.count(find)
                new_text = text.replace(find, replace)
            if count:
                touched.append(str(file))
                total += count
                if not dry_run:
                    self._write_text(file, new_text, encoding)
        return {"dry_run": dry_run, "files": touched, "occurrences": total}

    # -- moving things around -------------------------------------------
    def copy(self, source: str, destination: str, *, overwrite: bool = False) -> dict[str, Any]:
        src = self._resolve(source, must_exist=True)
        dst = self._resolve(destination)
        if dst.exists() and not overwrite:
            raise FileExistsError(f"'{dst}' exists and overwrite=false.")
        dst.parent.mkdir(parents=True, exist_ok=True)
        if src.is_dir():
            shutil.copytree(src, dst, dirs_exist_ok=overwrite)
        else:
            shutil.copy2(src, dst)
        return {"source": str(src), "destination": str(dst)}

    def move(self, source: str, destination: str, *, overwrite: bool = False) -> dict[str, Any]:
        src = self._resolve(source, must_exist=True)
        dst = self._resolve(destination)
        if dst.exists() and not overwrite:
            raise FileExistsError(f"'{dst}' exists and overwrite=false.")
        dst.parent.mkdir(parents=True, exist_ok=True)
        shutil.move(str(src), str(dst))
        return {"source": str(src), "destination": str(dst)}

    def rename(self, path: str, new_name: str, *, overwrite: bool = False) -> dict[str, Any]:
        src = self._resolve(path, must_exist=True)
        dst = self._resolve(str(src.parent / new_name))
        if dst.exists() and not overwrite:
            raise FileExistsError(f"'{dst}' exists.")
        src.rename(dst)
        return {"from": str(src), "to": str(dst)}

    def delete(self, path: str, *, recursive: bool = False, to_trash: bool = True,
               permanent: bool = False) -> dict[str, Any]:
        """Delete a file or folder. Defaults to recoverable deletion."""
        target = self._resolve(path, must_exist=True)
        size = _size_of(target)
        # Safety net: never let a single call erase a whole drive or a home dir.
        if target == Path(target.anchor) or target == Path.home():
            raise PermissionError(f"Refusing to delete '{target}' - it is a root or home directory.")
        if to_trash and not permanent:
            archive = self.settings_scrap_dir() / f"{int(time.time())}-{target.name}"
            shutil.move(str(target), str(archive))
            return {"path": str(target), "deleted": True, "recoverable_at": str(archive), "bytes": size}
        if target.is_dir():
            if not recursive:
                try:
                    target.rmdir()
                except OSError as exc:
                    raise ValueError(
                        f"Directory is not empty ({exc}). Pass recursive=true to delete it and its contents."
                    ) from exc
            else:
                shutil.rmtree(target)
        else:
            target.unlink()
        return {"path": str(target), "deleted": True, "permanent": True, "bytes": size}

    def settings_scrap_dir(self) -> Path:
        from ..config import paths

        directory = paths().artifacts / "trash"
        directory.mkdir(parents=True, exist_ok=True)
        return directory

    def truncate(self, path: str) -> dict[str, Any]:
        target = self._resolve(path, must_exist=True)
        previous = target.stat().st_size
        self._write_text(target, "")
        return {"path": str(target), "previous_bytes": previous}

    # -- archives -------------------------------------------------------
    def compress(self, paths: Sequence[str], destination: str, *, fmt: str = "zip") -> dict[str, Any]:
        dst = self._resolve(destination)
        dst.parent.mkdir(parents=True, exist_ok=True)
        sources = [self._resolve(item, must_exist=True) for item in paths]
        if fmt == "zip":
            with zipfile.ZipFile(dst, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=6) as archive:
                for source in sources:
                    if source.is_dir():
                        for file in source.rglob("*"):
                            if file.is_file():
                                archive.write(file, file.relative_to(source.parent))
                    else:
                        archive.write(source, source.name)
        elif fmt in {"tar", "tar.gz", "tgz", "gz"}:
            mode = "w:gz" if fmt in {"tar.gz", "tgz", "gz"} else "w"
            with tarfile.open(dst, mode) as archive:
                for source in sources:
                    archive.add(source, arcname=source.name)
        else:
            raise ValueError("fmt must be one of: zip, tar, tar.gz")
        return {"destination": str(dst), "bytes": dst.stat().st_size, "format": fmt,
                "members": len(sources)}

    def extract(self, archive_path: str, destination: str, *, members: Sequence[str] | None = None) -> dict[str, Any]:
        src = self._resolve(archive_path, must_exist=True)
        dst = self._resolve(destination)
        dst.mkdir(parents=True, exist_ok=True)
        written: list[str] = []
        if zipfile.is_zipfile(src):
            with zipfile.ZipFile(src) as archive:
                for name in (members or archive.namelist()):
                    # Zip-slip guard: never write outside the destination.
                    target = (dst / name).resolve()
                    if dst.resolve() not in target.parents and target != dst.resolve():
                        raise PermissionError(f"Archive entry '{name}' escapes the destination.")
                    archive.extract(name, dst)
                    written.append(str(target))
        elif tarfile.is_tarfile(src):
            with tarfile.open(src) as archive:
                for member in archive.getmembers():
                    if members and member.name not in members:
                        continue
                    target = (dst / member.name).resolve()
                    if dst.resolve() not in target.parents and target != dst.resolve():
                        raise PermissionError(f"Archive entry '{member.name}' escapes the destination.")
                    archive.extract(member, dst, filter="data")
                    written.append(str(target))
        else:
            raise ValueError(f"'{src}' is not a zip or tar archive.")
        return {"destination": str(dst), "extracted": len(written), "paths": written[:100]}

    # -- inspection -----------------------------------------------------
    def stat_path(self, path: str) -> dict[str, Any]:
        target = self._resolve(path, must_exist=True)
        info = target.stat()
        return {
            "path": str(target), "is_dir": target.is_dir(), "size": info.st_size,
            "modified": info.st_mtime, "created": info.st_ctime,
            "mode": oct(stat_module.S_IMODE(info.st_mode)),
            "readable": os.access(target, os.R_OK), "writable": os.access(target, os.W_OK),
            "mime": mimetypes.guess_type(target.name)[0] or "application/octet-stream",
            "suffix": target.suffix,
        }

    def hash_file(self, path: str, *, algorithm: str = "sha256") -> dict[str, Any]:
        target = self._resolve(path, must_exist=True)
        digest = hashlib.new(algorithm)
        with target.open("rb") as handle:
            for chunk in iter(lambda: handle.read(1024 * 1024), b""):
                digest.update(chunk)
        return {"path": str(target), "algorithm": algorithm, "digest": digest.hexdigest()}

    def diff(self, path_a: str, path_b: str, *, context: int = 3) -> dict[str, Any]:
        left = self._resolve(path_a, must_exist=True)
        right = self._resolve(path_b, must_exist=True)
        text_a, _ = self._read_text(left)
        text_b, _ = self._read_text(right)
        lines = list(
            difflib.unified_diff(
                text_a.splitlines(), text_b.splitlines(),
                fromfile=str(left), tofile=str(right), n=context, lineterm="",
            )
        )
        return {"identical": not lines, "diff": "\n".join(lines)[:40000],
                "added": sum(1 for line in lines if line.startswith("+") and not line.startswith("+++")),
                "removed": sum(1 for line in lines if line.startswith("-") and not line.startswith("---"))}

    def disk_usage(self, path: str) -> dict[str, Any]:
        target = self._resolve(path, must_exist=True)
        usage = shutil.disk_usage(target if target.is_dir() else target.parent)
        return {"total": usage.total, "used": usage.used, "free": usage.free,
                "free_gb": round(usage.free / 1e9, 2)}


def _size_of(path: Path) -> int:
    if path.is_file():
        try:
            return path.stat().st_size
        except OSError:
            return 0
    total = 0
    for child in path.rglob("*"):
        if child.is_file():
            try:
                total += child.stat().st_size
            except OSError:
                pass
    return total


# ---------------------------------------------------------------------------
# Tool registration
# ---------------------------------------------------------------------------
def register(registry: ToolRegistry, settings: Settings, tools: FileTools) -> None:
    def files_for(_: Any) -> FileTools:
        return tools

    @registry.tool(
        "files.read",
        "Read a text file. Supports line ranges (start_line/end_line), returns line numbers, "
        "detects encoding, and reports total_lines so the agent can page through big files. "
        "Binary files come back as base64.",
        obj(
            {
                "path": prop("string", "Absolute path to the file."),
                "start_line": prop("integer", "First line to return (1-based)."),
                "end_line": prop("integer", "Last line to return, inclusive."),
                "max_lines": prop("integer", "Cap when no range is given (default 2000)."),
                "with_line_numbers": prop("boolean", "Prefix each line with its number."),
            },
            ["path"],
        ),
        category="files", permission="safe",
    )
    def read(path: str, start_line: int | None = None, end_line: int | None = None,
             max_lines: int = 2000, with_line_numbers: bool = True, ctx: Any = None) -> dict[str, Any]:
        return files_for(ctx).read(
            path, start_line=start_line, end_line=end_line, max_lines=max_lines,
            with_line_numbers=with_line_numbers,
        )

    @registry.tool(
        "files.read_structured",
        "Read a JSON, JSONL, YAML, TOML, CSV, TSV or XML file as structured data instead of raw "
        "text.",
        obj({"path": prop("string", "Absolute path."), "limit": prop("integer", "Row cap.")},
            ["path"]),
        category="files", permission="safe",
    )
    def read_structured(path: str, limit: int = 500, ctx: Any = None) -> Any:
        return files_for(ctx).read_structured(path, limit=limit)

    @registry.tool(
        "files.write",
        "Create or overwrite a file with text. Works for any extension: .py, .rs, .ts, .md, "
        ".json, .csv, .ps1, .docx-adjacent source, config files, anything.",
        obj(
            {
                "path": prop("string", "Absolute destination path."),
                "content": prop("string", "Full file content."),
                "encoding": prop("string", "Text encoding, default utf-8."),
                "backup": prop("boolean", "Keep a .bak copy of the previous version."),
                "overwrite": prop("boolean", "Set false to fail if the file already exists."),
            },
            ["path", "content"],
        ),
        category="files", permission="sensitive",
    )
    def write(path: str, content: str, encoding: str = "utf-8", backup: bool = False,
              overwrite: bool = True, ctx: Any = None) -> dict[str, Any]:
        return files_for(ctx).write(path, content, encoding=encoding, backup=backup, overwrite=overwrite)

    @registry.tool(
        "files.append",
        "Append text to the end of a file (creates it if missing). Useful for logs and journals.",
        obj({"path": prop("string", "File path."), "content": prop("string", "Text to append."),
             "newline": prop("boolean", "Add a separating newline first.")}, ["path", "content"]),
        category="files", permission="sensitive",
    )
    def append(path: str, content: str, newline: bool = True, ctx: Any = None) -> dict[str, Any]:
        return files_for(ctx).append(path, content, newline=newline)

    @registry.tool(
        "files.insert_lines",
        "Insert text after a given line number without rewriting the whole file.",
        obj({"path": prop("string", "File path."), "content": prop("string", "Text to insert."),
             "after_line": prop("integer", "Insert after this line (0 = at the top).")},
            ["path", "content", "after_line"]),
        category="files", permission="sensitive",
    )
    def insert_lines(path: str, content: str, after_line: int, ctx: Any = None) -> dict[str, Any]:
        return files_for(ctx).insert_lines(path, content, after_line=after_line)

    @registry.tool(
        "files.edit",
        "Change part of a file: replace an exact string, or use a regular expression. This is the "
        "right tool for small changes - read the file, then edit precisely. A .bak copy is kept.",
        obj(
            {
                "path": prop("string", "File path."),
                "find": prop("string", "Exact text to find."),
                "replace": prop("string", "Replacement text."),
                "regex": prop("string", "Regular expression to match instead of literal text."),
                "all_occurrences": prop("boolean", "Replace every occurrence, not just the first."),
                "count": prop("integer", "How many occurrences to replace when not replacing all."),
                "backup": prop("boolean", "Keep a .bak copy (default true)."),
            },
            ["path"],
        ),
        category="files", permission="sensitive",
    )
    def edit(path: str, find: str | None = None, replace: str = "", regex: str | None = None,
             all_occurrences: bool = False, count: int = 1, backup: bool = True,
             ctx: Any = None) -> dict[str, Any]:
        return files_for(ctx).edit(
            path, find=find, replace=replace, regex=regex, all_occurrences=all_occurrences,
            count=count, backup=backup,
        )

    @registry.tool(
        "files.list",
        "List a directory, or find files by wildcard pattern inside it. "
        "Example: pattern='*.py', recursive=true.",
        obj(
            {
                "path": prop("string", "Directory path."),
                "pattern": prop("string", "Wildcard such as '*.pdf'."),
                "recursive": prop("boolean", "Walk subdirectories."),
                "include_hidden": prop("boolean", "Include dotfiles."),
            },
            ["path"],
        ),
        category="files", permission="safe",
    )
    def list_dir(path: str, pattern: str | None = None, recursive: bool = False,
                 include_hidden: bool = False, ctx: Any = None) -> list[dict[str, Any]]:
        return files_for(ctx).list_dir(
            path, pattern=pattern, recursive=recursive, include_hidden=include_hidden
        )

    @registry.tool(
        "files.tree", "Print a directory tree so you can understand a project's layout at a glance.",
        obj({"path": prop("string", "Root directory."), "depth": prop("integer", "Levels to descend.")}),
        category="files", permission="safe",
    )
    def tree(path: str, depth: int = 3, ctx: Any = None) -> dict[str, Any]:
        return {"tree": files_for(ctx).tree(path, depth=depth)}

    @registry.tool(
        "files.search",
        "Search inside files for text or a pattern across a directory tree, with line numbers. "
        "Use this instead of reading every file.",
        obj(
            {
                "path": prop("string", "Directory to search."),
                "query": prop("string", "Text or pattern to find."),
                "regex": prop("boolean", "Treat query as a regular expression."),
                "pattern": prop("string", "Only search files matching this wildcard, e.g. '*.py'."),
                "case_sensitive": prop("boolean", "Match case."),
                "context_lines": prop("integer", "Lines of context around each hit."),
            },
            ["path", "query"],
        ),
        category="files", permission="safe",
    )
    def search(path: str, query: str, regex: bool = False, pattern: str | None = None,
               case_sensitive: bool = False, context_lines: int = 0, ctx: Any = None) -> dict[str, Any]:
        return {"results": files_for(ctx).search(
            path, query, regex=regex, pattern=pattern, case_sensitive=case_sensitive,
            context_lines=context_lines,
        )}

    @registry.tool(
        "files.replace_in_files",
        "Find and replace across many files at once. Defaults to a dry run: it reports what would "
        "change and touches nothing until dry_run=false.",
        obj(
            {
                "path": prop("string", "Directory root."),
                "find": prop("string", "Text or pattern to find."),
                "replace": prop("string", "Replacement."),
                "pattern": prop("string", "Only process files matching this wildcard."),
                "regex": prop("boolean", "Treat find as a regular expression."),
                "dry_run": prop("boolean", "Preview only (default true)."),
            },
            ["path", "find", "replace"],
        ),
        category="files", permission="destructive",
    )
    def replace_in_files(path: str, find: str, replace: str, pattern: str = "*", regex: bool = False,
                         dry_run: bool = True, ctx: Any = None) -> dict[str, Any]:
        return files_for(ctx).replace_in_files(
            path, find, replace, pattern=pattern, regex=regex, dry_run=dry_run
        )

    @registry.tool(
        "files.mkdir", "Create a directory (and any missing parents).",
        obj({"path": prop("string", "Directory to create.")}, ["path"]),
        category="files", permission="sensitive",
    )
    def mkdir(path: str, ctx: Any = None) -> dict[str, Any]:
        return files_for(ctx).mkdir(path)

    @registry.tool(
        "files.copy", "Copy a file or directory.",
        obj({"source": prop("string", "Existing path."), "destination": prop("string", "Target path."),
             "overwrite": prop("boolean", "Allow replacing the destination.")}, ["source", "destination"]),
        category="files", permission="sensitive",
    )
    def copy(source: str, destination: str, overwrite: bool = False, ctx: Any = None) -> dict[str, Any]:
        return files_for(ctx).copy(source, destination, overwrite=overwrite)

    @registry.tool(
        "files.move", "Move a file or directory to a new location.",
        obj({"source": prop("string", "Existing path."), "destination": prop("string", "Target path."),
             "overwrite": prop("boolean", "Allow replacing the destination.")}, ["source", "destination"]),
        category="files", permission="sensitive",
    )
    def move(source: str, destination: str, overwrite: bool = False, ctx: Any = None) -> dict[str, Any]:
        return files_for(ctx).move(source, destination, overwrite=overwrite)

    @registry.tool(
        "files.rename", "Rename a file or directory in place.",
        obj({"path": prop("string", "Current path."), "new_name": prop("string", "New file name only."),
             "overwrite": prop("boolean", "Allow replacing an existing name.")}, ["path", "new_name"]),
        category="files", permission="sensitive",
    )
    def rename(path: str, new_name: str, overwrite: bool = False, ctx: Any = None) -> dict[str, Any]:
        return files_for(ctx).rename(path, new_name, overwrite=overwrite)

    @registry.tool(
        "files.delete",
        "Delete a file or directory. By default the item is moved to a recovery folder; pass "
        "permanent=true only when the user explicitly wants it gone for good.",
        obj(
            {
                "path": prop("string", "Path to delete."),
                "recursive": prop("boolean", "Required for non-empty directories."),
                "permanent": prop("boolean", "Erase immediately instead of moving to recovery."),
            },
            ["path"],
        ),
        category="files", permission="destructive",
    )
    def delete(path: str, recursive: bool = False, permanent: bool = False, ctx: Any = None) -> dict[str, Any]:
        return files_for(ctx).delete(path, recursive=recursive, permanent=permanent)

    @registry.tool(
        "files.compress", "Zip or tar files and folders into a single archive.",
        obj({"paths": prop("array", "Paths to include.", items={"type": "string"}),
             "destination": prop("string", "Archive file to create."),
             "format": prop("string", "zip | tar | tar.gz")}, ["paths", "destination"]),
        category="files", permission="sensitive",
    )
    def compress(paths: list[str], destination: str, format: str = "zip", ctx: Any = None) -> dict[str, Any]:
        return files_for(ctx).compress(paths, destination, fmt=format)

    @registry.tool(
        "files.extract", "Extract a zip or tar archive, with protection against path traversal.",
        obj({"archive_path": prop("string", "Archive file."), "destination": prop("string", "Folder for output."),
             "members": prop("array", "Only extract these entries.",
                             items={"type": "string"})}, ["archive_path", "destination"]),
        category="files", permission="sensitive",
    )
    def extract(archive_path: str, destination: str, members: list[str] | None = None,
                ctx: Any = None) -> dict[str, Any]:
        return files_for(ctx).extract(archive_path, destination, members=members)

    @registry.tool(
        "files.stat", "Metadata for a path: size, timestamps, permissions, MIME type.",
        obj({"path": prop("string", "Path to inspect.")}, ["path"]),
        category="files", permission="safe",
    )
    def stat_path(path: str, ctx: Any = None) -> dict[str, Any]:
        return files_for(ctx).stat_path(path)

    @registry.tool(
        "files.hash", "Checksum a file (sha256 by default) to verify a copy or detect changes.",
        obj({"path": prop("string", "File path."), "algorithm": prop("string", "hashlib algorithm name.")},
            ["path"]),
        category="files", permission="safe",
    )
    def hash_file(path: str, algorithm: str = "sha256", ctx: Any = None) -> dict[str, Any]:
        return files_for(ctx).hash_file(path, algorithm=algorithm)

    @registry.tool(
        "files.diff", "Compare two text files and return a unified diff.",
        obj({"path_a": prop("string", "First file."), "path_b": prop("string", "Second file.")},
            ["path_a", "path_b"]),
        category="files", permission="safe",
    )
    def diff(path_a: str, path_b: str, ctx: Any = None) -> dict[str, Any]:
        return files_for(ctx).diff(path_a, path_b)

    @registry.tool(
        "files.disk_usage", "Free and used space on the drive that holds a given path.",
        obj({"path": prop("string", "Any path on the drive of interest.")}, ["path"]),
        category="files", permission="safe",
    )
    def disk_usage(path: str, ctx: Any = None) -> dict[str, Any]:
        return files_for(ctx).disk_usage(path)
