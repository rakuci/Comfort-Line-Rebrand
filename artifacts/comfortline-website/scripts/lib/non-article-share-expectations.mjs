import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const pages = resolve(dirname(fileURLToPath(import.meta.url)), "../../src/pages");

// An independent AST reader, not the manifest's regex/object-slicing parser.
// Read static copy only: never execute page imports, React, or browser code.
function readPage(file) {
  const tree = ts.createSourceFile(file, readFileSync(resolve(pages, file), "utf8"),
    ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const variables = {};
  const tags = [];
  const elements = [];
  function literal(node) {
    if (!node) return undefined;
    if (ts.isStringLiteralLike(node)) return node.text;
    if (ts.isObjectLiteralExpression(node)) {
      return Object.fromEntries(node.properties.filter(ts.isPropertyAssignment)
        .map((p) => [p.name.text, literal(p.initializer)]));
    }
    return undefined;
  }
  function visit(node) {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name)) {
      variables[node.name.text] = literal(node.initializer);
    }
    if (ts.isJsxSelfClosingElement(node) && node.tagName.getText(tree) === "Seo") {
      tags.push(Object.fromEntries(node.attributes.properties.filter(ts.isJsxAttribute)
        .map((p) => [p.name.text, literal(p.initializer)])));
    }
    if (ts.isJsxElement(node)) elements.push(node);
    ts.forEachChild(node, visit);
  }
  visit(tree);
  function conditionalCopy(tag, lang, after) {
    const element = elements.find((e) => e.openingElement.tagName.getText(tree) === tag
      && (!after || e.pos > after.end)
      && e.children.some((c) => ts.isJsxExpression(c) && c.expression
        && ts.isConditionalExpression(c.expression) && c.expression.condition.getText(tree) === "isRu"));
    const expression = element?.children.find((c) => ts.isJsxExpression(c)
      && c.expression && ts.isConditionalExpression(c.expression))?.expression;
    return { element, text: expression && literal(lang === "ru" ? expression.whenTrue : expression.whenFalse) };
  }
  return { variables, seo: tags[0], conditionalCopy };
}

function expectation(page, seo, ogSlug, copy) {
  assert.ok(seo?.pathRu && seo?.pathEn, `${page}: missing independent share paths`);
  const result = { ogSlug, pathRu: seo.pathRu, pathEn: seo.pathEn };
  for (const [lang, suffix] of [["ru", "Ru"], ["en", "En"]]) {
    const { title, intro } = copy(lang, suffix);
    assert.ok(title && intro, `${page} [${lang}]: missing independent share copy`);
    result[`h1${suffix}`] = title;
    result[`intro${suffix}`] = intro;
  }
  return result;
}

export function collectNonArticleShareExpectations() {
  const expected = [];
  const excluded = new Set(["landing.tsx", "faq.tsx", "terms.tsx", "privacy-policy.tsx",
    "brandbook.tsx", "thank-you.tsx", "not-found.tsx", "route-landing-page.tsx",
    "country-transfer-page.tsx", "vehicle-page.tsx",
    "belarus-city-routes.tsx", "belarus-city-routes-index.tsx"]);
  for (const file of readdirSync(pages).filter((f) => f.endsWith(".tsx") && !excluded.has(f))) {
    const page = readPage(file);
    const data = page.variables.data;
    const seo = data?.seo || page.seo;
    assert.ok(seo, `${file}: unsupported share source (update independent expectations)`);
    expected.push(expectation(file, seo, seo.pathEn?.slice(1).replaceAll("/", "-"), (lang, suffix) => {
      const content = (data || page.variables.content)?.[lang];
      return {
        title: content?.title || page.conditionalCopy("h1", lang).text
          || seo[`title${suffix}`]?.replace(/\s*\|\s*ComfortLine.*$/i, "").trim(),
        intro: content?.subtitle || content?.seoIntro || seo[`desc${suffix}`],
      };
    }));
  }
  const fleet = readPage("vehicle-page.tsx").variables;
  assert.ok(fleet.vehicleSeo && fleet.vehicleContent, "Missing independent fleet source");
  for (const [slug, seo] of Object.entries(fleet.vehicleSeo)) {
    expected.push(expectation("vehicle-page.tsx", seo, slug, (lang) => ({
      title: fleet.vehicleContent[slug]?.[lang]?.name,
      intro: fleet.vehicleContent[slug]?.[lang]?.desc,
    })));
  }
  // The route pages are described in static curated JSON rather than
  // one TSX component per direction. Inspect that source independently.
  const cityMeta = JSON.parse(readFileSync(resolve(pages, "../data/belarus-city-route-pages.json"), "utf8"));
  for (const route of cityMeta) {
    expected.push(expectation("belarus-city-route-pages.json", route,
      route.pathEn.slice(1), (lang, suffix) => ({
        title: route["h1" + suffix],
        intro: route["intro" + suffix],
      })));
  }
  expected.push(expectation("belarus-city-routes-index.tsx", {
    pathRu: "/трансферы-по-городам-беларуси",
    pathEn: "/belarus-city-transfers",
  }, "belarus-city-transfers", (lang) => ({
    title: lang === "ru" ? "Трансферы между городами Беларуси и Европы"
      : "Private transfers between Belarusian cities and Europe",
    intro: lang === "ru" ? "Выберите конкретное направление, чтобы узнать об адресах подачи, возможностях поездки и достопримечательностях города назначения."
      : "Choose a direction to review pickup options, route-specific considerations and authentic landmarks in the destination city.",
  })));
  const blog = readPage("blog/index.tsx");
  // Stable public index identities; do not derive them from the manifest.
  expected.push(expectation("blog/index.tsx", { pathRu: "/блог", pathEn: "/blog" }, "blog-index", (lang) => {
    const heading = blog.conditionalCopy("h1", lang);
    return { title: heading.text, intro: blog.conditionalCopy("p", lang, heading.element).text };
  }));
  return expected;
}
