import { readFile, mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";

// The header and all generated icons share this SVG. Run from the project root.
// An optional output root allows preparing assets without changing the checkout.
const require = createRequire(path.join(process.cwd(), "package.json"));
const sharp = require("sharp");
const root = path.resolve(process.argv[2] || process.cwd());
const brand = path.join(root, "public/brand");
const svg = await readFile(path.join(brand, "book-sprout-mark.svg"), "utf8");

async function png(size) {
  const sizedSvg = svg.replace('width="27" height="27"', `width="${size}" height="${size}"`);
  return sharp(Buffer.from(sizedSvg)).png().toBuffer();
}

await mkdir(brand, { recursive: true });
await Promise.all([
  [96, "bomgichul-icon-96.png"],
  [180, "bomgichul-apple-icon.png"],
  [1024, "bomgichul-search-icon.png"],
].map(async ([size, filename]) => writeFile(path.join(brand, filename), await png(size))));

// ICO supports PNG frames and preserves the source SVG's transparent background.
const sizes = [16, 32, 48, 64, 96, 128, 256];
const frames = await Promise.all(sizes.map(png));
const directory = Buffer.alloc(6 + sizes.length * 16);
directory.writeUInt16LE(1, 2);
directory.writeUInt16LE(sizes.length, 4);
let offset = directory.length;
for (let i = 0; i < sizes.length; i += 1) {
  const entry = 6 + i * 16;
  directory.writeUInt8(sizes[i] === 256 ? 0 : sizes[i], entry);
  directory.writeUInt8(sizes[i] === 256 ? 0 : sizes[i], entry + 1);
  directory.writeUInt16LE(1, entry + 4);
  directory.writeUInt16LE(32, entry + 6);
  directory.writeUInt32LE(frames[i].length, entry + 8);
  directory.writeUInt32LE(offset, entry + 12);
  offset += frames[i].length;
}
await writeFile(path.join(root, "public/favicon.ico"), Buffer.concat([directory, ...frames]));
