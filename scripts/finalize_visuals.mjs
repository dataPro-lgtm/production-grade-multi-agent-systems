#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve("docs/assets/images");
const chapterPattern = /^chapter-(\d{2})$/;
const visualVersion = "3";

const colorMap = new Map([
  ["#fbf7ec", "#fffdf9"],
  ["#fbfaf5", "#fffdf9"],
  ["#fffdf7", "#ffffff"],
  ["#1e3a5f", "#173a63"],
  ["#55708f", "#526a82"],
  ["#3c8d77", "#2f7d67"],
  ["#d59621", "#d97706"],
  ["#c94c4c", "#c73e3e"],
  ["#7651a6", "#6d4ba0"],
  ["#dfeaf4", "#f3f7fb"],
  ["#dcefe7", "#f1f8f5"],
  ["#f7e7b8", "#fff8e8"],
  ["#f7dddd", "#fff3f2"],
  ["#e9e0f4", "#f7f3fb"],
  ["#e8f2ff", "#f3f7fb"],
  ["#e7f5ed", "#f1f8f5"],
  ["#fff4d2", "#fff8e8"],
  ["#fff1bb", "#fff8e8"],
  ["#fff0ef", "#fff3f2"],
  ["#f4ebff", "#f7f3fb"],
  ["#e3f0f8", "#f3f7fb"],
]);

const escapeXml = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const plainText = (value) =>
  value
    .replace(/<[^>]+>/g, " ")
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replace(/\s+/g, " ")
    .trim();

function normalizeRoot(svg) {
  return svg.replace(/<svg\b([^>]*)>/, (_match, attributes) => {
    const cleaned = attributes
      .replace(/\srole="[^"]*"/g, "")
      .replace(/\sfocusable="[^"]*"/g, "")
      .replace(/\sdata-whiteboard-version="[^"]*"/g, "");
    return `<svg${cleaned} role="img" focusable="false" data-whiteboard-version="${visualVersion}">`;
  });
}

function normalizeColors(svg) {
  let normalized = svg;
  for (const [from, to] of colorMap) {
    normalized = normalized.replaceAll(from, to);
    normalized = normalized.replaceAll(from.toUpperCase(), to);
  }
  return normalized;
}

function normalizeTypography(svg) {
  return svg
    .replaceAll(
      "'Kaiti SC','STKaiti',sans-serif",
      "'Kaiti SC','STKaiti','Noto Sans SC',sans-serif",
    )
    .replaceAll(
      "'Kaiti SC', 'STKaiti', sans-serif",
      "'Kaiti SC','STKaiti','Noto Sans SC',sans-serif",
    );
}

function removePreviousFinalization(svg) {
  return svg
    .replace(/<title id="whiteboard-title">[\s\S]*?<\/title>\s*/g, "")
    .replace(/<desc id="whiteboard-desc">[\s\S]*?<\/desc>\s*/g, "")
    .replace(
      /<pattern id="whiteboard-paper-dots"[\s\S]*?<\/pattern>/g,
      "",
    )
    .replace(/<g id="whiteboard-surface"[\s\S]*?<\/g>\s*/g, "")
    .replace(/<text[^>]+id="whiteboard-footer"[\s\S]*?<\/text>\s*/g, "")
    .replace(
      /<text\b[^>]*>\s*生产级多智能体系统\s*·\s*第\s*\d{2}\s*章\s*<\/text>\s*/g,
      "",
    );
}

function addMetadata(svg, file, chapter) {
  const firstText = svg.match(/<text\b[^>]*>([\s\S]*?)<\/text>/);
  const title = firstText ? plainText(firstText[1]) : file.name.replaceAll("-", " ");
  const metadata = `<title id="whiteboard-title">${escapeXml(title)}</title>
<desc id="whiteboard-desc">《生产级多智能体系统》第 ${chapter} 章架构图，使用确定性白板线框表达控制流、证据或责任边界。</desc>
`;
  return svg.replace(/(<svg\b[^>]*>)/, `$1\n${metadata}`);
}

function addSurface(svg) {
  const surface = `<g id="whiteboard-surface" aria-hidden="true" opacity=".22">
  <rect width="1600" height="900" fill="url(#whiteboard-paper-dots)"/>
</g>
`;
  const pattern = `<pattern id="whiteboard-paper-dots" width="17" height="17" patternUnits="userSpaceOnUse">
  <circle cx="2" cy="3" r=".7" fill="#d7dee7" opacity=".34"/>
  <circle cx="13" cy="11" r=".45" fill="#eadfce" opacity=".3"/>
</pattern>`;
  let next = svg;
  if (next.includes("<defs>")) {
    next = next.replace("<defs>", `<defs>${pattern}`);
  } else {
    next = next.replace(
      /(<desc id="whiteboard-desc">[\s\S]*?<\/desc>)/,
      `$1\n<defs>${pattern}</defs>`,
    );
  }
  const background = next.match(/<rect\b[^>]*(?:width="1600"[^>]*height="900"|width="100%"[^>]*height="100%")[^>]*\/>/);
  if (!background) {
    throw new Error("Missing full-canvas background rectangle");
  }
  return next.replace(background[0], `${background[0]}\n${surface}`);
}

function addFooter(svg, chapter) {
  const footer = `<text id="whiteboard-footer" x="1525" y="862" font-family="'Kaiti SC','STKaiti','Noto Sans SC',sans-serif" font-size="18" fill="#526a82" text-anchor="end">生产级多智能体系统 · 第 ${chapter} 章</text>
`;
  return svg.replace("</svg>", `${footer}</svg>`);
}

async function finalize(file, chapter) {
  let svg = fs.readFileSync(file, "utf8");
  svg = removePreviousFinalization(svg);
  svg = normalizeRoot(svg);
  svg = normalizeColors(svg);
  svg = normalizeTypography(svg);
  svg = addMetadata(svg, path.parse(file), chapter);
  svg = addSurface(svg);
  svg = addFooter(svg, chapter);
  fs.writeFileSync(file, svg);

  const png = file.replace(/\.svg$/, ".png");
  await sharp(Buffer.from(svg))
    .resize(1600, 900, { fit: "fill" })
    .png({ compressionLevel: 9, palette: false })
    .toFile(png);
  return png;
}

const chapterDirs = fs
  .readdirSync(root, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && chapterPattern.test(entry.name))
  .sort((a, b) => a.name.localeCompare(b.name));

let count = 0;
for (const directory of chapterDirs) {
  const chapter = directory.name.match(chapterPattern)[1];
  const directoryPath = path.join(root, directory.name);
  const svgFiles = fs
    .readdirSync(directoryPath)
    .filter(
      (name) =>
        name.endsWith(".svg") && !/\.(?:en|ja)\.svg$/u.test(name),
    )
    .sort()
    .map((name) => path.join(directoryPath, name));
  for (const file of svgFiles) {
    await finalize(file, chapter);
    count += 1;
  }
}

if (count !== 68) {
  throw new Error(`Expected 68 chapter diagrams, finalized ${count}`);
}

console.log(`Finalized ${count} architect-whiteboard diagrams (SVG + PNG).`);
