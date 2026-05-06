import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'tytus-app.json'), 'utf8'));
const dist = path.join(root, 'dist', 'index.js');

function fail(message) {
  console.error(`[release-check] ${message}`);
  process.exit(1);
}

if (pkg.version !== manifest.version) {
  fail(`package.json version ${pkg.version} != tytus-app.json version ${manifest.version}`);
}

if (manifest.id !== 'forge') fail(`unexpected manifest id ${manifest.id}`);
if (!manifest.entry?.url?.includes(`tytus-app-forge@${manifest.version}/dist/index.js`)) {
  fail(`manifest entry.url must pin the immutable release tag ${manifest.version}`);
}
if (!fs.existsSync(dist)) fail('dist/index.js missing; run npm run build');
const js = fs.readFileSync(dist, 'utf8');
if (!js.includes('tytus-forge-css')) {
  fail('dist/index.js does not include injected Forge CSS marker');
}
console.log(`[release-check] ok forge ${manifest.version}`);
