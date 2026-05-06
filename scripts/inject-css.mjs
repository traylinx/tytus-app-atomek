import { readdir, readFile, unlink, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const dist = new URL('../dist/', import.meta.url);
const files = await readdir(dist);
const cssFiles = files.filter((file) => file.endsWith('.css'));
if (cssFiles.length === 0) process.exit(0);
let css = '';
for (const file of cssFiles) {
  css += await readFile(join(dist.pathname, file), 'utf8');
  await unlink(join(dist.pathname, file));
}
const indexPath = join(dist.pathname, 'index.js');
const index = await readFile(indexPath, 'utf8');
const inject = `const __tytusForgeCss=${JSON.stringify(css)};if(typeof document!=="undefined"&&!document.getElementById("tytus-forge-css")){const s=document.createElement("style");s.id="tytus-forge-css";s.textContent=__tytusForgeCss;document.head.appendChild(s);}
`;
await writeFile(indexPath, inject + index);
