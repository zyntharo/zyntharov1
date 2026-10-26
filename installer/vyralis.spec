# -*- mode: python ; coding: utf-8 -*-
"""PyInstaller build for Vyralis.

Produces a **one-folder** build rather than a one-file executable on purpose:
one-file unpacks the whole runtime into a temp directory on every launch, which
adds seconds to startup and doubles disk IO. For an always-on desktop agent that
is the wrong trade.

The build bundles:
  * the Python runtime and every dependency,
  * the `vyralis` package (including the built GUI in `vyralis/gui`),
  * the plugin template so `plugins.scaffold` works on a machine with no source,
  * only the Qt/GTK pieces actually needed by the webview, if present.

It deliberately does **not** bundle a browser: Vyralis drives the Chrome/Edge the
user already has.
"""

import sys
from pathlib import Path

from PyInstaller.utils.hooks import collect_submodules

ROOT = Path(__file__).resolve().parent.parent
PKG = ROOT / "vyralis"
GUI = PKG / "gui"

block_cipher = None

datas = [
    (str(GUI), "vyralis/gui"),
    (str(PKG / "templates"), "vyralis/templates"),
]

# FastAPI/uvicorn/pydantic and the office libraries resolve some modules lazily.
hiddenimports = [
    "uvicorn.logging",
    "uvicorn.loops.auto",
    "uvicorn.loops.asyncio",
    "uvicorn.protocols.http.auto",
    "uvicorn.protocols.http.h11_impl",
    "uvicorn.protocols.websockets.auto",
    "uvicorn.protocols.websockets.websockets_impl",
    "uvicorn.lifespan.on",
    "uvicorn.lifespan.off",
    "websockets",
    "wsproto",
    "httpx",
    "httpcore",
    "anyio",
    "anyio._backends._asyncio",
    "pydantic",
    "pydantic_core",
    "psutil",
    "PIL.Image",
    "PIL.ImageDraw",
    "PIL.ImageFont",
    "docx",
    "openpyxl",
    "pptx",
    "pypdf",
    "webview",
    "webview.platforms.edgechromium",
    "webview.platforms.cef",
    "webview.platforms.gtk",
    "webview.platforms.cocoa",
]

for optional in ("playwright", "pyautogui", "pyperclip", "wmi", "pyodbc", "faster_whisper", "sounddevice"):
    hiddenimports.extend(collect_submodules(optional))

excludes = [
    "tkinter",
    "matplotlib",
    "numpy.tests",
    "pytest",
    "setuptools",
    "IPython",
    "notebook",
    "PyQt5",
    "PySide2",
]

a = Analysis(
    [str(ROOT / "vyralis" / "__main__.py")],
    pathex=[str(ROOT)],
    binaries=[],
    datas=datas,
    hiddenimports=hiddenimports,
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=excludes,
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=False,
)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name="vyralis",
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=False,  # UPX trips antivirus heuristics; startup wins are not worth it.
    console=False,  # GUI app: no console window. Use `vyralis serve` for logs.
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
    icon=str(ROOT / "installer" / "assets" / "vyralis.ico")
    if (ROOT / "installer" / "assets" / "vyralis.ico").exists()
    else None,
)

coll = COLLECT(
    exe,
    a.binaries,
    a.zipfiles,
    a.datas,
    strip=False,
    upx=False,
    upx_exclude=[],
    name="Vyralis",
)

if sys.platform == "darwin":
    app = BUNDLE(
        coll,
        name="Vyralis.app",
        icon=str(ROOT / "installer" / "assets" / "vyralis.icns")
        if (ROOT / "installer" / "assets" / "vyralis.icns").exists()
        else None,
        bundle_identifier="com.vyralis.desktop",
        info_plist={
            "NSHighResolutionCapable": True,
            "LSApplicationCategoryType": "public.app-category.productivity",
            "NSAppleEventsUsageDescription": "Vyralis controls applications on your behalf.",
            "NSMicrophoneUsageDescription": "Vyralis listens for your voice commands.",
            "NSScreenCaptureUsageDescription": "Vyralis reads the screen to operate your computer.",
        },
    )
