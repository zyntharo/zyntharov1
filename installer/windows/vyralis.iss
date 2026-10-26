; Vyralis installer (Inno Setup 6).
;
; Per-user by default: the agent needs to read the user's own browser profile,
; files and sessions, so installing for "all users" would fight permissions.
; The user never needs Python, Node or any coding tool: everything is bundled.
;
; Build with:  iscc installer\windows\vyralis.iss
; (after `python scripts/build_app.py` has produced dist\Vyralis)

#define AppName "Vyralis"
#define AppVersion "0.1.0"
#define AppPublisher "Vyralis"
#define AppExeName "vyralis.exe"

[Setup]
AppId={{8F3A5C11-6D9E-4F4B-9C2A-VYRALIS0001}
AppName={#AppName}
AppVersion={#AppVersion}
AppPublisher={#AppPublisher}
DefaultDirName={localappdata}\Programs\{#AppName}
DefaultGroupName={#AppName}
DisableProgramGroupPage=yes
PrivilegesRequired=lowest
ArchitecturesInstallIn64BitMode=x64compatible
OutputDir=..\..\dist\installer
OutputBaseFilename=Vyralis-{#AppVersion}-Setup
Compression=lzma2/max
SolidCompression=yes
WizardStyle=modern
UninstallDisplayIcon={app}\{#AppExeName}
LicenseFile=..\..\LICENSE
SetupLogging=yes

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "Create a desktop shortcut"; GroupDescription: "Shortcuts:"
Name: "autostart"; Description: "Start Vyralis when I sign in"; GroupDescription: "Startup:"; Flags: unchecked

[Files]
; The whole PyInstaller output. Nothing else is required on the target machine.
Source: "..\..\dist\Vyralis\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{autoprograms}\{#AppName}"; Filename: "{app}\{#AppExeName}"
Name: "{autodesktop}\{#AppName}"; Filename: "{app}\{#AppExeName}"; Tasks: desktopicon

[Registry]
Root: HKCU; Subkey: "Software\Microsoft\Windows\CurrentVersion\Run"; ValueType: string; \
    ValueName: "Vyralis"; ValueData: """{app}\{#AppExeName}"""; Flags: uninsdeletevalue; Tasks: autostart

[Run]
; Offer to launch straight after install. The app asks for a model provider on
; first run; nothing else needs configuring for computer/browser control.
Filename: "{app}\{#AppExeName}"; Description: "Launch Vyralis"; Flags: nowait postinstall skipifsilent

[UninstallDelete]
; Leave the user's runtime data alone: memories, skills and plugins are theirs.
; Removing the program must never delete their work.
Type: filesandordirs; Name: "{app}"
