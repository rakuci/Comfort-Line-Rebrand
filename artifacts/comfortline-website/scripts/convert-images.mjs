import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.resolve(__dirname, "..", "public");

const QUALITY = 80;
const SKIP = new Set(["opengraph.jpg"]);

// Match the gallery's responsive candidates. Prefer PNG when legacy JPEG and
// PNG files share a basename (some legacy .jpg downloads are HTML error pages).
const GALLERY_WIDTHS = [400, 800, 1200];

async function convertOne(file, width) {
  const inPath = path.join(PUBLIC_DIR, file);
  const base = file.replace(/\.(png|jpg|jpeg)$/i, "");
  const outPath = path.join(PUBLIC_DIR, base + (width ? `-${width}` : "") + ".webp");

  const inStat = fs.statSync(inPath);
  if (fs.existsSync(outPath)) {
    const outStat = fs.statSync(outPath);
    if (outStat.mtimeMs >= inStat.mtimeMs) {
      return { file, skipped: true, before: inStat.size, after: outStat.size };
    }
  }
  let image = sharp(inPath).rotate();
  if (width) image = image.resize({ width });
  await image.webp({ quality: QUALITY, effort: 5 }).toFile(outPath);
  const after = fs.statSync(outPath).size;
  return { file, before: inStat.size, after, skipped: false };
}

async function main() {
  const candidates = fs
    .readdirSync(PUBLIC_DIR, { recursive: true })
    .filter((f) => /\.(png|jpg|jpeg)$/i.test(f) && !SKIP.has(f))
    .sort((a, b) => Number(/\.png$/i.test(b)) - Number(/\.png$/i.test(a)) || a.localeCompare(b));
  const byBase = new Map();
  for (const file of candidates) {
    const base = file.replace(/\.(png|jpg|jpeg)$/i, "");
    if (!byBase.has(base)) byBase.set(base, file);
  }
  const files = [...byBase.values()];
  if (files.length === 0) {
    console.log("[webp] no images to convert");
    return;
  }
  let totalBefore = 0;
  let totalAfter = 0;
  for (const file of files) {
    const widths = file.startsWith(`img${path.sep}`) ? GALLERY_WIDTHS : [undefined];
    for (const width of widths) {
      const r = await convertOne(file, width);
      if (width === widths[0]) totalBefore += r.before;
      totalAfter += r.after;
      const pct = Math.round((1 - r.after / r.before) * 100);
      const tag = r.skipped ? "skip" : " ok ";
      const kbBefore = (r.before / 1024).toFixed(0);
      const kbAfter = (r.after / 1024).toFixed(0);
      console.log(`[webp] ${tag} ${file}${width ? ` (${width}w)` : ""}: ${kbBefore} KB -> ${kbAfter} KB (-${pct}%)`);
    }
  }
  const totalPct = Math.round((1 - totalAfter / totalBefore) * 100);
  console.log(
    `[webp] total: ${(totalBefore / 1024).toFixed(0)} KB -> ${(totalAfter / 1024).toFixed(0)} KB (-${totalPct}%)`,
  );
}

main().catch((e) => {
  console.error("[webp] failed:", e);
  process.exit(1);
});
