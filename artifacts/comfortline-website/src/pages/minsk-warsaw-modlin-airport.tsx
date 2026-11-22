import { CityAirportLinks } from "@/components/CityAirportLinks";
import { RouteFareTable } from "@/components/RouteFareTable";
import { useFareRate } from "@/hooks/use-fare-rate";
import { roundedByn, routeFares } from "@/data/route-fares";
import { motion } from "framer-motion";
import { Plane, Clock, MapPin, Car, ArrowRight, Info, CheckCircle2, PhoneCall, ShieldCheck } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useLang } from "@/context/language-context";
import { GlobalBookingModal } from "@/components/sections/GlobalBookingModal";
import { Seo } from "@/seo/Seo";
import { taxiServiceJsonLd } from "@/seo/jsonld";
import { SITE_URL } from "@/seo/seo-config";
import { getHomeSectionHref } from "@/lib/lang-urls";

const fareRoute = "/warsaw-transfer";

const content = {
  ru: {
    badge: "Трансфер",
    title: "Минск — Аэропорт Варшава-Модлин",
    subtitle: "Индивидуальный трансфер в аэропорт Варшава-Модлин (WMI). Бюджетные авиалинии, фиксированная цена, профессиональный водитель.",
    stats: [
      { label: "Расстояние", value: "~570 км" },
      { label: "Время в пути", value: "6–10 ч" },
      { label: "Класс авто", value: "Комфорт / Бизнес" },
      { label: "Подача машины", value: "До двери" },
    ],
    howTitle: "Как проходит трансфер",
    steps: [
      { icon: MapPin, title: "Подача от двери", desc: "Водитель приедет к вашему адресу в Минске точно в назначенное время." },
      { icon: ShieldCheck, title: "Граница Беларусь–Польша", desc: "Водитель мониторит пропускные пункты в реальном времени и выбирает оптимальный маршрут." },
      { icon: Plane, title: "Прибытие в аэропорт", desc: "Доставим прямо к терминалу Модлина — единственный и удобный — с запасом до вылета." },
    ],
    airportTitle: "Аэропорт Варшава-Модлин (WMI)",
    airportInfo: [
      { label: "Полное название", value: "Аэропорт Варшава/Модлин" },
      { label: "IATA код", value: "WMI" },
      { label: "Адрес", value: "ul. Gen. Wiktora Thommée 1A, 05-102 Nowy Dwór Mazowiecki, Польша" },
      { label: "Расстояние от центра", value: "~35 км к северу от Варшавы" },
      { label: "Терминалы", value: "1 терминал (все рейсы)" },
      { label: "Авиакомпании", value: "Ryanair, Wizz Air (бюджетные рейсы по Европе)" },
      { label: "До центра Варшавы", value: "Автобус Modlin Ekspres (55 мин), Flixbus, такси (35–50 мин)" },
    ],
    noteTitle: "Важно знать",
    note: "Модлин и Шопен — два разных аэропорта. Убедитесь, что ваш рейс именно из Варшавы-Модлин (WMI), а не из аэропорта Шопена (WAW).",
    photosTitle: "Аэропорт в фото",
    photos: [
      { src: "/img/warsaw/modlin-terminal.png", caption: "Терминал аэропорта Варшава-Модлин (WMI)" },
      { src: "/img/warsaw/modlin-tower.png", caption: "Зона прилёта и такси" },
    ],
    tipsTitle: "Полезная информация",
    tips: [
      "Граница Беларусь–Польша: среднее время 3–8 часов. В пиковые дни — до 12 часов.",
      "Рекомендуем выезжать с запасом 8–10 часов до вылета.",
      "Модлин расположен в 35 км от Варшавы — учитывайте время на подъезд к аэропорту.",
      "Ryanair и Wizz Air — основные операторы. Регистрация закрывается строго по расписанию.",
      "Бесплатный интернет доступен в терминале.",
      "Комплекс небольшой — регистрацию лучше пройти онлайн заранее.",
    ],
    whyTitle: "Почему ComfortLine",
    whyItems: [
      "Фиксированная цена без счётчика и скрытых доплат",
      "Опытный водитель, знающий все погранпереходы",
      "Детские кресла по запросу",
      "Встреча с табличкой при обратном трансфере",
      "Помощь с багажом",
      "Работаем 24/7, включая праздники",
    ],
    alsoTitle: "Также смотрите",
    alsoLinks: [
      {
        label: "Минск — Аэропорт Варшавы Шопен (WAW)",
        href: "/трансфер-минск-варшава-шопен",
      },
      {
        label: "Трансфер Варшава — Минск и Минск — Варшава",
        href: "/трансфер-варшава",
      },
    ],
    ctaTitle: "Забронировать трансфер",
    ctaDesc: "Оставьте заявку — менеджер свяжется с вами в ближайшее время и назовёт точную стоимость.",
    ctaBtn: "Оставить заявку",
    backBtn: "← Все услуги",
  },
  en: {
    badge: "Transfer",
    title: "Minsk — Warsaw Modlin Airport",
    subtitle: "Private transfer to Warsaw Modlin Airport (WMI). Budget airlines hub, fixed price, professional chauffeur.",
    stats: [
      { label: "Distance", value: "~570 km" },
      { label: "Travel time", value: "6–10 hrs" },
      { label: "Vehicle class", value: "Comfort / Business" },
      { label: "Pickup", value: "Door-to-door" },
    ],
    howTitle: "How the transfer works",
    steps: [
      { icon: MapPin, title: "Door pickup", desc: "Your driver arrives at your Minsk address exactly on time." },
      { icon: ShieldCheck, title: "Belarus–Poland border", desc: "Your driver monitors all checkpoints in real time and selects the fastest crossing." },
      { icon: Plane, title: "Airport arrival", desc: "Delivered straight to the Modlin terminal — compact, single-terminal airport — with time to spare." },
    ],
    airportTitle: "Warsaw Modlin Airport (WMI)",
    airportInfo: [
      { label: "Full name", value: "Warsaw/Modlin Airport" },
      { label: "IATA code", value: "WMI" },
      { label: "Address", value: "ul. Gen. Wiktora Thommée 1A, 05-102 Nowy Dwór Mazowiecki, Poland" },
      { label: "Distance from Warsaw", value: "~35 km north of Warsaw city centre" },
      { label: "Terminals", value: "1 terminal (all flights)" },
      { label: "Airlines", value: "Ryanair, Wizz Air (budget European routes)" },
      { label: "City transfer", value: "Modlin Ekspres bus (55 min), Flixbus, taxi (35–50 min)" },
    ],
    noteTitle: "Important",
    note: "Modlin and Chopin are two separate airports. Make sure your flight departs from Warsaw Modlin (WMI) and not Warsaw Chopin (WAW).",
    photosTitle: "Airport Gallery",
    photos: [
      { src: "/img/warsaw/modlin-terminal.png", caption: "Warsaw Modlin Airport terminal (WMI)" },
      { src: "/img/warsaw/modlin-tower.png", caption: "Arrivals area and taxi access" },
    ],
    tipsTitle: "Useful Information",
    tips: [
      "Belarus–Poland border crossing: average 3–8 hours. Up to 12 hours on peak days.",
      "We recommend departing 8–10 hours before your flight.",
      "Modlin is 35 km from Warsaw — factor in the drive to the airport itself.",
      "Ryanair and Wizz Air are the main operators. Check-in closes strictly on time.",
      "Free Wi-Fi is available inside the terminal.",
      "The terminal is compact — online check-in in advance is strongly recommended.",
    ],
    whyTitle: "Why ComfortLine",
    whyItems: [
      "Fixed price — no meter, no hidden extras",
      "Driver experienced in all Belarus–Poland border crossings",
      "Child seats available on request",
      "Name-board meet & greet for return transfers",
      "Luggage assistance included",
      "Available 24/7 including holidays",
    ],
    alsoTitle: "Also see",
    alsoLinks: [
      {
        label: "Minsk — Warsaw Chopin Airport (WAW)",
        href: "/minsk-warsaw-airport",
      },
      {
        label: "Warsaw — Minsk and Minsk — Warsaw transfer",
        href: "/warsaw-transfer",
      },
    ],
    ctaTitle: "Book your transfer",
    ctaDesc: "Submit a request and our manager will contact you shortly with an exact price.",
    ctaBtn: "Request a booking",
    backBtn: "← All services",
  },
};

export default function MinskWarsawModlinAirportPage() {
  const { lang } = useLang();
  const rate = useFareRate();
  const c = content[lang];

  const isRu = lang === "ru";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Seo
        titleRu="Трансфер Минск — Аэропорт Варшавы Модлин (WMI) | ComfortLine"
        titleEn="Minsk to Warsaw Modlin Airport (WMI) Private Transfer"
        descRu="Индивидуальный трансфер из Минска в аэропорт Варшавы Модлин (WMI). Фиксированная цена, опытный водитель, помощь на границе Беларусь–Польша. ~600 км, 7–10 ч."
        descEn="Private transfer from Minsk to Warsaw Modlin Airport (WMI). Fixed price, professional driver, assistance at the Belarus–Poland border. ~600 km, 7–10 hrs."
        pathRu="/трансфер-минск-варшава-модлин"
        pathEn="/minsk-warsaw-modlin-airport"
        keywordsRu="минск варшава индивидуальный трансфер такси, трансфер минск модлин, минск варшава модлин, wmi трансфер, такси минск варшава модлин, индивидуальный трансфер аэропорт модлин"
        keywordsEn="minsk warsaw private transfer taxi, minsk warsaw modlin transfer, minsk to wmi taxi, warsaw modlin airport private transfer, ryanair modlin minsk"
        breadcrumbsRu={[
          { name: "Главная", path: "/" },
          { name: "Трансфер Минск — Аэропорт Варшавы Модлин (WMI)", path: "/трансфер-минск-варшава-модлин" },
        ]}
        breadcrumbsEn={[
          { name: "Home", path: "/" },
          { name: "Minsk — Warsaw Modlin Airport (WMI)", path: "/minsk-warsaw-modlin-airport" },
        ]}
        jsonLd={taxiServiceJsonLd({
          lang,
          name: isRu ? "Трансфер Минск — Аэропорт Варшавы Модлин (WMI)" : "Minsk to Warsaw Modlin Airport (WMI) Transfer",
          description: isRu
            ? "Индивидуальный трансфер из Минска в аэропорт Варшавы Модлин (WMI). Фиксированная цена."
            : "Private transfer from Minsk to Warsaw Modlin Airport (WMI). Fixed price.",
          url: SITE_URL + (isRu ? "/трансфер-минск-варшава-модлин" : "/minsk-warsaw-modlin-airport"),
          priceFrom: roundedByn(routeFares[fareRoute]!.outbound[0], rate.bynPerEur),
          priceCurrency: "BYN",
          fromName: isRu ? "Минск" : "Minsk",
          toName: isRu ? "Аэропорт Варшавы Модлин (WMI)" : "Warsaw Modlin Airport (WMI)",
        })}
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
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mb-10">
            {c.subtitle}
          </p>
          <CityAirportLinks lang={lang} pathEn="/minsk-warsaw-modlin-airport" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {c.stats.map((s) => (
              <div key={s.label} className="bg-card border border-border rounded-xl p-4">
                <p className="text-primary font-bold text-lg">{s.value}</p>
                <p className="text-muted-foreground text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
          <RouteFareTable rate={rate} lang={lang} cityRoute={fareRoute} from={isRu ? "Минск" : "Minsk"} to="WMI" />
          <div className="mt-8">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("open-booking-modal", {
                detail: {
                  prefilledFrom: isRu ? "Минск" : "Minsk",
                  prefilledTo: isRu ? "Аэропорт Варшава-Модлин (WMI)" : "Warsaw Modlin Airport (WMI)",
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
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
            <Info className="h-5 w-5 text-primary" />
            {c.airportTitle}
          </h2>

          {/* Important note */}
          <div className="flex items-start gap-3 bg-primary/5 border border-primary/20 rounded-xl px-5 py-4 mb-6">
            <span className="text-primary text-lg shrink-0">⚠️</span>
            <div>
              <p className="text-sm font-semibold text-foreground mb-1">{c.noteTitle}</p>
              <p className="text-sm text-muted-foreground">{c.note}</p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            {c.airportInfo.map((row, i) => (
              <div key={i} className={`flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 px-6 py-4 ${i < c.airportInfo.length - 1 ? "border-b border-border/50" : ""}`}>
                <span className="text-muted-foreground text-sm min-w-[200px] shrink-0">{row.label}</span>
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

        {/* Also see */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">{c.alsoTitle}</p>
          <div className="flex flex-col gap-2">
            {c.alsoLinks.map((l) => (
              <a key={l.href} href={l.href} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <ArrowRight className="h-3.5 w-3.5 shrink-0" />
                {l.label}
              </a>
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
                  prefilledTo: lang === "ru" ? "Аэропорт Варшава-Модлин (WMI)" : "Warsaw Modlin Airport (WMI)",
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
