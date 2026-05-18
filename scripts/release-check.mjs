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

if (manifest.id !== 'atomek') fail(`unexpected manifest id ${manifest.id}`);
const expectedTagPath = `v${manifest.version}/dist/index.js`;
const entryUrl = String(manifest.entry?.url ?? '');
const immutableReleaseUrl =
  /^https:\/\/cdn\.jsdelivr\.net\/gh\/traylinx\/tytus-app-atomek@v[0-9]+\.[0-9]+\.[0-9]+\/dist\/index\.js$/.test(entryUrl) ||
  /^https:\/\/raw\.githubusercontent\.com\/traylinx\/tytus-app-atomek\/v[0-9]+\.[0-9]+\.[0-9]+\/dist\/index\.js$/.test(entryUrl);
if (immutableReleaseUrl && !entryUrl.endsWith(expectedTagPath)) {
  fail(`manifest entry.url tag does not match version ${manifest.version}`);
}
if (!immutableReleaseUrl) {
  fail(`manifest entry.url must pin the immutable release tag ${manifest.version}`);
}
if (!fs.existsSync(dist)) fail('dist/index.js missing; run npm run build');
const js = fs.readFileSync(dist, 'utf8');
if (!js.includes('tytus-workbench-css')) {
  fail('dist/index.js does not include injected workbench CSS marker');
}
console.log(`[release-check] ok atomek ${manifest.version}`);
