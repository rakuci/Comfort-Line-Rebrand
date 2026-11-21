import { BUSINESS, SITE_URL } from "./seo-config";

export function localBusinessJsonLd(lang: "ru" | "en") {
  const description =
    lang === "ru"
      ? "ComfortLine — комфортный трансфер из Минска в аэропорт Вильнюса (VNO), аэропорт Варшавы (WAW, Модлин), Берлин и города Европы. Фиксированная цена, опытные водители, комфортные автомобили."
      : "ComfortLine — comfortable transfers from Minsk to Vilnius Airport (VNO), Warsaw Airport (WAW, Modlin), Berlin and major European cities. Personalised quotes, professional drivers, comfortable vehicles.";

  const popularRoutes = [
    {
      ru: { name: "Трансфер Минск — Аэропорт Вильнюса (VNO)", path: "/трансфер-минск-вильнюс-аэропорт" },
      en: { name: "Minsk to Vilnius Airport (VNO) transfer", path: "/minsk-vilnius-airport" },
    },
    {
      ru: { name: "Трансфер Минск — Аэропорт Шопен (WAW)", path: "/трансфер-минск-варшава-шопен" },
      en: { name: "Minsk to Warsaw Chopin Airport (WAW) transfer", path: "/minsk-warsaw-airport" },
    },
  ];

  return {
    "@context": "https://schema.org",
    "@type": ["TaxiService", "LocalBusiness"],
    "@id": `${SITE_URL}#business`,
    name: BUSINESS.name,
    alternateName: ["ComfortLine Transfer", "Комфортлайн", "ComfortLine Минск"],
    legalName: BUSINESS.legalName,
    url: BUSINESS.url,
    logo: BUSINESS.logo,
    image: [BUSINESS.image, `${SITE_URL}/car-mercedes-e.jpg`, `${SITE_URL}/car-kia-carnival.jpg`],
    telephone: BUSINESS.phone,
    email: BUSINESS.email,
    priceRange: "€€",
    slogan: BUSINESS.slogan[lang],
    description,
    foundingDate: BUSINESS.foundingDate,
    paymentAccepted: BUSINESS.paymentAccepted.join(", "),
    currenciesAccepted: BUSINESS.currenciesAccepted,
    knowsLanguage: ["ru", "en", "be", "pl"],
    address: {
      "@type": "PostalAddress",
      addressLocality: lang === "ru" ? "Минск" : "Minsk",
      addressRegion: lang === "ru" ? "Минская область" : "Minsk Region",
      addressCountry: "BY",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: BUSINESS.geo.lat,
      longitude: BUSINESS.geo.lng,
    },
    areaServed: BUSINESS.serviceArea.map((a) => ({ "@type": "Place", name: a })),
    serviceArea: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: BUSINESS.geo.lat,
        longitude: BUSINESS.geo.lng,
      },
      geoRadius: 1500000,
    },
    sameAs: BUSINESS.sameAs,
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: BUSINESS.phone,
        contactType: "customer service",
        availableLanguage: ["Russian", "English", "Belarusian", "Polish"],
        areaServed: ["BY", "LT", "PL", "LV", "DE", "CZ", "RU"],
        contactOption: ["TollFree"],
        hoursAvailable: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          opens: "00:00",
          closes: "23:59",
        },
      },
      {
        "@type": "ContactPoint",
        telephone: BUSINESS.phone,
        contactType: "reservations",
        availableLanguage: ["Russian", "English"],
        url: "https://wa.me/375447620649",
      },
    ],
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "00:00",
      closes: "23:59",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: lang === "ru" ? "Популярные направления" : "Popular routes",
      itemListElement: popularRoutes.map((r) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: r[lang].name,
          url: SITE_URL + r[lang].path,
          provider: { "@id": `${SITE_URL}#business` },
        },
      })),
    },
  };
}

export interface ServiceJsonLdInput {
  name: string;
  description: string;
  url: string;
  fromName: string;
  toName: string;
  distanceKm?: string;
  durationIso?: string;
  priceFrom?: number;
  priceCurrency?: string;
  lang: "ru" | "en";
}

export function taxiServiceJsonLd(s: ServiceJsonLdInput) {
  const offer = typeof s.priceFrom === "number" ? {
    "@type": "Offer",
    url: s.url,
    seller: { "@id": `${SITE_URL}#business` },
    priceSpecification: {
      "@type": "PriceSpecification",
      minPrice: s.priceFrom,
      priceCurrency: s.priceCurrency || "BYN",
      description: s.lang === "ru" ? "Начальная цена за автомобиль в одну сторону" : "Starting fare per vehicle, one way",
    },
  } : undefined;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: s.lang === "ru" ? "Индивидуальный трансфер" : "Private transfer",
    name: s.name,
    description: s.description,
    url: s.url,
    provider: { "@id": `${SITE_URL}#business` },
    areaServed: [
      { "@type": "Place", name: s.fromName },
      { "@type": "Place", name: s.toName },
    ],
    offers: offer,
  };
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: SITE_URL + it.path,
    })),
  };
}

export interface FaqEntry {
  question: string;
  answer: string;
}

export function faqJsonLd(entries: FaqEntry[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entries.map((e) => ({
      "@type": "Question",
      name: e.question,
      acceptedAnswer: { "@type": "Answer", text: e.answer },
    })),
  };
}

export interface VehicleJsonLdInput {
  name: string;
  description: string;
  image: string;
  url: string;
  seatingCapacity: number;
  modelDate?: string;
  vehicleClass?: string;
  lang: "ru" | "en";
}

export function vehicleJsonLd(v: VehicleJsonLdInput) {
  const offer = {
    "@type": "Offer",
    url: v.url,
    availability: "https://schema.org/InStock",
    priceCurrency: "BYN",
    seller: { "@id": `${SITE_URL}#business` },
  };

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: v.lang === "ru" ? "Индивидуальный трансфер" : "Private transfer",
    name: v.name,
    description: v.description,
    image: v.image,
    url: v.url,
    provider: { "@id": `${SITE_URL}#business` },
    offers: offer,
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: v.lang === "ru" ? "Количество мест" : "Seating capacity",
        value: v.seatingCapacity,
      },
      ...(v.modelDate
        ? [{
            "@type": "PropertyValue",
            name: v.lang === "ru" ? "Год выпуска" : "Model year",
            value: v.modelDate,
          }]
        : []),
      ...(v.vehicleClass
        ? [{
            "@type": "PropertyValue",
            name: v.lang === "ru" ? "Класс автомобиля" : "Vehicle class",
            value: v.vehicleClass,
          }]
        : []),
    ],
  };
}
