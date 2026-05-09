# Atomek — standalone development

This workspace app is published as Atomek; internals stay generic so future rebrands are cheap. Normal product work happens here, not in `tytus-os`.

## Local loop

```bash
cd /Users/sebastian/Projects/tytus-apps/tytus-app-atomek
npm install
npm run typecheck
npm run build
npm run release:check
```

`npm run build` runs Vite and then `scripts/inject-css.mjs`, which inlines the workbench CSS into `dist/index.js`. That is required because Tytus OS loads remote app entries by dynamic import and does not automatically pull Vite's extracted CSS file.

## Release loop

1. Make Atomek changes in this repo.
2. Bump `package.json` and `tytus-app.json` to the same version.
3. Ensure `tytus-app.json.entry.url` points at the immutable Git tag for that version:
   `https://cdn.jsdelivr.net/gh/traylinx/tytus-app-atomek@v<version>/dist/index.js`.
4. Run:
   ```bash
   npm run typecheck
   npm run build
   npm run release:check
   git add .
   git commit -m "feat: ..."
   git tag <version>
   git push origin main --tags
   ```
5. Update `tytus-app-catalog/featured.json` to point Atomek at the new manifest tag.
6. Push the catalog. TytusOS fetches the catalog from the configured catalog URL, so Atomek version bumps do not need a Tytus OS rebuild.

## Tytus OS integration contract

- User-facing app id is `atomek`; internal source identifiers stay generic.
- Manifest stays public at `tytus-app.json`.
- Built entry stays `dist/index.js` and must be CSS-injected.
- AI/pods/Cortex integrations should enter through the right-side chat/outputs extension surface.
- Do not copy Atomek source back into `tytus-os/packages/app-workbench`; that package is intentionally retired.
- Do not hardcode provider model IDs; use host/global AIL discovery.
- Do not direct-fetch pod/model URLs from the browser; use the host bridge.
