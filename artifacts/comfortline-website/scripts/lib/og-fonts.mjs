import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

export const OG_FONT_FAMILY = "DejaVu Sans";
export const OG_FONT_DIR = fileURLToPath(new URL("../fonts/", import.meta.url));
export const OG_FONT_CONFIG = fileURLToPath(new URL("../fonts/fonts.conf", import.meta.url));
export const OG_FONT_HASHES = Object.freeze({
  "DejaVuSans.ttf": "ae7b7855e115a5966d8b1b3f80f254ccc117ec86f9965e202ee2940453837280",
  "DejaVuSans-Bold.ttf": "5c1247acef7f2b8522a31742c76d6adcb5569bacc0be7ceaa4dc39dd252ce895",
});

// Call only in the image-generator process, BEFORE importing sharp: fontconfig
// is initialized by native libraries and cannot reliably be reset afterwards.
// Missing/changed pinned files must fail the build, never use a host fallback.
export function configureOgFonts() {
  for (const [name, expected] of Object.entries(OG_FONT_HASHES)) {
    const bytes = readFileSync(new URL(`../fonts/${name}`, import.meta.url));
    if (createHash("sha256").update(bytes).digest("hex") !== expected) {
      throw new Error(`OG font checksum mismatch: ${name}`);
    }
  }
  readFileSync(OG_FONT_CONFIG); // Fail explicitly if the isolated config is missing.
  process.env.FONTCONFIG_FILE = OG_FONT_CONFIG;
  process.env.FONTCONFIG_PATH = OG_FONT_DIR;
}
