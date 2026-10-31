// Editorial regression baseline, NOT legal authority or a live-status feed.
// Visa/checkpoint expectations: source review 2026-10-16 (MFA Europe/airport,
// GPK and the Polish/Lithuanian/Latvian notices linked beside the articles).
// Customs expectations live in check-border-guide.mjs, reviewed 2026-10-17.
// An official rule update requires deliberate edits here AND in both languages.
export const POLICY_REVIEW_DATE = "2026-10-16";
export const EXPECTED_ORIGIN = "https://comfortline.by";
export const GUIDE_SLUG = "как-въехать-в-беларусь-на-автомобиле-2026";
export const VISA_SLUG = "виза-свободный-въезд-в-беларусь-2026";

// Preserve publication identity, not the order articles happen to appear in.
// [RU slug, EN slug, social-image identity, original publication date]
export const ARTICLE_IDENTITIES = [
  ["eu-belarus-shopping-by-car", "eu-belarus-shopping-by-car", "blog-eu-belarus-shopping-by-car", "2026-10-31"],
  [GUIDE_SLUG, "driving-to-belarus-by-car-2026-rules-checker", "blog-v-belarus-na-avtomobile-2026", "2026-10-16"],
  ["граница-беларусь-литва", "belarus-lithuania-border-crossing-guide", "blog-granitsa-belarus-litva", "2026-04-15"],
  ["стоимость-трансфер-минск-варшава", "minsk-warsaw-transfer-price-2026", "blog-stoimost-transfer-minsk-varshava", "2026-04-10"],
  ["что-нельзя-ввозить-в-ес", "what-not-to-bring-from-belarus-to-eu", "blog-chto-nelzya-vvozit-v-es", "2026-05-20"],
  ["какой-кпп-выбрать", "which-belarus-border-crossing-to-choose", "blog-kakoy-kpp-vybrat", "2026-03-28"],
  ["трансфер-с-детьми", "family-airport-transfer-with-children", "blog-transfer-s-detmi", "2026-03-20"],
  ["как-добраться-до-аэропорта-вильнюса", "how-to-get-to-vilnius-airport-from-minsk", "blog-kak-dobratsya-do-vno", "2026-03-15"],
  ["аэропорт-варшавы-вав", "warsaw-chopin-airport-guide-from-belarus", "blog-airport-warsaw-waw", "2026-05-20"],
  ["граница-беларусь-польша", "belarus-poland-border-crossing-guide", "blog-granitsa-belarus-polsha", "2026-05-10"],
  ["аэропорт-риги-rix", "riga-airport-guide-from-minsk-belarus", "blog-airport-riga-rix", "2026-04-28"],
  ["автобус-минск-варшава-модлин-вильнюс", "minsk-warsaw-vilnius-bus-vs-private-transfer", "blog-avtobus-minsk-varshava-modlin-vilnius", "2026-06-01"],
  [VISA_SLUG, "visa-free-entry-belarus-2026", "blog-visa-free-belarus-2026", "2026-06-13"],
  ["вывоз-60-евро-в-беларусь-из-литвы-латвии", "eu-60-euro-cash-limit-belarus-lithuania-latvia", "blog-60-evro-litva-latvia-belarus", "2026-06-28"],
  ["советские-мозаики-минска", "soviet-mosaics-minsk-guide", "blog-sovetskie-mozaiki-minska", "2026-07-05"],
];

export const GUIDE_LINKED_FROM = [
  "граница-беларусь-литва", "что-нельзя-ввозить-в-ес", "какой-кпп-выбрать",
  "как-добраться-до-аэропорта-вильнюса", "граница-беларусь-польша",
  "аэропорт-риги-rix", VISA_SLUG,
];

// Vehicle eligibility, not queue-time estimates. Each row is independently
// pinned in RU and EN: merely comparing translations could approve shared errors.
export const CHECKPOINT_ROWS = {
  "граница-беларусь-литва": {
    ru: [
      ["Каменный Лог", "Мядининкай", "Легковые + автобусы"],
      ["Бенякони", "Шальчининкай", "Автотранспорт; разрешения перевозчика проверяются отдельно"],
      ["Котловка", "Лаворишкес", "Закрыт"], ["Привалка", "Райгардас", "Закрыт"],
      ["Лоша", "Шумскас", "Закрыт"], ["Видзы", "Твярячюс", "Закрыт"],
    ],
    en: [
      ["Kamenny Log", "Medininkai", "Cars + buses"],
      ["Benyakoni", "Šalčininkai", "Motor vehicles; carrier permits checked separately"],
      ["Kotlovka", "Lavoriškės", "Closed"], ["Privalka", "Raigardas", "Closed"],
      ["Losha", "Šumskas", "Closed"], ["Vidzy", "Tverečius", "Closed"],
    ],
  },
  "граница-беларусь-польша": {
    ru: [
      ["Брест (Тересполь)", "Тересполь", "М1 / Е30 → Варшава"],
      ["Берестовица", "Бобровники", "Легковые и автобусы → Белосток"],
      ["Брузги", "Кузница Белостоцкая", "Легковые, без автобусов → Белосток"],
      ["Домачево", "Словатыче", "Движение приостановлено"],
      ["Песчатка", "Половце", "Движение приостановлено"],
    ],
    en: [
      ["Brest (Terespol)", "Terespol", "M1 / E30 → Warsaw"],
      ["Berestovitsa", "Bobrowniki", "Cars and coaches → Białystok"],
      ["Bruzgi", "Kuźnica Białostocka", "Cars, no coaches → Białystok"],
      ["Domachevo", "Sławatycze", "Traffic suspended"],
      ["Peschatka", "Połowce", "Traffic suspended"],
    ],
  },
};

export const DRIVING_CROSSINGS = {
  ru: [
    ["Польша → Беларусь", "Terespol — Brest; Bobrowniki — Berestovitsa; Kuźnica — Bruzgi"],
    ["Литва → Беларусь", "Medininkai — Kamenny Log; Šalčininkai — Benyakoni"],
    ["Латвия → Беларусь", "Pāternieki — Grigorovshchina"],
  ],
  en: [
    ["Poland", "Terespol–Brest; Bobrowniki–Berestovitsa; Kuźnica–Bruzgi"],
    ["Lithuania", "Medininkai–Kamenny Log; Šalčininkai–Benyakoni"],
    ["Latvia", "Pāternieki–Grigorovshchina"],
  ],
};

export const VISA_ROWS = {
  ru: [
    ["Аэропорты Беларуси", "до 30 суток", "Въезд и выезд: Минск, Брест, Витебск, Гомель, Гродно, Могилёв; не рейсы из/в РФ", "76 государств"],
    ["Наземная граница (авто и ж/д)", "до 30 суток за въезд; PL/LT/LV и неграждане Латвии — до 90; всего не более 90 суток в календарном году", "Работающие международные автодорожные и железнодорожные КПП", "38 европейских государств; до 31.12.2026"],
  ],
  en: [
    ["Belarusian airports", "up to 30 days", "Entry and exit: Minsk, Brest, Vitebsk, Gomel, Grodno, Mogilev; no flights from/to Russia", "76 states"],
    ["Land border (road & rail)", "up to 30 days per entry; PL/LT/LV citizens and Latvian non-citizens — up to 90; maximum 90 days per calendar year", "Operating international road and railway border crossings", "38 European states; until 31 December 2026"],
  ],
};

export const EUROPEAN_LAND_COUNTRIES = "AT AD BE BG BA VA GB HU GR DK IE IS ES IT CY LI LU LV LT MT MC NL NO PL PT RO SM MK SK SI FI FR DE HR CZ CH SE EE".split(" ").sort();
