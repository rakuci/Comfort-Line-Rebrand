import { useState } from "react";
import { BookingModal } from "./BookingModal";
import { Plane, Users, MapPin, Globe2, ArrowRight, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useLang } from "@/context/language-context";

const icons = [Plane, MapPin, Users, Globe2];

interface RouteItem {
  from: string;
  to: string;
  code: string;
  meta: string;
  href: string;
}

const serviceRoutes: Record<"ru" | "en", RouteItem[][]> = {
  ru: [
    [
      { from: "Минск", to: "Аэропорт Вильнюса", code: "VNO", meta: "~175 км · 2,5–5 ч",  href: "/трансфер-минск-вильнюс-аэропорт" },
      { from: "Минск", to: "Варшава Шопен",      code: "WAW", meta: "~550 км · 6–9 ч",    href: "/трансфер-минск-варшава-шопен" },
      { from: "Минск", to: "Варшава Модлин",     code: "WMI", meta: "~570 км · 7–10 ч",   href: "/трансфер-минск-варшава-модлин" },
      { from: "Минск", to: "Аэропорт Риги",      code: "RIX", meta: "~470 км · 5–8 ч",    href: "/трансфер-минск-рига-аэропорт" },
    ],
    [
      { from: "Минск", to: "по городу",    code: "24/7",      meta: "30–60 мин подача",    href: "/трансфер-по-минску" },
      { from: "Минск", to: "по Беларуси",  code: "6 ОБЛ.",    meta: "Брест, Гродно, Витебск…", href: "/трансфер-по-беларуси" },
      { from: "Минск", to: "санаторий",    code: "SPA",       meta: "Нарочь, Браслав, БП…",  href: "/трансфер-в-санаторий" },
    ],
    [
      { from: "Группа", to: "любой маршрут", code: "≤8 ЧЕЛ", meta: "Минивэн / Микроавтобус", href: "/групповой-трансфер" },
      { from: "VIP",    to: "бизнес-трансфер", code: "PREM", meta: "Mercedes E / V-class",    href: "/вип-трансфер" },
      { from: "Лыжи",   to: "горнолыжный курорт", code: "SKI", meta: "Силичи, Татры, Закопане", href: "/лыжный-трансфер" },
    ],
    [
      { from: "Минск", to: "Литва 🇱🇹",    code: "VNO · KUN", meta: "Вильнюс, Каунас, Клайпеда",  href: "/трансфер-в-литву" },
      { from: "Минск", to: "Латвия 🇱🇻",   code: "RIX",       meta: "Рига, Юрмала",               href: "/трансфер-в-латвию" },
      {
        from: "Минск",
        to: "Варшава",
        code: "CITY",
        meta: "Индивидуальный трансфер · до адреса",
        href: "/трансфер-варшава",
      },
      { from: "Минск", to: "Польша 🇵🇱",   code: "WAW · WMI", meta: "Варшава Шопен, Варшава Модлин", href: "/трансфер-в-польшу" },
      { from: "Минск", to: "Германия 🇩🇪", code: "BER",       meta: "Берлин и другие города",      href: "/трансфер-в-германию" },
      { from: "Минск", to: "Франция 🇫🇷",  code: "CDG",       meta: "Париж — по запросу",          href: "/трансфер-во-францию" },
    ],
  ],
  en: [
    [
      { from: "Minsk", to: "Vilnius Airport",  code: "VNO", meta: "~175 km · 2.5–5 hrs", href: "/minsk-vilnius-airport" },
      { from: "Minsk", to: "Warsaw Chopin",    code: "WAW", meta: "~550 km · 6–9 hrs",   href: "/minsk-warsaw-airport" },
      { from: "Minsk", to: "Warsaw Modlin",    code: "WMI", meta: "~570 km · 7–10 hrs",  href: "/minsk-warsaw-modlin-airport" },
      { from: "Minsk", to: "Riga Airport",     code: "RIX", meta: "~470 km · 5–8 hrs",   href: "/minsk-riga-airport" },
    ],
    [
      { from: "Minsk", to: "city",       code: "24/7",      meta: "30–60 min dispatch",    href: "/minsk-city-transfer" },
      { from: "Minsk", to: "Belarus",    code: "6 REG.",    meta: "Brest, Grodno, Vitebsk…", href: "/belarus-transfer" },
      { from: "Minsk", to: "resort", code: "SPA",       meta: "Naroch, Braslav, BP…",   href: "/sanatorium-transfer" },
    ],
    [
      { from: "Group", to: "any route",        code: "≤8 PAX", meta: "Minivan / Minibus",       href: "/group-transfer" },
      { from: "VIP",   to: "business transfer", code: "PREM",  meta: "Mercedes E / V-class",   href: "/vip-transfer" },
      { from: "Ski",   to: "winter resort",    code: "SKI",   meta: "Silichi, Tatras, Zakopane", href: "/ski-transfer" },
    ],
    [
      { from: "Minsk", to: "Lithuania 🇱🇹",  code: "VNO · KUN", meta: "Vilnius, Kaunas, Klaipėda",     href: "/lithuania-transfer" },
      { from: "Minsk", to: "Latvia 🇱🇻",    code: "RIX",       meta: "Riga, Jūrmala",                href: "/latvia-transfer" },
      {
        from: "Minsk",
        to: "Warsaw",
        code: "CITY",
        meta: "Private transfer · door to door",
        href: "/warsaw-transfer",
      },
      { from: "Minsk", to: "Poland 🇵🇱",    code: "WAW · WMI", meta: "Warsaw Chopin, Warsaw Modlin",  href: "/poland-transfer" },
      { from: "Minsk", to: "Germany 🇩🇪",   code: "BER",       meta: "Berlin and more",               href: "/germany-transfer" },
      { from: "Minsk", to: "France 🇫🇷",    code: "CDG",       meta: "Paris — on request",            href: "/france-transfer" },
    ],
  ],
};

const cardTitles = {
  ru: ["Трансферы в аэропорт", "Беларусь и здравницы", "Группа, VIP и спецуслуги", "По всей Европе"],
  en: ["Airport Transfers", "Belarus & Resorts", "Group, VIP & Specialty", "Across Europe"],
};

const cardDescs = {
  ru: [
    "Вильнюс, Варшава и другие аэропорты — подача точно ко времени вылета.",
    "Деловые поездки, межгород по Беларуси, санатории и здравницы — Нарочь, Браслав, Беловежская Пуща.",
    "До 8 пассажиров. Семьи и тур-группы, премиум-сервис для бизнеса, лыжные поездки на курорты.",
    "Литва, Латвия, Польша, Германия, Франция — выберите страну и направление.",
  ],
  en: [
    "Vilnius, Warsaw and beyond — punctual door-to-door airport service.",
    "Business trips across Belarus, plus health resort transfers — Naroch, Braslav, Belovezhskaya Pushcha.",
    "Up to 8 passengers. Families and tour groups, premium business service, ski-resort runs.",
    "Lithuania, Latvia, Poland, Germany, France — pick a country then choose your city.",
  ],
};

const sectionLabel = { ru: "Маршруты", en: "Routes" };

export function Services() {
  const { t, lang } = useLang();
  const ru = lang === "ru";
  const [requested, setRequested] = useState<string[] | null>(null);
  const warsaw = ru ? "Варшава" : "Warsaw";
  const riga = ru ? "Рига" : "Riga";
  const vilnius = ru ? "Вильнюс" : "Vilnius";
  const minsk = ru ? "Минск" : "Minsk";
  const cityLinks = [
    [warsaw, ru ? "/трансфер-варшава" : "/warsaw-transfer"],
    [riga, ru ? "/трансфер-рига" : "/riga-transfer"],
    [vilnius, ru ? "/трансфер-минск-вильнюс" : "/minsk-vilnius-transfer"],
  ];
  const routes = serviceRoutes[lang];
  const titles = cardTitles[lang];
  const descs = cardDescs[lang];

  return (
    <section id="services" className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-primary font-semibold tracking-wider uppercase text-sm mb-3">{t.services.label}</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-foreground">{t.services.heading}</h3>
          <div className="w-20 h-1 bg-primary mx-auto mt-6 rounded-full" />
        </div>

        <div className="mb-8 rounded-2xl border border-border bg-card p-5 sm:p-8">
          <h3 className="text-xl font-bold">{ru ? "Трансферы из Минска и обратно" : "Transfers to and from Minsk"}</h3>
          <div className="my-4 grid gap-3 sm:grid-cols-3">
            {cityLinks.map(([city, href]) => (
              <a key={href} href={href} className="rounded-xl border border-border px-4 py-3 font-semibold hover:border-primary">
                {minsk} ↔ {city}
                <span className="block text-sm font-normal text-muted-foreground">{ru ? "Маршрут и цены" : "Route and fares"}</span>
              </a>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">{ru
            ? "Между Варшавой, Ригой и Вильнюсом доступность и цену уточняйте на дату поездки. Выберите направление для запроса."
            : "For travel between Warsaw, Riga and Vilnius, choose a direction to request availability and a fare for your date."}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {[[warsaw, riga], [riga, warsaw], [vilnius, warsaw], [warsaw, vilnius], [vilnius, riga], [riga, vilnius]].map(pair => (
              <button type="button" key={pair.join("-")} onClick={() => setRequested(pair)}
                className="rounded-lg border border-border px-3 py-2 text-sm text-primary hover:border-primary">
                {pair.join(" → ")}
              </button>
            ))}
          </div>
          <a className="mt-4 inline-block text-sm underline" href={ru ? "/terms" : "/en/terms"}>
            {ru ? "Условия бронирования, оплаты и отмены" : "Booking, payment and cancellation terms"}
          </a>
        </div>
        {requested && <BookingModal open onClose={() => setRequested(null)} prefilledFrom={requested[0]} prefilledTo={requested[1]} />}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {titles.map((title, index) => {
            const Icon = icons[index];
            const cardRoutes = routes[index];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card border border-border p-8 rounded-2xl hover:border-primary/50 transition-colors group"
              >
                {/* Icon + title */}
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <Icon className="h-7 w-7 text-primary" />
                </div>
                <h4 className="text-xl font-bold mb-3 text-card-foreground group-hover:text-primary transition-colors">
                  {title}
                </h4>
                <p className="text-muted-foreground leading-relaxed text-sm mb-6">
                  {descs[index]}
                </p>

                {/* Route list — styled to match header dropdown */}
                <div className="border-t border-border/50 pt-4">
                  {/* Mini section header */}
                  <div className="flex items-center gap-1.5 mb-2 px-1">
                    <MapPin className="h-3 w-3 text-primary" />
                    <span className="text-[10px] font-bold text-primary uppercase tracking-[0.12em]">
                      {sectionLabel[lang]}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1">
                    {cardRoutes.map((route) => (
                      <a
                        key={route.href}
                        href={route.href}
                        className="group/row flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-primary/10 border border-transparent hover:border-primary/20 transition-all duration-150"
                      >
                        {/* Route text */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-semibold text-foreground group-hover/row:text-primary transition-colors leading-snug">
                              {route.from}
                              <ArrowRight className="inline h-3 w-3 text-primary/60 mx-1 align-middle" />
                              {route.to}
                            </p>
                            <span className="px-1.5 py-0.5 text-[10px] font-bold bg-primary/15 text-primary rounded-md shrink-0 leading-none whitespace-nowrap mt-0.5">
                              {route.code}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 mt-0.5">
                            <Clock className="h-2.5 w-2.5 text-muted-foreground/60 shrink-0" />
                            <span className="text-[11px] text-muted-foreground/70">{route.meta}</span>
                          </div>
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover/row:text-primary group-hover/row:translate-x-0.5 transition-all shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
