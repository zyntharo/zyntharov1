"""Capability layer: the subsystems that actually touch the machine.

Each module exposes a controller class plus a ``register(...)`` function that
publishes its operations as agent-facing tools.
"""

from .browser import BrowserController
from .computer import ComputerController, WindowManager
from .files import FileTools
from .hardware import HardwareMonitor, Sample, Sensor
from .office import OfficeController
from .shell import ShellController
from .vision import Mark, ScreenMap, VisionEngine
from .whatsapp import WhatsAppController

__all__ = [
    "BrowserController",
    "ComputerController",
    "FileTools",
    "HardwareMonitor",
    "Mark",
    "OfficeController",
    "Sample",
    "ScreenMap",
    "Sensor",
    "ShellController",
    "VisionEngine",
    "WhatsAppController",
    "WindowManager",
]
