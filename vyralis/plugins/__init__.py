"""Plugin subsystem: SDK, loader, scaffolder and agent-facing plugin tools."""

from .loader import MANIFEST_NAME, TEMPLATE_CODE, TEMPLATE_MANIFEST, PluginManager
from .sdk import LoadedPlugin, PluginAPI, PluginManifest, digest_directory

__all__ = [
    "LoadedPlugin",
    "MANIFEST_NAME",
    "PluginAPI",
    "PluginManager",
    "PluginManifest",
    "TEMPLATE_CODE",
    "TEMPLATE_MANIFEST",
    "digest_directory",
]
