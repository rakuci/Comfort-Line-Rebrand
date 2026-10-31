import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { createDataLoader } from "../lib/load-blog-data.mjs";

const load = createDataLoader();
const { buildShoppingEnquiry: build, parseShoppingNumber: number, ENQUIRY_FIELDS, ENQUIRY_DISCLAIMER } = load("shopping-enquiry");
const { ARTICLES } = load("blog-articles");
const article = ARTICLES.find((a) => a.slug === "eu-belarus-shopping-by-car");

test("both complete supplied articles retain all text, five tables and every source URL", () => {
  const source = readFileSync(new URL("../../../../attached_assets/comfortline-replit-content-ru-en_1793430129314.md", import.meta.url), "utf8");
  const ru = source.split("# Russian article — publication content")[1].split("# English article — publication content")[0];
  const en = source.split("# English article — publication content")[1];
  for (const [lang, supplied] of [["ru", ru], ["en", en]]) {
    const body = lang === "ru" ? article.body : article.bodyEn;
    const copy = JSON.stringify(body);
    const normalize = (s) => s.replace(/\s+/g, " ").trim();
    for (const line of supplied.split("\n").map((s) => s.trim()).filter(Boolean)) {
      if (line === "---" || line.startsWith("# ")) continue;
      if (/^\|[\s:|-]+\|$/.test(line)) continue;
      const fragments = line.startsWith("|") ? line.slice(1, -1).split("|").map((s) => s.trim())
        : [line.replace(/^#{2,3} /, "").replace(/^[-*] /, "").replace(/^\d+\. /, "")];
      for (const fragment of fragments) {
        assert(normalize(copy).includes(normalize(JSON.stringify(fragment).slice(1, -1))), `${lang}: missing supplied copy ${fragment.slice(0, 90)}`);
      }
    }
    for (const [, url] of supplied.matchAll(/\]\((https:\/\/[^)]+)\)/g)) assert(copy.includes(url), `${lang}: ${url}`);
    assert.equal(body.filter((b) => b.type === "table").length, 5);
    const formAt = body.findIndex((b) => b.type === "shoppingEnquiry");
    assert(formAt > body.findIndex((b) => b.type === "h2" && b.text.startsWith("10.")));
    assert.equal(body[formAt + 1].type, "h2");
    assert.equal(body.filter((b) => b.type === "h2" && /^\d+\./.test(b.text)).length, 10);
  }
});

test("every optional field is explicitly unknown in both languages", () => {
  for (const lang of ["ru", "en"]) {
    const text = build({}, lang);
    for (const f of ENQUIRY_FIELDS) assert(text.includes(`${f[lang]}: ${lang === "ru" ? "Неизвестно" : "Unknown"}`));
    assert(text.includes(ENQUIRY_DISCLAIMER[lang]));
    assert.match(text, lang === "ru" ? /въезд, транзит и возврат/ : /entry, transit and return/);
    assert.match(text, lang === "ru" ? /актуальный статус КПП/ : /current checkpoint/);
    assert.doesNotMatch(text, /\b(?:approved|allowed|guaranteed)\b/i);
  }
});

test("currency and weight parsing never coerces unknown or invalid data to zero", () => {
  assert.equal(number("25,5"), 25.5);
  assert.equal(number("0"), 0);
  for (const value of ["", "unknown", "-1", "1,000.00", "Infinity", "€500", "1e3"]) assert.equal(number(value), undefined);
});

test("per-passenger limits use strictly above either limit, not their sum", () => {
  const common = { direction: "toBy", borderCountry: "pl", registration: "DE" };
  for (const values of [{ valueEUR: "500.01", weightKG: "1" }, { valueEUR: "1", weightKG: "25.01" }]) {
    assert.match(build({ ...common, ...values }, "en"), /exceed €500 or 25 kg per passenger/);
  }
  const boundary = build({ ...common, valueEUR: "500", weightKG: "25" }, "en");
  assert.doesNotMatch(boundary, /Purchases exceed/);
  assert.match(boundary, /Do not pool passenger allowances/);
  assert.match(boundary, /personal use, frequency, annual categories and restrictions still need checking/);
  assert.match(build(common, "en"), /unknown is not zero/);
});

test("BY plate conditions are country-specific and never equate a Polish permit with a Lithuanian one", () => {
  for (const lang of ["ru", "en"]) {
    const lt = build({ registration: "Беларусь / BY", borderCountry: "lt", direction: "round", entryBasis: "Polish permit" }, lang);
    assert.match(lt, lang === "ru" ? /Польский ВНЖ не заменяет литовский/ : /Polish permit does not replace a Lithuanian/);
    assert.match(lt, lang === "ru" ? /объём см³ и клиренс/ : /capacity in cm³ and ground clearance/);
    const pl = build({ registration: "BY", borderCountry: "pl", direction: "toEu" }, lang);
    assert.match(pl, lang === "ru" ? /собственника за рулём или его присутствие/ : /owner driving or being present/);
    const lv = build({ registration: "Belarus", borderCountry: "lv", direction: "toEu" }, lang);
    assert.match(lv, lang === "ru" ? /общий запрет въезда в ЕС/ : /general prohibition on EU entry/);
  }
});

test("direction, annual categories, special goods and permanent import remain separate checks", () => {
  const euOnly = build({ direction: "toEu", purpose: "import", registration: "any other country", citizenships: "Stateless; multiple citizenships" }, "en");
  assert.match(euOnly, /Stateless; multiple citizenships/);
  assert.match(euOnly, /EU return\/entry/);
  assert.doesNotMatch(euOnly, /Purchases exceed/);
  assert.match(euOnly, /permanent vehicle import or sale involve separate procedures/);
  assert.match(euOnly, /annual-category goods/);
  assert.match(euOnly, /retailer’s product number is not a customs product type/);
  const unknown = build({ vehicleDetails: "Small engine, cheap vehicle" }, "en");
  assert.match(unknown, /small engine does not establish export eligibility/);
  assert.match(unknown, /unknown details are not a favourable result/);
});
