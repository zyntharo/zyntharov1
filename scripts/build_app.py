#!/usr/bin/env python3
"""Build Vyralis into a distributable application.

Steps, in order:

1. Build the interface (`ui/` -> `vyralis/gui/`). Skipped if the harness is
   missing and a previous build already exists.
2. Bundle the backend with PyInstaller using ``installer/vyralis.spec``.
3. Produce a platform installer if the tooling for it is present:
   * Windows -> Inno Setup (``iscc``)
   * macOS   -> ``hdiutil`` disk image
   * Linux   -> ``tar.gz`` plus a ``.desktop`` file

Every step prints what it did and does not hide failures: a build that cannot
produce an installer still reports exactly which tool is missing.
"""

from __future__ import annotations

import argparse
import os
import platform
import shutil
import subprocess
import sys
import tarfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
UI = ROOT / "ui"
GUI_OUT = ROOT / "vyralis" / "gui"
DIST = ROOT / "dist"
VERSION = "0.1.0"


def log(message: str) -> None:
    print(f"\033[36m▸\033[0m {message}", flush=True)


def run(argv: list[str], cwd: Path | None = None, *, check: bool = True) -> int:
    log(" ".join(argv))
    result = subprocess.run(argv, cwd=str(cwd or ROOT), shell=platform.system() == "Windows")
    if check and result.returncode != 0:
        raise SystemExit(f"command failed ({result.returncode}): {' '.join(argv)}")
    return result.returncode


def which(name: str) -> str | None:
    return shutil.which(name)


def build_gui(*, force: bool) -> None:
    if not UI.exists():
        log("no ui/ directory; keeping the existing interface build")
        return
    if not which("npm"):
        if (GUI_OUT / "index.html").exists():
            log("npm is not available; reusing the existing interface build")
            return
        raise SystemExit(
            "npm is required to build the interface and no build exists yet. "
            "Install Node 20+ or ship a prebuilt vyralis/gui."
        )
    if force or not (UI / "node_modules").exists():
        run(["npm", "install", "--no-audit", "--no-fund"], cwd=UI)
    run(["npm", "run", "build"], cwd=UI)
    if not (GUI_OUT / "index.html").exists():
        raise SystemExit("the interface build did not produce vyralis/gui/index.html")


def build_backend(*, onedir: bool) -> Path:
    if not which("pyinstaller"):
        run([sys.executable, "-m", "pip", "install", "--quiet", "pyinstaller"])
    run([
        sys.executable,
        "-m",
        "PyInstaller",
        "--noconfirm",
        "--clean",
        "--distpath",
        str(DIST),
        "--workpath",
        str(ROOT / "build"),
        str(ROOT / "installer" / "vyralis.spec"),
    ])
    produced = DIST / ("Vyralis.app" if platform.system() == "Darwin" else "Vyralis")
    if not produced.exists():
        # Some PyInstaller versions place the bundle at dist/<name> directly.
        candidates = list(DIST.glob("Vyralis*"))
        if not candidates:
            raise SystemExit(f"PyInstaller produced nothing in {DIST}")
        produced = candidates[0]
    log(f"backend bundle: {produced}")
    return produced


def build_windows_installer() -> None:
    iscc = which("iscc") or which("ISCC")
    if not iscc:
        log(
            "Inno Setup not found; skipping the .exe installer. "
            "Install it from https://jrsoftware.org/isdl.php and re-run, "
            "or ship dist/Vyralis as a portable folder."
        )
        return
    run([iscc, str(ROOT / "installer" / "windows" / "vyralis.iss")])
    log(f"installer written to {DIST / 'installer'}")


def build_macos_dmg(bundle: Path) -> None:
    if not which("hdiutil"):
        log("hdiutil not available; skipping the .dmg")
        return
    dmg = DIST / f"Vyralis-{VERSION}.dmg"
    if dmg.exists():
        dmg.unlink()
    run(["hdiutil", "create", "-volname", "Vyralis", "-srcfolder", str(bundle), "-ov", "-format", "UDZO", str(dmg)])
    log(f"disk image: {dmg}")


def build_linux_archive(bundle: Path) -> None:
    archive = DIST / f"vyralis-{VERSION}-linux-x86_64.tar.gz"
    with tarfile.open(archive, "w:gz") as tar:
        tar.add(bundle, arcname="vyralis")
        desktop = ROOT / "installer" / "linux" / "vyralis.desktop"
        if desktop.exists():
            tar.add(desktop, arcname="vyralis/vyralis.desktop")
    log(f"archive: {archive}")


def main() -> int:
    parser = argparse.ArgumentParser(description="Build the Vyralis application")
    parser.add_argument("--skip-gui", action="store_true", help="reuse the existing interface build")
    parser.add_argument("--force-install", action="store_true", help="reinstall npm dependencies")
    parser.add_argument("--no-installer", action="store_true", help="skip the platform installer")
    args = parser.parse_args()

    log(f"building Vyralis {VERSION} for {platform.system()} {platform.machine()}")
    if not args.skip_gui:
        build_gui(force=args.force_install)
    bundle = build_backend(onedir=True)

    if not args.no_installer:
        system = platform.system()
        if system == "Windows":
            build_windows_installer()
        elif system == "Darwin":
            build_macos_dmg(bundle)
        else:
            build_linux_archive(bundle)

    log("done")
    print(f"\nDistribution output: {DIST}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
