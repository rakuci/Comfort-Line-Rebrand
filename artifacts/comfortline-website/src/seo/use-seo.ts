import { createContext, useContext, useEffect } from "react";

export interface AlternateLink {
  hreflang: string;
  href: string;
}

export interface SeoData {
  title: string;
  description: string;
  canonical: string;
  alternates: AlternateLink[];
  ogImage?: string;
  ogType?: string;
  jsonLd?: object | object[];
  lang?: string;
  keywords?: string;
  /** When set, overrides the default index,follow with e.g. "noindex, nofollow". */
  robots?: string;
}

const SEO_FLAG = "data-seo";

// Build-only collector: prerender uses the exact same page data as the client.
// A per-render provider keeps ownership isolated instead of using global state.
export const SeoRenderContext = createContext<((data: SeoData) => void) | null>(null);

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  const selector = `meta[${attr}="${key}"]`;
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.rel = "canonical";
    document.head.appendChild(el);
  }
  el.href = href;
}

function clearTagged(selector: string) {
  document.head.querySelectorAll(`${selector}[${SEO_FLAG}]`).forEach((el) => el.remove());
}

export function useSeo(data: SeoData) {
  const collect = useContext(SeoRenderContext);
  collect?.(data);
  const altKey = data.alternates.map((a) => `${a.hreflang}|${a.href}`).join(",");
  const jsonKey = data.jsonLd ? JSON.stringify(data.jsonLd) : "";

  useEffect(() => {
    document.title = data.title;
    if (data.lang) {
      document.documentElement.lang = data.lang;
    }

    upsertMeta("name", "description", data.description);
    if (data.keywords) upsertMeta("name", "keywords", data.keywords);
    // Default robots in index.html is "index, follow, ...". Only override when a
    // page explicitly opts out (e.g. brandbook). Restoring on unmount is handled
    // by the next route's useSeo() running its own upsert.
    if (data.robots) {
      upsertMeta("name", "robots", data.robots);
      upsertMeta("name", "googlebot", data.robots);
    } else {
      upsertMeta(
        "name",
        "robots",
        "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
      );
      upsertMeta("name", "googlebot", "index, follow");
    }

    upsertMeta("property", "og:title", data.title);
    upsertMeta("property", "og:description", data.description);
    upsertMeta("property", "og:url", data.canonical);
    upsertMeta("property", "og:type", data.ogType || "website");
    upsertMeta("property", "og:site_name", "ComfortLine");
    upsertMeta("property", "og:locale", data.lang === "ru" ? "ru_RU" : "en_US");
    if (data.ogImage) {
      upsertMeta("property", "og:image", data.ogImage);
      upsertMeta("property", "og:image:secure_url", data.ogImage);
    }

    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", data.title);
    upsertMeta("name", "twitter:description", data.description);
    if (data.ogImage) upsertMeta("name", "twitter:image", data.ogImage);

    upsertCanonical(data.canonical);

    // Remove ALL existing hreflang alternates (tagged or not) to avoid conflicts
    // with stale ones shipped in index.html or left over from another route.
    document.head.querySelectorAll('link[rel="alternate"][hreflang]').forEach((el) => el.remove());
    data.alternates.forEach((alt) => {
      const link = document.createElement("link");
      link.rel = "alternate";
      link.hreflang = alt.hreflang;
      link.href = alt.href;
      link.setAttribute(SEO_FLAG, "1");
      document.head.appendChild(link);
    });

    clearTagged('script[type="application/ld+json"]');
    if (data.jsonLd) {
      const arr = Array.isArray(data.jsonLd) ? data.jsonLd : [data.jsonLd];
      arr.forEach((obj) => {
        const script = document.createElement("script");
        script.type = "application/ld+json";
        script.setAttribute(SEO_FLAG, "1");
        script.textContent = JSON.stringify(obj);
        document.head.appendChild(script);
      });
    }

    return () => {
      clearTagged('link[rel="alternate"]');
      clearTagged('script[type="application/ld+json"]');
    };
  }, [
    data.title,
    data.description,
    data.canonical,
    data.lang,
    data.ogImage,
    data.ogType,
    data.keywords,
    altKey,
    jsonKey,
  ]);
}
