# Atomek

Atomek is the standalone Tytus app that provides the TytusOS workbench: local files, Monaco editing, markdown preview, chat, artifacts, AIL routing, Computer / Agents, and agentic app skills.

Current published app release: **v0.4.11**.

## What it does

- Opens local files and folders through the browser File System Access API.
- Renders a VS Code-like Explorer with collapsible folders and editable tabs.
- Edits text/code/markdown in Monaco.
- Shows markdown preview and rich chat/artifact output.
- Lets chat attach active file/open editor context.
- Routes AI through the Tytus host AI bridge and global AIL settings.
- Discovers local tools and app skills through the Tytus host bridge.
- Converts generated edits into artifacts or preview diffs before files are saved.

## Boundary

Atomek is product surface. TytusOS is platform/runtime.

Normal Atomek development happens here, not in the TytusOS core repo. TytusOS should load Atomek from the catalog or pinned app manifest.

Hard rules:

- Do not hardcode provider model IDs in Atomek. Use host/global AIL model discovery.
- Do not direct-fetch remote pod/model endpoints from the browser. Use the Tytus host bridge.
- Do not turn Atomek into a second local-agent runtime. Control existing tray/local resources.
- Do not write AI edits blindly. Return artifacts or preview patches first.
- Do not modify JULI3TA internals while fixing Atomek.

## Development

```bash
npm install
npm run typecheck
npm run build
npm run release:check
```

`npm run build` runs Vite and then injects CSS into `dist/index.js`. CSS injection is required because TytusOS loads app entries by dynamic import and does not automatically pull Vite's extracted CSS file.

## Tytus app entry

`tytus-app.json` points to the tagged CDN build:

```text
https://cdn.jsdelivr.net/gh/traylinx/tytus-app-atomek@v0.4.11/dist/index.js
```

The catalog should point to the matching immutable manifest tag:

```text
https://raw.githubusercontent.com/traylinx/tytus-app-atomek/v0.4.11/tytus-app.json
```

## Release loop

1. Make changes in this repo.
2. Bump `package.json` and `tytus-app.json` to the same version.
3. Point `tytus-app.json.entry.url` at the immutable tag for that version.
4. Run:
   ```bash
   npm run typecheck
   npm run build
   npm run release:check
   git add .
   git commit -m "feat: ..."
   git tag v<version>
   git push origin main --tags
   ```
5. Update `tytus-app-catalog/featured.json` to point Atomek at the new manifest tag.
6. If TytusOS vendors or pins the catalog, update that repo and the tray dist too.

## User manual

The primary user manual lives in TytusOS:

```text
services/tytus-os/docs/user-manual/atomek.md
```

Whenever Atomek behavior changes, update that manual and regenerate `services/tytus-cli/os-docs.md`.
