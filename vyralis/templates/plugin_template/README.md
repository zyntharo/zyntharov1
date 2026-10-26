# Plugin template

Copy this folder into the plugin directory (or call `plugins.scaffold`, which
does it for you) and edit the two files:

- `plugin.json` - the manifest: id, name, tools it registers, permissions.
- `plugin.py`   - `register(api)` defines the tools with `@api.tool(...)`.

Install it with `plugins.install` (path) or, when the agent generated the code
itself, `plugins.generate` (id + source). Installed plugins are loaded
immediately and appear as ordinary tools to every agent.

Call other capabilities through `api.call(...)` rather than reimplementing them:
that path goes through the same permission checks as any other tool.
