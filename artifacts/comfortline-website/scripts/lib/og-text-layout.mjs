// Conservative em advances for the Arial/Helvetica/sans-serif SVG stack.
// These include headroom for the DejaVu Sans fallback used by sharp/librsvg.
// No font loading, native rendering, or file access is needed to plan a layout.
export function measureText(text, fontSize) {
  let em = 0;
  for (const char of text) {
    if (/\p{Mark}/u.test(char)) continue;
    if (/\s/u.test(char)) em += 0.36;
    else if ("ilIjtfr.,:;!'|`".includes(char)) em += 0.5;
    else if ('()[]{}"/\\-'.includes(char)) em += 0.55;
    else if ("mwMW@%ЖШЩЮФЫДЪжшщюфыд".includes(char)) em += 1.2;
    else if (/[A-ZА-ЯЁ]/u.test(char)) em += 0.9;
    else if (/[a-zа-яё0-9]/u.test(char)) em += 0.78;
    else em += 1.25; // Dashes, symbols, and unsupported scripts need more room.
  }
  return em * fontSize;
}

// Split oversized tokens by Unicode code point, retaining combining marks.
// Ordinary copy wraps only at whitespace; no hyphens/ellipses are inserted.
function wrap(text, fontSize, maxWidth) {
  const lines = [];
  let line = "";
  for (const word of text.trim().split(/\s+/u).filter(Boolean)) {
    const candidate = line ? `${line} ${word}` : word;
    if (measureText(candidate, fontSize) <= maxWidth) {
      line = candidate;
      continue;
    }
    if (line) lines.push(line);
    line = "";
    for (const char of word) {
      if (measureText(line + char, fontSize) > maxWidth) {
        if (!line) throw new RangeError("OG glyph exceeds available width");
        lines.push(line);
        line = "";
      }
      line += char;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export function fitText(text, { maxWidth, maxLines, maxFontSize, minFontSize }) {
  if (typeof text !== "string") throw new TypeError("OG text must be a string");
  if (!(maxWidth > 0 && maxLines >= 1 && minFontSize > 0 && maxFontSize >= minFontSize)) {
    throw new RangeError("Invalid OG text bounds");
  }
  for (let fontSize = maxFontSize; fontSize >= minFontSize; fontSize--) {
    const lines = wrap(text, fontSize, maxWidth);
    if (lines.length <= maxLines) {
      return { lines, fontSize, lineHeight: Math.ceil(fontSize * 1.2) };
    }
  }
  throw new RangeError(`OG text cannot fit ${maxLines} lines at readable sizes: ${text}`);
}

export const OG_TEXT_BOUNDS = Object.freeze({
  x: 80, width: 1040, top: 174, bottom: 486, gap: 22,
});

export function layoutOgText({ title, subtitle }) {
  if (!title?.trim()) throw new TypeError("OG title must not be empty");
  const titleBlock = fitText(title, {
    maxWidth: OG_TEXT_BOUNDS.width, maxLines: 3, maxFontSize: 60, minFontSize: 44,
  });
  const subtitleBlock = fitText(subtitle, {
    maxWidth: OG_TEXT_BOUNDS.width, maxLines: 2, maxFontSize: 30, minFontSize: 25,
  });
  const titleHeight = titleBlock.lines.length * titleBlock.lineHeight;
  const gap = subtitleBlock.lines.length ? OG_TEXT_BOUNDS.gap : 0;
  const height = titleHeight + gap + subtitleBlock.lines.length * subtitleBlock.lineHeight;
  if (height > OG_TEXT_BOUNDS.bottom - OG_TEXT_BOUNDS.top) {
    throw new RangeError("OG text overlaps branding or footer");
  }
  const top = OG_TEXT_BOUNDS.top + (OG_TEXT_BOUNDS.bottom - OG_TEXT_BOUNDS.top - height) / 2;
  function position(block, y) {
    return {
      ...block,
      lines: block.lines.map((text, index) => ({
        text, x: OG_TEXT_BOUNDS.x, y: y + block.fontSize + index * block.lineHeight,
        width: measureText(text, block.fontSize),
      })),
    };
  }
  return {
    title: position(titleBlock, top),
    subtitle: position(subtitleBlock, top + titleHeight + gap),
  };
}
