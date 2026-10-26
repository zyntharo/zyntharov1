"""Filesystem tools: line ranges, precise edits, archives, path confinement."""

from __future__ import annotations

import zipfile
from pathlib import Path

import pytest

from vyralis.capabilities.files import FileTools
from vyralis.config import Settings
from vyralis.safety.permissions import PathGuard


@pytest.fixture
def tools(tmp_path: Path) -> FileTools:
    settings = Settings(fs_allowlist=[str(tmp_path)])
    return FileTools(settings, PathGuard(settings))


def test_write_read_with_line_range(tools: FileTools, tmp_path: Path):
    target = tmp_path / "notes.txt"
    tools.write(str(target), "\n".join(f"line {index}" for index in range(1, 21)))

    everything = tools.read(str(target))
    assert everything["total_lines"] == 20
    assert "1 | line 1" in everything["content"]

    window = tools.read(str(target), start_line=5, end_line=7, with_line_numbers=False)
    assert window["content"] == "line 5\nline 6\nline 7"
    assert window["truncated"] is True


def test_edit_is_surgical_and_keeps_a_backup(tools: FileTools, tmp_path: Path):
    target = tmp_path / "code.py"
    tools.write(str(target), "def add(a, b):\n    return a - b\n")
    result = tools.edit(str(target), find="a - b", replace="a + b")
    assert result["replaced"] == 1
    assert "a + b" in target.read_text()
    assert target.with_suffix(".py.bak").exists()


def test_edit_reports_when_nothing_matched(tools: FileTools, tmp_path: Path):
    target = tmp_path / "code.py"
    tools.write(str(target), "value = 1\n")
    result = tools.edit(str(target), find="not present", replace="x")
    assert result["replaced"] == 0 and result["found"] is False
    assert "hint" in result


def test_regex_edit_replaces_all_when_asked(tools: FileTools, tmp_path: Path):
    target = tmp_path / "data.csv"
    tools.write(str(target), "1,a\n2,b\n3,c\n")
    tools.edit(str(target), regex=r"^\d+,", replace="row,", all_occurrences=True)
    assert target.read_text().count("row,") == 3


def test_append_and_insert_lines(tools: FileTools, tmp_path: Path):
    target = tmp_path / "log.txt"
    tools.write(str(target), "first")
    tools.append(str(target), "second")
    tools.insert_lines(str(target), "inserted", after_line=1)
    assert target.read_text().splitlines() == ["first", "inserted", "second"]


def test_search_finds_matches_with_line_numbers(tools: FileTools, tmp_path: Path):
    (tmp_path / "pkg").mkdir()
    tools.write(str(tmp_path / "pkg" / "a.py"), "import os\n# TODO fix this\n")
    tools.write(str(tmp_path / "pkg" / "b.py"), "nothing here\n")
    hits = tools.search(str(tmp_path), "TODO", pattern="*.py")
    assert len(hits) == 1 and hits[0]["line"] == 2


def test_replace_in_files_defaults_to_dry_run(tools: FileTools, tmp_path: Path):
    target = tmp_path / "a.txt"
    tools.write(str(target), "old value")
    preview = tools.replace_in_files(str(tmp_path), "old", "new", dry_run=True)
    assert preview["occurrences"] == 1
    assert target.read_text() == "old value", "dry run must not modify files"
    tools.replace_in_files(str(tmp_path), "old", "new", dry_run=False)
    assert target.read_text() == "new value"


def test_compress_and_extract_roundtrip(tools: FileTools, tmp_path: Path):
    source = tmp_path / "project"
    tools.mkdir(str(source))
    tools.write(str(source / "file.txt"), "payload")
    archive = tmp_path / "packed.zip"

    result = tools.compress([str(source)], str(archive))
    assert result["bytes"] > 0 and zipfile.is_zipfile(archive)

    out = tmp_path / "unpacked"
    extracted = tools.extract(str(archive), str(out))
    assert extracted["extracted"] >= 1
    assert (out / "project" / "file.txt").read_text() == "payload"


def test_delete_is_recoverable_by_default(tools: FileTools, tmp_path: Path):
    target = tmp_path / "throwaway.txt"
    tools.write(str(target), "bye")
    result = tools.delete(str(target))
    assert result["deleted"] and "recoverable_at" in result
    assert not target.exists()
    assert Path(result["recoverable_at"]).exists()


def test_path_guard_refuses_outside_the_allowlist(tools: FileTools):
    with pytest.raises(PermissionError):
        tools.read("/etc/hostname")


def test_refuses_to_delete_a_root_directory(tmp_path: Path):
    settings = Settings(fs_allowlist=["/"])
    guard_tools = FileTools(settings, PathGuard(settings))
    with pytest.raises(PermissionError):
        guard_tools.delete("/")


def test_diff_and_hash(tools: FileTools, tmp_path: Path):
    a = tmp_path / "a.txt"
    b = tmp_path / "b.txt"
    tools.write(str(a), "alpha\nbeta\n")
    tools.write(str(b), "alpha\ngamma\n")
    diff = tools.diff(str(a), str(b))
    assert diff["identical"] is False
    assert diff["added"] == 1 and diff["removed"] == 1

    first = tools.hash_file(str(a))["digest"]
    tools.write(str(a), "alpha\nbeta\n")
    assert tools.hash_file(str(a))["digest"] == first


def test_read_structured_parses_json_and_csv(tools: FileTools, tmp_path: Path):
    tools.write(str(tmp_path / "config.json"), '{"retries": 3}')
    assert tools.read_structured(str(tmp_path / "config.json")) == {"retries": 3}

    tools.write(str(tmp_path / "rows.csv"), "name,qty\nbolt,4\nnut,9\n")
    assert tools.read_structured(str(tmp_path / "rows.csv"))["rows"][1] == ["bolt", "4"]
