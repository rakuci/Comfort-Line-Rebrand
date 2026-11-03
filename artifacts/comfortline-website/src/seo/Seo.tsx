import { useLang } from "@/context/language-context";
import { useSeo } from "./use-seo";
import { SITE_URL, DEFAULT_OG_IMAGE } from "./seo-config";
import { breadcrumbJsonLd, type BreadcrumbItem } from "./jsonld";

interface SeoProps {
  titleRu: string;
  titleEn: string;
  descRu: string;
  descEn: string;
  pathRu: string;
  pathEn: string;
  keywordsRu?: string;
  keywordsEn?: string;
  ogImage?: string;
  ogType?: string;
  jsonLd?: object | object[];
  breadcrumbsRu?: BreadcrumbItem[];
  breadcrumbsEn?: BreadcrumbItem[];
  noindex?: boolean;
}

export function Seo(props: SeoProps) {
  const { lang } = useLang();
  const isRu = lang === "ru"; // UI language — used for breadcrumbs and JSON-LD (follows user preference)

  // SEO language — derived from the ACTUAL URL, not the user's preference.
  // This ensures Googlebot sees the correct title/description/<html lang> for each URL variant.
  // e.g. a RU-preferring user on /minsk-vilnius-airport still gets EN meta tags.
  // Compare the FULL url (pathname + search) so that shared pages, which have
  // distinct RU/EN pathnames (e.g. /faq vs /en/faq) or (for a few legacy
  // utility pages) a `?lang=en` query string, are matched correctly instead of
  // always falling into the RU branch.
  let seoIsRu = isRu;
  let canonicalPath = isRu ? props.pathRu : props.pathEn;
  if (typeof window !== "undefined") {
    const liveFull = window.location.pathname + window.location.search;
    const decodedFull = decodeURIComponent(window.location.pathname) + window.location.search;
    if (liveFull === props.pathEn || decodedFull === props.pathEn) {
      seoIsRu = false;
      canonicalPath = props.pathEn;
    } else if (liveFull === props.pathRu || decodedFull === props.pathRu) {
      seoIsRu = true;
      canonicalPath = props.pathRu;
    }
  }

  const title = seoIsRu ? props.titleRu : props.titleEn;
  const description = seoIsRu ? props.descRu : props.descEn;
  const keywords = seoIsRu ? props.keywordsRu : props.keywordsEn;

  const allJsonLd: object[] = [];
  // Site identity (#business, #organization, WebSite) belongs to index.html.
  // Route-owned schemas reference those IDs, never redefine them.

  const breadcrumbs = isRu ? props.breadcrumbsRu : props.breadcrumbsEn;
  if (breadcrumbs && breadcrumbs.length > 0) {
    allJsonLd.push(breadcrumbJsonLd(breadcrumbs));
  }

  if (props.jsonLd) {
    if (Array.isArray(props.jsonLd)) allJsonLd.push(...props.jsonLd);
    else allJsonLd.push(props.jsonLd);
  }

  // server.mjs canonicalises /foo/ → /foo (301). Canonical and hreflang URLs
  // must therefore NOT have trailing slashes so they match what the server serves.
  // Root "/" is the only exception and is left as-is.
  useSeo({
    title,
    description,
    canonical: SITE_URL + canonicalPath,
    alternates: [
      { hreflang: "ru", href: SITE_URL + props.pathRu },
      { hreflang: "en", href: SITE_URL + props.pathEn },
      { hreflang: "x-default", href: SITE_URL + props.pathRu },
    ],
    ogImage: props.ogImage || DEFAULT_OG_IMAGE,
    ogType: props.ogType,
    keywords,
    jsonLd: allJsonLd,
    lang: seoIsRu ? "ru" : "en",
    robots: props.noindex ? "noindex, nofollow" : undefined,
  });

  return null;
}
