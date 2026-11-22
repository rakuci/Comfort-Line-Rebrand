import { RouteFareTable } from "@/components/RouteFareTable";
import { useFareRate } from "@/hooks/use-fare-rate";
import { roundedByn, routeFares } from "@/data/route-fares";
import { useState } from "react";
import { motion } from "framer-motion";
import { Plane, Clock, MapPin, Car, ArrowRight, Info, CheckCircle2, PhoneCall, ShieldCheck, HelpCircle, ChevronDown, Wallet } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useLang } from "@/context/language-context";
import { GlobalBookingModal } from "@/components/sections/GlobalBookingModal";
import { Seo } from "@/seo/Seo";
import { taxiServiceJsonLd, faqJsonLd } from "@/seo/jsonld";
import { SITE_URL } from "@/seo/seo-config";
import { getHomeSectionHref } from "@/lib/lang-urls";

const fareRoute = "/minsk-vilnius-transfer";

const economyEur = routeFares[fareRoute]!.outbound[0];

const content = {
  ru: {
    badge: "Трансфер",
    title: "Трансфер Минск — Аэропорт Вильнюса (VNO)",
    subtitle: "Индивидуальный трансфер Минск — аэропорт Вильнюса (VNO) на ваш рейс. Подача от двери в Минске, фиксированная цена, опытный водитель и помощь на границе Беларусь–Литва.",
    seoIntro: "Из Минска в аэропорт Вильнюса (VNO) можно добраться тремя основными способами: рейсовым автобусом, маршруткой или индивидуальным трансфером. Самый быстрый и удобный — индивидуальный трансфер: подача от двери в Минске, доставка прямо к терминалу VNO, фиксированная цена за всю машину (1–3 пассажира) без счётчика. Маршрут ~175 км через пограничный переход Каменный Лог / Котловка занимает 2,5–5 часов в зависимости от очередей. Подаём комфорт-класс Volkswagen Passat или бизнес-седан Mercedes E-class.",
    comparisonTitle: "Способы добраться: автобус, маршрутка, трансфер",
    comparisonIntro: "Сравнение трёх основных способов уехать из Минска в аэропорт Вильнюса (VNO):",
    comparison: {
      headers: ["Транспорт", "Цена", "Время", "Кому подойдёт"],
      rows: [
        ["Рейсовый автобус ECOLINES", "От 180 BYN за пассажира", "5–7 ч + ожидание на границе", "Бюджетные путешественники без багажа"],
        ["Сборный трансфер ExpressBus", "От 200 BYN за пассажира", "4–6 ч", "1 пассажир с лёгким багажом"],
        ["Индивидуальный трансфер ComfortLine", `От €${economyEur} за автомобиль`, "2,5–5 ч от двери до терминала", "Семьи, командировки, ночные/утренние рейсы, большой багаж"],
      ],
    },
    stats: [
      { label: "Расстояние", value: "~175 км" },
      { label: "Время в пути", value: "2,5–5 ч" },
      { label: "Класс авто", value: "Комфорт / Бизнес" },
      { label: "Подача машины", value: "До двери" },
    ],
    howTitle: "Как проходит трансфер",
    steps: [
      { icon: MapPin, title: "Подача от двери", desc: "Водитель приедет к вашему адресу в Минске точно в назначенное время." },
      { icon: ShieldCheck, title: "Пересечение границы", desc: "Беларусь–Литва. Водитель поможет на КПП, знает актуальные маршруты и очереди." },
      { icon: Plane, title: "Прибытие в аэропорт", desc: "Доставим прямо к нужному терминалу с запасом до вылета." },
    ],
    airportTitle: "Аэропорт Вильнюса (VNO)",
    airportInfo: [
      { label: "Полное название", value: "Международный аэропорт Вильнюс" },
      { label: "IATA код", value: "VNO" },
      { label: "Адрес", value: "Rodūnios kelias 10A, Вильнюс, Литва" },
      { label: "Терминалы", value: "1 терминал (все рейсы)" },
      { label: "Основные авиакомпании", value: "Ryanair, Wizz Air, LOT, Turkish Airlines, flydubai" },
      { label: "Трансфер в центр", value: "Автобус №1 (40 мин), такси (25–35 мин)" },
    ],
    photosTitle: "Аэропорт в фото",
    photos: [
      { src: "/vilnius-airport-exterior.jpg", caption: "Терминал аэропорта Вильнюса (VNO)" },
      { src: "/vilnius-airport-interior.jpg", caption: "Зал вылета аэропорта Вильнюса" },
    ],
    tipsTitle: "Полезная информация",
    tips: [
      "Аэропорт открыт круглосуточно. Рейсы есть ранним утром и поздно ночью.",
      "Пограничный контроль Беларусь–Литва: в среднем 1–3 часа. В пиковые дни — до 5 часов.",
      "Рекомендуем выезжать с запасом 4–5 часов до вылета.",
      "Бесплатный Wi-Fi, кафе и зоны отдыха в единственном терминале.",
      "Стойка регистрации открывается за 2–3 часа до вылета.",
      "Вильнюс — альтернатива Варшаве: зачастую дешевле перелёт из VNO.",
    ],
    whyTitle: "Почему ComfortLine",
    whyItems: [
      "Фиксированная цена без счётчика и скрытых доплат",
      "Опытный водитель с навыком пограничного перехода",
      "Детские кресла по запросу",
      "Встреча с табличкой при обратном трансфере",
      "Помощь с багажом",
      "Работаем 24/7, включая праздники",
    ],
    faqTitle: "Частые вопросы — Минск → Аэропорт Вильнюса",
    faq: [
      { q: "Сколько стоит трансфер из Минска в аэропорт Вильнюса (VNO)?", a: "Начальные цены по классам автомобилей указаны в таблице выше. Стоимость зависит от класса авто (комфорт / бизнес / минивэн), необходимости детского кресла, поездки с домашним животным, конкретного адреса подачи в Минске и других пожеланий клиента. Менеджер озвучит фиксированную сумму без счётчика — без доплат на месте, с включёнными топливом, страховкой, помощью на границе, водой и багажом." },
      { q: "Сколько занимает дорога Минск — VNO?", a: "Сама поездка ~175 км занимает примерно 2 часа по трассе М7. К этому добавляется пограничный переход Каменный Лог / Котловка — обычно 1–3 часа, в пиковые дни до 4–5 часов. Итого планируйте 2,5–5 часов от двери до терминала VNO. Рекомендуем выезжать с запасом 4–5 часов до вылета." },
      { q: "Какой пограничный переход вы используете?", a: "По умолчанию Каменный Лог (Беларусь) — Мядининкай (Литва), он же «Котловка». Это основной автомобильный переход на этом маршруте. При больших очередях водитель может перенаправить на Бенякони — Шальчининкай. Решение принимается утром по актуальной обстановке." },
      { q: "Какие документы нужны для въезда в Литву?", a: "Действующий загранпаспорт и шенгенская виза (для граждан Беларуси/России и других стран, которым она требуется). Граждане ЕС/Литвы — паспорт или ID-карта. Дети — собственный загранпаспорт. Рекомендуем шенгенскую медицинскую страховку." },
      { q: "Что дешевле: автобус или индивидуальный трансфер?", a: "Если едете один с маленькой сумкой — рейсовый автобус (Ecolines, Lux Express) обычно дешевле в пересчёте на одного человека. Если едете вдвоём, втроём или семьёй с багажом — индивидуальный трансфер чаще выгоднее по цене на человека и быстрее на 1–3 часа за счёт прямой доставки от двери до терминала без пересадок и ночных пересадок на вокзале. Точную сумму на ваше количество пассажиров уточните у менеджера." },
      { q: "Подаёте ли вы машину ночью или рано утром на ранний рейс?", a: "Да, работаем 24/7 включая праздники. На рейсы 5:00–7:00 утра обычно выезжаем из Минска в 23:00–00:00. Ночная подача и работа в праздники без доплат." },
      { q: "Доступен ли обратный трансфер из аэропорта Вильнюса в Минск?", a: "Да. Водитель встретит вас в зале прилёта VNO с табличкой с вашим именем (бесплатно), поможет с багажом и доставит к указанному адресу в Минске. Бронируйте сразу обе поездки — скидка 5%." },
      { q: "Можно ли с детским креслом?", a: "Да, детские кресла и бустеры предоставляются бесплатно по запросу при бронировании. Укажите возраст ребёнка." },
    ],
    ctaTitle: "Забронировать трансфер",
    ctaDesc: "Оставьте заявку — менеджер свяжется с вами в ближайшее время и назовёт точную стоимость.",
    ctaBtn: "Оставить заявку",
    backBtn: "← Все услуги",
  },
  en: {
    badge: "Transfer",
    title: "Minsk to Vilnius Airport (VNO) Transfer",
    subtitle: "Private door-to-door transfer from Minsk to Vilnius International Airport (VNO). Fixed price, professional driver, full assistance at the Belarus–Lithuania border.",
    seoIntro: "There are three main ways to travel from Minsk to Vilnius Airport (VNO): scheduled coach, shared minibus, or private transfer. The fastest and most convenient is a private transfer: door pickup in Minsk, drop-off right at the VNO terminal, a fixed price for the whole car (1–3 passengers) — no meter. The ~175 km route via the Kamenny Log / Kotlovka border crossing takes 2.5–5 hours depending on queues. We use a comfort-class Volkswagen Passat or a business-class Mercedes E-class.",
    comparisonTitle: "How to get there: coach, minibus, private transfer",
    comparisonIntro: "Comparison of the three main ways to travel from Minsk to Vilnius Airport (VNO):",
    comparison: {
      headers: ["Transport", "Price", "Travel time", "Best for"],
      rows: [
        ["ECOLINES scheduled coach", "Starting from 180 BYN per passenger", "5–7 hrs + border wait", "Solo budget travellers with light luggage"],
        ["ExpressBus shared transfer", "Starting from 200 BYN per passenger", "4–6 hrs", "1 passenger with light luggage"],
        ["ComfortLine private transfer", `Starting at €${economyEur} per vehicle`, "2.5–5 hrs door to terminal", "Families, business trips, night/early flights, lots of luggage"],
      ],
    },
    stats: [
      { label: "Distance", value: "~175 km" },
      { label: "Travel time", value: "2.5–5 hrs" },
      { label: "Vehicle class", value: "Comfort / Business" },
      { label: "Pickup", value: "Door-to-door" },
    ],
    howTitle: "How the transfer works",
    steps: [
      { icon: MapPin, title: "Door pickup", desc: "Your driver arrives at your Minsk address exactly on time." },
      { icon: ShieldCheck, title: "Border crossing", desc: "Belarus–Lithuania. Your driver knows the border routines and monitors queue conditions." },
      { icon: Plane, title: "Airport arrival", desc: "Delivered directly to the right terminal well ahead of your flight." },
    ],
    airportTitle: "Vilnius Airport (VNO)",
    airportInfo: [
      { label: "Full name", value: "Vilnius International Airport" },
      { label: "IATA code", value: "VNO" },
      { label: "Address", value: "Rodūnios kelias 10A, Vilnius, Lithuania" },
      { label: "Terminals", value: "1 terminal (all flights)" },
      { label: "Main airlines", value: "Ryanair, Wizz Air, LOT, Turkish Airlines, flydubai" },
      { label: "City transfer", value: "Bus #1 (40 min), taxi (25–35 min)" },
    ],
    photosTitle: "Airport Gallery",
    photos: [
      { src: "/vilnius-airport-exterior.jpg", caption: "Vilnius Airport terminal (VNO)" },
      { src: "/vilnius-airport-interior.jpg", caption: "Vilnius Airport departures hall" },
    ],
    tipsTitle: "Useful Information",
    tips: [
      "The airport operates 24/7. Early morning and late-night flights are common.",
      "Belarus–Lithuania border crossing: 1–3 hours on average, up to 5 hours on busy days.",
      "We recommend departing 4–5 hours before your flight.",
      "Free Wi-Fi, cafes and rest zones are available in the single terminal.",
      "Check-in desks open 2–3 hours before departure.",
      "Vilnius is a popular alternative to Warsaw — often cheaper flights from VNO.",
    ],
    whyTitle: "Why ComfortLine",
    whyItems: [
      "Fixed price — no meter, no hidden extras",
      "Driver experienced in border crossings",
      "Child seats available on request",
      "Name-board meet & greet for return transfers",
      "Luggage assistance included",
      "Available 24/7 including holidays",
    ],
    faqTitle: "Frequently asked — Minsk to Vilnius Airport",
    faq: [
      { q: "How much does a Minsk to Vilnius Airport (VNO) transfer cost?", a: "See the starting fares by vehicle class above. The exact figure depends on the vehicle class (comfort / business / minivan), whether you need a child seat, whether you travel with a pet, your pickup address in Minsk, and any other special requests. Our manager confirms a fixed price (no meter) with fuel, insurance, border assistance, bottled water and luggage already included — no extras at pickup or drop-off." },
      { q: "How long is the Minsk to VNO trip?", a: "The drive itself, ~175 km on the M7 highway, is around 2 hours. Add 1–3 hours (up to 4–5 on peak days) for the Kamenny Log / Kotlovka border crossing. Plan for 2.5–5 hours door to terminal. We recommend leaving Minsk 4–5 hours before your flight." },
      { q: "Which border crossing do you use?", a: "By default Kamenny Log (Belarus) — Medininkai (Lithuania), also known as 'Kotlovka' — the main passenger crossing on this route. If queues are heavy the driver may switch to Benyakoni — Šalčininkai. The decision is made in the morning based on live conditions." },
      { q: "What documents do I need to enter Lithuania?", a: "A valid passport and a Schengen visa (for Belarusian, Russian and other nationals who need one). EU/Lithuanian citizens — passport or national ID. Children require their own passport. Schengen-area medical insurance is recommended." },
      { q: "Is the coach cheaper than a private transfer?", a: "If you're travelling solo with a small bag — yes, the scheduled coach (Ecolines, Lux Express) is usually cheaper per person. If you're travelling as a couple, family or group with luggage, a private transfer is often cheaper per person and 1–3 hours faster thanks to direct door-to-terminal service with no transfers and no nighttime waits at the bus station. Ask our manager for the exact quote based on your party size." },
      { q: "Do you operate at night or for early-morning flights?", a: "Yes, we run 24/7 including holidays. For 5:00–7:00 AM flights we typically depart Minsk at 23:00–00:00. No surcharge for nights or holidays." },
      { q: "Is the return transfer Vilnius Airport to Minsk available?", a: "Yes. The driver meets you in the VNO arrivals hall with a name sign (free of charge), helps with luggage, and drops you at your Minsk address. Book both directions in one request — 5% discount." },
      { q: "Can I request a child seat?", a: "Yes — child seats and boosters are provided free of charge on request at booking. Please tell us the child's age." },
    ],
    ctaTitle: "Book your transfer",
    ctaDesc: "Submit a request and our manager will contact you shortly with an exact price.",
    ctaBtn: "Request a booking",
    backBtn: "← All services",
  },
};

export default function MinskVilniusAirportPage() {
  const { lang } = useLang();
  const rate = useFareRate();
  const c = content[lang];
  const isRu = lang === "ru";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Seo
        titleRu="Трансфер Минск — Аэропорт Вильнюса (VNO) | ComfortLine"
        titleEn="Minsk to Vilnius Airport (VNO) Private Transfer"
        descRu="Индивидуальный трансфер из Минска в международный аэропорт Вильнюса (VNO)."
        descEn="Private transfer from Minsk to Vilnius Airport (VNO). Fixed price, English-speaking driver, border assistance and 2.5–5 hour journey."
        pathRu="/трансфер-минск-вильнюс-аэропорт"
        pathEn="/minsk-vilnius-airport"
        keywordsRu="трансфер минск вильнюс, трансфер минск аэропорт вильнюса, такси минск вильнюс аэропорт, vno трансфер, минск vilnius трансфер, заказ авто в аэропорт вильнюса"
        keywordsEn="minsk vilnius airport transfer, minsk to vno taxi, private transfer minsk vilnius, vilnius international airport ride, belarus lithuania border transfer"
        breadcrumbsRu={[
          { name: "Главная", path: "/" },
          { name: "Трансфер Минск — Аэропорт Вильнюса (VNO)", path: "/трансфер-минск-вильнюс-аэропорт" },
        ]}
        breadcrumbsEn={[
          { name: "Home", path: "/" },
          { name: "Minsk — Vilnius Airport (VNO)", path: "/minsk-vilnius-airport" },
        ]}
        jsonLd={[
          taxiServiceJsonLd({
            lang,
            name: isRu ? "Трансфер Минск — Аэропорт Вильнюса (VNO)" : "Minsk to Vilnius Airport (VNO) Transfer",
            description: isRu
              ? "Индивидуальный трансфер из Минска в международный аэропорт Вильнюса (VNO). Фиксированная цена, подача от двери, опытный водитель."
              : "Private door-to-door transfer from Minsk to Vilnius International Airport (VNO). Fixed price, professional driver.",
            url: SITE_URL + (isRu ? "/трансфер-минск-вильнюс-аэропорт" : "/minsk-vilnius-airport"),
            priceFrom: roundedByn(routeFares[fareRoute]!.outbound[0], rate.bynPerEur),
          priceCurrency: "BYN",
          fromName: isRu ? "Минск" : "Minsk",
            toName: isRu ? "Аэропорт Вильнюса (VNO)" : "Vilnius International Airport (VNO)",

          }),
          faqJsonLd(c.faq.map((f) => ({ question: f.q, answer: f.a }))),
        ]}
      />
      <Navbar />

      {/* Hero */}
      <div className="pt-28 pb-14 border-b border-border/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 md:px-6 max-w-4xl relative">
          <a href={getHomeSectionHref(lang, "services")} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors mb-6">
            {c.backBtn}
          </a>
          <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-primary mb-4">
            {c.badge}
          </p>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
            {c.title}
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mb-6">
            {c.subtitle}
          </p>
          <p className="text-muted-foreground/90 text-sm md:text-[15px] leading-relaxed max-w-3xl mb-10">
            {c.seoIntro}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {c.stats.map((s) => (
              <div key={s.label} className="bg-card border border-border rounded-xl p-4">
                <p className="text-primary font-bold text-lg">{s.value}</p>
                <p className="text-muted-foreground text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
          <RouteFareTable rate={rate} lang={lang} cityRoute={fareRoute} from={isRu ? "Минск" : "Minsk"} to="VNO" />
          <div className="mt-8">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("open-booking-modal", {
                detail: {
                  prefilledFrom: isRu ? "Минск" : "Minsk",
                  prefilledTo: isRu ? "Аэропорт Вильнюса (VNO)" : "Vilnius Airport (VNO)",
                }
              }))}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-primary/20 cursor-pointer"
            >
              {isRu ? "Забронировать трансфер" : "Book transfer"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 max-w-4xl py-14 space-y-16">

        {/* Price/transport comparison — AI-overview style */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-2xl font-bold text-foreground mb-3 flex items-center gap-3">
            <Wallet className="h-5 w-5 text-primary" />
            {c.comparisonTitle}
          </h2>
          <p className="text-muted-foreground text-sm mb-6 max-w-2xl">{c.comparisonIntro}</p>
          <div className="overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-primary/5">
                  {c.comparison.headers.map((h) => (
                    <th key={h} scope="col" className="px-4 py-3 text-left font-semibold text-foreground whitespace-nowrap text-xs uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {c.comparison.rows.map((row, i) => (
                  <tr key={i} className={`${i < c.comparison.rows.length - 1 ? "border-b border-border/50" : ""} ${i === c.comparison.rows.length - 1 ? "bg-primary/[0.04]" : ""}`}>
                    {row.map((cell, j) => (
                      <td key={j} className={`px-4 py-3 align-top ${j === 0 ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                        {cell}{i === 2 && j === 1 && (
                          <span className="block mt-1 font-medium tabular-nums">{isRu ? "От" : "Starting from"} <span className="whitespace-nowrap">{roundedByn(economyEur, rate.bynPerEur).toLocaleString(isRu ? "ru-BY" : "en-GB")} BYN</span></span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            {isRu ? "Стоимость билета на выбранную дату уточняйте у перевозчика: " : "Check ticket prices for your travel date with "}
            <a className="underline" href="https://ecolines.by/by/ru/predlozhenie/mezhdunarodnie/avtobus-minsk-aeroport-vilnyus">ECOLINES</a>
            {isRu ? " или " : " or "}
            <a className="underline" href="https://expressbus.by/transfer-vilnus.html">ExpressBus</a>.
            {isRu ? " Оплата трансфера ComfortLine только в BYN. По вашей заявке водитель подтвердит итоговую стоимость до выезда." : " ComfortLine accepts payment only in BYN. When you request a quote, the driver confirms the final fare before departure."}
          </p>
        </motion.section>

        {/* How it works */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-2xl font-bold text-foreground mb-8">{c.howTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {c.steps.map((step, i) => {
              const StepIcon = step.icon;
              return (
                <div key={i} className="bg-card border border-border rounded-2xl p-6 relative">
                  <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                    {i + 1}
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5">
                    <StepIcon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
                  {i < c.steps.length - 1 && (
                    <ArrowRight className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/40 z-10" />
                  )}
                </div>
              );
            })}
          </div>
        </motion.section>

        {/* Airport Info */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
            <Info className="h-5 w-5 text-primary" />
            {c.airportTitle}
          </h2>
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            {c.airportInfo.map((row, i) => (
              <div key={i} className={`flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 px-6 py-4 ${i < c.airportInfo.length - 1 ? "border-b border-border/50" : ""}`}>
                <span className="text-muted-foreground text-sm min-w-[180px] shrink-0">{row.label}</span>
                <span className="text-foreground text-sm font-medium">{row.value}</span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Airport Photos */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
            <MapPin className="h-5 w-5 text-primary" />
            {c.photosTitle}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {c.photos.map((photo, i) => (
              <div key={i} className="relative rounded-2xl overflow-hidden aspect-video bg-card border border-border">
                <img src={photo.src} alt={photo.caption} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3">
                  <p className="text-white text-sm font-medium">{photo.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Tips */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
            <Clock className="h-5 w-5 text-primary" />
            {c.tipsTitle}
          </h2>
          <ul className="space-y-3">
            {c.tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </motion.section>

        {/* Related routes — internal SEO links */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
            <Plane className="h-5 w-5 text-primary" />
            {isRu ? "Похожие направления" : "Related transfers"}
          </h2>
          <p className="text-muted-foreground text-sm mb-6 max-w-2xl">
            {isRu
              ? "Если из Вильнюса нет нужного рейса — рассмотрите альтернативные аэропорты с прямым трансфером из Минска:"
              : "If Vilnius doesn't have your flight, consider these alternative airports with direct transfer from Minsk:"}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href={isRu ? "/трансфер-минск-варшава-шопен" : "/minsk-warsaw-airport"}
              className="block bg-card border border-border rounded-2xl p-5 hover:border-primary/50 hover:bg-primary/5 transition-colors group"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <p className="font-bold text-foreground group-hover:text-primary transition-colors">
                  {isRu ? "Трансфер Минск — Аэропорт Варшавы Шопен (WAW)" : "Minsk — Warsaw Chopin Airport (WAW)"}
                </p>
                <ArrowRight className="h-4 w-4 text-primary shrink-0 mt-1 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-muted-foreground text-xs leading-relaxed">
                {isRu
                  ? "~550 км, 6–10 ч. Главный международный аэропорт Польши. LOT, Lufthansa, Turkish Airlines."
                  : "~550 km, 6–10 hrs. Poland's main international airport. LOT, Lufthansa, Turkish Airlines."}
              </p>
            </a>
            <a
              href={isRu ? "/трансфер-минск-варшава-модлин" : "/minsk-warsaw-modlin-airport"}
              className="block bg-card border border-border rounded-2xl p-5 hover:border-primary/50 hover:bg-primary/5 transition-colors group"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <p className="font-bold text-foreground group-hover:text-primary transition-colors">
                  {isRu ? "Трансфер Минск — Аэропорт Варшавы Модлин (WMI)" : "Minsk — Warsaw Modlin Airport (WMI)"}
                </p>
                <ArrowRight className="h-4 w-4 text-primary shrink-0 mt-1 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-muted-foreground text-xs leading-relaxed">
                {isRu
                  ? "~600 км, 7–10 ч. Бюджетный хаб Ryanair и Wizz Air, в 35 км от центра Варшавы."
                  : "~600 km, 7–10 hrs. Ryanair and Wizz Air budget hub, 35 km from central Warsaw."}
              </p>
            </a>
          </div>
        </motion.section>

        {/* Why ComfortLine */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
            <Car className="h-5 w-5 text-primary" />
            {c.whyTitle}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {c.whyItems.map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-card border border-border rounded-xl px-5 py-4">
                <span className="text-primary mt-0.5 shrink-0">▸</span>
                <span className="text-sm text-foreground">{item}</span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* FAQ */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
            <HelpCircle className="h-5 w-5 text-primary" />
            {c.faqTitle}
          </h2>
          <div className="space-y-3">
            {c.faq.map((entry, i) => (
              <VilniusFaqItem key={i} q={entry.q} a={entry.a} />
            ))}
          </div>
        </motion.section>


        {/* CTA */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-8 md:p-10 text-center">
            <PhoneCall className="h-8 w-8 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-3">{c.ctaTitle}</h2>
            <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">{c.ctaDesc}</p>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("open-booking-modal", {
                detail: {
                  prefilledFrom: lang === "ru" ? "Минск" : "Minsk",
                  prefilledTo: lang === "ru" ? "Аэропорт Вильнюса (VNO)" : "Vilnius Airport (VNO)",
                }
              }))}
              className="inline-block px-10 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-primary/20 cursor-pointer"
            >
              {c.ctaBtn}
            </button>
          </div>
        </motion.section>

      </div>

      <GlobalBookingModal />
      <Footer />
    </div>
  );
}

let vilniusFaqUid = 0;
function VilniusFaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  const [id] = useState(() => `vno-faq-${++vilniusFaqUid}`);
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-primary/5 transition-colors"
        aria-expanded={open}
        aria-controls={id}
      >
        <span className="text-sm font-semibold text-foreground">{q}</span>
        <ChevronDown className={`h-4 w-4 text-primary shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div id={id} role="region" className="px-5 pb-4 -mt-1 text-sm text-muted-foreground leading-relaxed">{a}</div>
      )}
    </div>
  );
}
