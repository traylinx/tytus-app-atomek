# Tytus Forge

Standalone Tytus app: a `vscode.dev`-style Monaco workbench for local files, markdown preview, and future agent/Cortex workflows.

## Development

```bash
npm install
npm run typecheck
npm run build
```

## Tytus app entry

`tytus-app.json` points to the tagged CDN build:

```text
https://cdn.jsdelivr.net/gh/traylinx/tytus-app-forge@v0.1.0/dist/index.js
```

## Boundary

Forge is product surface. Tytus OS is platform/runtime. Normal Forge development happens here, not in the Tytus OS core repo.
