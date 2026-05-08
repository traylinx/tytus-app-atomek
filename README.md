# Atomek

Standalone Tytus app: a clean Monaco workspace for local files, markdown preview, and search.

## Development

```bash
npm install
npm run typecheck
npm run build
```

## Tytus app entry

`tytus-app.json` points to the tagged CDN build:

```text
https://cdn.jsdelivr.net/gh/traylinx/tytus-app-atomek@v0.2.0/dist/index.js
```

## Boundary

Atomek is product surface. Tytus OS is platform/runtime. Normal Atomek development happens here, not in the Tytus OS core repo.
