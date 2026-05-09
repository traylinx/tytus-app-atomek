# Atomek Skill: Inspect Project

Use Atomek workspace context to inspect a project safely.

Rules:
- Use open editors, selected text, project index hits, artifacts, and Cortex context first.
- Never invent file contents.
- If editing is needed, produce a unified diff or replacement block so Atomek can show a preview.
- Keep model choice delegated to global AIL settings.
- Do not direct-fetch pod/tool endpoints from browser code; use Tytus host APIs.

Expected output:
- Findings
- Risks
- Proposed changes
- Test commands
