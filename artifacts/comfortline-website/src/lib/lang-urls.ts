import { ARTICLES } from "@/data/blog-articles";

import cityRoutes from "@/data/belarus-city-route-pages.json";

type Lang = "ru" | "en";

const RU_TO_EN: Record<string, string> = {
  "/трансфер-минск-вильнюс-аэропорт":   "/minsk-vilnius-airport",
  "/трансфер-минск-варшава-шопен":       "/minsk-warsaw-airport",
  "/трансфер-минск-варшава-модлин":      "/minsk-warsaw-modlin-airport",
  "/трансфер-минск-каунас-аэропорт":     "/minsk-kaunas-airport",
  "/трансфер-минск-рига-аэропорт":       "/minsk-riga-airport",
  "/трансфер-мерседес-е-класс":          "/mercedes-e-class-transfer",
  "/трансфер-киа-карнавал":              "/kia-carnival-transfer",
  "/трансфер-хендай-палисад":            "/hyundai-palisade-transfer",
  "/трансфер-фиат-скудо":               "/fiat-scudo-transfer",
  "/трансфер-ауди-а6":                   "/audi-a6-transfer",
  "/трансфер-по-минску":                 "/minsk-city-transfer",
  "/трансфер-по-беларуси":              "/belarus-transfer",
  "/групповой-трансфер":                 "/group-transfer",
  "/трансфер-варшава":                   "/warsaw-transfer",
  "/трансфер-берлин":                    "/berlin-transfer",
  "/трансфер-прага":                     "/prague-transfer",
  "/трансфер-рига":                      "/riga-transfer",
  "/трансфер-в-санаторий":              "/sanatorium-transfer",
  "/лыжный-трансфер":                    "/ski-transfer",
  "/вип-трансфер":                       "/vip-transfer",
  "/трансфер-мерседес-в-класс":          "/mercedes-v-class-transfer",
  "/трансфер-в-европу":                  "/europe-transfer",
  "/трансфер-в-литву":                   "/lithuania-transfer",
  "/трансфер-в-латвию":                  "/latvia-transfer",
  "/трансфер-в-польшу":                  "/poland-transfer",
  "/трансфер-во-францию":               "/france-transfer",
  "/трансфер-в-германию":               "/germany-transfer",
  "/трансфер-минск-каунас":              "/minsk-kaunas-transfer",
  "/трансфер-минск-паланга":             "/minsk-palanga-transfer",
  "/трансфер-минск-вентспилс":           "/minsk-ventspils-transfer",
  "/трансфер-минск-лиепая":              "/minsk-liepaja-transfer",
  "/трансфер-минск-юрмала":              "/minsk-jurmala-transfer",
  "/трансфер-минск-даугавпилс":          "/minsk-daugavpils-transfer",
  "/трансфер-минск-катовице":            "/minsk-katowice-transfer",
  "/трансфер-минск-лодзь":               "/minsk-lodz-transfer",
  "/трансфер-минск-познань":             "/minsk-poznan-transfer",
  "/трансфер-минск-краков":              "/minsk-krakow-transfer",
  "/трансфер-минск-вроцлав":             "/minsk-wroclaw-transfer",
  "/трансфер-минск-гданьск":             "/minsk-gdansk-transfer",
  "/трансфер-минск-вильнюс":             "/minsk-vilnius-transfer",
  "/трансфер-минск-тракай":              "/minsk-trakai-transfer",
  "/трансфер-минск-клайпеда":            "/minsk-klaipeda-transfer",
  "/трансфер-минск-друскининкай":        "/minsk-druskininkai-transfer",
  ...Object.fromEntries(cityRoutes.map((route) => [route.pathRu, route.pathEn])),
  "/трансферы-по-городам-беларуси": "/belarus-city-transfers",
  "/блог":                               "/blog",
};

const EN_TO_RU: Record<string, string> = Object.fromEntries(
  Object.entries(RU_TO_EN).map(([ru, en]) => [en, ru])
);

// Shared pages (/, /faq, /privacy, /terms) are a single wouter <Route> per
// pathname; English now has its own crawlable path under /en/... rather than
// a `?lang=en` query string, so search engines and AI crawlers get a
// genuinely distinct source HTML document per language.
const SHARED_RU_TO_EN: Record<string, string> = {
  "/": "/en",
  "/faq": "/en/faq",
  "/privacy": "/en/privacy",
  "/terms": "/en/terms",
};
const SHARED_EN_TO_RU: Record<string, string> = Object.fromEntries(
  Object.entries(SHARED_RU_TO_EN).map(([ru, en]) => [en, ru])
);

// Derived from the article inventory itself (rather than hand-maintained) so
// every bilingual blog article automatically gets a language-switch target —
// new articles cannot be published without one.
const BLOG_SLUGS: Array<{ ru: string; en: string }> = ARTICLES.filter(
  (a): a is typeof a & { slugEn: string } => Boolean(a.slugEn)
).map((a) => ({ ru: a.slug, en: a.slugEn }));

/**
 * Returns the href a language-switcher link should point to for the given
 * current pathname and target language.
 *
 * - Service pages  → navigate to the URL-based alternate (Cyrillic ↔ Latin).
 * - Blog articles  → navigate to the translated article (or blog index as fallback).
 * - Shared pages (/, /faq, /privacy, /terms) → navigate to the /en/... path-based
 *   alternate (Russian keeps the clean root pathname).
 */
export function getAlternateLangHref(pathname: string, targetLang: Lang): string {
  const path = decodeURIComponent(pathname).replace(/\/+$/, "") || "/";

  if (targetLang === "en") {
    const en = RU_TO_EN[path] || SHARED_RU_TO_EN[path];
    if (en) return en;
    if (SHARED_EN_TO_RU[path]) return path; // already an /en/... shared path
  } else {
    const ru = EN_TO_RU[path] || SHARED_EN_TO_RU[path];
    if (ru) return ru;
  }

  const ruBlogMatch = path.match(/^\/блог\/(.+)$/);
  if (ruBlogMatch) {
    if (targetLang === "en") {
      const pair = BLOG_SLUGS.find((s) => s.ru === ruBlogMatch[1]);
      return pair ? `/blog/${pair.en}` : "/blog";
    }
    return path;
  }

  const enBlogMatch = path.match(/^\/blog\/(.+)$/);
  if (enBlogMatch) {
    if (targetLang === "ru") {
      const pair = BLOG_SLUGS.find((s) => s.en === enBlogMatch[1]);
      return pair ? `/блог/${pair.ru}` : "/блог";
    }
    return path;
  }

  // If path already belongs to the target language, return it unchanged.
  // Cyrillic → Russian URL; Latin + non-shared → English URL.
  // (/, /faq, /privacy, /terms are handled above via SHARED_RU_TO_EN/SHARED_EN_TO_RU.)
  const isShared = ["/brandbook", "/thank-you"].includes(path);
  const hasCyrillic = /[\u0400-\u04FF]/.test(path);
  if (targetLang === "ru" && hasCyrillic) return path;
  if (targetLang === "en" && !hasCyrillic && !isShared) return path;

  if (targetLang === "en") {
    return (path === "/" ? "" : path) + "?lang=en";
  }
  return path;
}

/**
 * Returns the href for a same-page anchor section on the home page (e.g.
 * "services", "fleet"), language-aware. English visitors and crawlers must
 * be routed to the English home shell (`/en#section`) rather than the
 * Russian default (`/#section`), matching the pattern used by the navbar.
 */
export function getHomeSectionHref(lang: Lang, section: string): string {
  return lang === "en" ? `/en#${section}` : `/#${section}`;
}
