import { RouteFareTable } from "@/components/RouteFareTable";
import { useFareRate } from "@/hooks/use-fare-rate";
import { roundedByn, routeFares } from "@/data/route-fares";
import { motion } from "framer-motion";
import { Plane, Clock, MapPin, Car, ArrowRight, Info, CheckCircle2, PhoneCall, ShieldCheck, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { BorderOfficialSources } from "@/components/layout/DisclaimerBanner";
import { Footer } from "@/components/layout/Footer";
import { useLang } from "@/context/language-context";
import { GlobalBookingModal } from "@/components/sections/GlobalBookingModal";
import { Seo } from "@/seo/Seo";
import { taxiServiceJsonLd, faqJsonLd } from "@/seo/jsonld";
import { SITE_URL } from "@/seo/seo-config";
import { getHomeSectionHref } from "@/lib/lang-urls";

const fareRoute = "/warsaw-transfer";

const content = {
  ru: {
    badge: "Индивидуальный трансфер-такси",
    title: "Индивидуальный трансфер Минск — Аэропорт Варшавы Шопен",
    subtitle: "Комфортное такси из Минска до аэропорта WAW по фиксированной цене. Опытный водитель, помощь на границе Беларусь–Польша, подача от двери.",
    stats: [
      { label: "Расстояние", value: "~550 км" },
      { label: "Время в пути", value: "6–10 ч" },
      { label: "Класс авто", value: "Комфорт / Бизнес" },
      { label: "Подача машины", value: "До двери" },
    ],
    howTitle: "Как работает индивидуальный трансфер Минск–Варшава",
    steps: [
      { icon: MapPin, title: "Подача от двери", desc: "Водитель приедет к вашему адресу в Минске точно в назначенное время." },
      { icon: ShieldCheck, title: "Граница Беларусь–Польша", desc: "Водитель знает все КПП, отслеживает очереди и выбирает оптимальный пропускной пункт." },
      { icon: Plane, title: "Прибытие в аэропорт", desc: "Доставим прямо к нужному терминалу — Т1 (Chopin) или иному — с запасом до вылета." },
    ],
    airportTitle: "Аэропорт Варшавы Шопен (WAW)",
    airportInfo: [
      { label: "Полное название", value: "Аэропорт Варшавы им. Фредерика Шопена" },
      { label: "IATA код", value: "WAW" },
      { label: "Адрес", value: "Żwirki i Wigury 1, 00-906 Варшава, Польша" },
      { label: "Терминалы", value: "Терминал А (международные) и Терминал B (Schengen)" },
      { label: "Основные авиакомпании", value: "LOT, Ryanair, Wizz Air, Lufthansa, British Airways, Emirates" },
      { label: "До центра Варшавы", value: "Поезд SKM (20 мин), метро S2 (30 мин), такси (25–40 мин)" },
    ],
    altTitle: "Также обслуживаем",
    photosTitle: "Аэропорт в фото",
    photos: [
      { src: "/img/warsaw/chopin-terminal.png", caption: "Терминал аэропорта Шопен (WAW)" },
      { src: "/img/warsaw/chopin-international.png", caption: "Международный терминал" },
    ],
    tipsTitle: "Важно знать перед поездкой",
    tips: [
      "Граница Беларусь–Польша: среднее время 3–8 часов. В пиковые дни — до 12 часов.",
      "Рекомендуем выезжать с запасом 8–10 часов до вылета.",
      "Уточняйте: рейс из Варшавы-Шопен (WAW) или Варшавы-Модлин (WMI) — это разные аэропорты.",
      "Терминал A — для рейсов за пределы Шенгена. Терминал B — рейсы внутри Шенгена.",
      "Бесплатная парковка первые 15 минут (для высадки).",
      "В Терминале A работает ресторан открытый 24/7.",
    ],
    whyTitle: "Почему ComfortLine — индивидуальный трансфер, а не автобус",
    whyItems: [
      "Фиксированная цена без счётчика и скрытых доплат",
      "Опытный водитель, знающий все погранпереходы",
      "Детские кресла по запросу",
      "Встреча с табличкой при обратном трансфере",
      "Помощь с багажом",
      "Работаем 24/7, включая праздники",
    ],
    faqTitle: "Частые вопросы о трансфере Минск–Варшава",
    faqs: [
      {
        question: "Сколько стоит индивидуальный трансфер-такси из Минска до аэропорта Варшавы Шопен?",
        answer: "Стоимость рассчитывается индивидуально и зависит от класса автомобиля, количества пассажиров и даты поездки. Итоговая цена фиксируется при бронировании — никакого счётчика и скрытых доплат. Оставьте заявку или позвоните нам, и менеджер назовёт точную стоимость.",
      },
      {
        question: "Сколько времени занимает такси из Минска до аэропорта Варшавы?",
        answer: "В среднем 6–10 часов. Большую часть этого времени занимает ожидание на границе Беларусь–Польша (3–8 часов, в пиковые дни — до 12 часов). Расстояние Минск–Варшава составляет около 550 км. Рекомендуем выезжать за 8–10 часов до вылета.",
      },
      {
        question: "Как заказать индивидуальный трансфер-такси Минск–Варшава?",
        answer: "Оставьте заявку на сайте, напишите в WhatsApp или позвоните по номеру +375 (44) 762-06-49. Менеджер уточнит адрес подачи, дату и время вылета, класс авто, а затем подтвердит бронирование. Предоплата не требуется.",
      },
      {
        question: "Включена ли помощь на границе Беларусь–Польша в стоимость трансфера?",
        answer: "Да. Водитель отслеживает ситуацию на всех погранпереходах в режиме реального времени и выбирает оптимальный КПП. Мы на связи 24/7 на протяжении всей поездки.",
      },
      {
        question: "Чем отличается аэропорт Шопен (WAW) от аэропорта Модлин (WMI)?",
        answer: "Это два разных аэропорта. Аэропорт Шопен (WAW) расположен в 10 км от центра Варшавы и обслуживает большинство авиакомпаний: LOT, Lufthansa, Emirates, British Airways, Ryanair. Аэропорт Модлин (WMI) — в 35 км к северу от Варшавы, используется преимущественно Ryanair и Wizz Air. Обязательно уточните, откуда вылетает ваш рейс.",
      },
      {
        question: "Можно ли взять детское кресло или перевезти крупный багаж?",
        answer: "Да, детские кресла доступны по запросу — уточните при бронировании. Для крупного багажа (лыжи, самокаты, коляски) рекомендуем минивэн Kia Carnival или Mercedes V-Class: 7–8 мест и большой багажник.",
      },
    ],
    ctaTitle: "Забронировать трансфер",
    ctaDesc: "Оставьте заявку — менеджер свяжется с вами в ближайшее время и назовёт точную стоимость.",
    ctaBtn: "Оставить заявку",
    backBtn: "← Все услуги",
  },
  en: {
    badge: "Private Transfer",
    title: "Private Transfer Minsk — Warsaw Chopin Airport (WAW)",
    subtitle: "Door-to-door taxi from Minsk to Warsaw Chopin Airport. Fixed price, professional driver, real-time border assistance.",
    stats: [
      { label: "Distance", value: "~550 km" },
      { label: "Travel time", value: "6–10 hrs" },
      { label: "Vehicle class", value: "Comfort / Business" },
      { label: "Pickup", value: "Door-to-door" },
    ],
    howTitle: "How your private transfer from Minsk to Warsaw works",
    steps: [
      { icon: MapPin, title: "Door pickup", desc: "Your driver arrives at your Minsk address exactly on time." },
      { icon: ShieldCheck, title: "Belarus–Poland border", desc: "Your driver monitors all border checkpoints in real time and selects the fastest crossing." },
      { icon: Plane, title: "Airport arrival", desc: "Delivered directly to the correct terminal at Chopin Airport with time to spare." },
    ],
    airportTitle: "Warsaw Chopin Airport (WAW)",
    airportInfo: [
      { label: "Full name", value: "Warsaw Frederic Chopin Airport" },
      { label: "IATA code", value: "WAW" },
      { label: "Address", value: "Żwirki i Wigury 1, 00-906 Warsaw, Poland" },
      { label: "Terminals", value: "Terminal A (international) and Terminal B (Schengen)" },
      { label: "Main airlines", value: "LOT, Ryanair, Wizz Air, Lufthansa, British Airways, Emirates" },
      { label: "City transfer", value: "SKM train (20 min), S2 metro (30 min), taxi (25–40 min)" },
    ],
    altTitle: "We also serve",
    photosTitle: "Airport Gallery",
    photos: [
      { src: "/img/warsaw/chopin-terminal.png", caption: "Warsaw Chopin Airport terminal (WAW)" },
      { src: "/img/warsaw/chopin-international.png", caption: "International terminal" },
    ],
    tipsTitle: "What to know before your trip",
    tips: [
      "Belarus–Poland border crossing: average 3–8 hours. Can be up to 12 hours on peak days.",
      "We recommend departing 8–10 hours before your flight.",
      "Check carefully: is your flight from Warsaw Chopin (WAW) or Warsaw Modlin (WMI)? They are different airports.",
      "Terminal A handles non-Schengen routes. Terminal B handles Schengen flights.",
      "Free parking for the first 15 minutes (drop-off zone).",
      "A 24/7 restaurant is available in Terminal A.",
    ],
    whyTitle: "Why choose a private transfer instead of a coach",
    whyItems: [
      "Fixed price — no meter, no hidden extras",
      "Driver experienced in all Belarus–Poland border crossings",
      "Child seats available on request",
      "Name-board meet & greet for return transfers",
      "Luggage assistance included",
      "Available 24/7 including holidays",
    ],
    faqTitle: "Frequently asked questions about the Minsk–Warsaw transfer",
    faqs: [
      {
        question: "How much does a private transfer from Minsk to Warsaw Chopin Airport cost?",
        answer: "The price depends on the vehicle class, number of passengers, and travel date. You receive a fixed quote at booking — no meter, no hidden charges. Submit a request or call +375 (44) 762-06-49 for an exact price.",
      },
      {
        question: "How long does the taxi ride from Minsk to Warsaw Chopin Airport take?",
        answer: "On average 6–10 hours. Most of this time is spent at the Belarus–Poland border crossing (3–8 hours on normal days, up to 12 hours during peak periods). The Minsk–Warsaw distance is approximately 550 km. We recommend departing at least 8–10 hours before your flight.",
      },
      {
        question: "How do I book a private transfer from Minsk to Warsaw?",
        answer: "Submit a request on the website, message us on WhatsApp, or call +375 (44) 762-06-49. Our manager will confirm the pickup address, flight date/time, and vehicle class, then send a booking confirmation. No prepayment required.",
      },
      {
        question: "Is border assistance at Belarus–Poland included in the transfer price?",
        answer: "Yes. Your driver monitors all border crossing queues in real time and selects the fastest checkpoint. Our team is available 24/7 throughout the journey.",
      },
      {
        question: "What is the difference between Warsaw Chopin Airport (WAW) and Warsaw Modlin Airport (WMI)?",
        answer: "They are two separate airports. Chopin Airport (WAW) is 10 km from central Warsaw and handles most airlines: LOT, Lufthansa, Emirates, British Airways, and Ryanair. Modlin Airport (WMI) is 35 km north of Warsaw and is used primarily by Ryanair and Wizz Air. Please verify your departure airport before booking.",
      },
      {
        question: "Can I request a child seat or transport oversized luggage?",
        answer: "Yes, child seats are available on request — just mention it when booking. For large items such as skis, bicycles, or strollers, we recommend the Kia Carnival or Mercedes V-Class minivan, which accommodates 7–8 passengers and has a generous luggage compartment.",
      },
    ],
    ctaTitle: "Book your transfer",
    ctaDesc: "Submit a request and our manager will contact you shortly with an exact price.",
    ctaBtn: "Request a booking",
    backBtn: "← All services",
  },
};

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-start justify-between gap-4 px-5 py-4 text-left bg-card hover:bg-primary/5 transition-colors"
        aria-expanded={open}
      >
        <span className="font-semibold text-foreground text-sm leading-snug">{question}</span>
        <ChevronDown
          className={`h-4 w-4 text-primary shrink-0 mt-0.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-5 pb-5 pt-2 bg-card border-t border-border/40">
          <p className="text-muted-foreground text-sm leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

function WarsawAirportSeo({ rate }: { rate: ReturnType<typeof useFareRate> }) {
  const { lang } = useLang();
  const isRu = lang === "ru";

  const faqsRu = content.ru.faqs;
  const faqsEn = content.en.faqs;

  return (
    <Seo
      titleRu="Индивидуальный трансфер-такси Минск — Аэропорт Варшавы Шопен"
      titleEn="Private Transfer Minsk to Warsaw Chopin Airport (WAW)"
      descRu="Индивидуальный трансфер-такси из Минска в аэропорт Варшавы Шопен (WAW). Фиксированная цена, опытный водитель, помощь на границе Беларусь–Польша. ~550 км."
      descEn="Private taxi transfer from Minsk to Warsaw Chopin Airport (WAW). Fixed price, professional driver, Belarus–Poland border assistance included. ~550 km, 6–10 hrs."
      pathRu="/трансфер-минск-варшава-шопен"
      pathEn="/minsk-warsaw-airport"
      keywordsRu="минск варшава индивидуальный трансфер такси, трансфер минск варшава, трансфер минск варшава аэропорт, такси минск варшава шопен, waw трансфер, индивидуальный трансфер минск варшава шопен, такси минск варшава цена"
      keywordsEn="minsk warsaw private transfer taxi, minsk warsaw airport transfer, minsk to waw taxi, warsaw chopin airport private transfer, minsk warsaw transfer price, belarus poland border transfer"
      breadcrumbsRu={[
        { name: "Главная", path: "/" },
        { name: "Трансфер Минск — Аэропорт Варшавы Шопен (WAW)", path: "/трансфер-минск-варшава-шопен" },
      ]}
      breadcrumbsEn={[
        { name: "Home", path: "/" },
        { name: "Minsk — Warsaw Chopin Airport (WAW)", path: "/minsk-warsaw-airport" },
      ]}
      jsonLd={[
        taxiServiceJsonLd({
          lang,
          name: isRu
            ? "Индивидуальный трансфер-такси Минск — Аэропорт Варшавы Шопен (WAW)"
            : "Private Transfer Minsk to Warsaw Chopin Airport (WAW)",
          description: isRu
            ? "Индивидуальный трансфер-такси из Минска в аэропорт Варшавы Шопен (WAW). Фиксированная цена, опытный водитель, помощь на границе Беларусь–Польша."
            : "Private taxi transfer from Minsk to Warsaw Chopin Airport (WAW). Fixed price, professional driver, border assistance included.",
          url: SITE_URL + (isRu ? "/трансфер-минск-варшава-шопен" : "/minsk-warsaw-airport"),
          priceFrom: roundedByn(routeFares[fareRoute]!.outbound[0], rate.bynPerEur),
          priceCurrency: "BYN",
          fromName: isRu ? "Минск" : "Minsk",
          toName: isRu ? "Аэропорт Варшавы Шопен (WAW)" : "Warsaw Chopin Airport (WAW)",
          distanceKm: "550",
          durationIso: "PT8H",
        }),
        faqJsonLd(isRu ? faqsRu : faqsEn),
      ]}
    />
  );
}

export default function MinskWarsawAirportPage() {
  const { lang } = useLang();
  const rate = useFareRate();
  const c = content[lang];
  const isRu = lang === "ru";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <WarsawAirportSeo rate={rate} />
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
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mb-10">
            {c.subtitle}
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
          <RouteFareTable rate={rate} lang={lang} cityRoute={fareRoute} from={isRu ? "Минск" : "Minsk"} to="WAW" />
          <div className="mt-8">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("open-booking-modal", {
                detail: {
                  prefilledFrom: lang === "ru" ? "Минск" : "Minsk",
                  prefilledTo: lang === "ru" ? "Аэропорт Варшавы-Шопен (WAW)" : "Warsaw Chopin Airport (WAW)",
                }
              }))}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-primary/20 cursor-pointer"
            >
              {lang === "ru" ? "Забронировать трансфер" : "Book transfer"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 max-w-4xl py-14 space-y-16">

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
          <div className="bg-card border border-border rounded-2xl overflow-hidden mb-6">
            {c.airportInfo.map((row, i) => (
              <div key={i} className={`flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 px-6 py-4 ${i < c.airportInfo.length - 1 ? "border-b border-border/50" : ""}`}>
                <span className="text-muted-foreground text-sm min-w-[180px] shrink-0">{row.label}</span>
                <span className="text-foreground text-sm font-medium">{row.value}</span>
              </div>
            ))}
          </div>

          {/* Also serves */}
          <a
            href={lang === "ru" ? "/трансфер-минск-варшава-модлин" : "/minsk-warsaw-modlin-airport"}
            className="flex items-center justify-between gap-4 bg-card border border-border/60 rounded-2xl px-5 py-4 hover:border-primary/50 hover:bg-primary/5 transition-colors group"
          >
            <div>
              <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">{c.altTitle}</p>
              <p className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">
                {lang === "ru" ? "Аэропорт Варшава-Модлин (WMI)" : "Warsaw Modlin Airport (WMI)"}
              </p>
              <p className="text-muted-foreground text-xs mt-0.5">
                {lang === "ru"
                  ? "Ryanair, Wizz Air. В 35 км от центра Варшавы."
                  : "Ryanair, Wizz Air. 35 km north of Warsaw city centre."}
              </p>
            </div>
            <ArrowRight className="h-4 w-4 text-primary shrink-0 group-hover:translate-x-1 transition-transform" />
          </a>
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
          <h2 className="text-2xl font-bold text-foreground mb-6">{c.faqTitle}</h2>
          <div className="space-y-3">
            {c.faqs.map((faq, i) => (
              <FaqItem key={i} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </motion.section>

        {/* Related routes — internal SEO links */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
            <Plane className="h-5 w-5 text-primary" />
            {lang === "ru" ? "Похожие направления" : "Related transfers"}
          </h2>
          <p className="text-muted-foreground text-sm mb-6 max-w-2xl">
            {lang === "ru"
              ? "Альтернативные аэропорты с прямым трансфером из Минска — иногда выгоднее по цене билета и расписанию:"
              : "Alternative airports with direct transfer from Minsk — sometimes a better deal on ticket price or schedule:"}
          </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <a
              href={lang === "ru" ? "/трансфер-минск-вильнюс-аэропорт" : "/minsk-vilnius-airport"}
              className="block bg-card border border-border rounded-2xl p-5 hover:border-primary/50 hover:bg-primary/5 transition-colors group"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <p className="font-bold text-foreground group-hover:text-primary transition-colors">
                  {lang === "ru" ? "Трансфер Минск — Аэропорт Вильнюса (VNO)" : "Minsk — Vilnius Airport (VNO)"}
                </p>
                <ArrowRight className="h-4 w-4 text-primary shrink-0 mt-1 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-muted-foreground text-xs leading-relaxed">
                {lang === "ru"
                  ? "~175 км, 2,5–5 ч. Ближайший аэропорт ЕС. Ryanair, Wizz Air, LOT, Turkish Airlines."
                  : "~175 km, 2.5–5 hrs. The nearest EU airport. Ryanair, Wizz Air, LOT, Turkish Airlines."}
              </p>
            </a>
            <a
              href={lang === "ru" ? "/трансфер-минск-варшава-модлин" : "/minsk-warsaw-modlin-airport"}
              className="block bg-card border border-border rounded-2xl p-5 hover:border-primary/50 hover:bg-primary/5 transition-colors group"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <p className="font-bold text-foreground group-hover:text-primary transition-colors">
                  {lang === "ru" ? "Трансфер Минск — Аэропорт Варшавы Модлин (WMI)" : "Minsk — Warsaw Modlin Airport (WMI)"}
                </p>
                <ArrowRight className="h-4 w-4 text-primary shrink-0 mt-1 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-muted-foreground text-xs leading-relaxed">
                {lang === "ru"
                  ? "~600 км, 7–10 ч. Бюджетный хаб Ryanair и Wizz Air, в 35 км от центра Варшавы."
                  : "~600 km, 7–10 hrs. Ryanair and Wizz Air budget hub, 35 km from central Warsaw."}
              </p>
            </a>
            <a
              href={lang === "ru" ? "/трансфер-варшава" : "/warsaw-transfer"}
              className="block bg-card border border-border rounded-2xl p-5 hover:border-primary/50 hover:bg-primary/5 transition-colors group"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <p className="font-bold text-foreground group-hover:text-primary transition-colors">
                  {lang === "ru"
                    ? "Такси Минск — Варшава, центр города"
                    : "Minsk — Warsaw city transfer"}
                </p>

                <ArrowRight className="h-4 w-4 text-primary shrink-0 mt-1 group-hover:translate-x-1 transition-transform" />
              </div>

              <p className="text-muted-foreground text-xs leading-relaxed">
                {lang === "ru"
                  ? "До отеля, квартиры, офиса, Warszawa Centralna или Warszawa Zachodnia. Поездка без попутчиков."
                  : "Door-to-door service to a hotel, apartment, office, Warszawa Centralna or Warszawa Zachodnia."}
              </p>
            </a>
          </div>
        </motion.section>

        {/* Official sources */}
        <motion.section id="official-sources" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <BorderOfficialSources isRu={isRu} />
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
                  prefilledTo: lang === "ru" ? "Аэропорт Варшава-Шопен (WAW)" : "Warsaw Chopin Airport (WAW)",
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
