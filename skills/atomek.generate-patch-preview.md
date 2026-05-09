# Atomek Skill: Generate Patch Preview

Generate edits that Atomek can preview before applying.

Rules:
- Prefer unified diffs with file paths matching the workspace.
- For full-file replacements, use fenced code blocks and clearly name the target file.
- Never claim a file was changed until the user applies the preview.
- Keep destructive actions out of generated shell commands.

Patch output format:
```diff
--- a/path/to/file
+++ b/path/to/file
@@
-old
+new
```
