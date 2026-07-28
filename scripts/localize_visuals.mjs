#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve("docs/assets/images");
const translationRoot = path.resolve("i18n/visuals");
const locales = {
  en: {
    font:
      "'Chalkboard SE','Comic Sans MS','Arial',sans-serif",
    fontScale: 0.82,
  },
  ja: {
    font:
      "'Klee One','Yu Gothic','Hiragino Kaku Gothic ProN','Noto Sans JP',sans-serif",
    fontScale: 0.92,
  },
};
const chapterPattern = /^chapter-(\d{2})$/u;
const localizedSuffix = /\.(?:en|ja)\.svg$/u;
const hanPattern = /\p{Script=Han}/u;

function decodeXml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'");
}

function encodeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function sourceFiles(directoryPath) {
  return fs
    .readdirSync(directoryPath)
    .filter((name) => name.endsWith(".svg") && !localizedSuffix.test(name))
    .sort()
    .map((name) => path.join(directoryPath, name));
}

function sourceStrings(svg) {
  const strings = new Set();
  for (const match of svg.matchAll(/>([^<>]+)</gu)) {
    const value = decodeXml(match[1]).trim();
    if (value && hanPattern.test(value)) {
      strings.add(value);
    }
  }
  return [...strings].sort((left, right) => left.localeCompare(right, "zh"));
}

function templateFor(locale, chapter, strings) {
  return {
    _meta: {
      locale,
      chapter,
      rule: "Translate every value. Keep labels concise enough for the existing whiteboard layout.",
    },
    translations: Object.fromEntries(strings.map((value) => [value, ""])),
  };
}

function initializeTemplates() {
  let count = 0;
  for (const locale of Object.keys(locales)) {
    const localeRoot = path.join(translationRoot, locale);
    fs.mkdirSync(localeRoot, { recursive: true });
    for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
      const match = entry.isDirectory() && entry.name.match(chapterPattern);
      if (!match) continue;
      const chapter = match[1];
      const strings = new Set();
      for (const file of sourceFiles(path.join(root, entry.name))) {
        const svg = fs.readFileSync(file, "utf8");
        for (const value of sourceStrings(svg)) strings.add(value);
      }
      const target = path.join(localeRoot, `${entry.name}.json`);
      if (!fs.existsSync(target)) {
        fs.writeFileSync(
          target,
          `${JSON.stringify(
            templateFor(
              locale,
              chapter,
              [...strings].sort((left, right) =>
                left.localeCompare(right, "zh"),
              ),
            ),
            null,
            2,
          )}\n`,
        );
        count += 1;
      }
    }
  }
  console.log(`Initialized ${count} visual translation templates.`);
}

function loadTranslations(locale, chapterDirectory) {
  const file = path.join(
    translationRoot,
    locale,
    `${chapterDirectory}.json`,
  );
  if (!fs.existsSync(file)) {
    throw new Error(`Missing visual translation map: ${file}`);
  }
  const parsed = JSON.parse(fs.readFileSync(file, "utf8"));
  return { file, translations: parsed.translations ?? {} };
}

function localizeSvg(svg, locale, translations, source) {
  const missing = new Set();
  let localized = svg.replace(/>([^<>]+)</gu, (match, rawValue) => {
    const leading = rawValue.match(/^\s*/u)?.[0] ?? "";
    const trailing = rawValue.match(/\s*$/u)?.[0] ?? "";
    const value = decodeXml(rawValue).trim();
    if (!value || !hanPattern.test(value)) return match;
    const translated = translations[value];
    if (typeof translated !== "string" || !translated.trim()) {
      missing.add(value);
      return match;
    }
    return `>${leading}${encodeXml(translated.trim())}${trailing}<`;
  });

  if (missing.size) {
    throw new Error(
      `${source}: ${locale} map is missing ${missing.size} strings:\n${[
        ...missing,
      ].join("\n")}`,
    );
  }

  localized = localized
    .replace(
      /<svg\b([^>]*)\blang="[^"]*"([^>]*)>/u,
      `<svg$1lang="${locale}"$2>`,
    )
    .replace(
      /<svg\b((?:(?!\blang=)[^>])*)>/u,
      `<svg$1 lang="${locale}">`,
    )
    .replace(
      /font-family="'Kaiti SC','STKaiti','Noto Sans SC',sans-serif"/gu,
      `font-family="${locales[locale].font}"`,
    )
    .replace(
      /font-family:"Kaiti SC","STKaiti","Noto Sans SC",sans-serif/gu,
      `font-family:${locales[locale].font}`,
    );

  const scale = locales[locale].fontScale;
  localized = localized
    .replace(/font-size="(\d+(?:\.\d+)?)"/gu, (_match, rawSize) => {
      const size = Math.max(14, Number(rawSize) * scale);
      return `font-size="${Number(size.toFixed(1))}"`;
    })
    .replace(/font-size:(\d+(?:\.\d+)?)px/gu, (_match, rawSize) => {
      const size = Math.max(14, Number(rawSize) * scale);
      return `font-size:${Number(size.toFixed(1))}px`;
    });

  return localized;
}

async function buildLocalizedAssets(localeFilter, chapterFilter) {
  let count = 0;
  let expectedCount = 0;
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    if (!entry.isDirectory() || !chapterPattern.test(entry.name)) continue;
    if (chapterFilter && entry.name !== chapterFilter) continue;
    const directoryPath = path.join(root, entry.name);
    const selectedLocales = localeFilter
      ? [localeFilter]
      : Object.keys(locales);
    for (const locale of selectedLocales) {
      const { file: mapFile, translations } = loadTranslations(
        locale,
        entry.name,
      );
      const sources = sourceFiles(directoryPath);
      expectedCount += sources.length;
      for (const source of sources) {
        const svg = fs.readFileSync(source, "utf8");
        const localized = localizeSvg(svg, locale, translations, mapFile);
        const parsed = path.parse(source);
        const targetSvg = path.join(
          parsed.dir,
          `${parsed.name}.${locale}.svg`,
        );
        const targetPng = path.join(
          parsed.dir,
          `${parsed.name}.${locale}.png`,
        );
        fs.writeFileSync(targetSvg, localized);
        await sharp(Buffer.from(localized))
          .resize(1600, 900, { fit: "fill" })
          .png({ compressionLevel: 9, adaptiveFiltering: true })
          .toFile(targetPng);
        count += 1;
      }
    }
  }
  if (count !== expectedCount) {
    throw new Error(
      `Expected ${expectedCount} localized diagrams, generated ${count}`,
    );
  }
  console.log(`Generated ${count} localized SVG + PNG diagram pairs.`);
}

const args = process.argv.slice(2);
const command = args[0] ?? "build";
const option = (name) => {
  const prefix = `--${name}=`;
  const raw = args.find((value) => value.startsWith(prefix));
  return raw?.slice(prefix.length);
};
const localeFilter = option("locale");
const chapterFilter = option("chapter");
if (localeFilter && !(localeFilter in locales)) {
  throw new Error(`Unsupported locale '${localeFilter}'.`);
}
if (chapterFilter && !chapterPattern.test(chapterFilter)) {
  throw new Error(
    `Invalid chapter '${chapterFilter}'. Use chapter-NN, for example chapter-01.`,
  );
}
if (command === "init") {
  initializeTemplates();
} else if (command === "build") {
  await buildLocalizedAssets(localeFilter, chapterFilter);
} else {
  throw new Error(`Unknown command '${command}'. Use 'init' or 'build'.`);
}
