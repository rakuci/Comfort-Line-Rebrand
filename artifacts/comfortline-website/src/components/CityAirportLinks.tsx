interface Destination {
  ru: [string, string];
  en: [string, string];
}

const corridors: { city: Destination; airports: Destination[] }[] = [
  {
    city: { ru: ["Трансфер Минск — Варшава до адреса в городе", "/трансфер-варшава"], en: ["Minsk ↔ Warsaw city transfer", "/warsaw-transfer"] },
    airports: [
      { ru: ["Минск ↔ аэропорт Шопена (WAW)", "/трансфер-минск-варшава-шопен"], en: ["Minsk ↔ Warsaw Chopin Airport (WAW)", "/minsk-warsaw-airport"] },
      { ru: ["Минск ↔ аэропорт Модлин (WMI)", "/трансфер-минск-варшава-модлин"], en: ["Minsk ↔ Warsaw Modlin Airport (WMI)", "/minsk-warsaw-modlin-airport"] },
    ],
  },
  {
    city: { ru: ["Трансфер Минск — Вильнюс до адреса в городе", "/трансфер-минск-вильнюс"], en: ["Minsk ↔ Vilnius city transfer", "/minsk-vilnius-transfer"] },
    airports: [{ ru: ["Минск ↔ аэропорт Вильнюса (VNO)", "/трансфер-минск-вильнюс-аэропорт"], en: ["Minsk ↔ Vilnius Airport (VNO)", "/minsk-vilnius-airport"] }],
  },
  {
    city: { ru: ["Трансфер Минск — Рига до адреса в городе", "/трансфер-рига"], en: ["Minsk ↔ Riga city transfer", "/riga-transfer"] },
    airports: [{ ru: ["Минск ↔ аэропорт Риги (RIX)", "/трансфер-минск-рига-аэропорт"], en: ["Minsk ↔ Riga Airport (RIX)", "/minsk-riga-airport"] }],
  },
];

export function CityAirportLinks({ lang, pathEn }: { lang: "ru" | "en"; pathEn: string }) {
  const corridor = corridors.find(({ city, airports }) =>
    city.en[1] === pathEn || airports.some(airport => airport.en[1] === pathEn));
  if (!corridor) return null;
  const options = [corridor.city, ...corridor.airports].filter(place => place.en[1] !== pathEn);
  return (
    <nav aria-label={lang === "ru" ? "Другие пункты назначения" : "Other destinations"} className="mb-6 flex flex-wrap gap-2">
      {options.map(place => (
        <a key={place.en[1]} href={place[lang][1]} className="rounded-lg border border-border px-3 py-2 text-sm font-medium text-primary hover:border-primary">
          {place[lang][0]}
        </a>
      ))}
    </nav>
  );
}
