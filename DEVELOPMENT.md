# Tytus Forge — standalone development

Forge is now an independent Tytus app repo. Normal product work happens here, not in `tytus-os`.

## Local loop

```bash
cd /Users/sebastian/Projects/tytus-apps/tytus-app-forge
npm install
npm run typecheck
npm run build
npm run release:check
```

`npm run build` runs Vite and then `scripts/inject-css.mjs`, which inlines the workbench CSS into `dist/index.js`. That is required because Tytus OS loads remote app entries by dynamic import and does not automatically pull Vite's extracted CSS file.

## Release loop

1. Make Forge changes in this repo.
2. Bump `package.json` and `tytus-app.json` to the same version.
3. Ensure `tytus-app.json.entry.url` points at the immutable Git tag for that version:
   `https://cdn.jsdelivr.net/gh/traylinx/tytus-app-forge@<version>/dist/index.js`.
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
5. Update `tytus-app-catalog/featured.json` to point Forge at the new manifest tag.
6. Push the catalog. Tytus OS fetches the catalog from `main`, so Forge version bumps do not need a Tytus OS rebuild.

## Tytus OS integration contract

- App id stays `forge`.
- Manifest stays public at `tytus-app.json`.
- Built entry stays `dist/index.js` and must be CSS-injected.
- AI/pods/Cortex integrations should enter through the right-side chat/outputs extension surface.
- Do not copy Forge source back into `tytus-os/packages/app-forge`; that package is intentionally retired.
