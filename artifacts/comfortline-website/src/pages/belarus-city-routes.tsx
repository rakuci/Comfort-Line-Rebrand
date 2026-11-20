import { MapPin, ShieldCheck, Car } from "lucide-react";
import { useLocation } from "wouter";
import { RouteLandingPage, type RoutePageData, type LandmarkPhoto, type RouteContent } from "./route-landing-page";
import catalog from "@/data/belarus-city-route-catalog.json";
import routePages from "@/data/belarus-city-route-pages.json";

export const belarusCityRoutes = routePages;
type CityId = keyof typeof catalog.cities;
type City = (typeof catalog.cities)[CityId];
type Pair = (typeof catalog.pairs)[number];
type RouteMeta = (typeof routePages)[number];

const city = (id: string): City => catalog.cities[id as CityId] as City;
const pair = (key: string): Pair => {
  const result = catalog.pairs.find((item) => item.key === key);
  if (!result) throw new Error("Missing city-pair data: " + key);
  return result;
};

function image(c: City, lang: "ru" | "en"): LandmarkPhoto {
  const license = c.photo.license;
  return {
    src: c.photo.src,
    caption: lang === "ru" ? c.landmarkRu : c.landmarkEn,
    sourceUrl: c.photo.source,
    credit: c.photo.author,
    license,
    licenseUrl: license.startsWith("CC0")
      ? "https://creativecommons.org/publicdomain/zero/1.0/"
      : license.startsWith("CC BY-SA 3") ? "https://creativecommons.org/licenses/by-sa/3.0/"
      : license.startsWith("CC BY-SA 4") ? "https://creativecommons.org/licenses/by-sa/4.0/"
      : "https://creativecommons.org/licenses/by/4.0/",
  };
}
function related(meta: RouteMeta) {
  const reverse = routePages.find((r) => r.from === meta.to && r.to === meta.from);
  const others = routePages.filter((r) => r.key !== meta.key && r.key !== reverse?.key &&
    (r.from === meta.from || r.to === meta.to)).slice(0, 2);
  return [reverse, ...others].filter((r): r is RouteMeta => !!r).map((r) => ({
    ru: city(r.from).ru + " — " + city(r.to).ru,
    en: city(r.from).en + " — " + city(r.to).en,
    pathRu: r.pathRu,
    pathEn: r.pathEn,
  }));
}

function contentRu(meta: RouteMeta, f: City, t: City, p: Pair): RouteContent {
  return {
    badge: "Индивидуальный трансфер · " + f.ru + " — " + t.ru,
    title: meta.h1Ru,
    subtitle: meta.introRu,
    stats: [
      { label: "Тип поездки", value: "Частный автомобиль" },
      { label: "Подача", value: "От двери до двери" },
      { label: "Пограничные правила", value: "Уточняются перед выездом" },
      { label: "Стоимость", value: "По запросу" },
    ],
    photosTitle: "Направление " + f.ru + " — " + t.ru + ": городские ориентиры",
    photos: [image(t, "ru"), image(f, "ru")],
    howTitle: "Как проходит поездка " + f.ru + " — " + t.ru,
    steps: [
      { icon: MapPin, title: "Подача в " + f.ru, desc: "Согласуем адрес подачи: " + f.pickupRu + ". Время встречи и автомобиль подтвердим перед поездкой." },
      { icon: ShieldCheck, title: "Проверка границы и документов", desc: p.borderRu },
      { icon: Car, title: "Прибытие в " + t.ru, desc: "Довезём по согласованному адресу: " + t.pickupRu + ". Остановки и объём багажа обсудим заранее." },
    ],
    infoTitle: "Практическая информация о маршруте",
    infoRows: [
      { label: "Подача", value: f.pickupRu },
      { label: "Прибытие", value: t.pickupRu },
      { label: "Особенности направления", value: p.reasonRu },
      { label: "Для кого поездка", value: p.travellersRu },
      { label: "Местная история", value: t.historyRu },
      { label: "Путь и граница", value: p.routeRu + ". " + p.borderRu },
      { label: "Время", value: "Зависит от маршрута, дорожных условий и пограничного контроля; точное время не гарантируется" },
      { label: "Обратный путь", value: "Трансфер " + t.ru + " — " + f.ru + " оформляется отдельным заказом" },
    ],
    includedTitle: "Условия, которые можно согласовать",
    included: [
      "Частный автомобиль без посторонних пассажиров",
      "Подача и доставка по согласованным адресам",
      "Машина под количество пассажиров и багажа",
      "Детское кресло или бустер по запросу",
      "Остановки в пути по предварительному согласованию",
      "Стоимость и условия до выезда",
    ],
    whyTitle: "Что важно знать о поездке " + f.ru + " — " + t.ru,
    whyItems: [
      p.reasonRu,
      p.travellersRu,
      "Ориентиры города прибытия: " + t.pickupRu + ".",
      t.historyRu,
    ],
    faqTitle: "Частые вопросы: " + f.ru + " — " + t.ru,
    faq: [
      { q: "Сколько стоит трансфер " + f.ru + " — " + t.ru + "?", a: "Цена рассчитывается за автомобиль после уточнения даты, адресов, количества пассажиров и багажа. Неподтверждённую фиксированную стоимость не публикуем." },
      { q: "Сколько времени занимает поездка?", a: "Продолжительность зависит от выбранного пути, дорожной ситуации и пограничного контроля. Очереди и ограничения могут изменяться — точное время прибытия не гарантируется." },
      { q: "Где возможна подача в " + f.ru + "?", a: "Заберём по согласованному адресу: " + f.pickupRu + "." },
      { q: "Как проверить возможность пересечения границы?", a: p.borderRu + " Перед выездом обязательно перепроверьте официальную информацию." },
    ],
    ctaTitle: "Заказать трансфер " + f.ru + " — " + t.ru,
    ctaDesc: "Укажите дату, адреса, количество пассажиров и багаж. Менеджер проверит возможность поездки и рассчитает цену.",
    ctaBtn: "Отправить заявку",
    prefilledFrom: f.ru,
    prefilledTo: t.ru,
    backBtn: "← Все направления по Беларуси и Европе",
  };
}
function contentEn(meta: RouteMeta, f: City, t: City, p: Pair): RouteContent {
  return {
    badge: "Private transfer · " + f.en + " to " + t.en,
    title: meta.h1En,
    subtitle: meta.introEn,
    stats: [
      { label: "Service", value: "Private vehicle" },
      { label: "Pickup", value: "Door to door" },
      { label: "Border requirements", value: "Checked before departure" },
      { label: "Fare", value: "On request" },
    ],
    photosTitle: f.en + " to " + t.en + ": destination landmarks",
    photos: [image(t, "en"), image(f, "en")],
    howTitle: "How the " + f.en + " to " + t.en + " transfer works",
    steps: [
      { icon: MapPin, title: "Pickup in " + f.en, desc: "We agree an exact pickup point: " + f.pickupEn + ". Vehicle and meeting time are confirmed before departure." },
      { icon: ShieldCheck, title: "Current border rules", desc: p.borderEn },
      { icon: Car, title: "Arrival in " + t.en, desc: "Door-to-door arrival at " + t.pickupEn + ". Discuss luggage and rest stops in advance." },
    ],
    infoTitle: "Practical route information",
    infoRows: [
      { label: "Pickup", value: f.pickupEn },
      { label: "Drop-off", value: t.pickupEn },
      { label: "Why this route", value: p.reasonEn },
      { label: "Best suited for", value: p.travellersEn },
      { label: "Local heritage", value: t.historyEn },
      { label: "Border and route", value: p.routeEn + ". " + p.borderEn },
      { label: "Journey time", value: "Depends on route, road conditions and border procedures; no exact arrival time is guaranteed" },
      { label: "Return direction", value: t.en + " to " + f.en + " is available as a separately confirmed request" },
    ],
    includedTitle: "What you can arrange with your booking",
    included: [
      "Private vehicle without shared passengers",
      "Pickup and drop-off at agreed addresses",
      "Vehicle class appropriate to your group and bags",
      "Child seat or booster on advance request",
      "Rest stops discussed before confirmation",
      "Fare and conditions agreed before the trip",
    ],
    whyTitle: "Planning a " + f.en + " to " + t.en + " journey",
    whyItems: [
      p.reasonEn,
      p.travellersEn,
      "Arrival options: " + t.pickupEn + ".",
      t.historyEn,
    ],
    faqTitle: f.en + " to " + t.en + " transfer FAQs",
    faq: [
      { q: "How much does a " + f.en + " to " + t.en + " transfer cost?", a: "We quote per vehicle based on travel date, actual addresses, passenger count, luggage and route conditions. We do not advertise a fixed fare that has not been confirmed." },
      { q: "How long will the journey take?", a: "Travel time depends on the route, traffic, border controls and queues. Checkpoint access can change, so arrival times cannot be guaranteed." },
      { q: "Where is pickup available in " + f.en + "?", a: "We can arrange a pickup at " + f.pickupEn + "." },
      { q: "What should I check before crossing the border?", a: p.borderEn + " Always verify the latest rules with the relevant official authorities before departure." },
    ],
    ctaTitle: "Book " + f.en + " to " + t.en,
    ctaDesc: "Share your travel date, addresses, passenger details and luggage. A manager will check availability and send a personal quote.",
    ctaBtn: "Request a transfer",
    prefilledFrom: f.en,
    prefilledTo: t.en,
    backBtn: "← Belarus and European routes",
  };
}

export default function BelarusCityRoutePage() {
  const [path] = useLocation();
  const cleanPath = path.length > 1 ? path.replace(/\/+$/, "") : path;
  const meta = routePages.find((route) => route.pathRu === cleanPath || route.pathEn === cleanPath);
  if (!meta) return null;
  const f = city(meta.from);
  const t = city(meta.to);
  const p = pair(meta.pairKey);
  const data: RoutePageData = {
    disclaimerBanner: true,
    relatedRoutes: related(meta),
    ru: contentRu(meta, f, t, p),
    en: contentEn(meta, f, t, p),
    seo: {
      titleRu: meta.titleRu,
      titleEn: meta.titleEn,
      descRu: meta.descRu,
      descEn: meta.descEn,
      pathRu: meta.pathRu,
      pathEn: meta.pathEn,
      fromName: f.ru,
      toName: t.ru,
      breadcrumbRu: meta.h1Ru,
      breadcrumbEn: meta.h1En,
    },
  };
  return <RouteLandingPage data={data} />;
}
