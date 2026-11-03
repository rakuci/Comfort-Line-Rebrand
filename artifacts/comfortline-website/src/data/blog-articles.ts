// Blog articles. Russian-only — Yandex is the priority audience and all topics
// are Belarus / RU-speaker focused. Each article ships a structured body so we
// can render it in React AND prerender the full text into the static HTML.

import { BORDER_BY_CAR_BODY_RU, BORDER_BY_CAR_BODY_EN } from "./blog-border-by-car-2026";
import { SHOPPING_BODY_RU, SHOPPING_BODY_EN } from "./blog-eu-belarus-shopping";

export type Block = (
  | { type: "p"; text: string }
  | { type: "h2"; text: string; id?: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "callout"; text: string }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "link"; href: string; label: string; description?: string }
  | { type: "img"; src: string; alt: string; caption?: string }
  | { type: "liveQueue" }
  | { type: "borderChecker" }
  | { type: "shoppingEnquiry" }
  | { type: "editorial-correction"; heading: string; text: string }
  | { type: "info-notice"; text: string }) & { markdown?: boolean };

export interface Article {
  slug: string;
  slugEn?: string;
  titleEn?: string;
  seoTitle?: string;
  seoTitleEn?: string;
  descriptionEn?: string;
  ogSlug: string;
  title: string;
  description: string;
  intro: string;
  introEn?: string;
  dateISO: string;
  dateModified?: string;
  readingMin: number;
  category: string;
  categoryEn?: string;
  tags: string[];
  body: Block[];
  bodyEn?: Block[];
  related: string[];
  ctaRoute?: { label: string; labelEn?: string; path: string; pathEn: string };
  disclaimerBanner?: boolean;
  citation?: string[];
}

export const BLOG_BASE_RU = "/блог";
export const BLOG_BASE_EN = "/blog";

export const ARTICLES: Article[] = [
  {
    slug: "eu-belarus-shopping-by-car",
    slugEn: "eu-belarus-shopping-by-car",
    ogSlug: "blog-eu-belarus-shopping-by-car",
    title: "Из ЕС в Беларусь на автомобиле: покупки, граница и параметры вашей поездки",
    titleEn: "Driving from the EU to Belarus: shopping, border checks and your travel details",
    seoTitle: "Что можно везти из ЕС в Беларусь на машине — ComfortLine",
    seoTitleEn: "EU to Belarus by Car: Customs & Travel Guide — ComfortLine",
    description: "Покупки из ЕС в Беларусь на автомобиле: стоимость, вес, частые поездки, ограничения Польши, Литвы и Латвии. Официальные источники и персональный запрос.",
    descriptionEn: "Driving from the EU to Belarus: purchases, luggage allowances, frequent trips and vehicle checks for Poland, Lithuania and Latvia. Official sources and enquiry.",
    intro: "Три отдельных проверки перед поездкой: документы пассажиров, вывоз автомобиля и покупок из ЕС, ввоз вещей в Беларусь. Материал подготовлен 31 октября 2026 года; анкета помогает составить запрос, но не выдаёт разрешений.",
    introEn: "Three separate checks before travelling: passenger documents, exporting the vehicle and purchases from the EU, and bringing goods into Belarus. Prepared on 31 October 2026; the enquiry builder does not issue permission.",
    dateISO: "2026-10-31",
    readingMin: 18,
    category: "Таможня",
    categoryEn: "Customs",
    tags: ["Беларусь", "ЕС", "покупки", "таможня", "автомобиль"],
    disclaimerBanner: true,
    body: SHOPPING_BODY_RU,
    bodyEn: SHOPPING_BODY_EN,
    related: ["как-въехать-в-беларусь-на-автомобиле-2026", "граница-беларусь-литва", "какой-кпп-выбрать"],
  },
  {
    slug: "как-въехать-в-беларусь-на-автомобиле-2026",
    slugEn: "driving-to-belarus-by-car-2026-rules-checker",
    titleEn: "Belarus by Car: Rules & Checker 2026",
    descriptionEn: "Belarus by car: dated source checks, vehicle sanctions, visas and BY-plate return risks. Preliminary checker, with verification gaps clearly marked.",
    ogSlug: "blog-v-belarus-na-avtomobile-2026",
    title: "Въезд в Беларусь на авто: правила 2026",
    description:
      "В Беларусь на авто: датированная сверка источников, санкции, безвиз и риски возврата на BY-номерах. Предварительная анкета с явно указанными пробелами проверки.",
    intro:
      "Законность поездки на автомобиле в Беларусь не сводится к одному паспорту или номерному знаку: отдельно проверяются человек, переход, санкции, возврат в ЕС и таможня ЕАЭС. Исследование и редакционная сверка доступных источников датированы 16 октября 2026 года; ниже явно отмечены неподтверждённые положения. Анкета работает только в вашем браузере и не выдаёт разрешений.",
    introEn:
      "Driving to Belarus is not decided by one passport or one number plate: traveller, crossing, sanctions, EU return and EAEU customs are separate checks. Research and editorial inspection of accessible sources are dated 16 October 2026; unconfirmed points are explicitly marked below. The browser-only checker does not issue permission.",
    dateISO: "2026-10-16",
    dateModified: "2026-10-17",
    readingMin: 20,
    category: "Граница",
    categoryEn: "Border",
    tags: ["граница", "Беларусь", "автомобиль", "санкции", "таможня", "безвиз", "номера BY", "Польша", "Литва", "Латвия"],
    disclaimerBanner: true,
    citation: [
      "https://eur-lex.europa.eu/eli/reg/2006/765/2026-07-24/eng",
      "https://mano.muitine.lt/en/knowledge-bank/prohibitions-and-restrictions/international-sanctions/restrictions-export-passenger-vehicles-belarus",
      "https://eur-lex.europa.eu/eli/reg/2025/1472/oj/eng",
      "https://eur-lex.europa.eu/eli/reg/2026/513/oj/eng",
      "https://www.gov.pl/web/kas/nowe-zasady-przywozu-samochodow-osobowych-zarejestrowanych-na-bialorusi",
      "https://muitine.lrv.lt/en/news/updated-procedure-for-admitting-cars-with-belarusian-registration-to-enter-lithuania/",
      "https://www.vid.gov.lv/lv/jaunums/personas-ar-baltkrievijas-republika-registretu-transportlidzekli-turpmak-nevares-iebraukt-latvija",
      "https://www.gov.pl/web/kas/przejscia-graniczne-z-bialorusia-w-bobrownikach-i-kuznicy-otwarte",
      "https://vsat.lrv.lt/lt/naujienos/atidaromi-salcininku-ir-medininku-pasienio-kontroles-punktai/",
      "https://www.lvborder.lv/en/",
      "https://t.me/s/gpkgovby?before=8073",
      "https://www.mfa.bg/en/embassyinfo/belarus",
      "https://eec.eaeunion.org/upload/iblock/93c/TK-EAES.pdf",
      "https://www.consilium.europa.eu/en/policies/sanctions-against-belarus/",
      "https://granica.gov.pl/",
      "https://www.gov.pl/web/bialorus/komunikat-dla-kierowcow-udajacych-sie-na-bialorus",
      "https://home-affairs.ec.europa.eu/policies/schengen/visa-policy_en",
      "https://www.consilium.europa.eu/en/policies/eu-visa-policy/",
      "https://eur-lex.europa.eu/eli/reg_impl/2026/1817/oj/eng",
      "https://eur-lex.europa.eu/eli/reg/2026/1846/oj/eng",
      "https://gpk.gov.by/",
      "https://www.gov.uk/foreign-travel-advice/belarus/entry-requirements",
      "https://eec.eaeunion.org/upload/medialibrary/48d/754bnati3u804penijmb0h866e5g6cng/Prilozhenie-2_107.pdf",
      "https://eec.eaeunion.org/comission/department/dep_tamoj_zak/transferenceProduct.php",
      "https://eec.eaeunion.org/upload/medialibrary/e51/rf0fgji3ws0bcs8fzlz4k51m93ytecqh/Prilozhenie-3_107.pdf",
      "https://docs.eaeunion.org/upload/iblock/db1/hwvca13w5zfkp6bbk0kjn823yeuflqm7/Reshenie-Soveta-_-111-ot-5-dekabrya-2025-g.pdf",
      "https://www.customs.gov.by/news/ob-ustanovlenii-lgot-v-otnoshenii-elektromobiley-na-2026-god/",
      "https://www.customs.gov.by/news/ob-izmenenii-zakonodatelstva-reguliruyushchego-primenenie-lgot-v-otnoshenii-elektromobiley-v-2026-g-/",
      "https://www.customs.gov.by/news/ob-izmeneniyakh-v-tn-ved-eaes-kasayushchikhsya-elektromobiley-i-posledovatelnykh-gibridov/",
      "https://president.gov.by/fp/v1/501/document-thumb__70501__original/70501.1765469807.9aa4ef2b5f.pdf",
      "https://www.customs.gov.by/news/ob-izmenenii-zakonodatelstva-reguliruyushchego-poryadok-uplaty-utilizatsionnogo-sbora/",
      "https://www.customs.gov.by/calc/",
      "https://www.consilium.europa.eu/en/policies/sanctions-against-belarus/timeline-eu-sanctions-against-belarus/",
      "https://www.lvrtc.lv/en/news/jaunumi/no-sodienas-latvijas-robezu-ar-krieviju-un-baltkrieviju-var-skersot-tikai-pec-registracijas-elektroniskas-rindas-rezervacijas-sistema/",
      "https://eur-lex.europa.eu/eli/reg/2025/2041/oj/eng",
    ],
    body: BORDER_BY_CAR_BODY_RU,
    bodyEn: BORDER_BY_CAR_BODY_EN,
    related: ["eu-belarus-shopping-by-car", "виза-свободный-въезд-в-беларусь-2026", "что-нельзя-ввозить-в-ес", "какой-кпп-выбрать", "граница-беларусь-польша"],
    ctaRoute: { label: "Трансфер в Европу с водителем", labelEn: "Chauffeured transfer to Europe", path: "/трансфер-в-европу", pathEn: "/europe-transfer" },
  },

  {
    slug: "граница-беларусь-литва",
    slugEn: "belarus-lithuania-border-crossing-guide",
    titleEn: "Lithuania Border: Checkpoints & Docs",
    descriptionEn: "Everything about crossing the Belarus–Lithuania border in 2026: open checkpoints, typical wait times, required documents and tips from ComfortLine drivers.",
    ogSlug: "blog-granitsa-belarus-litva",
    title: "Граница Беларусь — Литва: КПП и документы",
    description:
      "Подробный гайд по границе Беларусь–Литва в 2026: какие КПП работают, сколько стоят очереди, какие документы нужны для въезда в ЕС, советы водителей ComfortLine.",
    intro:
      "Граница Беларусь–Литва — это самый востребованный маршрут наших трансферов. Ниже собрано всё, что нужно знать перед поездкой в 2026 году: список рабочих КПП, среднее время прохождения, документы, типичные причины отказа и советы из практики.",
    dateISO: "2026-04-15",
    dateModified: "2026-10-16",
    disclaimerBanner: true,
    readingMin: 9,
    category: "Граница",
    tags: ["граница", "Литва", "КПП", "документы"],
    body: [
      { type: "h2", text: "Какие КПП работают в 2026" },
      { type: "info-notice", text: "Проверено по официальным источникам 16 октября 2026 года. Статус КПП и допуск людей и машин проверяются отдельно; оценки времени не гарантируют прохождение." },
      { type: "link", href: "/блог/как-въехать-в-беларусь-на-автомобиле-2026", label: "Новый гайд: в Беларусь на автомобиле и обратно", description: "Санкции на машины, номера BY, право въезда пассажиров, страховка и таможня." },
      { type: "p", text: "Для BY-номеров действует запрет с узкими исключениями. Таможня Литвы описывает, в частности, личную машину гражданина Беларуси, который сам за рулём и имеет литовскую визу или литовский ВНЖ; виза другой страны Шенгена это условие не заменяет. Есть отдельное исключение для граждан ЕС, проживающих в Беларуси. Эти условия не распространяются автоматически на коммерческий трансфер. При выезде из ЕС в Беларусь отдельно проверяются санкции на вывоз автомобиля." },
      { type: "link", href: "https://muitine.lrv.lt/en/news/updated-procedure-for-admitting-cars-with-belarusian-registration-to-enter-lithuania/", label: "Таможня Литвы: условия для автомобилей с номерами BY" },
      { type: "link", href: "https://vrm.lrv.lt/en/news/the-operation-of-the-lavoriskes-and-raigardas-border-crossing-points-will-be-terminated-from-1-march", label: "МВД Литвы: закрытие Лаворишкес и Райгардас с 01.03.2024" },
      { type: "link", href: "https://vsat.lrv.lt/lt/naujienos/atidaromi-salcininku-ir-medininku-pasienio-kontroles-punktai/", label: "VSAT: возобновление работы Мядининкай и Шальчининкай с 20.11.2025" },
      {
        type: "p",
        text:
          "Для автомобильного маршрута рассматривайте Каменный Лог–Мядининкай и Бенякони–Шальчининкай при подтверждённой работе в день поездки. Оба возобновили работу 20 ноября 2025 года. Котловка–Лаворишкес и Привалка–Райгардас закрыты с 1 марта 2024 года; Лоша–Шумскас и Видзы–Твярячюс — с 18 августа 2023 года. Лоша — отдельный переход, не другое название Каменного Лога. Переход пешком и на велосипеде через два оставшихся КПП не разрешён.",
      },
      {
        type: "table",
        headers: ["КПП", "Литовская сторона", "Авто", "Среднее время"],
        rows: [
          ["Каменный Лог", "Мядининкай", "Легковые + автобусы", "2–5 ч"],
          ["Бенякони", "Шальчининкай", "Автотранспорт; разрешения перевозчика проверяются отдельно", "3–6 ч (ориентир)"],
          ["Котловка", "Лаворишкес", "Закрыт", "—"],
          ["Привалка", "Райгардас", "Закрыт", "—"],
          ["Лоша", "Шумскас", "Закрыт", "—"],
          ["Видзы", "Твярячюс", "Закрыт", "—"],
        ],
      },
      { type: "h2", text: "Документы для въезда в Литву" },
      {
        type: "ul",
        items: [
          "Действующий паспорт (срок действия не менее 3 месяцев после выезда из ЕС).",
          "Виза, ВНЖ или право безвизового въезда, если применимо; соблюдение лимита пребывания и национальных ограничений. Виза сама по себе не гарантирует пропуск.",
          "Медицинская страховка с покрытием от 30 000 €.",
          "Подтверждение цели поездки: бронь отеля, билеты, приглашение.",
          "Подтверждение финансового обеспечения (~50 € в день).",
          "Для несовершеннолетних — нотариальное согласие, если ребёнок едет без обоих родителей.",
        ],
      },
      { type: "h2", text: "Сколько по времени стоять на границе" },
      {
        type: "p",
        text:
          "Самое непредсказуемое в маршруте Минск–Вильнюс — именно граница. По данным наших водителей за 2025–2026 год, в будние дни утром и днём время прохождения Каменного Лога — 2,5–4 часа. По пятницам вечером и в воскресенье днём — может вырасти до 6–8 часов. Бенякони обычно медленнее на 1–1,5 часа, но иногда наоборот — зависит от смены.",
      },
      {
        type: "link",
        href: "https://mon.declarant.by/#/zone",
        label: "Электронная очередь в зонах ожидания — mon.declarant.by",
        description: "Лучший источник живой информации об очередях на границе в интернете: официальный сервис мониторинга регистрации транспорта в системе электронной очереди на белорусских КПП, включая Каменный Лог и Бенякони, в реальном времени. Если сайт не открывается — попробуйте зайти через VPN.",
      },
      { type: "liveQueue" },
      { type: "h3", text: "Лайфхаки от наших водителей" },
      {
        type: "ul",
        items: [
          "Самое спокойное время — вторник и среда с 6:00 до 11:00.",
          "В пятницу и воскресенье берите запас 6 часов до вылета сверх обычного времени поездки.",
          "Если граница встала, водитель ComfortLine оперативно меняет маршрут — Каменный Лог ↔ Бенякони отличаются на 40 минут езды.",
          "Заправляйтесь в Беларуси: в Литве топливо дороже на 30–40%.",
          "Готовьте документы заранее в одной папке — это ускоряет проверку.",
        ],
      },
      { type: "h2", text: "Типичные причины отказа во въезде" },
      {
        type: "ul",
        items: [
          "Истёкшая или некорректно оформленная страховка.",
          "Отсутствие подтверждения цели поездки и обратных билетов.",
          "Неверно заполненная декларация о ввозимых товарах.",
          "Подозрение на санкционные товары (см. отдельный гайд).",
          "Истекающий через 1–2 месяца паспорт.",
        ],
      },
      {
        type: "callout",
        text:
          "Если вам важна гарантия, что вы успеете на рейс — закажите трансфер ComfortLine с буфером на границу. Водители знают актуальные очереди в реальном времени и могут оперативно сменить КПП.",
      },
      { type: "h2", id: "official-sources", text: "Официальные источники" },
      { type: "link", href: "https://www.vsat.lt/en", label: "Государственная пограничная охрана Литвы (VSAT) — vsat.lt", description: "Актуальные условия въезда, статус КПП, официальные новости и предупреждения" },
      { type: "link", href: "https://www.lrmuitine.lt/web/guest/fiziniams-asmenims", label: "Таможня Литовской Республики — lrmuitine.lt", description: "Нормы провоза товаров, запреты, таможенное оформление для физических лиц" },
      { type: "link", href: "https://gtk.gov.by", label: "Государственный таможенный комитет Беларуси — gtk.gov.by", description: "Официальный сайт ГТК: нормативная база, правила ввоза и вывоза товаров" },
      { type: "link", href: "https://mon.declarant.by/#/zone", label: "Электронная очередь на КПП — mon.declarant.by", description: "Актуальное количество автомобилей в электронной очереди на Каменном Логе, Бенякони и других КПП — обновляется в реальном времени." },
      { type: "info-notice", text: "Правила въезда, визовые требования и таможенные нормы могут изменяться без уведомления. Всегда проверяйте актуальную информацию на официальных сайтах перед поездкой." },
    ],
    categoryEn: "Border",
    introEn:
      "The Belarus–Lithuania border is our busiest transfer route. Here is everything you need to know for 2026: open checkpoints, average crossing times, required documents, common reasons for refusal and tips from our drivers.",
    bodyEn: [
      { type: "h2", text: "Open Checkpoints in 2026" },
      { type: "info-notice", text: "Checked against official sources on 16 October 2026. Crossing status, passenger admission and vehicle admission are separate checks; journey-time estimates are not guarantees." },
      { type: "link", href: "/blog/driving-to-belarus-by-car-2026-rules-checker", label: "New guide: driving to Belarus and returning to the EU", description: "Vehicle sanctions, BY plates, passenger eligibility, insurance and customs." },
      { type: "p", text: "BY-plated passenger cars are banned with narrow exceptions. Lithuanian Customs describes, among others, a Belarusian citizen's personal car driven by that owner holding a Lithuanian visa or Lithuanian residence permit; another Schengen state's visa does not meet that condition. A separate exception covers EU citizens resident in Belarus. These private-use exceptions do not automatically cover commercial transfers. Driving from the EU to Belarus requires separate vehicle-export sanctions checks." },
      { type: "link", href: "https://muitine.lrv.lt/en/news/updated-procedure-for-admitting-cars-with-belarusian-registration-to-enter-lithuania/", label: "Lithuanian Customs: conditions for BY-plated cars" },
      { type: "link", href: "https://vrm.lrv.lt/en/news/the-operation-of-the-lavoriskes-and-raigardas-border-crossing-points-will-be-terminated-from-1-march", label: "Lithuanian Interior Ministry: Lavoriškės and Raigardas closed from 1 March 2024" },
      { type: "link", href: "https://vsat.lrv.lt/lt/naujienos/atidaromi-salcininku-ir-medininku-pasienio-kontroles-punktai/", label: "VSAT: Medininkai and Šalčininkai reopened on 20 November 2025" },
      {
        type: "p",
        text: "Consider Kamenny Log–Medininkai and Benyakoni–Šalčininkai for road travel, subject to confirmation on your travel date. Both reopened on 20 November 2025. Kotlovka–Lavoriškės and Privalka–Raigardas closed on 1 March 2024; Losha–Šumskas and Vidzy–Tverečius closed on 18 August 2023. Losha is a separate crossing, not another name for Kamenny Log. Pedestrians and cyclists cannot use the two remaining crossings.",
      },
      {
        type: "table",
        headers: ["Checkpoint (BY)", "Lithuanian side", "Vehicles", "Avg. wait time"],
        rows: [
          ["Kamenny Log", "Medininkai", "Cars + buses", "2–5 h"],
          ["Benyakoni", "Šalčininkai", "Motor vehicles; carrier permits checked separately", "3–6 h (estimate)"],
          ["Kotlovka", "Lavoriškės", "Closed", "—"],
          ["Privalka", "Raigardas", "Closed", "—"],
          ["Losha", "Šumskas", "Closed", "—"],
          ["Vidzy", "Tverečius", "Closed", "—"],
        ],
      },
      { type: "h2", text: "Documents for Entry into Lithuania" },
      {
        type: "ul",
        items: [
          "Valid passport (at least 3 months' validity beyond the planned EU exit date).",
          "Visa, residence permit or visa-free entitlement where applicable; compliance with stay limits and national restrictions. A visa alone does not guarantee admission.",
          "Medical insurance with coverage of at least €30,000.",
          "Proof of purpose of trip: hotel booking, tickets, invitation letter.",
          "Proof of sufficient funds (~€50 per day).",
          "For minors travelling without both parents — notarised parental consent.",
        ],
      },
      { type: "h2", text: "How Long Does the Border Take?" },
      {
        type: "p",
        text: "The border is the most unpredictable part of the Minsk–Vilnius journey. Based on our drivers' data for 2025–2026, on weekdays in the morning and afternoon Kamenny Log takes 2.5–4 hours. On Friday evenings and Sunday afternoons it can stretch to 6–8 hours. Benyakoni is typically 1–1.5 hours slower, though shifts occasionally change this.",
      },
      {
        type: "link",
        href: "https://mon.declarant.by/#/zone",
        label: "Electronic queue at waiting zones — mon.declarant.by",
        description: "The best live queue information available online: the official Belarusian customs monitoring service for vehicle registration in the electronic waiting-zone queue at border checkpoints, including Kamenny Log and Benyakoni, updated in real time. If the site doesn't load, try opening it with a VPN.",
      },
      { type: "liveQueue" },
      { type: "h3", text: "Driver Tips" },
      {
        type: "ul",
        items: [
          "Quietest time: Tuesday–Wednesday, 6:00–11:00.",
          "On Fridays and Sundays allow an extra 6-hour buffer on top of normal journey time.",
          "If one crossing is jammed, a ComfortLine driver will switch routes — Kamenny Log and Benyakoni are 40 minutes apart.",
          "Fill up in Belarus: fuel is 30–40% cheaper than in Lithuania.",
          "Keep all documents in one folder — it speeds up the inspection noticeably.",
        ],
      },
      { type: "h2", text: "Common Reasons for Entry Refusal" },
      {
        type: "ul",
        items: [
          "Expired or incorrectly issued insurance.",
          "No confirmation of purpose of trip or return tickets.",
          "Incorrectly completed customs declaration.",
          "Suspected sanctioned goods (see our separate customs guide).",
          "Passport expiring within 1–2 months.",
        ],
      },
      {
        type: "callout",
        text: "If you need to guarantee you make your flight — book a ComfortLine transfer with a border buffer. Our drivers monitor queue lengths in real time and can switch checkpoints instantly.",
      },
      { type: "h2", id: "official-sources", text: "Official Sources" },
      { type: "link", href: "https://www.vsat.lt/en", label: "Lithuanian State Border Guard Service (VSAT) — vsat.lt", description: "Current entry conditions, checkpoint status and official news" },
      { type: "link", href: "https://www.lrmuitine.lt/web/guest/fiziniams-asmenims", label: "Lithuanian Customs — lrmuitine.lt", description: "Allowances, prohibitions and customs procedures for individuals" },
      { type: "link", href: "https://gtk.gov.by", label: "Belarusian State Customs Committee — gtk.gov.by", description: "Official customs regulations and import/export rules" },
      { type: "link", href: "https://mon.declarant.by/#/zone", label: "Live border queue — mon.declarant.by", description: "Current vehicle queue counts at Kamenny Log, Benyakoni and other checkpoints, updated in real time." },
      { type: "info-notice", text: "Entry requirements and customs allowances may change without notice. Always check official sources before travelling." },
    ],
    related: ["какой-кпп-выбрать", "что-нельзя-ввозить-в-ес", "как-добраться-до-аэропорта-вильнюса"],
    ctaRoute: { label: "Заказать трансфер Минск — Вильнюс (VNO)", labelEn: "Book Minsk–Vilnius (VNO) transfer", path: "/трансфер-минск-вильнюс-аэропорт", pathEn: "/minsk-vilnius-airport" },
  },

  {
    slug: "стоимость-трансфер-минск-варшава",
    slugEn: "minsk-warsaw-transfer-price-2026",
    titleEn: "Minsk to Warsaw Transfer Price",
    descriptionEn:
      "Private Minsk–Warsaw transfer prices are provided on request. Learn what affects the quote, what is included, booking terms and BYN settlement details.",
    ogSlug: "blog-stoimost-transfer-minsk-varshava",
    title: "Цена трансфера Минск — Варшава",
    description:
      "Сколько стоит индивидуальный трансфер Минск — Варшава: цены на такси по запросу, что влияет на расчёт, что входит в стоимость и как заказать.",
    intro:
      "Индивидуальный трансфер Минск — Варшава — это поездка на отдельном автомобиле без попутчиков с подачей по адресу. Цена на такси предоставляется по запросу после уточнения деталей поездки.",
    dateISO: "2026-04-10",
    dateModified: "2026-08-04",
    readingMin: 8,
    category: "Цены",
    tags: [
      "цена",
      "Варшава",
      "такси Минск Варшава",
      "индивидуальный трансфер",
      "трансфер Варшава Минск",
    ],
    body: [
      { type: "h2", text: "Цены на такси Минск — Варшава по запросу" },
      {
        type: "table",
        headers: ["Класс", "Вместимость", "Багаж", "Цена"],
        rows: [
          ["Легковой Эконом", "до 3 пассажиров", "до 2 чемоданов", "по запросу"],
          ["Легковой Комфорт", "до 3 пассажиров", "до 2 чемоданов", "по запросу"],
          ["Легковой Бизнес", "до 3 пассажиров", "до 2 чемоданов", "по запросу"],
          ["Легковой VIP", "до 3 пассажиров", "до 2 чемоданов", "по запросу"],
          ["Минивэн Комфорт", "до 8 пассажиров", "до 4 чемоданов", "по запросу"],
          ["Минивэн Бизнес", "до 7 пассажиров", "до 4 чемоданов", "по запросу"],
        ],
      },
      {
        type: "info-notice",
        text:
          "Цена предоставляется по запросу после уточнения класса автомобиля, даты, адресов, пассажиров и багажа. Все расчёты и платежи производятся в белорусских рублях (BYN). Информация на странице не является публичной офертой. Окончательная стоимость, автомобиль и условия поездки должны быть подтверждены водителем ComfortLine до выезда.",
      },
      { type: "h2", text: "Что влияет на цену по запросу" },
      {
        type: "ul",
        items: [
          "Класс и вместимость выбранного автомобиля.",
          "Адрес подачи в Минске и адрес прибытия в Варшаве.",
          "Топливо, дорожные сборы и платные дороги в Польше.",
          "Продолжительность маршрута и ожидание на границе.",
          "Дополнительные остановки, крупный багаж или специальные условия поездки.",
        ],
      },
      {
        type: "p",
        text:
          "После согласования даты, адресов, количества пассажиров и багажа водитель рассчитывает стоимость по запросу в белорусских рублях. После подтверждения цена фиксируется для согласованных условий поездки.",
      },
      { type: "h2", text: "Что может повлиять на стоимость" },
      {
        type: "ul",
        items: [
          "Праздничные и наиболее загруженные даты.",
          "Ночная подача автомобиля.",
          "Срочный заказ незадолго до выезда.",
          "Подача за пределами Минска.",
          "Дополнительные остановки или изменение согласованного маршрута.",
        ],
      },
      { type: "h2", text: "Что входит в стоимость ComfortLine" },
      {
        type: "ul",
        items: [
          "Подача по согласованному адресу.",
          "Отдельный автомобиль без посторонних пассажиров.",
          "Прямая поездка без пересадок.",
          "Помощь водителя с багажом.",
          "Ожидание во время прохождения границы.",
          "Бутилированная вода.",
          "Детское кресло или бустер по предварительному запросу.",
        ],
      },
      {
        type: "link",
        href: "/трансфер-варшава",
        label: "Индивидуальное такси Минск — Варшава",
        description:
          "Посмотрите условия поездки без попутчиков, точки подачи в Варшаве и обратный маршрут Варшава — Минск.",
      },
      {
        type: "callout",
        text:
          "Для расчёта цены по запросу укажите дату, адреса, количество пассажиров и багажа. Водитель ComfortLine согласует окончательную стоимость в BYN до выезда.",
      },
    ],
    categoryEn: "Pricing",
    introEn:
      "A private Minsk–Warsaw transfer provides a dedicated vehicle with no shared passengers and door-to-door pickup. The taxi price is provided on request after the journey details are confirmed.",
    bodyEn: [
      { type: "h2", text: "Private taxi prices from Minsk to Warsaw on request" },
      {
        type: "table",
        headers: ["Class", "Capacity", "Luggage", "Price"],
        rows: [
          ["Economy Sedan", "up to 3 passengers", "up to 2 suitcases", "on request"],
          ["Comfort Sedan", "up to 3 passengers", "up to 2 suitcases", "on request"],
          ["Business Sedan", "up to 3 passengers", "up to 2 suitcases", "on request"],
          ["VIP Sedan", "up to 3 passengers", "up to 2 suitcases", "on request"],
          ["Comfort Minivan", "up to 8 passengers", "up to 4 suitcases", "on request"],
          ["Business Minivan", "up to 7 passengers", "up to 4 suitcases", "on request"],
        ],
      },
      {
        type: "info-notice",
        text:
          "The price is provided on request after confirming the vehicle class, date, addresses, passenger count and luggage. All settlements and payments are made in Belarusian roubles (BYN). The information on this page does not constitute a public offer. The final price, vehicle and journey conditions must be approved by the ComfortLine driver before departure.",
      },
      { type: "h2", text: "What affects the requested price" },
      {
        type: "ul",
        items: [
          "Vehicle class and required capacity.",
          "Pickup address in Minsk and destination address in Warsaw.",
          "Fuel, road tolls and motorway charges in Poland.",
          "Journey duration and waiting time at the border.",
          "Additional stops, oversized luggage or special journey requirements.",
        ],
      },
      {
        type: "p",
        text:
          "After the date, addresses, passenger count and luggage are agreed, the driver calculates the requested price in Belarusian roubles. The confirmed amount is then fixed for the agreed journey conditions.",
      },
      { type: "h2", text: "What can affect the price" },
      {
        type: "ul",
        items: [
          "Public holidays and peak travel dates.",
          "Night-time vehicle pickup.",
          "Urgent bookings made shortly before departure.",
          "Pickup outside Minsk.",
          "Additional stops or changes to the agreed route.",
        ],
      },
      { type: "h2", text: "What is included" },
      {
        type: "ul",
        items: [
          "Pickup from the agreed address.",
          "A dedicated vehicle with no shared passengers.",
          "Direct journey without transfers.",
          "Driver assistance with luggage.",
          "Vehicle waiting during border formalities.",
          "Bottled water.",
          "Child seat or booster by advance request.",
        ],
      },
      {
        type: "link",
        href: "/warsaw-transfer",
        label: "Private taxi from Minsk to Warsaw",
        description:
          "View door-to-door journey conditions, Warsaw pickup points and Warsaw–Minsk return transfers.",
      },
      {
        type: "callout",
        text:
          "To receive a price on request, provide the date, addresses, passenger count and luggage details. The ComfortLine driver will approve the final BYN price before departure.",
      },
    ],
    related: [
      "граница-беларусь-польша",
      "автобус-минск-варшава-модлин-вильнюс",
      "аэропорт-варшавы-вав",
    ],
    ctaRoute: {
      label: "Индивидуальный трансфер Минск — Варшава",
      labelEn: "Private Minsk–Warsaw transfer",
      path: "/трансфер-варшава",
      pathEn: "/warsaw-transfer",
    },
  },

  {
    slug: "что-нельзя-ввозить-в-ес",
    slugEn: "what-not-to-bring-from-belarus-to-eu",
    titleEn: "What Not to Bring from Belarus to the EU",
    descriptionEn: "Current customs rules for entering Lithuania, Poland and Latvia from Belarus: sanctions prohibitions, alcohol, tobacco, fuel, purchases and official sources.",
    ogSlug: "blog-chto-nelzya-vvozit-v-es",
    title: "Что нельзя ввозить из Беларуси в ЕС",
    description:
      "Актуальные правила ввоза из Беларуси в Литву, Польшу и Латвию: санкционные запреты, алкоголь, табак, топливо, покупки и официальные источники.",
    intro:
      "Литва, Польша и Латвия применяют санкционные правила ЕС при въезде из Беларуси. Ниже — актуальные лимиты, запреты, отличия по странам и официальные источники для проверки перед поездкой.",
    dateISO: "2026-05-20",
    dateModified: "2026-07-30",
    readingMin: 15,
    category: "Таможня",
    categoryEn: "Customs",
    tags: ["таможня", "ЕС", "санкции", "запреты", "граница", "Литва", "Польша", "Латвия", "декларирование", "нормы ввоза", "таможенные правила 2026"],
    disclaimerBanner: true,
    citation: [
      "https://www.customs.gov.by/fizicheskim-litsam/besposhlinnyy-vvoz-vyvoz-tovarov-dlya-lichnogo-polzovaniya/",
      "https://www.customs.gov.by/fizicheskim-litsam/vvoz-tovarov-dlya-lichnogo-polzovaniya-s-uplatoy-tamozhennykh-platezhey/",
      "https://europa.eu/youreurope/citizens/travel/carry/alcohol-tobacco-cash/index_en.htm",
      "https://eur-lex.europa.eu/eli/reg/2006/765/oj/eng",
      "https://eur-lex.europa.eu/eli/reg/2026/1846/oj/eng",
      "https://muitine.lrv.lt/en/for-passengers/coming-from-third-countries/",
      "https://podatki.gov.pl/informacje-o-cle/podstawowe-informacje-o-cle/informacje-dla-osob-fizycznych/towary-przywozone-przez-podroznych-zwolnione-z-oplat",
      "https://www.vid.gov.lv/en/excise-goods",
    ],
    body: [
      { type: "editorial-correction", heading: "Обновление редакции от 30 июля 2026 года", text: "Ранее опубликованная таблица показывала общие беспошлинные нормы для въезда в ЕС из третьих стран, но недостаточно учитывала санкционные запреты для товаров белорусского происхождения, дополнительные ограничения Литвы, правила для частых пересечений границы и транспортных экипажей, а также действующие правила для парфюмерии.\n\nТаблица и пояснения ниже были исправлены. Общие беспошлинные нормы применяются только к товарам, ввоз которых не запрещён санкциями или национальным законодательством страны въезда." },
      { type: "info-notice", text: "Информация предназначена для обычных пассажиров, перевозящих товары для личного пользования. Для водителей, транспортных экипажей, приграничных работников и лиц, часто пересекающих границу, могут действовать другие нормы." },
      { type: "link", href: "/блог/как-въехать-в-беларусь-на-автомобиле-2026", label: "Автомобиль — отдельная проверка: новый гайд по поездке в Беларусь", description: "Багажные нормы ниже не разрешают автоматически ввоз или вывоз машины. Проверьте санкции, номера, временный ввоз и обратный маршрут." },
      { type: "h2", text: "Товары, запрещённые к ввозу из Беларуси в ЕС" },
      {
        type: "p",
        text: "Следующие категории запрещены санкциями ЕС или национальным законодательством стран въезда. Наличие общей беспошлинной нормы не отменяет санкционный запрет.",
      },
      {
        type: "ul",
        items: [
          "Спиртные напитки по коду CN 2208 (крепкий алкоголь и ликёры), происходящие из Беларуси или вывозимые из Беларуси — запрещены санкциями ЕС.",
          "Сигареты, сигариллы и сигары (код CN 2402) белорусского происхождения или экспорта — запрещены санкциями ЕС. Литва применяет более широкий национальный запрет на табак и произведённые заменители табака белорусского происхождения.",
          "Нефтепродукты (топливо) белорусского происхождения или экспорта в переносных канистрах — Литва и Латвия: 0 л. К Польше: общий лимит в 10 л не применяется к запрещённому топливу белорусского происхождения.",
          "Военная техника, охотничье оружие, пневматика, газовые баллончики самообороны.",
          "Лекарственные препараты в количестве, превышающем личные нужды на поездку.",
          "Продукты животного происхождения (мясо, мясопродукты, молоко и молочные продукты) — запрещены к ввозу в ЕС из Беларуси как из третьей страны без ветеринарного сертификата. Таможенный орган вправе оценивать конкретный товар, его количество, происхождение, стоимость, упаковку и заявленную цель ввоза.",
          "Свежие фрукты, овощи, растения, семена, саженцы, почва — действуют фитосанитарные ограничения ЕС; таможня оценивает каждый случай.",
          "Товары под санкциями ЕС: отдельные виды стали, древесины, калийных удобрений, техники — перечень определяется актуальным регламентом (последнее изменение: Регламент ЕС 2026/1846 от 23 июля 2026 года).",
        ],
      },
      { type: "h2", id: "eu-entry-allowances", text: "Въезд из Беларуси в ЕС по земле: нормы для обычных пассажиров" },
      {
        type: "p",
        text: "Нормы действительны для совершеннолетних обычных пассажиров при въезде из третьих стран наземным транспортом. Могут применяться сниженные нормы в зависимости от статуса пересекающего границу лица (см. раздел о водителях ниже).",
      },
      {
        type: "callout",
        text: "Значение «0» означает, что обычная беспошлинная норма не применяется к товару, запрещённому из-за его происхождения, страны экспорта или товарной классификации. Если происхождение или код товара неясны, необходимо заранее обратиться в таможенный орган страны въезда.",
      },
      {
        type: "table",
        headers: ["Категория", "Литва", "Польша", "Латвия"],
        rows: [
          ["Сигареты, сигариллы и сигары", "0, если товар происходит из Беларуси или вывозится из Беларуси", "0, если товар происходит из Беларуси или вывозится из Беларуси", "0 для сигарет, сигарилл и сигар из Беларуси"],
          ["Курительный или самокруточный табак", "Табак белорусского происхождения подпадает под более широкий национальный запрет Литвы", "Общая норма — до 50 г, если товар разрешён с учётом происхождения, классификации и санкций", "До 50 г или пропорциональная комбинация разрешённых табачных изделий; обычно не чаще одного раза в 30 дней"],
          ["Крепкий алкоголь и ликёры, CN 2208", "0, если происходит из Беларуси или вывозится из Беларуси", "0, если происходит из Беларуси или вывозится из Беларуси", "0, если происходит из Беларуси или вывозится из Беларуси"],
          ["Алкоголь до 22%", "Общая норма — до 2 л, однако алкоголь белорусского происхождения охватывается более широким национальным запретом Литвы", "До 2 л, только если товар не запрещён; некоторые ликёры относятся к запрещённой категории CN 2208", "До 2 л разрешённых напитков, если они не относятся к запрещённым спиртным напиткам"],
          ["Тихое вино", "До 4 л, только если товар не имеет запрещённого происхождения и не подпадает под национальные ограничения", "До 4 л", "До 4 л натурального негазированного виноградного вина"],
          ["Пиво", "До 16 л, только если товар не имеет запрещённого происхождения и не подпадает под национальные ограничения", "До 16 л", "До 16 л; натурально ферментированное пиво исключено из конкретного латвийского запрета на спиртные напитки"],
          ["Духи и туалетная вода", "Отдельного лимита в миллилитрах нет; стоимость входит в общий лимит товаров", "Отдельного лимита в миллилитрах нет; стоимость входит в общий лимит товаров", "Отдельного лимита в миллилитрах нет; стоимость входит в общий лимит товаров"],
          ["Другие покупки и подарки", "До €300 для обычного пассажира, въезжающего наземным транспортом", "До €300 при въезде наземным транспортом", "До €300 при въезде наземным транспортом"],
          ["Топливо в переносной канистре", "0 л для топлива из Беларуси", "Не применять общий лимит 10 л к запрещённому топливу белорусского происхождения или экспорта", "0 л для топлива из Беларуси"],
          ["Топливо в штатном баке автомобиля", "Допускается с учётом условий и санкционных исключений", "Обычно допускается для собственного использования транспортным средством, с учётом санкций и проверки таможней", "Возможно только для обоснованных основных потребностей поездки; таможня может запросить пояснения или подтверждение"],
        ],
      },
      {
        type: "callout",
        text: "Важно: указанные нормы действуют только для разрешённых товаров некоммерческого характера и не отменяют санкционные запреты. Табачные изделия — 40 сигарет, 20 сигарилл, 10 сигар или 50 г табака — являются альтернативными нормами. Допускается пропорциональное сочетание в пределах 100% общей нормы.\n\nДля алкоголя 1 л напитков крепостью свыше 22% или 2 л напитков крепостью до 22% — альтернативная норма, допускающая пропорциональное сочетание. Дополнительно разрешаются 4 л тихого вина и 16 л пива, если соответствующий товар не подпадает под санкционный или национальный запрет.",
      },
      { type: "h2", text: "Отдельные правила для водителей и транспортных экипажей" },
      {
        type: "p",
        text: "Таблица выше предназначена для обычных пассажиров. Водители, члены экипажей транспортных средств, работники приграничной зоны, жители приграничной зоны и лица, регулярно пересекающие границу, могут подпадать под отдельные или сниженные нормы.",
      },
      {
        type: "ul",
        items: [
          "Литва устанавливает для некоторых членов экипажей регулярных международных маршрутов общий стоимостной лимит €150 и сниженные нормы на алкоголь.",
          "Польша указывает для членов экипажей, приграничных работников и жителей приграничной зоны сниженные нормы: 0,5 л крепкого либо более слабого алкоголя, дополнительно 0,5 л вина и 2 л пива.",
          "В Латвии ввоз отдельных подакцизных товаров для личного пользования обычно допускается не чаще одного раза в 30 дней. При более частом пересечении границы или по требованию таможни может потребоваться письменное заявление.",
          "Классификация водителя частного трансфера как члена экипажа регулярного международного транспорта может зависеть от характера перевозки и решения таможенного органа.",
        ],
      },
      { type: "h2", text: "Европейский союз → Беларусь: беспошлинный ввоз" },
      {
        type: "p",
        text: "Норма беспошлинного ввоза зависит от способа пересечения границы. Для наземного транспорта (машина, автобус) и пешего перехода — то есть для всех пассажиров ComfortLine — с 1 апреля 2024 года действует сниженная норма: стоимость товаров не выше 500 € и вес не более 25 кг на одного взрослого пассажира.",
      },
      {
        type: "table",
        headers: ["Способ ввоза", "Стоимость", "Вес"],
        rows: [
          ["Наземный транспорт / пешком (с 1 апреля 2024)", "до 500 €", "до 25 кг"],
          ["Воздушный транспорт (самолёт)", "до 10 000 €", "до 50 кг"],
          ["Доставка перевозчиком (не лично)", "до 200 €", "до 31 кг"],
          ["Международные почтовые отправления", "до 200 €", "до 31 кг (брутто)"],
        ],
      },
      {
        type: "p",
        text: "Табак и табачные изделия — отдельная норма, одинаковая для всех способов ввоза: 200 сигарет, или 50 сигар (сигарилл), или 200 стиков нагреваемого табака, или 250 г табака (либо ассорти этих товаров общим весом не более 250 г). Алкогольные напитки крепостью более 0,5% — не более 3 л при ввозе в багаже. Нормы на алкоголь и табак действуют для лиц старше 18 лет.",
      },
      {
        type: "p",
        text: "Сверх этих лимитов ввоз облагается таможенными платежами: для товаров в багаже наземным транспортом — 30% от суммы превышения стоимости, но не менее 4 € за каждый кг превышения по весу. Для товаров, доставленных перевозчиком или почтой, ставка ниже — 15% от превышения, но не менее 2 € за кг. Алкоголь в количестве от 3 до 5 л облагается по ставке 10 € за литр сверх нормы 3 л; этиловый спирт (до 5 л) — 22 € за литр. Товары с признаками коммерческой партии (оптовые количества, несколько одинаковых единиц) декларируются и оформляются отдельно как товары не для личного пользования.",
      },
      {
        type: "link",
        href: "https://www.customs.gov.by/fizicheskim-litsam/besposhlinnyy-vvoz-vyvoz-tovarov-dlya-lichnogo-polzovaniya/",
        label: "ГТК Беларуси — беспошлинный ввоз/вывоз товаров для личного пользования",
        description: "Официальные стоимостные, весовые и количественные нормы беспошлинного ввоза и вывоза товаров физическими лицами",
      },
      {
        type: "link",
        href: "https://www.customs.gov.by/fizicheskim-litsam/vvoz-tovarov-dlya-lichnogo-polzovaniya-s-uplatoy-tamozhennykh-platezhey/",
        label: "ГТК Беларуси — ввоз товаров с уплатой таможенных платежей",
        description: "Официальные ставки таможенных пошлин и налогов при превышении беспошлинных норм ввоза",
      },
      { type: "h2", text: "Наличные деньги и декларирование" },
      {
        type: "p",
        text: "Правила вывоза наличных из Беларуси и ввоза в ЕС регулируются независимо — белорусской таможней (ГТК) и таможней страны въезда в ЕС.",
      },
      { type: "h3", text: "Вывоз наличных из Беларуси" },
      {
        type: "ul",
        items: [
          "До 10 000 USD (или эквивалент в любой валюте) — без декларации.",
          "Свыше 10 000 USD — обязательная письменная таможенная декларация при пересечении белорусской границы.",
          "Незадекларированные суммы сверх лимита подлежат взысканию в соответствии с законодательством Беларуси.",
          "Ювелирные украшения для личного пользования, банковские карты и дорожные чеки к денежному лимиту не относятся.",
        ],
      },
      { type: "h3", text: "Ввоз наличных в ЕС (Литва, Польша, Латвия)" },
      {
        type: "ul",
        items: [
          "До 10 000 € (или эквивалент) — без декларации на стороне ЕС.",
          "Свыше 10 000 € — обязательная декларация EU Cash Declaration при въезде в зону ЕС.",
          "Декларация подаётся таможне страны въезда (литовской, польской или латвийской).",
          "Незадекларированные суммы сверх лимита могут быть задержаны и стать предметом административного или уголовного производства.",
        ],
      },
      {
        type: "link",
        href: "https://www.customs.by/deklarirovaniye",
        label: "ГТК Беларуси — официальная страница: правила декларирования",
        description: "Актуальные нормы вывоза наличных, ювелирных изделий и товаров физическими лицами при выезде из Беларуси",
      },
      { type: "h2", text: "Международные посылки и товары из интернет-магазинов" },
      {
        type: "p",
        text: "Если вы везёте посылку, полученную через белорусскую почту или СДЭК, либо товары, заказанные на OZON/Wildberries/AliExpress, таможня применяет отдельные правила контроля международных почтовых отправлений.",
      },
      {
        type: "ul",
        items: [
          "Товары из ЕАЭС (Россия, Казахстан и др.) при пересечении белорусско-европейской границы рассматриваются как товары из третьей страны.",
          "Норма беспошлинного ввоза в ЕС — до 150 € на посылку, свыше — таможенная пошлина и НДС страны въезда.",
          "Товары с коммерческими признаками (несколько одинаковых единиц, упаковка с ценниками оптом) — таможня вправе переквалифицировать как коммерческий груз.",
          "Правила ГТК РБ о контроле товаров, следующих в адрес физических лиц из ЕАЭС, описаны на официальном сайте таможни.",
        ],
      },
      {
        type: "link",
        href: "https://customs.gov.by/participants-ved/perevozchikam/informatsiya-o-provedenii-kontrolya-mezhdunarodnykh-pochtovykh-otpravleniy-i-tovarov-sleduyushchikh-/",
        label: "ГТК РБ — контроль международных почтовых отправлений и товаров физических лиц",
        description: "Официальная информация о порядке таможенного контроля посылок и товаров, ввозимых физическими лицами из государств ЕАЭС",
      },
      { type: "h2", text: "Что проверяют на границе Беларусь–ЕС" },
      {
        type: "ul",
        items: [
          "Топливные баки — пограничники Литвы и Латвии могут запросить открыть бак для проверки.",
          "Сигареты и табак — пограничники проверяют акцизные марки и считают количество.",
          "Алкоголь — проверяют наличие акцизных марок, сверяют количество.",
          "Электроника и покупки — могут запросить чеки или выписки для оценки стоимости относительно общей нормы ввоза.",
          "Продукты питания — холодильники и сумки с едой осматриваются на наличие запрещённых категорий.",
          "Содержимое багажника и чемоданов — рентгеновский сканер, иногда ручной досмотр.",
        ],
      },
      { type: "h2", text: "Что будет за нарушение таможенных правил" },
      {
        type: "table",
        headers: ["Нарушение", "Последствие"],
        rows: [
          ["Сигареты и табак, запрещённые из-за происхождения или сверх нормы", "Конфискация"],
          ["Алкоголь сверх лимита или запрещённого происхождения", "Конфискация + возможный штраф"],
          ["Незадекларированные наличные свыше 10 000 €", "Задержание суммы и административное/уголовное производство"],
          ["Запрещённые продукты питания", "Конфискация на месте"],
          ["Топливо в канистре из Беларуси (Литва/Латвия)", "Конфискация канистры с топливом"],
          ["Товары с признаками коммерческой партии без декларации", "Задержание товара, оформление, возможная пошлина"],
        ],
      },
      { type: "h2", text: "Частые вопросы о таможне на границе Беларусь–ЕС" },
      { type: "h3", text: "Можно ли везти домашнюю еду в Литву или Польшу?" },
      {
        type: "p",
        text: "Продукты животного происхождения (мясо, молочное, яйца) запрещены к ввозу в ЕС из Беларуси. В отношении других продуктов питания таможенный орган вправе оценивать конкретный товар, его количество, происхождение, стоимость, упаковку и заявленную цель ввоза. При сомнениях необходимо заранее обратиться в таможню страны въезда.",
      },
      { type: "h3", text: "Считаются ли сигареты в кармане отдельно от сигарет в чемодане?" },
      {
        type: "p",
        text: "Нет, лимит суммарный на человека. 40 сигарет (при условии, что они разрешены к ввозу по происхождению) — это 2 пачки суммарно, независимо от того, где они находятся.",
      },
      { type: "h3", text: "Нужно ли декларировать ноутбук или телефон?" },
      {
        type: "p",
        text: "Новая электроника, подарки и другие покупки учитываются в рамках общей стоимостной нормы (до 300 € при въезде наземным транспортом). Таможня вправе оценивать, предназначены ли товары для личного или коммерческого использования. При сомнениях рекомендуется заранее проконсультироваться с таможней страны въезда.",
      },
      { type: "h3", text: "Есть ли разница между Каменным Логом, Терехово и Брузги?" },
      {
        type: "p",
        text: "Общие нормы ЕС применяются на всех КПП, однако конкретные процедуры и интенсивность проверок могут различаться. Выбор КПП влияет на время ожидания. Для уточнения требований конкретного пункта пропуска рекомендуется обращаться в таможенную службу соответствующей страны.",
      },
      {
        type: "callout",
        text: "Правила меняются: санкционные пакеты ЕС обновляются несколько раз в год. Перед поездкой проверяйте актуальные нормы на официальных сайтах таможни Беларуси и страны въезда.",
      },
      { type: "h2", id: "official-sources", text: "Официальные источники и дата проверки" },
      { type: "h3", text: "Беларусь" },
      {
        type: "link",
        href: "https://www.customs.gov.by/fizicheskim-litsam/besposhlinnyy-vvoz-vyvoz-tovarov-dlya-lichnogo-polzovaniya/",
        label: "Государственный таможенный комитет Республики Беларусь — беспошлинный ввоз и вывоз товаров для личного пользования",
      },
      {
        type: "link",
        href: "https://www.customs.gov.by/fizicheskim-litsam/vvoz-tovarov-dlya-lichnogo-polzovaniya-s-uplatoy-tamozhennykh-platezhey/",
        label: "Государственный таможенный комитет Республики Беларусь — ввоз товаров с уплатой таможенных платежей",
      },
      { type: "h3", text: "Европейский союз" },
      {
        type: "link",
        href: "https://europa.eu/youreurope/citizens/travel/carry/alcohol-tobacco-cash/index_en.htm",
        label: "Your Europe — правила перевозки алкоголя, табака и других товаров",
        description: "Официальный портал ЕС",
      },
      {
        type: "link",
        href: "https://trade.ec.europa.eu/access-to-markets/en/content/guide-import-goods",
        label: "European Commission Access2Markets — руководство по импорту товаров",
      },
      {
        type: "link",
        href: "https://eur-lex.europa.eu/eli/reg/2006/765/oj/eng",
        label: "Council Regulation (EC) No 765/2006 — restrictive measures concerning Belarus",
        description: "EUR-Lex — официальный текст",
      },
      {
        type: "link",
        href: "https://eur-lex.europa.eu/eli/reg/2026/1846/oj/eng",
        label: "Council Regulation (EU) 2026/1846 of 23 July 2026 — latest amendment",
        description: "EUR-Lex — официальный текст",
      },
      { type: "h3", text: "Литва" },
      {
        type: "link",
        href: "https://muitine.lrv.lt/en/for-passengers/coming-from-third-countries/",
        label: "Lietuvos Respublikos muitinė — Coming from third countries",
        description: "Официальный сайт Таможни Литовской Республики",
      },
      { type: "h3", text: "Польша" },
      {
        type: "link",
        href: "https://podatki.gov.pl/informacje-o-cle/podstawowe-informacje-o-cle/informacje-dla-osob-fizycznych/towary-przywozone-przez-podroznych-zwolnione-z-oplat",
        label: "Ministerstwo Finansów / Krajowa Administracja Skarbowa — товары, ввозимые путешественниками без пошлин",
        description: "Официальный сайт налоговой администрации Польши",
      },
      { type: "h3", text: "Латвия" },
      {
        type: "link",
        href: "https://www.vid.gov.lv/en/excise-goods",
        label: "Valsts ieņēmumu dienests — Excise goods",
        description: "Официальный сайт Службы государственных доходов Латвии",
      },
      {
        type: "callout",
        text: "Информация проверена: 30 июля 2026 года. Следующая редакционная проверка: 30 января 2027 года.\n\nПравила могли измениться после указанной даты. Перед выездом откройте официальные источники и проверьте требования повторно.",
      },
    ],
    introEn:
      "Lithuania, Poland and Latvia enforce EU sanctions rules on entry from Belarus. Below are current allowances, prohibitions, country-by-country differences and official sources to check before travel.",
    bodyEn: [
      { type: "editorial-correction", heading: "Editorial correction, 30 July 2026", text: "The previously published table showed general EU duty-free allowances for travellers arriving from third countries, but did not adequately reflect the sanctions-based prohibitions for goods of Belarusian origin, Lithuania's additional national restrictions, rules for frequent border crossings and transport crews, or the current rules for perfume and eau de toilette.\n\nThe table and explanations below have been corrected. General duty-free allowances apply only to goods whose import is not prohibited by sanctions or the national legislation of the country of entry." },
      { type: "info-notice", text: "The information is intended for ordinary passengers carrying goods for personal use. Different rules may apply to drivers, transport crew members, border workers and persons who cross the border frequently." },
      { type: "link", href: "/blog/driving-to-belarus-by-car-2026-rules-checker", label: "The car needs a separate check: the new Belarus driving guide", description: "The baggage allowances below do not authorise vehicle import or export. Check sanctions, registration, temporary admission and the return route separately." },
      { type: "h2", text: "Goods Prohibited from Belarus into the EU" },
      {
        type: "p",
        text: "The following categories are prohibited under EU sanctions or the national legislation of the entry country. A general duty-free allowance does not override a sanctions prohibition.",
      },
      {
        type: "ul",
        items: [
          "Spirit drinks under CN 2208 (spirits and liqueurs) originating in or exported from Belarus — prohibited under EU sanctions.",
          "Cigarettes, cigarillos and cigars (CN 2402) of Belarusian origin or export — prohibited under EU sanctions. Lithuania applies a broader national prohibition covering Belarus-origin tobacco and manufactured tobacco substitutes.",
          "Petroleum products (fuel) of Belarusian origin or export in portable containers — Lithuania and Latvia: 0 l. For Poland: the general 10 l allowance does not apply to prohibited fuel of Belarusian origin.",
          "Military equipment, hunting weapons, air guns, self-defence gas sprays.",
          "Medicinal products in quantities exceeding personal needs for the trip.",
          "Animal-origin food (meat, meat products, milk and dairy products) — prohibited from import into the EU from Belarus as a third country without a veterinary certificate. Customs may assess a specific product on its quantity, origin, value, packaging and declared purpose.",
          "Fresh fruit, vegetables, plants, seeds, seedlings, soil — EU phytosanitary restrictions apply; customs assesses each case.",
          "EU-sanctioned goods: certain types of steel, timber, potassium fertilisers, machinery — the list is set by the current EU regulation (latest amendment: Council Regulation (EU) 2026/1846 of 23 July 2026).",
        ],
      },
      { type: "h2", id: "eu-entry-allowances", text: "Entry from Belarus into the EU by land: allowances for ordinary passengers" },
      {
        type: "p",
        text: "Allowances apply to adult ordinary passengers entering from third countries by land. Reduced or different allowances may apply depending on the traveller's status (see the section on drivers below).",
      },
      {
        type: "callout",
        text: "A value of '0' means that the standard duty-free allowance does not apply to a product prohibited because of its origin, country of export or tariff classification. If the origin or product code is unclear, contact the customs authority of the entry country before travelling.",
      },
      {
        type: "table",
        headers: ["Category", "Lithuania", "Poland", "Latvia"],
        rows: [
          ["Cigarettes, cigarillos and cigars", "0 if goods originate in or are exported from Belarus", "0 if goods originate in or are exported from Belarus", "0 for cigarettes, cigarillos and cigars from Belarus"],
          ["Smoking or hand-rolling tobacco", "Belarus-origin tobacco is covered by Lithuania's broader national prohibition", "General allowance — up to 50 g, if the goods are permitted having regard to origin, classification and sanctions", "Up to 50 g or a proportional combination of permitted tobacco products; normally not more than once every 30 days"],
          ["Spirits and liqueurs, CN 2208", "0 if originating in or exported from Belarus", "0 if originating in or exported from Belarus", "0 if originating in or exported from Belarus"],
          ["Alcohol up to 22% ABV", "General allowance — up to 2 l, however Belarus-origin alcohol is covered by Lithuania's broader national prohibition", "Up to 2 l, only if the goods are not prohibited; some liqueurs fall under the prohibited CN 2208 category", "Up to 2 l of permitted beverages, provided they are not prohibited spirits"],
          ["Still wine", "Up to 4 l, only if the goods do not have a prohibited origin and are not subject to national restrictions", "Up to 4 l", "Up to 4 l of naturally fermented still grape wine"],
          ["Beer", "Up to 16 l, only if the goods do not have a prohibited origin and are not subject to national restrictions", "Up to 16 l", "Up to 16 l; naturally fermented beer is excluded from Latvia's specific prohibition on spirit drinks"],
          ["Perfume and eau de toilette", "No separate millilitre allowance; value counts towards the general goods allowance", "No separate millilitre allowance; value counts towards the general goods allowance", "No separate millilitre allowance; value counts towards the general goods allowance"],
          ["Other purchases and gifts", "Up to €300 for an ordinary passenger arriving by land", "Up to €300 when arriving by land", "Up to €300 when arriving by land"],
          ["Fuel in a portable container", "0 l for Belarus-origin fuel", "Do not apply the general 10 l allowance to prohibited fuel of Belarusian origin or export", "0 l for Belarus-origin fuel"],
          ["Fuel in the vehicle's standard tank", "Permitted subject to conditions and sanctions exceptions", "Normally permitted for the vehicle's own use, subject to sanctions and customs assessment", "Permitted only for legitimate essential travel needs; customs may request an explanation or supporting evidence"],
        ],
      },
      {
        type: "callout",
        text: "Important: these allowances apply only to permitted goods of a non-commercial nature and do not override sanctions prohibitions. The tobacco figures — 40 cigarettes, 20 cigarillos, 10 cigars or 50 g of smoking tobacco — are alternative allowances. Proportional combinations within 100% of the total allowance are permitted.\n\nFor alcohol, 1 l of drinks above 22% ABV or 2 l of drinks up to 22% ABV is an alternative allowance and may be used in proportional combination. An additional 4 l of still wine and 16 l of beer are permitted, provided the product is not subject to a sanctions or national prohibition.",
      },
      { type: "h2", text: "Separate Rules for Drivers and Transport Crews" },
      {
        type: "p",
        text: "The table above is for ordinary passengers. Drivers, transport crew members, border workers, border-area residents and persons who cross the border regularly may be subject to separate or reduced allowances.",
      },
      {
        type: "ul",
        items: [
          "Lithuania sets a general value allowance of €150 and reduced alcohol allowances for certain crew members on regular international routes.",
          "Poland states reduced allowances for crew members, border workers and border-area residents: 0.5 l of spirits or lower-alcohol equivalent, plus 0.5 l of wine and 2 l of beer.",
          "In Latvia, import of certain excisable goods for personal use is normally permitted no more than once every 30 days. A written declaration may be required for more frequent crossings or at customs' request.",
          "Whether a private-transfer driver qualifies as a crew member of a regular international service may depend on the nature of the journey and the decision of the customs authority.",
        ],
      },
      { type: "h2", text: "European Union → Belarus: duty-free import" },
      {
        type: "p",
        text: "The duty-free allowance depends on how you cross the border. For land transport (car, bus) or on foot — which covers all ComfortLine passengers — a reduced allowance has applied since 1 April 2024: goods worth no more than €500 and weighing no more than 25 kg per adult passenger.",
      },
      {
        type: "table",
        headers: ["Mode of entry", "Value", "Weight"],
        rows: [
          ["Land transport / on foot (since 1 April 2024)", "up to €500", "up to 25 kg"],
          ["Air transport (flight)", "up to €10,000", "up to 50 kg"],
          ["Delivered by carrier (not carried in person)", "up to €200", "up to 31 kg"],
          ["International postal items", "up to €200", "up to 31 kg (gross)"],
        ],
      },
      {
        type: "p",
        text: "Tobacco products have a separate allowance that is the same for every mode of entry: 200 cigarettes, or 50 cigars (cigarillos), or 200 heated-tobacco sticks, or 250 g of tobacco (or an assortment totalling no more than 250 g). Alcoholic drinks over 0.5% ABV — no more than 3 l when carried in baggage. Alcohol and tobacco allowances apply to travellers aged 18 and over.",
      },
      {
        type: "p",
        text: "Above these limits, customs duty applies: for goods in baggage entering by land, the rate is 30% of the excess value, but no less than €4 per kilogram over the weight limit. For goods delivered by a carrier or by post, the rate is lower — 15% of the excess, but no less than €2 per kilogram. Alcohol between 3 and 5 l is charged at €10 per litre over the 3 l allowance; ethyl spirit (up to 5 l) is charged at €22 per litre. Goods showing signs of a commercial shipment (wholesale quantities, multiple identical items) are declared and processed separately.",
      },
      {
        type: "link",
        href: "https://www.customs.gov.by/fizicheskim-litsam/besposhlinnyy-vvoz-vyvoz-tovarov-dlya-lichnogo-polzovaniya/",
        label: "Belarus State Customs Committee — duty-free import/export of goods for personal use",
        description: "Official value, weight and quantity allowances for duty-free import and export of goods by individuals",
      },
      {
        type: "link",
        href: "https://www.customs.gov.by/fizicheskim-litsam/vvoz-tovarov-dlya-lichnogo-polzovaniya-s-uplatoy-tamozhennykh-platezhey/",
        label: "Belarus State Customs Committee — import of goods with payment of customs duties",
        description: "Official customs duty and tax rates for goods that exceed the duty-free import allowances",
      },
      { type: "h2", text: "Cash and Declaration Requirements" },
      {
        type: "p",
        text: "Rules on exporting cash from Belarus and importing it into the EU are regulated independently — by Belarusian customs (SCC) and by the customs authority of the EU entry country.",
      },
      { type: "h3", text: "Exporting Cash from Belarus" },
      {
        type: "ul",
        items: [
          "Up to USD 10,000 (or equivalent in any currency) — no declaration required.",
          "Over USD 10,000 — mandatory written customs declaration at the Belarusian border.",
          "Undeclared amounts above the limit may be subject to enforcement action under Belarusian law.",
          "Personal jewellery, bank cards and traveller's cheques do not count towards the cash limit.",
        ],
      },
      { type: "h3", text: "Importing Cash into the EU (Lithuania, Poland, Latvia)" },
      {
        type: "ul",
        items: [
          "Up to €10,000 (or equivalent) — no declaration required on the EU side.",
          "Over €10,000 — mandatory EU Cash Declaration upon entering the EU zone.",
          "The declaration is submitted to the customs of the entry country (Lithuanian, Polish or Latvian).",
          "Undeclared amounts above the limit may be detained and become subject to administrative or criminal proceedings.",
        ],
      },
      {
        type: "link",
        href: "https://www.customs.by/deklarirovaniye",
        label: "Belarusian State Customs Committee — official declaration rules",
        description: "Current limits on exporting cash, jewellery and goods for private individuals leaving Belarus",
      },
      { type: "h2", text: "Parcels and Online Shopping Items" },
      {
        type: "p",
        text: "If you are carrying a parcel from a Belarusian courier service or goods ordered online (OZON, Wildberries, AliExpress), customs applies separate rules for international postal items.",
      },
      {
        type: "ul",
        items: [
          "Goods from EAEU countries (Russia, Kazakhstan, etc.) are treated as goods from a third country at the Belarus–EU border.",
          "EU duty-free import threshold — up to €150 per parcel; above that, customs duty and VAT of the entry country apply.",
          "Goods with commercial characteristics (multiple identical units, wholesale retail packaging) may be reclassified as commercial cargo.",
          "Belarusian SCC rules on controlling goods sent to private individuals from the EAEU are on the official customs website.",
        ],
      },
      {
        type: "link",
        href: "https://customs.gov.by/participants-ved/perevozchikam/informatsiya-o-provedenii-kontrolya-mezhdunarodnykh-pochtovykh-otpravleniy-i-tovarov-sleduyushchikh-/",
        label: "Belarusian SCC — control of international postal items and personal goods",
        description: "Official information on customs procedures for parcels and goods imported by private individuals from EAEU states",
      },
      { type: "h2", text: "What Border Guards Check at Belarus–EU Crossings" },
      {
        type: "ul",
        items: [
          "Fuel tanks — Lithuanian and Latvian border guards may ask you to open the tank for inspection.",
          "Cigarettes and tobacco — border guards check excise stamps and count quantities.",
          "Alcohol — excise stamps are checked and quantities verified.",
          "Electronics and purchases — receipts or bank statements may be requested to assess value against the general goods allowance.",
          "Food — coolers and food bags are inspected for prohibited categories.",
          "Boot and luggage — X-ray scanner, sometimes manual search.",
        ],
      },
      { type: "h2", text: "Consequences of Customs Violations" },
      {
        type: "table",
        headers: ["Violation", "Consequence"],
        rows: [
          ["Cigarettes and tobacco prohibited due to origin or above the limit", "Confiscation"],
          ["Alcohol above the limit or of prohibited origin", "Confiscation + possible fine"],
          ["Undeclared cash over €10,000", "Amount detained; administrative or criminal proceedings"],
          ["Prohibited food products", "On-the-spot confiscation"],
          ["Belarus-origin fuel in a portable container (Lithuania/Latvia)", "Confiscation of container and fuel"],
          ["Goods showing commercial characteristics without declaration", "Goods detained; customs processing; possible duty"],
        ],
      },
      { type: "h2", text: "Frequently Asked Questions" },
      { type: "h3", text: "Can I bring home-cooked food into Lithuania or Poland?" },
      {
        type: "p",
        text: "Animal-origin products (meat, dairy, eggs) are prohibited from import into the EU from Belarus. For other food products, customs may assess the specific item on its quantity, origin, value, packaging and declared purpose. If in doubt, contact the customs authority of your entry country before travelling.",
      },
      { type: "h3", text: "Do cigarettes in my pocket count separately from those in my suitcase?" },
      {
        type: "p",
        text: "No, the limit is total per person. 40 cigarettes (provided they are permitted having regard to origin) means 2 packs in total, regardless of where they are.",
      },
      { type: "h3", text: "Do I need to declare a laptop or phone?" },
      {
        type: "p",
        text: "New electronics, gifts and other purchases normally count towards the general value allowance (up to €300 when entering by land). Customs may assess whether goods are for personal or commercial use. If you are unsure whether a specific item falls within the allowance, contact the customs authority of your entry country.",
      },
      { type: "h3", text: "Is there a difference between Kamenny Log, Terekhovka and Bruzgi?" },
      {
        type: "p",
        text: "General EU rules apply at all checkpoints, but specific procedures and inspection intensity may vary. Your choice of crossing affects waiting time. To clarify requirements at a specific checkpoint, contact the customs service of the relevant country.",
      },
      {
        type: "callout",
        text: "Rules change: EU sanctions packages are updated several times a year. Check the current limits on the official customs websites of Belarus and your entry country before every trip.",
      },
      { type: "h2", id: "official-sources", text: "Official Sources and Verification Date" },
      { type: "h3", text: "Belarus" },
      {
        type: "link",
        href: "https://www.customs.gov.by/fizicheskim-litsam/besposhlinnyy-vvoz-vyvoz-tovarov-dlya-lichnogo-polzovaniya/",
        label: "State Customs Committee of the Republic of Belarus — duty-free import and export of goods for personal use",
      },
      {
        type: "link",
        href: "https://www.customs.gov.by/fizicheskim-litsam/vvoz-tovarov-dlya-lichnogo-polzovaniya-s-uplatoy-tamozhennykh-platezhey/",
        label: "State Customs Committee of the Republic of Belarus — import of goods with payment of customs duties",
      },
      { type: "h3", text: "European Union" },
      {
        type: "link",
        href: "https://europa.eu/youreurope/citizens/travel/carry/alcohol-tobacco-cash/index_en.htm",
        label: "Your Europe — alcohol, tobacco and other goods",
        description: "Official EU citizens' portal",
      },
      {
        type: "link",
        href: "https://trade.ec.europa.eu/access-to-markets/en/content/guide-import-goods",
        label: "European Commission Access2Markets — guide to importing goods",
      },
      {
        type: "link",
        href: "https://eur-lex.europa.eu/eli/reg/2006/765/oj/eng",
        label: "Council Regulation (EC) No 765/2006 — restrictive measures concerning Belarus",
        description: "EUR-Lex — official text",
      },
      {
        type: "link",
        href: "https://eur-lex.europa.eu/eli/reg/2026/1846/oj/eng",
        label: "Council Regulation (EU) 2026/1846 of 23 July 2026 — latest amendment",
        description: "EUR-Lex — official text",
      },
      { type: "h3", text: "Lithuania" },
      {
        type: "link",
        href: "https://muitine.lrv.lt/en/for-passengers/coming-from-third-countries/",
        label: "Lietuvos Respublikos muitinė — Coming from third countries",
        description: "Official website of Lithuanian Customs",
      },
      { type: "h3", text: "Poland" },
      {
        type: "link",
        href: "https://podatki.gov.pl/informacje-o-cle/podstawowe-informacje-o-cle/informacje-dla-osob-fizycznych/towary-przywozone-przez-podroznych-zwolnione-z-oplat",
        label: "Ministerstwo Finansów / Krajowa Administracja Skarbowa — goods brought by travellers free of duty",
        description: "Official Polish tax administration website",
      },
      { type: "h3", text: "Latvia" },
      {
        type: "link",
        href: "https://www.vid.gov.lv/en/excise-goods",
        label: "Valsts ieņēmumu dienests — Excise goods",
        description: "Official website of the State Revenue Service of Latvia",
      },
      {
        type: "callout",
        text: "Information verified: 30 July 2026. Next editorial review: 30 January 2027.\n\nRules may have changed since this date. Before travelling, open the official sources above and verify the current requirements.",
      },
    ],
    related: ["eu-belarus-shopping-by-car", "граница-беларусь-литва", "какой-кпп-выбрать", "граница-беларусь-польша"],
    ctaRoute: { label: "Заказать трансфер в Литву, Польшу или Латвию", labelEn: "Book a transfer to Lithuania, Poland or Latvia", path: "/трансфер-минск-вильнюс-аэропорт", pathEn: "/minsk-vilnius-airport" },
  },

  {
    slug: "какой-кпп-выбрать",
    slugEn: "which-belarus-border-crossing-to-choose",
    titleEn: "Belarus Border Crossings: Kamenny Log",
    descriptionEn: "Compare Kamenny Log and Benyakoni for Belarus–Lithuania travel in 2026. Kotlovka is closed, not a backup crossing. Check operating status before departure.",
    ogSlug: "blog-kakoy-kpp-vybrat",
    title: "КПП Литвы: Каменный Лог и Бенякони",
    description:
      "Сравнение КПП Каменный Лог и Бенякони для поездок в Литву в 2026. Котловка закрыта и не является запасным вариантом. Проверяйте работу КПП перед выездом.",
    intro:
      "Для поездки из Минска в Литву сравнивайте Каменный Лог и Бенякони, предварительно проверив их работу. Котловка закрыта и не является запасным вариантом. Ниже — особенности маршрутов и ориентиры по ожиданию, а не гарантия времени прохождения.",
    dateISO: "2026-03-28",
    dateModified: "2026-10-16",
    disclaimerBanner: true,
    readingMin: 6,
    category: "Граница",
    tags: ["КПП", "Литва", "Каменный Лог", "Бенякони"],
    body: [
      { type: "h2", text: "Каменный Лог — основной выбор" },
      {
        type: "p",
        text:
          "Главный КПП по объёму трафика. Хорошая инфраструктура, две полосы для легкового транспорта, есть зона для оплаты сборов, кафе и туалеты с обеих сторон. Расположен на трассе М7 Минск–Вильнюс. Литовская сторона называется Мядининкай (Medininkai).",
      },
      {
        type: "ul",
        items: [
          "Плюсы: быстрая обработка, развитая инфраструктура, удобная трасса.",
          "Минусы: самый загруженный КПП, в часы пик стоит до 6 часов.",
          "Лучшее время: вт–ср, 6:00–11:00.",
        ],
      },
      { type: "h2", text: "Бенякони — резервный вариант" },
      {
        type: "p",
        text:
          "Запасной КПП в 60 км южнее Каменного Лога, литовская сторона — Шальчининкай (Šalčininkai). Меньше потока, но и меньше пропускная способность. Ехать дальше — крюк +40 минут до Вильнюса.",
      },
      {
        type: "ul",
        items: [
          "Плюсы: меньше очередь в выходные.",
          "Минусы: дольше путь до Вильнюса (~140 км вместо 100 км от Каменного Лога), скромная инфраструктура.",
          "Когда выбирать: пятница вечер и воскресенье день, когда Каменный Лог встал.",
        ],
      },
      { type: "h2", text: "Котловка — закрыта" },
      { type: "link", href: "https://vrm.lrv.lt/en/news/the-operation-of-the-lavoriskes-and-raigardas-border-crossing-points-will-be-terminated-from-1-march", label: "МВД Литвы: решение о закрытии с 1 марта 2024 года", description: "Проверено 16 октября 2026 года; Котловка не доступна как запасной КПП." },
      { type: "link", href: "/блог/как-въехать-в-беларусь-на-автомобиле-2026", label: "Проверьте не только КПП: новый гайд для поездки на машине", description: "Открытый переход не гарантирует допуск пассажиров или автомобиля; отдельные правила для номеров BY, виз и санкций." },
      {
        type: "p",
        text:
          "Котловка–Лаворишкес закрыт с 1 марта 2024 года решением Литвы, как и Привалка–Райгардас. Это не переход с ограниченным режимом для частных машин. Не направляйтесь туда без нового официального сообщения об открытии. Каменный Лог и Бенякони возобновили работу 20 ноября 2025 года; временные закрытия возможны.",
      },
      { type: "h2", text: "Как выбрать КПП в день поездки" },
      {
        type: "ol",
        items: [
          "Зайдите на сайт ГТК Беларуси и проверьте текущее количество авто в очереди.",
          "Сравните: если на Каменном Логе >150 авто, рассмотрите Бенякони.",
          "Сравните очереди, время объезда и статус обоих КПП: день недели не гарантирует более быстрого прохождения.",
          "Проверьте VSAT (литовская сторона) — иногда литовцы тормозят сильнее белорусов.",
          "Доверьтесь водителю — у нас данные обновляются каждые 30 минут.",
        ],
      },
      {
        type: "link",
        href: "https://mon.declarant.by/#/zone",
        label: "Электронная очередь в зонах ожидания — mon.declarant.by",
        description: "Лучший источник живой информации об очередях на границе в интернете: официальный сервис мониторинга регистрации транспорта в электронной очереди на КПП, обновляется в реальном времени. Если сайт не открывается — попробуйте зайти через VPN.",
      },
      { type: "liveQueue" },
      {
        type: "callout",
        text:
          "В ComfortLine водитель сам решает по дороге, какой КПП быстрее. Это часть фиксированной цены — никаких доплат за смену маршрута.",
      },
      { type: "h2", id: "official-sources", text: "Официальные источники" },
      { type: "link", href: "https://www.vsat.lt/en", label: "Государственная пограничная охрана Литвы (VSAT) — vsat.lt", description: "Актуальный статус КПП и условия въезда" },
      { type: "link", href: "https://www.lrmuitine.lt/web/guest/fiziniams-asmenims", label: "Таможня Литовской Республики — lrmuitine.lt", description: "Нормы провоза товаров, запреты, оформление для физических лиц" },
      { type: "link", href: "https://gtk.gov.by", label: "Государственный таможенный комитет Беларуси — gtk.gov.by", description: "Официальный сайт ГТК: нормативная база, правила ввоза и вывоза товаров" },
      { type: "link", href: "https://mon.declarant.by/#/zone", label: "Электронная очередь на КПП — mon.declarant.by", description: "Актуальные очереди на Каменном Логе, Бенякони и других КПП — обновляется в реальном времени." },
      { type: "info-notice", text: "Данные об очередях и статусе КПП могут изменяться. Всегда проверяйте актуальную информацию перед поездкой." },
    ],
    categoryEn: "Border",
    introEn:
      "For Minsk–Lithuania trips, compare Kamenny Log and Benyakoni after checking that they are operating. Kotlovka is closed, not a backup option. Below are route differences and indicative waits, not guaranteed crossing times.",
    bodyEn: [
      { type: "h2", text: "Kamenny Log — The Main Choice" },
      {
        type: "p",
        text: "The highest-traffic checkpoint. Good infrastructure, two lanes for private cars, a fee zone, café and toilets on both sides. Located on the M7 Minsk–Vilnius highway. The Lithuanian side is called Medininkai.",
      },
      {
        type: "ul",
        items: [
          "Pros: fast processing, well-developed infrastructure, convenient highway.",
          "Cons: the busiest crossing — can queue up to 6 hours at peak times.",
          "Best time: Tuesday–Wednesday, 6:00–11:00.",
        ],
      },
      { type: "h2", text: "Benyakoni — The Backup Option" },
      {
        type: "p",
        text: "A backup crossing 60 km south of Kamenny Log; the Lithuanian side is Šalčininkai. Less traffic but also lower throughput. The detour adds about 40 minutes to Vilnius.",
      },
      {
        type: "ul",
        items: [
          "Pros: shorter queue on weekends.",
          "Cons: longer route to Vilnius (~140 km instead of ~100 km from Kamenny Log), modest facilities.",
          "When to choose: Friday evening and Sunday afternoon when Kamenny Log is backed up.",
        ],
      },
      { type: "h2", text: "Kotlovka — Closed" },
      { type: "link", href: "https://vrm.lrv.lt/en/news/the-operation-of-the-lavoriskes-and-raigardas-border-crossing-points-will-be-terminated-from-1-march", label: "Lithuanian Interior Ministry: closure from 1 March 2024", description: "Checked on 16 October 2026; Kotlovka is not a backup crossing." },
      { type: "link", href: "/blog/driving-to-belarus-by-car-2026-rules-checker", label: "Check more than the crossing: the new driving guide", description: "An open crossing does not guarantee admission of passengers or vehicles; separate rules apply to BY plates, visas and sanctions." },
      {
        type: "p",
        text: "Kotlovka–Lavoriškės closed on 1 March 2024 by Lithuania's decision, as did Privalka–Raigardas. This is not restricted operation for private cars. Do not route there without a new official reopening announcement. Kamenny Log and Benyakoni reopened on 20 November 2025; temporary closures remain possible.",
      },
      { type: "h2", text: "How to Choose a Crossing on the Day of Travel" },
      {
        type: "ol",
        items: [
          "Check the Belarusian State Customs Committee website for the current queue length.",
          "Compare: if Kamenny Log shows more than 150 cars, consider Benyakoni.",
          "Compare queues, detour time and the status of both crossings: the day of the week does not guarantee a faster crossing.",
          "Check VSAT (Lithuanian side) — Lithuanian processing sometimes takes longer than Belarusian.",
          "Trust your driver — our queue data is updated every 30 minutes.",
        ],
      },
      {
        type: "link",
        href: "https://mon.declarant.by/#/zone",
        label: "Electronic queue at waiting zones — mon.declarant.by",
        description: "The best live queue information available online: the official Belarusian customs monitoring service for vehicle registration in the electronic border-crossing queue, updated in real time. If the site doesn't load, try opening it with a VPN.",
      },
      { type: "liveQueue" },
      {
        type: "callout",
        text: "A ComfortLine driver decides en route which crossing is faster. This is part of the fixed price — no extra charge for a route change.",
      },
      { type: "h2", id: "official-sources", text: "Official Sources" },
      { type: "link", href: "https://www.vsat.lt/en", label: "Lithuanian State Border Guard Service (VSAT) — vsat.lt", description: "Current checkpoint status and entry conditions" },
      { type: "link", href: "https://www.lrmuitine.lt/web/guest/fiziniams-asmenims", label: "Lithuanian Customs — lrmuitine.lt", description: "Allowances, prohibitions and customs procedures for individuals" },
      { type: "link", href: "https://gtk.gov.by", label: "Belarusian State Customs Committee — gtk.gov.by", description: "Official customs regulations and import/export rules" },
      { type: "link", href: "https://mon.declarant.by/#/zone", label: "Live border queue — mon.declarant.by", description: "Real-time queue counts at Kamenny Log, Benyakoni and other checkpoints." },
      { type: "info-notice", text: "Queue data and checkpoint status may change at any time. Always check before travelling." },
    ],
    related: ["граница-беларусь-литва", "как-добраться-до-аэропорта-вильнюса"],
    ctaRoute: { label: "Заказать трансфер Минск — Вильнюс (VNO)", labelEn: "Book Minsk–Vilnius (VNO) transfer", path: "/трансфер-минск-вильнюс-аэропорт", pathEn: "/minsk-vilnius-airport" },
  },

  {
    slug: "трансфер-с-детьми",
    slugEn: "family-airport-transfer-with-children",
    titleEn: "Minsk Airport Transfer with Children",
    descriptionEn: "How to travel with kids from Minsk to the airport by private transfer: car seats, luggage, timing and tips for a smooth family journey.",
    ogSlug: "blog-transfer-s-detmi",
    title: "Трансфер с детьми из Минска: чек-лист",
    description:
      "Чек-лист для трансфера с детьми из Минска в аэропорты Европы: документы, кресла, питание в дороге, советы по границе. Опыт водителей ComfortLine.",
    intro:
      "Поездка с детьми в аэропорт — это всегда стресс. Дальняя дорога, граница, ночные смены и капризы. Ниже — выжимка из опыта наших водителей за 8 лет: как сделать трансфер комфортным для всех.",
    dateISO: "2026-03-20",
    readingMin: 6,
    category: "С детьми",
    tags: ["дети", "семья", "трансфер"],
    body: [
      { type: "h2", text: "Документы на ребёнка" },
      {
        type: "ul",
        items: [
          "Загранпаспорт ребёнка (даже грудничку).",
          "Шенгенская виза или вписан в визу родителя.",
          "Свидетельство о рождении — оригинал.",
          "Если ребёнок едет без обоих родителей — нотариальное согласие, переведённое и заверенное.",
          "Медицинская страховка с покрытием от 30 000 €.",
        ],
      },
      { type: "h2", text: "Детские кресла" },
      {
        type: "p",
        text:
          "По правилам Беларуси и ЕС дети до 12 лет ростом до 150 см обязательно перевозятся в специальном автокресле или с использованием бустера. ComfortLine предоставляет кресла бесплатно — нужно только указать возраст и вес ребёнка при бронировании.",
      },
      {
        type: "table",
        headers: ["Возраст", "Вес", "Тип удерживающего устройства"],
        rows: [
          ["0–1 год", "до 13 кг", "Автолюлька группы 0/0+"],
          ["1–4 года", "9–18 кг", "Автокресло группы 1"],
          ["3–7 лет", "15–25 кг", "Автокресло группы 2"],
          ["7–12 лет", "22–36 кг", "Бустер группы 3"],
        ],
      },
      { type: "h2", text: "Что взять в дорогу" },
      {
        type: "ul",
        items: [
          "Воду и перекус на 4–6 часов (на границе магазинов нет).",
          "Влажные салфетки, бумажные полотенца, мусорные пакеты.",
          "Сменную одежду на случай разлива/недомогания.",
          "Любимую игрушку и наушники для мультиков.",
          "Лёгкое одеяло — в авто работает кондиционер.",
          "Препараты от укачивания, если ребёнок чувствителен.",
        ],
      },
      { type: "h2", text: "Как пройти границу с ребёнком быстрее" },
      {
        type: "ul",
        items: [
          "Не выезжайте в пиковое время — пятница вечер и воскресенье день.",
          "Имейте все документы в одной папке.",
          "При сильной очереди попросите водителя узнать о \"семейной\" полосе — на некоторых КПП Литвы пропускают вне очереди при маленьких детях.",
          "Заранее покормите и сводите ребёнка в туалет.",
        ],
      },
      {
        type: "callout",
        text:
          "Закажите трансфер минивэном — больше места, ребёнку удобнее в кресле, есть куда поставить коляску. ComfortLine подаёт Hyundai Palisade или Kia Carnival.",
      },
    ],
    categoryEn: "Family Travel",
    introEn:
      "Travelling to the airport with children is always stressful — a long road, a border crossing, night departures and restless kids. Below is the distilled experience of our drivers over 8 years: how to make the transfer comfortable for everyone.",
    bodyEn: [
      { type: "h2", text: "Documents for Your Child" },
      {
        type: "ul",
        items: [
          "International passport for the child (including infants).",
          "Schengen visa, or the child is entered into a parent's visa.",
          "Birth certificate — original.",
          "If the child travels without both parents — notarised parental consent, translated and certified.",
          "Medical insurance with at least €30,000 coverage.",
        ],
      },
      { type: "h2", text: "Child Seats" },
      {
        type: "p",
        text: "Under Belarusian and EU law, children under 12 who are shorter than 150 cm must travel in an approved child restraint system or booster seat. ComfortLine provides seats free of charge — just specify the child's age and weight when booking.",
      },
      {
        type: "table",
        headers: ["Age", "Weight", "Restraint type"],
        rows: [
          ["0–1 year", "up to 13 kg", "Group 0/0+ infant carrier"],
          ["1–4 years", "9–18 kg", "Group 1 car seat"],
          ["3–7 years", "15–25 kg", "Group 2 car seat"],
          ["7–12 years", "22–36 kg", "Group 3 booster"],
        ],
      },
      { type: "h2", text: "What to Pack for the Journey" },
      {
        type: "ul",
        items: [
          "Water and snacks for 4–6 hours (no shops at the border).",
          "Wet wipes, paper towels, small bin bags.",
          "A change of clothes in case of spills or motion sickness.",
          "A favourite toy and headphones for videos.",
          "A light blanket — the car has air conditioning.",
          "Anti-nausea medication if your child is prone to motion sickness.",
        ],
      },
      { type: "h2", text: "How to Cross the Border with Children More Quickly" },
      {
        type: "ul",
        items: [
          "Avoid peak times — Friday evening and Sunday afternoon.",
          "Keep all documents in one folder.",
          "If the queue is long, ask the driver about a family lane — some Lithuanian checkpoints allow families with young children to go ahead of the queue.",
          "Feed the children and take a bathroom break before the border.",
        ],
      },
      {
        type: "callout",
        text: "Book a minivan — more space, a more comfortable seat for the child, room for a pram. ComfortLine provides the Hyundai Palisade or Kia Carnival.",
      },
    ],
    related: ["граница-беларусь-литва", "стоимость-трансфер-минск-варшава"],
    ctaRoute: { label: "Заказать минивэн с детским креслом", labelEn: "Book a minivan with child seat", path: "/трансфер-хендай-палисад", pathEn: "/hyundai-palisade-transfer" },
  },

  {
    slug: "как-добраться-до-аэропорта-вильнюса",
    slugEn: "how-to-get-to-vilnius-airport-from-minsk",
    titleEn: "Minsk to Vilnius Airport: Travel Options",
    descriptionEn: "Complete guide to reaching Vilnius Airport from Minsk in 2026: private transfer, bus, minibus — travel times, prices and an honest comparison.",
    ogSlug: "blog-kak-dobratsya-do-vno",
    title: "Минск — аэропорт Вильнюса: как добраться",
    description:
      "Все способы добраться из Минска в аэропорт Вильнюса (VNO) в 2026: трансфер, такси, автобус, личное авто. Сравнение цены, времени и удобства.",
    intro:
      "Аэропорт Вильнюса (VNO) — самый удобный международный хаб для жителей Беларуси. Из Минска до VNO ~175 км. Ниже сравниваем все варианты, как туда добраться.",
    dateISO: "2026-03-15",
    readingMin: 5,
    category: "Аэропорт",
    tags: ["VNO", "Вильнюс", "аэропорт"],
    body: [
      { type: "h2", text: "Сравнение вариантов" },
      {
        type: "table",
        headers: ["Способ", "Время", "Стоимость", "Комфорт"],
        rows: [
          ["Личный трансфер ComfortLine", "3–5 ч", "По запросу", "★★★★★"],
          ["Сборное такси", "4–6 ч", "Дешевле трансфера", "★★★"],
          ["Автобус Минск–Вильнюс", "5–7 ч", "Самый бюджетный", "★★"],
          ["Личное авто", "3–5 ч", "Топливо + парковка", "★★★★"],
        ],
      },
      { type: "h2", text: "Трансфер: плюсы и минусы" },
      {
        type: "p",
        text:
          "Индивидуальный трансфер — самый предсказуемый вариант. Подача от двери в назначенное время, заранее согласованная стоимость, водитель помогает на границе и с багажом. Подходит, если нужно быть уверенным во времени или едет семья с детьми.",
      },
      { type: "h2", text: "Сборное такси и автобус" },
      {
        type: "p",
        text:
          "Дешевле, но менее предсказуемо. Сборные машины ждут заполнения, могут собирать пассажиров по нескольким адресам в Минске. Автобусы ходят по расписанию, но останавливаются в общем потоке на КПП и могут стоять дольше из-за группового досмотра.",
      },
      { type: "h2", text: "Личное авто" },
      {
        type: "p",
        text:
          "Перед поездкой проверьте допуск автомобиля в Литву, особенно на номерах BY, и оформите действующее в ЕС автострахование: белорусская «Зелёная карта» не заменяет пограничный полис. Добавьте расходы на парковку и топливо; короткая поездка не освобождает от ограничений.",
      },
      { type: "link", href: "/блог/как-въехать-в-беларусь-на-автомобиле-2026", label: "Поездка на машине: правила въезда и возвращения", description: "Номера BY, санкции и страховка — отдельно от выбора транспорта до аэропорта." },
      {
        type: "callout",
        text:
          "Если для вас важно успеть на рейс без сюрпризов — индивидуальный трансфер ComfortLine. Заказ онлайн или по телефону, расчёт в ближайшее время.",
      },
    ],
    categoryEn: "Airport",
    introEn:
      "Vilnius Airport (VNO) is the most convenient international hub for Belarusian travellers. Minsk to VNO is around 175 km. Here we compare all the options for getting there.",
    bodyEn: [
      { type: "h2", text: "Options Compared" },
      {
        type: "table",
        headers: ["Option", "Time", "Price", "Comfort"],
        rows: [
          ["Private transfer ComfortLine", "3–5 h", "On request", "★★★★★"],
          ["Shared taxi", "4–6 h", "Less than private transfer", "★★★"],
          ["Bus Minsk–Vilnius", "5–7 h", "Most budget-friendly", "★★"],
          ["Own car", "3–5 h", "Fuel + parking", "★★★★"],
        ],
      },
      { type: "h2", text: "Private Transfer: Pros and Cons" },
      {
        type: "p",
        text: "A private transfer is the most predictable option. Door-to-door pick-up at an agreed time, a price confirmed in advance, and a driver who assists at the border and with luggage. Ideal when you need certainty about timing or are travelling as a family with children.",
      },
      { type: "h2", text: "Shared Taxi and Bus" },
      {
        type: "p",
        text: "Cheaper, but less predictable. Shared vehicles wait until full and may collect passengers at several addresses across Minsk. Buses run on a fixed schedule but stop in the common queue at the checkpoint and can be delayed by group passport inspections.",
      },
      { type: "h2", text: "Own Car" },
      {
        type: "p",
        text: "Check whether your car may enter Lithuania, especially on BY plates, and arrange motor insurance valid in the EU: a Belarusian Green Card does not replace frontier insurance. Add parking and fuel costs; a short trip does not exempt you from restrictions.",
      },
      { type: "link", href: "/blog/driving-to-belarus-by-car-2026-rules-checker", label: "Driving guide: entry and return rules", description: "BY plates, sanctions and insurance — separate from choosing airport transport." },
      {
        type: "callout",
        text: "If catching your flight without surprises matters — choose a private ComfortLine transfer. Book online or by phone; quote shortly.",
      },
    ],
    related: ["граница-беларусь-литва", "какой-кпп-выбрать", "трансфер-с-детьми"],
    ctaRoute: { label: "Заказать трансфер Минск — Вильнюс (VNO)", labelEn: "Book Minsk–Vilnius (VNO) transfer", path: "/трансфер-минск-вильнюс-аэропорт", pathEn: "/minsk-vilnius-airport" },
  },

  {
    slug: "аэропорт-варшавы-вав",
    slugEn: "warsaw-chopin-airport-guide-from-belarus",
    titleEn: "Warsaw Chopin Airport: Passenger Guide",
    descriptionEn: "Everything about Warsaw Chopin Airport for passengers from Belarus: terminals, check-in tips, transfer options and how to get there from Minsk.",
    ogSlug: "blog-airport-warsaw-waw",
    title: "Аэропорт Варшавы WAW: гайд",
    description:
      "Всё об аэропорте Варшавы Фредерик Шопен (WAW) для путешественников из Беларуси: терминалы, регистрация, транзит, где встречают водители.",
    intro:
      "Аэропорт Варшавы имени Фредерика Шопена (WAW) — крупнейший хаб Польши и один из самых востребованных аэропортов для жителей Беларуси. Ниже — всё, что нужно знать перед вылетом.",
    dateISO: "2026-05-20",
    readingMin: 6,
    category: "Аэропорт",
    tags: ["WAW", "Варшава", "аэропорт", "Польша"],
    body: [
      { type: "h2", text: "Общая информация" },
      {
        type: "p",
        text: "WAW находится в 10 км к юго-западу от центра Варшавы. Расстояние от Минска — около 550–600 км, время в пути с трансфером — 7–9 часов с учётом границы. Аэропорт работает круглосуточно. Основные авиакомпании: LOT, Ryanair, Wizz Air, Lufthansa, Turkish Airlines.",
      },
      { type: "h2", text: "Терминалы: А и В" },
      {
        type: "p",
        text: "WAW имеет два пассажирских терминала, соединённых пешеходным переходом (5–7 минут): Терминал А — основной, международные и европейские рейсы; Терминал В — бюджетные перевозчики (Ryanair, Wizz Air). Перед поездкой проверьте на сайте авиакомпании, какой терминал ваш рейс.",
      },
      {
        type: "table",
        headers: ["Терминал", "Кто летает", "Регистрация (рекомендуется)"],
        rows: [
          ["Терминал А", "LOT, Lufthansa, Turkish, Emirates и др.", "За 2–3 часа до вылета"],
          ["Терминал В", "Ryanair, Wizz Air", "За 2 часа (онлайн-регистрация обязательна)"],
        ],
      },
      { type: "h2", text: "Зона встречи и трансфер" },
      {
        type: "p",
        text: "Зона прилёта и встречи находится на первом этаже обоих терминалов. Водители ComfortLine встречают с табличкой в зале прилёта. Парковка для подачи авто — P1 (Терминал А) и P2 (Терминал В), первые 15–20 минут бесплатно.",
      },
      { type: "h2", text: "Модлин (WMI) — альтернатива WAW" },
      {
        type: "p",
        text: "В 35 км севернее Варшавы находится аэропорт Варшава Модлин (WMI) — бюджетная альтернатива, которую активно использует Ryanair. Добраться туда из Минска дольше примерно на 30–40 минут. При бронировании трансфера важно уточнить: WAW или WMI.",
      },
      { type: "h2", text: "Советы перед вылетом" },
      {
        type: "ul",
        items: [
          "Онлайн-регистрация у Ryanair и Wizz Air обязательна — иначе сбор €50–55 за стойке.",
          "Приезжайте в аэропорт минимум за 2 часа (а для WAW → Терминал А — за 2,5).",
          "Табло с рейсами обновляется за 24 ч. Проверьте номер выхода (gate) онлайн накануне.",
          "Обмен валют в аэропорту невыгоден — лучше снять злотые заранее.",
          "Бесплатный Wi-Fi есть во всех зонах — работает стабильно.",
        ],
      },
      {
        type: "callout",
        text: "ComfortLine осуществляет трансферы к обоим аэропортам Варшавы — WAW и WMI. Водитель доставит от двери до зоны регистрации и при необходимости поможет с багажом.",
      },
    ],
    categoryEn: "Airport",
    introEn:
      "Warsaw Frederic Chopin Airport (WAW) is Poland's largest hub and one of the most popular airports for Belarusian travellers. Here is everything you need to know before your flight.",
    bodyEn: [
      { type: "h2", text: "General Information" },
      {
        type: "p",
        text: "WAW is located 10 km south-west of Warsaw city centre. Distance from Minsk — approximately 550–600 km; journey time by transfer is 7–9 hours including the border. The airport operates 24/7. Main airlines: LOT, Ryanair, Wizz Air, Lufthansa, Turkish Airlines.",
      },
      { type: "h2", text: "Terminals: A and B" },
      {
        type: "p",
        text: "WAW has two passenger terminals connected by a walkway (5–7 minutes): Terminal A — main terminal, international and European flights; Terminal B — budget carriers (Ryanair, Wizz Air). Before you travel, check your airline's website to confirm which terminal your flight uses.",
      },
      {
        type: "table",
        headers: ["Terminal", "Airlines", "Recommended check-in"],
        rows: [
          ["Terminal A", "LOT, Lufthansa, Turkish, Emirates etc.", "2–3 hours before departure"],
          ["Terminal B", "Ryanair, Wizz Air", "2 hours (online check-in mandatory)"],
        ],
      },
      { type: "h2", text: "Meet-and-Greet and Transfer" },
      {
        type: "p",
        text: "The arrivals and meet-and-greet zone is on the ground floor of both terminals. ComfortLine drivers meet passengers with a name board in the arrivals hall. Drop-off parking: P1 (Terminal A) and P2 (Terminal B); the first 15–20 minutes are free.",
      },
      { type: "h2", text: "Modlin (WMI) — An Alternative to WAW" },
      {
        type: "p",
        text: "Warsaw Modlin Airport (WMI) is 35 km north of Warsaw — a budget alternative used heavily by Ryanair. From Minsk it takes roughly 30–40 minutes longer. When booking a transfer, always confirm whether you mean WAW or WMI.",
      },
      { type: "h2", text: "Pre-Flight Tips" },
      {
        type: "ul",
        items: [
          "Online check-in is mandatory for Ryanair and Wizz Air — printing a boarding pass at the desk costs €50–55.",
          "Arrive at the airport at least 2 hours early (2.5 hours for WAW Terminal A).",
          "Flight boards update 24 h in advance. Check your gate online the evening before.",
          "Currency exchange at the airport is unfavourable — withdraw Polish złoty in advance.",
          "Free Wi-Fi is available throughout the airport and works reliably.",
        ],
      },
      {
        type: "callout",
        text: "ComfortLine transfers to both Warsaw airports — WAW and WMI. Your driver delivers you from door to check-in and assists with luggage.",
      },
    ],
    related: ["стоимость-трансфер-минск-варшава", "граница-беларусь-польша", "что-нельзя-ввозить-в-ес"],
    ctaRoute: { label: "Заказать трансфер Минск — Варшава (WAW)", labelEn: "Book Minsk–Warsaw (WAW) transfer", path: "/трансфер-минск-варшава-шопен", pathEn: "/minsk-warsaw-airport" },
  },

  {
    slug: "граница-беларусь-польша",
    slugEn: "belarus-poland-border-crossing-guide",
    titleEn: "Poland Border: Checkpoints & Docs",
    descriptionEn: "Practical guide to crossing the Belarus–Poland border in 2026: working checkpoints, required documents, typical wait times and practical tips.",
    ogSlug: "blog-granitsa-belarus-polsha",
    title: "Граница Беларусь–Польша: КПП и документы",
    description:
      "Гайд по пересечению границы Беларусь–Польша в 2026: рабочие КПП (Брест–Тересполь, Домачево, Брузги), документы, время ожидания, лайфхаки от водителей.",
    intro:
      "Граница Беларусь–Польша — второй по востребованности маршрут после литовского. Расстояние от Минска до Бреста — около 350 км, затем пересечение границы и дорога до Варшавы ещё 200 км. Рассказываем, как это устроено в 2026.",
    dateISO: "2026-05-10",
    dateModified: "2026-10-16",
    disclaimerBanner: true,
    readingMin: 8,
    category: "Граница",
    tags: ["граница", "Польша", "Брест", "КПП", "Тересполь"],
    body: [
      { type: "h2", text: "Рабочие КПП в 2026" },
      { type: "info-notice", text: "Проверено 16 октября 2026 года. Домачево закрыт; оценки ожидания не гарантируют время пересечения. Виза пассажира не подтверждает допуск машины." },
      { type: "link", href: "/блог/как-въехать-в-беларусь-на-автомобиле-2026", label: "Новый гайд: въезд в Беларусь на авто и обратный путь", description: "Право въезда пассажиров, санкции, номера BY, страховка и таможня." },
      { type: "p", text: "Для BY-номеров KAS допускает определённые личные автомобили физических лиц при наличии собственника в машине и некоммерческом использовании с соблюдением остальных условий. Это не общее разрешение для фирменных автомобилей, продажи или платных перевозок. Польские исключения не переносятся на Литву и Латвию. Вывоз автомобиля из ЕС в Беларусь проверяется отдельно по санкциям." },
      { type: "link", href: "https://www.gov.pl/web/kas/nowe-zasady-przywozu-samochodow-osobowych-zarejestrowanych-na-bialorusi", label: "KAS: условия для автомобилей с белорусской регистрацией" },
      { type: "link", href: "https://www.gov.pl/web/kas/przejscia-graniczne-z-bialorusia-w-bobrownikach-i-kuznicy-otwarte", label: "KAS: Бобровники — легковые и автобусы; Кузница — легковые без автобусов" },
      { type: "link", href: "https://granica.gov.pl/index_wait.php?k=w&p=b&v=ru", label: "Текущий статус польских КПП и очередь на выезд из Польши" },
      {
        type: "p",
        text: "Для легковых автомобилей на белорусско-польской границе в 2026 году работают три основных пункта пропуска. Выбор КПП сильно влияет на время ожидания — учитывайте это при планировании поездки.",
      },
      {
        type: "table",
        headers: ["КПП (BY)", "КПП (PL)", "Маршрут", "Среднее время"],
        rows: [
          ["Брест (Тересполь)", "Тересполь", "М1 / Е30 → Варшава", "3–7 ч"],
          ["Берестовица", "Бобровники", "Легковые и автобусы → Белосток", "Проверить очередь"],
          ["Брузги", "Кузница Белостоцкая", "Легковые, без автобусов → Белосток", "Проверить очередь"],
          ["Домачево", "Словатыче", "Движение приостановлено", "—"],
          ["Песчатка", "Половце", "Движение приостановлено", "—"],
        ],
      },
      { type: "h2", text: "Брест–Тересполь: самый загруженный" },
      {
        type: "p",
        text: "Основной и самый известный переход. Находится прямо на трассе М1 (Берлинское шоссе). Здесь проходит основной поток легковых автомобилей, поэтому в пятницу–воскресенье и накануне праздников очереди могут достигать 6–10 часов. Рекомендуем ехать во вторник–четверг, рано утром.",
      },
      { type: "h2", text: "Домачево: закрыт, не альтернатива Бресту" },
      {
        type: "p",
        text: "По официальной сводке granica.gov.pl, проверенной 16 октября 2026 года, движение через Домачево–Словатыче и Песчатка–Половце приостановлено. Не используйте их для объезда очереди. Берестовица–Бобровники возобновил работу 17 ноября 2025 года для легковых и автобусов; сравнивайте его с Брестом с учётом объезда и актуального статуса.",
      },
      { type: "h2", text: "Брузги (Гродно): для северного направления" },
      {
        type: "p",
        text: "Брузги–Кузница возобновил работу 17 ноября 2025 года для легковых автомобилей, но не автобусов. Он удобен для северного направления; перед поездкой проверьте статус и очередь. Козловичи–Кукурыки/Корощин — грузовое направление, не замена пассажирскому КПП.",
      },
      { type: "h2", text: "Документы для въезда в Польшу" },
      {
        type: "ul",
        items: [
          "Паспорт со сроком действия не менее 3 месяцев после предполагаемой даты выезда из ЕС.",
          "Виза, ВНЖ или право безвизового въезда, если применимо. Дополнительно проверьте, разрешён ли вам въезд из Беларуси по действующим польским ограничениям: одной визы может быть недостаточно.",
          "Медицинская страховка (минимум 30 000 €, действующая во всех странах Шенгена).",
          "Подтверждение брони отеля или приглашение от принимающей стороны.",
          "Обратные билеты или подтверждение цели поездки.",
          "Автострахование, действующее в стране въезда. Не полагайтесь на белорусскую «Зелёную карту» для ЕС: заранее проверьте необходимость пограничного полиса.",
        ],
      },
      { type: "h2", text: "Советы водителей ComfortLine" },
      {
        type: "ul",
        items: [
          "Планируйте поездку на вторник–четверг — очереди в 2–3 раза меньше, чем в пятницу.",
          "Держите все документы в одной папке — это реально ускоряет проверку.",
          "На Тересполе иногда спрашивают цель поездки устно — отвечайте чётко: туризм, бизнес, транзит.",
          "Мобильная связь A1/МТС работает до белорусской стороны, далее — польские операторы.",
          "Наличные злотые с собой — на польской стороне терминалы есть, но иногда «зависают».",
        ],
      },
      {
        type: "link",
        href: "https://mon.declarant.by/#/zone",
        label: "Электронная очередь в зонах ожидания — mon.declarant.by",
        description: "Регистрация транспорта в белорусских зонах ожидания. Сначала проверьте, открыт ли КПП: наличие его названия в системе не означает, что проезд разрешён.",
      },
      { type: "liveQueue" },
      {
        type: "callout",
        text: "Водитель сравнивает только работающие КПП, подходящие автомобилю и пассажирам. Закрытое Домачево не используется для объезда. Смена маршрута зависит от допуска, очереди и дополнительного времени в пути.",
      },
      { type: "h2", id: "official-sources", text: "Официальные источники" },
      { type: "link", href: "https://www.granica.gov.pl/", label: "Служба охраны государственной границы Польши — granica.gov.pl", description: "Статус КПП, условия въезда, актуальная обстановка на границе" },
      { type: "link", href: "https://www.podatki.gov.pl/clo/clo-dla-podroznych/", label: "Таможня Польши — podatki.gov.pl", description: "Нормы беспошлинного ввоза для путешественников, запрещённые товары" },
      { type: "link", href: "https://gtk.gov.by", label: "Государственный таможенный комитет Беларуси — gtk.gov.by", description: "Официальный сайт ГТК: нормативная база, правила ввоза и вывоза товаров" },
      { type: "link", href: "https://mon.declarant.by/#/zone", label: "Электронная очередь на КПП — mon.declarant.by", description: "Регистрация в зонах ожидания работающих белорусских КПП; не подтверждает открытие закрытого перехода." },
      { type: "info-notice", text: "Правила въезда, визовые требования и таможенные нормы могут изменяться без уведомления. Всегда проверяйте актуальную информацию на официальных сайтах перед поездкой." },
    ],
    categoryEn: "Border",
    introEn:
      "The Belarus–Poland border is the second busiest route after Lithuania. Minsk to Brest is around 350 km, then the border crossing and another 200 km to Warsaw. Here is how it works in 2026.",
    bodyEn: [
      { type: "h2", text: "Working Checkpoints in 2026" },
      { type: "info-notice", text: "Checked on 16 October 2026. Domachevo is closed; waiting-time estimates do not guarantee crossing times. A passenger's visa does not establish vehicle admissibility." },
      { type: "link", href: "/blog/driving-to-belarus-by-car-2026-rules-checker", label: "New guide: driving to Belarus and returning", description: "Passenger eligibility, sanctions, BY plates, insurance and customs." },
      { type: "p", text: "KAS allows certain privately owned BY-plated cars where the owner is in the vehicle and use is non-commercial, subject to the other conditions. This is not blanket permission for corporate cars, vehicles for sale or paid passenger transport. Poland's exceptions do not apply automatically in Lithuania or Latvia. Taking a car from the EU to Belarus requires a separate export-sanctions check." },
      { type: "link", href: "https://www.gov.pl/web/kas/nowe-zasady-przywozu-samochodow-osobowych-zarejestrowanych-na-bialorusi", label: "KAS: conditions for Belarus-registered cars" },
      { type: "link", href: "https://www.gov.pl/web/kas/przejscia-graniczne-z-bialorusia-w-bobrownikach-i-kuznicy-otwarte", label: "KAS: Bobrowniki takes cars and coaches; Kuźnica takes cars, not coaches" },
      { type: "link", href: "https://granica.gov.pl/index_wait.php?k=w&p=b&v=en", label: "Current Polish crossing status and queues leaving Poland" },
      {
        type: "p",
        text: "Three main checkpoints operate for private cars on the Belarus–Poland border in 2026. Your choice of crossing significantly affects waiting time — factor this into your travel planning.",
      },
      {
        type: "table",
        headers: ["Checkpoint (BY)", "Checkpoint (PL)", "Route", "Avg. wait time"],
        rows: [
          ["Brest (Terespol)", "Terespol", "M1 / E30 → Warsaw", "3–7 h"],
          ["Berestovitsa", "Bobrowniki", "Cars and coaches → Białystok", "Check current queue"],
          ["Bruzgi", "Kuźnica Białostocka", "Cars, no coaches → Białystok", "Check current queue"],
          ["Domachevo", "Sławatycze", "Traffic suspended", "—"],
          ["Peschatka", "Połowce", "Traffic suspended", "—"],
        ],
      },
      { type: "h2", text: "Brest–Terespol: The Busiest Crossing" },
      {
        type: "p",
        text: "The main and best-known crossing, located directly on the M1 highway (the Berlin road). It handles the largest volume of private cars, so on Friday–Sunday and before public holidays queues can reach 6–10 hours. We recommend travelling Tuesday–Thursday, early in the morning.",
      },
      { type: "h2", text: "Domachevo: Closed, Not a Brest Alternative" },
      {
        type: "p",
        text: "The official granica.gov.pl bulletin, checked on 16 October 2026, lists Domachevo–Sławatycze and Peschatka–Połowce as suspended. Do not use them as queue bypasses. Berestovitsa–Bobrowniki reopened on 17 November 2025 for cars and coaches; compare it with Brest using current status and the extra driving distance.",
      },
      { type: "h2", text: "Bruzgi (Grodno): For the Northern Direction" },
      {
        type: "p",
        text: "Bruzgi–Kuźnica reopened on 17 November 2025 for passenger cars, but not coaches. It suits northern routes; check its status and queue before travelling. Kozlovichi–Kukuryki/Koroszczyn is a freight route, not a passenger-crossing alternative.",
      },
      { type: "h2", text: "Documents for Entry into Poland" },
      {
        type: "ul",
        items: [
          "Passport valid for at least 3 months beyond your planned EU departure date.",
          "Visa, residence permit or visa-free entitlement where applicable. Also check whether Poland's current restrictions permit your entry from Belarus: a visa alone may be insufficient.",
          "Medical insurance (minimum €30,000, valid across all Schengen countries).",
          "Hotel booking confirmation or invitation from a host.",
          "Return tickets or confirmation of purpose of visit.",
          "Motor insurance valid in the destination country. Do not rely on a Belarusian Green Card for the EU: check frontier insurance requirements in advance.",
        ],
      },
      { type: "h2", text: "ComfortLine Driver Tips" },
      {
        type: "ul",
        items: [
          "Plan for Tuesday–Thursday — queues are 2–3 times shorter than on Fridays.",
          "Keep all documents in one folder — it genuinely speeds up the inspection.",
          "At Terespol, guards sometimes ask about the purpose of your visit verbally — answer clearly: tourism, business or transit.",
          "A1/MTS mobile signal works up to the Belarusian side; beyond that, Polish networks take over.",
          "Bring Polish złoty cash — card terminals exist on the Polish side but sometimes fail.",
        ],
      },
      {
        type: "link",
        href: "https://mon.declarant.by/#/zone",
        label: "Electronic queue at waiting zones — mon.declarant.by",
        description: "Vehicle registration in Belarusian waiting zones. Check that the crossing is open first: its name appearing in a queue system is not permission to cross.",
      },
      { type: "liveQueue" },
      {
        type: "callout",
        text: "Drivers compare only operating crossings suitable for the vehicle and passengers. Closed Domachevo is not used as a bypass. Rerouting depends on admission rules, queues and additional driving time.",
      },
      { type: "h2", id: "official-sources", text: "Official Sources" },
      { type: "link", href: "https://www.granica.gov.pl/", label: "Polish Border Guard — granica.gov.pl", description: "Checkpoint status, entry conditions and current border situation" },
      { type: "link", href: "https://www.podatki.gov.pl/clo/clo-dla-podroznych/", label: "Polish Customs — podatki.gov.pl", description: "Duty-free allowances for travellers, prohibited goods" },
      { type: "link", href: "https://gtk.gov.by", label: "Belarusian State Customs Committee — gtk.gov.by", description: "Official customs regulations and import/export rules" },
      { type: "link", href: "https://mon.declarant.by/#/zone", label: "Live border queue — mon.declarant.by", description: "Waiting-zone registration at operating Belarusian checkpoints; not evidence that a closed crossing has reopened." },
      { type: "info-notice", text: "Entry requirements and customs allowances may change without notice. Always check official sources before travelling." },
    ],
    related: ["стоимость-трансфер-минск-варшава", "что-нельзя-ввозить-в-ес", "аэропорт-варшавы-вав"],
    ctaRoute: { label: "Заказать трансфер Минск — Варшава", labelEn: "Book Minsk–Warsaw transfer", path: "/трансфер-минск-варшава-шопен", pathEn: "/minsk-warsaw-airport" },
  },

  {
    slug: "аэропорт-риги-rix",
    slugEn: "riga-airport-guide-from-minsk-belarus",
    titleEn: "Riga Airport RIX: Passenger Guide",
    descriptionEn: "Complete guide to Riga Airport for travelers from Belarus: terminals, how to get there from Minsk, check-in tips and private transfer options.",
    ogSlug: "blog-airport-riga-rix",
    title: "Аэропорт Риги RIX: гайд для пассажиров",
    description:
      "Всё об аэропорте Риги (RIX) для путешественников из Беларуси: терминал, авиакомпании, зона встречи, парковка, советы по трансферу Минск–Рига.",
    intro:
      "Международный аэропорт Риги (RIX) — третий по размеру хаб Балтии после Вильнюса и Таллина. Для жителей Беларуси он интересен рейсами airBaltic и другими направлениями, которых нет в Вильнюсе. Расстояние от Минска — около 470 км.",
    dateISO: "2026-04-28",
    readingMin: 5,
    category: "Аэропорт",
    tags: ["RIX", "Рига", "аэропорт", "Латвия"],
    body: [
      { type: "h2", text: "Почему Рига, а не Вильнюс?" },
      {
        type: "p",
        text: "Вильнюс ближе (175 км против 470 км), но Рига выигрывает по маршрутной сети: airBaltic летит из Риги в более чем 80 направлений. Рига лучше подходит для перелётов в скандинавские страны, Исландию, Канаду и некоторые азиатские направления, которых нет в VNO.",
      },
      { type: "h2", text: "Структура аэропорта" },
      {
        type: "p",
        text: "RIX — компактный аэропорт с одним терминалом и тремя пирсами (A, B, C). Пирс A — некоммерческие и региональные рейсы. Пирс B — Шенгенские рейсы. Пирс C — рейсы за пределы Шенгена. Навигация простая: указатели дублируются на латышском, английском и русском языках.",
      },
      {
        type: "table",
        headers: ["Авиакомпания", "Ключевые направления"],
        rows: [
          ["airBaltic", "Хельсинки, Амстердам, Лондон, Берлин, Дубай, Торонто"],
          ["Ryanair", "Бристоль, Дублин, Мадрид, Милан, Афины"],
          ["Wizz Air", "Вена, Берлин, Рим, Барселона"],
          ["Finnair", "Хельсинки (транзит по всему миру)"],
        ],
      },
      { type: "h2", text: "Зона прилёта и встречи" },
      {
        type: "p",
        text: "Зона встречи находится на первом этаже, выход из зоны прилёта — прямо в общий зал. Водители ComfortLine встречают с табличкой у выхода из таможенной зоны. Ориентир: кофейня-сеть Coffee & Chocolate у главного выхода.",
      },
      { type: "h2", text: "Советы перед вылетом" },
      {
        type: "ul",
        items: [
          "airBaltic требует онлайн-регистрацию — без неё сбор у стойки около €30.",
          "Ручная кладь: airBaltic разрешает только маленькую сумку бесплатно, за чемодан в салон — доплата.",
          "Бесплатный WiFi в аэропорту — подключается через SMS-верификацию (нужен латвийский или роуминговый номер).",
          "Магазины Duty Free — открываются за зоной паспортного контроля, цены на алкоголь заметно ниже рижских.",
          "Аэроэкспресс из центра Риги: автобус №22 ходит каждые 10–15 минут, 30 минут в пути.",
        ],
      },
      { type: "h2", text: "Трансфер Минск–Рига: что важно знать" },
      {
        type: "p",
        text: "Маршрут Минск–Рига проходит через Григоровщину–Патерниеки — это две стороны одного перехода. Силене закрыт. При выезде из Латвии на автомобиле нужна предварительная запись на lvborder.lv, кроме предусмотренных законом исключений. Обычный въезд в Латвию на легковом авто с номерами BY запрещён; допуск пассажиров проверяют отдельно. Рассчитывайте время с учётом всей дороги, очереди и регистрации на рейс, а не только запаса 3–4 часа.",
      },
      { type: "link", href: "/блог/как-въехать-в-беларусь-на-автомобиле-2026", label: "Новый гайд: КПП, автомобиль и право въезда", description: "Для личного авто и обратного маршрута условия отличаются от пассажирского трансфера." },
      { type: "link", href: "https://www.lvborder.lv/en/", label: "Официальная запись в очередь для выезда из Латвии" },
      { type: "link", href: "https://www.vid.gov.lv/lv/jaunums/personas-ar-baltkrievijas-republika-registretu-transportlidzekli-turpmak-nevares-iebraukt-latvija", label: "СГД Латвии: запрет въезда легковых автомобилей с регистрацией BY" },
      {
        type: "callout",
        text: "ComfortLine выполняет трансферы в аэропорт Риги (RIX). Подача от двери, помощь с багажом, актуальная информация по очереди на границе — всё включено.",
      },
    ],
    categoryEn: "Airport",
    introEn:
      "Riga International Airport (RIX) is the third-largest hub in the Baltics after Vilnius and Tallinn. For Belarusian travellers it is attractive for airBaltic routes and destinations not available from Vilnius. Distance from Minsk — around 470 km.",
    bodyEn: [
      { type: "h2", text: "Why Riga Rather than Vilnius?" },
      {
        type: "p",
        text: "Vilnius is closer (175 km vs 470 km), but Riga wins on route network: airBaltic flies from Riga to more than 80 destinations. Riga is better for flights to Scandinavia, Iceland, Canada and certain Asian routes not available from VNO.",
      },
      { type: "h2", text: "Airport Layout" },
      {
        type: "p",
        text: "RIX is a compact single-terminal airport with three piers (A, B, C). Pier A — non-commercial and regional flights. Pier B — Schengen flights. Pier C — non-Schengen flights. Wayfinding is straightforward: signs are in Latvian, English and Russian.",
      },
      {
        type: "table",
        headers: ["Airline", "Key destinations"],
        rows: [
          ["airBaltic", "Helsinki, Amsterdam, London, Berlin, Dubai, Toronto"],
          ["Ryanair", "Bristol, Dublin, Madrid, Milan, Athens"],
          ["Wizz Air", "Vienna, Berlin, Rome, Barcelona"],
          ["Finnair", "Helsinki (global connections)"],
        ],
      },
      { type: "h2", text: "Arrivals and Meet-and-Greet" },
      {
        type: "p",
        text: "The meet-and-greet zone is on the ground floor; the arrivals exit leads directly into the main hall. ComfortLine drivers meet passengers with a name board at the customs exit. Landmark: the Coffee & Chocolate café near the main exit.",
      },
      { type: "h2", text: "Pre-Flight Tips" },
      {
        type: "ul",
        items: [
          "airBaltic requires online check-in — without it there is an approximately €30 desk fee.",
          "Carry-on: airBaltic allows only a small bag for free; a cabin bag incurs an extra charge.",
          "Free airport Wi-Fi connects via SMS verification (requires a Latvian or roaming number).",
          "Duty Free shops open after passport control — alcohol prices are noticeably lower than in Riga city.",
          "City bus No. 22 to Riga centre runs every 10–15 minutes; journey time 30 minutes.",
        ],
      },
      { type: "h2", text: "Minsk–Riga Transfer: Key Facts" },
      {
        type: "p",
        text: "The Minsk–Riga route uses Grigorovshchina–Pāternieki, the two sides of one crossing. Silene is closed. Vehicles departing Latvia require advance registration at lvborder.lv, except for statutory exemptions. Ordinary BY-plated passenger cars are banned from entering Latvia; passenger eligibility is checked separately. Allow for the entire drive, queue and airline check-in, not just a 3–4-hour pre-flight buffer.",
      },
      { type: "link", href: "/blog/driving-to-belarus-by-car-2026-rules-checker", label: "New guide: crossings, vehicles and entry eligibility", description: "Conditions for your own car and the return route differ from passenger-transfer arrangements." },
      { type: "link", href: "https://www.lvborder.lv/en/", label: "Official queue booking for vehicles leaving Latvia" },
      { type: "link", href: "https://www.vid.gov.lv/lv/jaunums/personas-ar-baltkrievijas-republika-registretu-transportlidzekli-turpmak-nevares-iebraukt-latvija", label: "Latvian Revenue Service: ban on entry of BY-registered passenger cars" },
      {
        type: "callout",
        text: "ComfortLine transfers to Riga Airport (RIX). Door-to-door pick-up, luggage assistance and live border queue information — all included.",
      },
    ],
    related: ["граница-беларусь-польша", "что-нельзя-ввозить-в-ес", "как-добраться-до-аэропорта-вильнюса"],
    ctaRoute: { label: "Заказать трансфер Минск — Рига (RIX)", labelEn: "Book Minsk–Riga (RIX) transfer", path: "/трансфер-минск-рига-аэропорт", pathEn: "/minsk-riga-airport" },
  },

  {
    slug: "автобус-минск-варшава-модлин-вильнюс",
    slugEn: "minsk-warsaw-vilnius-bus-vs-private-transfer",
    titleEn: "Minsk–Warsaw & Vilnius: Bus or Taxi",
    descriptionEn: "Comparing buses, minibuses and private transfers from Minsk to Warsaw (Chopin, Modlin) and Vilnius airports in 2026: prices, comfort and wait times.",
    ogSlug: "blog-avtobus-minsk-varshava-modlin-vilnius",
    title: "Автобус или трансфер: Минск — Варшава",
    description:
      "Расписание и цены автобусов и маршруток Минск — Варшава (аэропорты Модлин WMI и Шопен WAW) и Минск — Вильнюс в 2026.",
    intro:
      "Большинство пассажиров, летящих через Варшаву или Вильнюс, первым делом ищут автобус или маршрутку — дёшево и привычно. Но для поездки именно в аэропорт у этого варианта есть несколько критических нюансов, которые стоит знать заранее, чтобы не опоздать на рейс.",
    dateISO: "2026-06-01",
    readingMin: 11,
    category: "Советы",
    tags: ["автобус", "маршрутка", "Минск Варшава", "Модлин", "Вильнюс", "аэропорт", "трансфер", "Шопен", "как добраться", "WMI", "WAW", "VNO"],
    body: [
      { type: "h2", text: "Автобусы и маршрутки Минск — Варшава: текущие варианты" },
      {
        type: "p",
        text: "Из Минска в Варшаву регулярно ходят рейсовые автобусы и частные маршрутки. Большинство маршрутов идут на варшавский автовокзал Zachodnia или в центр города — и это ключевой момент, если вы летите из аэропорта.",
      },
      {
        type: "table",
        headers: ["Перевозчик", "Тип", "Время в пути", "Цена от", "Багаж"],
        rows: [
          ["Ecolines", "Рейсовый автобус", "8–10 ч", "25–40 €", "1 чемодан включён"],
          ["Lux Express", "Рейсовый автобус", "8–10 ч", "25–45 €", "1 чемодан включён"],
          ["Частные маршрутки", "Микроавтобус", "7–9 ч", "20–35 €", "Ограничен, зависит от водителя"],
          ["ComfortLine (трансфер)", "Частный автомобиль", "6–8 ч", "По запросу", "Без ограничений"],
        ],
      },
      {
        type: "callout",
        text: "Автобусы Минск — Варшава прибывают на автовокзал Zachodnia в центре города. До аэропорта Шопен (WAW) оттуда 30–40 мин на городском автобусе или такси. До Модлина (WMI) — отдельный автобус Modlinbus, ещё 45–60 мин. Это критически важно при расчёте времени выезда.",
      },
      { type: "h2", text: "Минск — аэропорт Модлин (WMI): как добраться на автобусе" },
      {
        type: "p",
        text: "Аэропорт Варшава Модлин (WMI) находится в 35 км к северу от центра Варшавы. Прямых автобусов из Беларуси до Модлина нет — это важно понимать при планировании поездки.",
      },
      {
        type: "ul",
        items: [
          "Шаг 1: автобус или маршрутка Минск → Варшава (автовокзал Zachodnia или центр). Время: 7–10 часов.",
          "Шаг 2: переезд в Варшаве до станции Dworzec Centralny или Młociny на метро/такси. Время: 20–40 мин.",
          "Шаг 3: автобус Modlinbus до аэропорта WMI. Время: 45–60 мин, ходит каждые 30–60 мин.",
          "Итого в пути: 9–12 часов + 2 пересадки с чемоданами.",
        ],
      },
      {
        type: "p",
        text: "При этом Modlinbus работает не круглосуточно — ранние и поздние рейсы могут не совпасть с расписанием. Если ваш самолёт улетает в 6:00–8:00 утра или прилетает после 22:00, велик шанс, что автобус Modlinbus уже не ходит.",
      },
      { type: "h2", text: "Минск — аэропорт Варшавы Шопен (WAW): варианты на автобусе" },
      {
        type: "p",
        text: "Аэропорт Варшавы Шопен (WAW) расположен в 8 км от центра — добраться проще, чем до Модлина. От автовокзала Zachodnia до WAW курсирует городской автобус 175 и экспресс-автобус, время в пути 20–35 мин.",
      },
      {
        type: "ul",
        items: [
          "Автобус 175 (городской) от Zachodnia до WAW: ~30 мин, билет ~1,5 €.",
          "Такси от автовокзала до WAW: 15–20 мин, 15–25 €.",
          "Минимальный запас времени от выхода из автобуса до начала регистрации: 2,5–3 часа.",
          "Рейсовые автобусы часто задерживаются на границе — закладывайте буфер не менее 3–4 часов.",
        ],
      },
      { type: "h2", text: "Минск — аэропорт Вильнюса (VNO): автобус и маршрутка" },
      {
        type: "p",
        text: "Вильнюс ближе к Минску — около 170–180 км. Маршруток и рейсовых автобусов на этом направлении больше, конкуренция выше, цены ниже.",
      },
      {
        type: "table",
        headers: ["Вариант", "Время в пути", "Цена от", "До аэропорта VNO"],
        rows: [
          ["Ecolines (Минск → Вильнюс)", "3–4 ч", "10–20 €", "Автовокзал в центре, такси до VNO 15 мин / 10–12 €"],
          ["Lux Express (Минск → Вильнюс)", "3–4 ч", "12–22 €", "Автовокзал, такси или автобус №1 до VNO"],
          ["Частные маршрутки", "2,5–3,5 ч", "10–18 €", "Иногда довозят до аэропорта — уточняйте"],
          ["ComfortLine (трансфер)", "2,5–3 ч", "По запросу", "Прямо к терминалу вылета"],
        ],
      },
      {
        type: "p",
        text: "Аэропорт Вильнюса находится в 5 км от центра города. Городской автобус №1 довезёт от автовокзала за 20–25 мин. Такси — 10–15 €. Это самый реалистичный маршрут «на автобусе» из трёх направлений.",
      },
      { type: "h2", text: "Частный трансфер vs автобус: честное сравнение" },
      {
        type: "p",
        text: "Автобус и маршрутка — нормальный выбор для поездки в город. Для поездки в аэропорт на конкретный рейс картина другая:",
      },
      {
        type: "table",
        headers: ["Критерий", "Автобус / маршрутка", "Частный трансфер"],
        rows: [
          ["Откуда подача", "Фиксированная остановка", "От вашей двери"],
          ["Куда доставка", "Автовокзал в центре", "Прямо к терминалу"],
          ["Расписание", "Фиксированное, нельзя перенести", "Под ваш рейс"],
          ["Задержка на границе", "Ждут все пассажиры вместе", "Водитель контролирует ситуацию"],
          ["Чемоданы", "Ограничение по количеству и размеру", "Любой объём багажа"],
          ["Дети до 12 лет", "Без детского кресла", "Детское кресло по запросу"],
          ["Домашние животные", "Как правило, запрещены", "Разрешены"],
          ["Конфиденциальность", "Общий салон", "Только ваша группа"],
          ["Гарантия посадки на рейс", "Нет (задержки часты)", "Отслеживаем границу"],
          ["Цена за группу 3–4 человека", "30–80 € × кол-во мест", "По запросу"],
        ],
      },
      { type: "h2", text: "Когда автобус точно не подходит для поездки в аэропорт" },
      {
        type: "ul",
        items: [
          "Ранний вылет (до 8:00) или поздний прилёт (после 22:00) — автобусы не совпадают по расписанию, Modlinbus не ходит.",
          "Вы летите через Модлин (WMI) — 2 пересадки с чемоданами делают поездку очень рискованной.",
          "Едут 2 и более человека — суммарная цена автобусных билетов сопоставима с трансфером.",
          "Много багажа — чемоданы, лыжное снаряжение, детские коляски.",
          "С детьми до 12 лет — в автобусе нет детских кресел.",
          "Домашние животные — большинство перевозчиков не пропускают.",
          "Стыковочный рейс с ограниченным временем — задержка на границе закрывает вылет.",
          "Важная деловая поездка — опоздание на рейс означает срыв встреч.",
        ],
      },
      { type: "h2", text: "Что подготовить для поездки в аэропорт Варшавы или Вильнюса" },
      {
        type: "h3",
        text: "Документы",
      },
      {
        type: "ul",
        items: [
          "Загранпаспорт — срок действия не менее 3 месяцев после даты возвращения.",
          "Шенгенская виза или действующий ВНЖ страны ЕС.",
          "Посадочный талон — распечатанный или в приложении авиакомпании (скачайте офлайн-версию).",
          "Медицинская страховка на весь период поездки (минимум 30 000 €).",
          "Бронирование отеля или приглашение (могут спросить на границе).",
        ],
      },
      {
        type: "h3",
        text: "Тайминг: когда выезжать из Минска",
      },
      {
        type: "table",
        headers: ["Направление", "Время в пути", "Рекомендуемый запас", "Выезд при вылете в 12:00"],
        rows: [
          ["Минск → Модлин (WMI)", "9–12 ч (+ 2 пересадки)", "4 ч до вылета", "Накануне вечером"],
          ["Минск → Шопен (WAW)", "8–10 ч (+такси/автобус)", "3 ч до вылета", "01:00–02:00 ночи"],
          ["Минск → Вильнюс (VNO)", "3–4 ч (+ такси 15 мин)", "2,5 ч до вылета", "05:30–06:00"],
          ["Трансфер ComfortLine → WAW", "6–8 ч door-to-door", "2 ч до вылета", "02:00–04:00"],
          ["Трансфер ComfortLine → WMI", "6–8 ч door-to-door", "2 ч до вылета", "02:00–04:00"],
          ["Трансфер ComfortLine → VNO", "2,5–3 ч door-to-door", "2 ч до вылета", "07:00–07:30"],
        ],
      },
      {
        type: "h3",
        text: "Что взять в поездку",
      },
      {
        type: "ul",
        items: [
          "Наличные злотые (Польша) или евро/литы (Литва) — на такси, кофе, непредвиденные расходы.",
          "Польская/литовская SIM или роуминг — для навигации и связи после пересечения границы.",
          "Зарядка и пауэрбанк — дорога занимает 3–10 часов.",
          "Вода и еда в дорогу — особенно важно с детьми и при ранних выездах.",
          "Подушка и плед — для ночных поездок.",
          "Страховой полис в приложении или распечатанный.",
        ],
      },
      { type: "h2", text: "Частые вопросы о поездке в аэропорт Варшавы и Вильнюса" },
      {
        type: "h3",
        text: "Можно ли уехать на маршрутке и успеть на утренний рейс?",
      },
      {
        type: "p",
        text: "Зависит от аэропорта. На Вильнюс (VNO) — да, если вылет не раньше 10:00 и граница пройдёт быстро. На Варшаву Шопен (WAW) — рискованно при вылете раньше 13:00. На Модлин (WMI) — крайне рискованно при любом утреннем рейсе из-за 2 пересадок.",
      },
      {
        type: "h3",
        text: "Что будет, если автобус задержится на границе?",
      },
      {
        type: "p",
        text: "Автобус ждёт пока все пассажиры пройдут паспортный контроль — это может занять 1–4 часа. Пересесть на другой транспорт в середине очереди практически невозможно. Водитель частного трансфера отслеживает загруженность КПП и при необходимости перестраивается на другой пункт пропуска.",
      },
      {
        type: "h3",
        text: "Дешевле ли автобус, если едем вдвоём?",
      },
      {
        type: "p",
        text: "До Вильнюса — да, автобус выгоднее. До Варшавы вдвоём автобус стоит 50–90 €, плюс такси до аэропорта 15–25 € × 2 + риск задержки. Трансфер на двоих до WAW — цена по запросу, но без пересадок, от двери до терминала. При двух и более пассажирах разница часто оказывается меньше, чем кажется.",
      },
      {
        type: "h3",
        text: "Везут ли маршрутки прямо в аэропорт?",
      },
      {
        type: "p",
        text: "Некоторые частные маршрутки предлагают доставку до аэропорта Вильнюса — уточняйте при бронировании. До Варшавы такой опции практически нет: маршрутки идут в центр, дальше самостоятельно. Это стоит уточнять у конкретного перевозчика заранее.",
      },
      {
        type: "callout",
        text: "ComfortLine выполняет трансферы из любой точки Беларуси прямо к терминалу вылета — Модлин, Шопен или Вильнюс. Выезд в удобное вам время, детские кресла, помощь с багажом и актуальная информация по очереди на границе. Цена фиксирована — никаких сюрпризов.",
      },
    ],
    categoryEn: "Travel Tips",
    introEn:
      "Most passengers flying through Warsaw or Vilnius start by searching for a bus or minibus — cheap and familiar. But for a trip to the airport specifically, this option has several critical nuances worth knowing in advance to avoid missing your flight.",
    bodyEn: [
      { type: "h2", text: "Buses and Minibuses Minsk–Warsaw: Current Options" },
      {
        type: "p",
        text: "Scheduled buses and private minibuses run regularly from Minsk to Warsaw. Most routes terminate at Warsaw's Zachodnia bus station or the city centre — and this is a crucial point if you are flying from an airport.",
      },
      {
        type: "table",
        headers: ["Operator", "Type", "Journey time", "From", "Luggage"],
        rows: [
          ["Ecolines", "Scheduled bus", "8–10 h", "€25–40", "1 suitcase included"],
          ["Lux Express", "Scheduled bus", "8–10 h", "€25–45", "1 suitcase included"],
          ["Private minibuses", "Minibus", "7–9 h", "€20–35", "Limited, driver-dependent"],
          ["ComfortLine (transfer)", "Private car", "6–8 h", "On request", "No limits"],
        ],
      },
      {
        type: "callout",
        text: "Minsk–Warsaw buses arrive at Zachodnia bus station in the city centre. From there to Chopin Airport (WAW): 30–40 min by city bus or taxi. To Modlin (WMI): a separate Modlinbus, another 45–60 min. This is critical when calculating your departure time.",
      },
      { type: "h2", text: "Minsk to Modlin Airport (WMI): Getting There by Bus" },
      {
        type: "p",
        text: "Warsaw Modlin Airport (WMI) is 35 km north of Warsaw city centre. There are no direct buses from Belarus to Modlin — this is important to understand when planning your trip.",
      },
      {
        type: "ul",
        items: [
          "Step 1: bus or minibus Minsk → Warsaw (Zachodnia or city centre). Time: 7–10 hours.",
          "Step 2: travel within Warsaw to Dworzec Centralny or Młociny by metro/taxi. Time: 20–40 min.",
          "Step 3: Modlinbus to WMI airport. Time: 45–60 min; runs every 30–60 min.",
          "Total journey: 9–12 hours + 2 connections with luggage.",
        ],
      },
      {
        type: "p",
        text: "Modlinbus does not operate around the clock — early-morning and late-night flights may not align with the timetable. If your plane departs at 6:00–8:00 or lands after 22:00, Modlinbus may no longer be running.",
      },
      { type: "h2", text: "Minsk to Chopin Airport Warsaw (WAW): Bus Options" },
      {
        type: "p",
        text: "Warsaw Chopin Airport (WAW) is 8 km from the city centre — easier to reach than Modlin. City bus 175 and the express bus run from Zachodnia to WAW, journey time 20–35 min.",
      },
      {
        type: "ul",
        items: [
          "Bus 175 (city) from Zachodnia to WAW: ~30 min, ticket ~€1.50.",
          "Taxi from bus station to WAW: 15–20 min, €15–25.",
          "Minimum buffer from stepping off the bus to check-in opening: 2.5–3 hours.",
          "Scheduled buses often get delayed at the border — allow a buffer of at least 3–4 hours.",
        ],
      },
      { type: "h2", text: "Minsk to Vilnius Airport (VNO): Bus and Minibus" },
      {
        type: "p",
        text: "Vilnius is closer to Minsk — about 170–180 km. There are more minibuses and scheduled buses on this route, more competition and lower prices.",
      },
      {
        type: "table",
        headers: ["Option", "Journey time", "From", "To VNO airport"],
        rows: [
          ["Ecolines (Minsk → Vilnius)", "3–4 h", "€10–20", "City bus station; taxi to VNO 15 min / €10–12"],
          ["Lux Express (Minsk → Vilnius)", "3–4 h", "€12–22", "Bus station, taxi or bus No.1 to VNO"],
          ["Private minibuses", "2.5–3.5 h", "€10–18", "Some go to the airport — confirm when booking"],
          ["ComfortLine (transfer)", "2.5–3 h", "On request", "Directly to the departure terminal"],
        ],
      },
      {
        type: "p",
        text: "Vilnius Airport is 5 km from the city centre. City bus No. 1 from the bus station takes 20–25 min. Taxi — €10–15. This is the most realistic 'bus option' of the three directions.",
      },
      { type: "h2", text: "Private Transfer vs Bus: An Honest Comparison" },
      {
        type: "p",
        text: "A bus or minibus is a perfectly reasonable choice for travelling to a city. For travelling to a specific airport for a specific flight, the picture changes:",
      },
      {
        type: "table",
        headers: ["Criterion", "Bus / minibus", "Private transfer"],
        rows: [
          ["Pick-up point", "Fixed stop", "From your door"],
          ["Drop-off point", "City bus station", "Directly to the terminal"],
          ["Schedule", "Fixed, cannot be changed", "Matched to your flight"],
          ["Border delay", "All passengers wait together", "Driver monitors the situation"],
          ["Luggage", "Quantity and size restrictions", "Any amount of luggage"],
          ["Children under 12", "No child seats", "Child seat on request"],
          ["Pets", "Generally prohibited", "Allowed"],
          ["Privacy", "Shared cabin", "Your group only"],
          ["Guarantee of making the flight", "None (delays are frequent)", "We track the border"],
          ["Price for a group of 3–4", "€30–80 × per seat", "On request"],
        ],
      },
      { type: "h2", text: "When a Bus Is Definitely Not Suitable for Airport Travel" },
      {
        type: "ul",
        items: [
          "Early departure (before 08:00) or late arrival (after 22:00) — buses don't align with timetables, Modlinbus doesn't run.",
          "You are flying via Modlin (WMI) — 2 connections with luggage make the journey very risky.",
          "Two or more passengers — the combined cost of bus tickets is comparable to a transfer.",
          "Heavy luggage — suitcases, ski equipment, pushchairs.",
          "With children under 12 — buses have no child seats.",
          "Pets — most operators don't allow them.",
          "Connecting flight with limited time — a border delay cancels your flight.",
          "An important business trip — missing a flight means missing meetings.",
        ],
      },
      { type: "h2", text: "What to Prepare for Your Airport Journey" },
      { type: "h3", text: "Documents" },
      {
        type: "ul",
        items: [
          "International passport — valid for at least 3 months beyond your return date.",
          "Schengen visa or valid EU residence permit.",
          "Boarding pass — printed or in the airline app (download the offline version).",
          "Medical insurance for the full trip duration (minimum €30,000).",
          "Hotel booking or invitation (may be requested at the border).",
        ],
      },
      { type: "h3", text: "Timing: When to Leave Minsk" },
      {
        type: "table",
        headers: ["Route", "Journey time", "Recommended buffer", "Departure for a 12:00 flight"],
        rows: [
          ["Minsk → Modlin (WMI)", "9–12 h (+ 2 connections)", "4 h before departure", "Evening before"],
          ["Minsk → Chopin (WAW)", "8–10 h (+taxi/bus)", "3 h before departure", "01:00–02:00"],
          ["Minsk → Vilnius (VNO)", "3–4 h (+ taxi 15 min)", "2.5 h before departure", "05:30–06:00"],
          ["ComfortLine transfer → WAW", "6–8 h door-to-door", "2 h before departure", "02:00–04:00"],
          ["ComfortLine transfer → WMI", "6–8 h door-to-door", "2 h before departure", "02:00–04:00"],
          ["ComfortLine transfer → VNO", "2.5–3 h door-to-door", "2 h before departure", "07:00–07:30"],
        ],
      },
      { type: "h3", text: "What to Pack" },
      {
        type: "ul",
        items: [
          "Polish złoty (Poland) or euros (Lithuania) in cash — for a taxi, coffee and unexpected costs.",
          "Polish/Lithuanian SIM or roaming — for navigation and calls after crossing the border.",
          "Charger and power bank — the journey takes 3–10 hours.",
          "Water and food — especially important with children and for early-morning departures.",
          "Travel pillow and blanket — for night journeys.",
          "Insurance policy in the app or printed.",
        ],
      },
      { type: "h2", text: "Frequently Asked Questions" },
      { type: "h3", text: "Can I take a minibus and make an early-morning flight?" },
      {
        type: "p",
        text: "It depends on the airport. For Vilnius (VNO) — yes, if the flight is no earlier than 10:00 and the border is quick. For Warsaw Chopin (WAW) — risky for departures before 13:00. For Modlin (WMI) — extremely risky for any morning flight due to 2 connections.",
      },
      { type: "h3", text: "What happens if the bus gets delayed at the border?" },
      {
        type: "p",
        text: "The bus waits until every passenger has cleared passport control — this can take 1–4 hours. Switching to another vehicle in the middle of the queue is virtually impossible. A private transfer driver monitors checkpoint congestion and can reroute to a different crossing if necessary.",
      },
      { type: "h3", text: "Is a bus cheaper if there are two of us?" },
      {
        type: "p",
        text: "To Vilnius — yes, the bus is cheaper. To Warsaw for two, two bus tickets come to €50–90 plus taxi to the airport €15–25 each, plus the risk of delay. A transfer for two to WAW is available on request — no connections, door to terminal. For two or more passengers the price difference is often smaller than it appears.",
      },
      { type: "h3", text: "Do minibuses go directly to the airport?" },
      {
        type: "p",
        text: "Some private minibuses offer drop-off at Vilnius Airport — confirm when booking. For Warsaw, this option barely exists: minibuses go to the city centre, from where you continue independently. Always check with the specific operator in advance.",
      },
      {
        type: "callout",
        text: "ComfortLine transfers from any point in Belarus directly to the departure terminal — Modlin, Chopin or Vilnius. Departure at a time convenient for you, child seats, luggage assistance and live border queue information. Fixed price — no surprises.",
      },
    ],
    related: ["стоимость-трансфер-минск-варшава", "аэропорт-варшавы-вав", "как-добраться-до-аэропорта-вильнюса"],
    ctaRoute: { label: "Рассчитать стоимость трансфера в аэропорт", labelEn: "Get a transfer quote to the airport", path: "/трансфер-минск-варшава-модлин", pathEn: "/minsk-warsaw-modlin-airport" },
  },
  {
    slug: "виза-свободный-въезд-в-беларусь-2026",
    slugEn: "visa-free-entry-belarus-2026",
    titleEn: "Visa-Free Entry to Belarus: Guide",
    descriptionEn: "Which European countries can enter Belarus without a visa in 2026, which border checkpoints to use, required documents, and private transfer options.",
    ogSlug: "blog-visa-free-belarus-2026",
    title: "Безвизовый въезд в Беларусь: гайд",
    description:
      "Кто может въехать в Беларусь без визы в 2026 году, через какие КПП, какие документы нужны — и почему частный трансфер это самый удобный способ добраться.",
    intro:
      "Беларусь открыта для гостей из Европы: в 2026 году граждане десятков стран могут въехать без оформления визы. Замки Мир и Несвиж, Беловежская пуща, Брестская крепость, рестораны Минска — всё это доступно без визовых хлопот. Разбираем действующие режимы, нужные документы, пограничные переходы и лучший способ добраться.",
    dateISO: "2026-06-13",
    dateModified: "2026-10-16",
    disclaimerBanner: true,
    readingMin: 12,
    category: "Въезд в Беларусь",
    tags: ["безвиз", "въезд в Беларусь", "документы", "Европа", "туризм"],
    body: [
      {
        type: "callout",
        text: "Актуальный официальный список стран и условий безвизового въезда публикует Министерство иностранных дел Республики Беларусь: mfa.gov.by/visa/freemove/general/ — проверяйте перед поездкой, правила периодически обновляются.",
      },
      { type: "h2", text: "Два основных безвизовых режима в 2026 году" },
      { type: "editorial-correction", heading: "Условия перепроверены 16 октября 2026", text: "Наземный европейский безвиз: 38 государств, до 31.12.2026, суммарно не более 90 суток за календарный год. Аэропортовый безвиз — другой режим: выезд по нему только через указанные аэропорты. Въезд в Беларусь, возвращение в ЕС и допуск автомобиля проверяются отдельно." },
      { type: "link", href: "https://mfa.gov.by/en/visa/freemove/europe", label: "МИД Беларуси: наземный безвиз, страны, сроки и исключения" },
      { type: "link", href: "https://mfa.gov.by/en/visa/freemove/airport", label: "МИД Беларуси: аэропортовый безвиз и дополнительные документы" },
      { type: "link", href: "/блог/как-въехать-в-беларусь-на-автомобиле-2026", label: "Новый гайд: автомобиль, КПП и обратный въезд", description: "Виза или безвиз пассажира не отменяет санкции и таможенные требования к машине." },
      {
        type: "p",
        text: "Беларусь предлагает два основных формата безвизового въезда, различающихся по способу прибытия: воздушный и наземный. Помимо них существуют специальные региональные программы (Гродненская область, Августовский канал). Важно заранее определить, какой режим подходит именно вам.",
      },
      {
        type: "table",
        headers: ["Режим", "Длительность", "Въезд через", "Охват стран"],
        rows: [
          ["Аэропорты Беларуси", "до 30 суток", "Въезд и выезд: Минск, Брест, Витебск, Гомель, Гродно, Могилёв; не рейсы из/в РФ", "76 государств"],
          ["Наземная граница (авто и ж/д)", "до 30 суток за въезд; PL/LT/LV и неграждане Латвии — до 90; всего не более 90 суток в календарном году", "Работающие международные автодорожные и железнодорожные КПП", "38 европейских государств; до 31.12.2026"],
        ],
      },
      { type: "h2", text: "Режим 1 — через аэропорты Беларуси: до 30 суток" },
      {
        type: "p",
        text: "Аэропортовый режим до 30 суток относится к гражданам 76 государств из отдельного списка МИД. Въезд и выезд — только через Национальный аэропорт Минск и аэропорты Бреста, Витебска, Гомеля, Гродно, Могилёва. Рейсы из России и в Россию исключены. Для ряда гражданств нужны дополнительные документы, включая использованную многократную визу ЕС/Шенгена и билет на вылет; проверьте свою страну по ссылке МИД ниже.",
      },
      {
        type: "ul",
        items: [
          "Срок пребывания — не более 30 суток со дня въезда.",
          "Въезд — через Нац. аэропорт Минск (MSQ), аэропорты Бреста, Витебска, Гомеля, Гродно, Могилёва.",
          "Режим не распространяется на рейсы из России и в Россию.",
          "Выезд — только через один из шести перечисленных аэропортов, не через наземную границу.",
          "Цель визита — туризм, деловые встречи, транзит, посещение родственников.",
          "При себе обязательно: медицинская страховка с покрытием в Беларуси.",
        ],
      },
      {
        type: "callout",
        text: "Аэропортовый безвиз не действует автоматически для любого пассажира и не разрешает выехать по земле. Если вы прилетаете в Вильнюс, Варшаву или Ригу и затем едете в Беларусь на автомобиле, нужен наземный безвиз, отдельное соглашение или виза. Проверяйте фактическое авиасообщение, не предполагая наличие прямых рейсов в Минск из ЕС.",
      },
      { type: "h2", text: "Режим 2 — наземная и железнодорожная граница: до 30 суток" },
      {
        type: "p",
        text: "По странице МИД, проверенной 16 октября 2026 года, наземный безвиз охватывает 38 европейских государств и действует до 31 декабря 2026 года включительно. Обычный срок — до 30 суток за въезд; гражданам Польши, Литвы, Латвии и негражданам Латвии — до 90 суток. Для всех действует общий предел 90 суток в календарном году. Въезд возможен через работающие международные автодорожные и железнодорожные КПП; транзит в Россию этим режимом не разрешён.",
      },
      {
        type: "ul",
        items: [
          "Въезд — через работающий международный автодорожный или железнодорожный КПП; ограничения соседней страны проверяются отдельно.",
          "Срок пребывания — до 30 суток для большинства стран.",
          "Для граждан Польши, Литвы, Латвии и лиц со статусом негражданина Латвии — до 90 суток.",
          "Охват: 38 европейских государств; для Эстонии также указаны постоянно проживающие там лица без гражданства. Полный список и документы — на странице МИД о европейском безвизе.",
          "Повторные въезды возможны до 31.12.2026, но не обнуляют предел 90 суток за календарный год.",
          "Медицинская страховка обязательна.",
        ],
      },
      {
        type: "callout",
        text: "Для граждан Польши, Литвы, Латвии и неграждан Латвии — до 90 суток за въезд, но суммарно не более 90 суток в календарном году по этому режиму. Право въезда в Беларусь не заменяет право вернуться в ЕС и допуск автомобиля.",
      },
      { type: "h3", text: "Специальные региональные программы" },
      {
        type: "p",
        text: "Региональный туристический безвиз Брест–Гродно — отдельная программа с территориальными ограничениями и требованиями к туристическим документам. Не смешивайте её с общенациональным европейским безвизом и не используйте старые списки КПП: наличие перехода в описании программы не означает, что он открыт. Условия конкретного маршрута уточняйте в МИД и у пограничной службы.",
      },
      { type: "h2", text: "Страны с правом безвизового въезда" },
      {
        type: "p",
        text: "МИД публикует отдельные списки для аэропортового режима, европейского наземного безвиза и двусторонних соглашений. Проверяйте гражданство и тип документа именно по своему режиму:",
      },
      {
        type: "ul",
        items: [
          "Аэропортовый список — 76 государств; у некоторых гражданств есть дополнительные визовые и билетные условия.",
          "Европейский наземный безвиз — 38 государств по списку МИД, до 31.12.2026.",
          "Отдельные двусторонние соглашения могут давать иные сроки и основания въезда; не переносите их условия на аэропортовый режим.",
        ],
      },
      {
        type: "link",
        href: "https://mfa.gov.by/en/visa/freemove/airport",
        label: "Официальный список стран и актуальные условия — МИД Республики Беларусь",
        description: "Проверяйте перед поездкой: правила могут обновляться",
      },
      { type: "h2", text: "Какие документы нужны на границе" },
      {
        type: "p",
        text: "Пакет документов небольшой, но каждый из них обязателен. Пограничники Беларуси проверяют их внимательно — лучше подготовиться заранее.",
      },
      {
        type: "ol",
        items: [
          "Действующий паспорт или иной признаваемый проездной документ для вашего режима. Для аэропортового безвиза — обычный паспорт, действующий не менее 90 дней после планируемого выезда.",
          "Медицинская страховка на весь срок пребывания, действующая в Беларуси, с покрытием не менее 10 000 евро. EHIC не заменяет такой полис.",
          "Документы, подтверждающие цель поездки: бронь отеля, приглашение, программа деловой встречи, туристический маршрут.",
          "Средства к существованию: для аэропортового режима МИД указывает не менее двух базовых величин за день или 50 базовых величин за полные 30 суток. Пересчитайте по действующим величине и курсу; для своего режима проверьте условия отдельно.",
          "Для несовершеннолетних без обоих родителей — нотариально заверенное согласие на выезд от родителей или законных представителей.",
        ],
      },
      { type: "h3", text: "Медицинская страховка: на что обратить внимание" },
      {
        type: "p",
        text: "Проверьте территорию действия, срок и покрытие полиса. EHIC не заменяет страховку для Беларуси. При необходимости оформите отдельный полис до поездки; стоимость и условия уточняйте у страховщика.",
      },
      { type: "h3", text: "Нужна ли регистрация по месту пребывания" },
      {
        type: "p",
        text: "Гостиницы оформляют регистрацию при заселении. МИД указывает необходимость регистрации при пребывании более 10 рабочих дней — в подразделении по гражданству и миграции или через portal.gov.by. Проверьте применимые к вашему гражданству исключения и сроки заранее.",
      },
      { type: "h2", text: "Почему частный трансфер — это лучший вариант для въезда в Беларусь" },
      {
        type: "p",
        text: "Можно прилететь в Варшаву, Вильнюс, Ригу или Каунас, а затем ехать в Беларусь по земле — только при наличии права наземного въезда. Аэропортовый безвиз Беларуси для такого маршрута не подходит. Ниже сравниваем автобусы и частный трансфер.",
      },
      {
        type: "table",
        headers: ["Критерий", "Автобус/маршрутка", "Частный трансфер ComfortLine"],
        rows: [
          ["Место отправления", "Автобусная станция", "Ваш отель, аэропорт или адрес"],
          ["Место прибытия", "Автовокзал в Минске", "Ваш отель или адрес в Беларуси"],
          ["Расписание", "Фиксированное", "Под ваш рейс или удобное время"],
          ["Поддержка на границе", "Нет", "Водитель помогает, знает процедуру"],
          ["Время в пути", "4–7 ч + ожидание пересадки", "Прямо от точки А до точки Б"],
          ["Комфорт", "Сидячие места, ограничен багаж", "Бизнес-авто, кондиционер, wi-fi"],
          ["Детские кресла", "Нет", "По запросу, бесплатно"],
          ["Гибкость маршрута", "Нет", "Остановки, объезды — по желанию"],
        ],
      },
      { type: "h3", text: "Граница: почему с нами проще" },
      {
        type: "p",
        text: "Пересечение белорусско-литовской или белорусско-польской границы может занять от 2 до 8 часов в зависимости от дня недели и времени суток. Наши водители проходят этот маршрут регулярно — они знают, в каком окне меньше очередь, когда лучше выехать и как подготовить документы так, чтобы таможня прошла быстрее. Это особенно важно для тех, кто впервые пересекает границу Беларуси.",
      },
      {
        type: "ul",
        items: [
          "Водитель заранее предупредит, какой пакет документов нужно держать под рукой.",
          "Актуальная информация об очерёдности на КПП — отслеживаем в режиме реального времени.",
          "При длительном ожидании — комфортный автомобиль, климат-контроль, возможность поспать.",
          "Детские кресла, помощь с багажом — входит в стандарт.",
          "Вас встретят в аэропорту с табличкой и проводят к автомобилю.",
        ],
      },
      { type: "h2", text: "Популярные маршруты из Европы в Беларусь" },
      { type: "h3", text: "Вильнюс / Аэропорт VNO → Минск" },
      {
        type: "p",
        text: "Из аэропорта Вильнюса в Беларусь едут через Каменный Лог–Мядининкай или Бенякони–Шальчининкай, если они работают в день поездки. Котловка–Лаворишкес закрыт. Для этого маршрута нужен наземный безвиз, другое действующее основание или виза. Время в пути зависит от выбранного КПП и очереди.",
      },
      { type: "h3", text: "Варшава / Аэропорт WAW и Модлин → Минск" },
      {
        type: "p",
        text: "Варшава — крупнейший хаб для рейсов из Западной Европы, Северной Америки и Азии. От Варшавы до Минска около 550 км — это полноценная дорожная поездка. Граница в районе Тересполь / Брест-Тересполь. Маршрут популярен у тех, кто летит через Варшаву и хочет продолжить путь в Беларусь без пересадок.",
      },
      { type: "h3", text: "Каунас / Аэропорт KUN → Минск" },
      {
        type: "p",
        text: "Аэропорт Каунаса — база Ryanair и других лоукостеров. Прямые рейсы в Каунас из десятков европейских городов по выгодным тарифам. Расстояние Каунас–Минск около 270 км. Маршрут проходит через тот же белорусско-литовский погранпереход, что и Вильнюс.",
      },
      { type: "h3", text: "Рига / Аэропорт RIX → Минск" },
      {
        type: "p",
        text: "Из Риги едут через Григоровщину–Патерниеки: это две стороны одного перехода, не альтернативные КПП. Силене закрыт. Для выезда из Латвии на авто нужна запись на lvborder.lv, кроме предусмотренных законом исключений. Проверьте статус КПП и заложите запас; возвращение обычного легкового авто на BY-номерах через Латвию запрещено.",
      },
      { type: "link", href: "https://www.lvborder.lv/en/", label: "Официальная латвийская запись в автомобильную очередь" },
      { type: "link", href: "https://www.vid.gov.lv/en/article/operation-silene-border-crossing-point-halted-19-september-2023", label: "СГД Латвии: Силене закрыт, маршрут через Патерниеки" },
      { type: "h2", text: "Что посмотреть в Беларуси: топ-10 направлений" },
      {
        type: "p",
        text: "Беларусь удивляет гостей сочетанием природы, истории и доступных цен. Вот что стоит включить в маршрут:",
      },
      {
        type: "ul",
        items: [
          "Мирский замок — объект Всемирного наследия ЮНЕСКО, один из красивейших замков Восточной Европы. 100 км от Минска.",
          "Несвижский дворцово-парковый комплекс — резиденция рода Радзивиллов, тоже в списке ЮНЕСКО. Рядом с Миром.",
          "Брестская крепость — мощный мемориальный комплекс, символ стойкости. 350 км от Минска.",
          "Беловежская пуща — древнейший первобытный лес Европы, резиденция Деда Мороза, зубры в дикой природе.",
          "Гродно — исторический город с польским и литовским влиянием, старинные костёлы, замки, уютные кафе.",
          "Минск — современная столица с широкими проспектами, сталинской архитектурой, развитой гастросценой и музеями.",
          "Дудутки — этнографический музей под открытым небом с мастерскими, конными прогулками и белорусской кухней.",
          "Хатынь — мемориальный комплекс в память о сожжённых деревнях Беларуси.",
          "Страусиная ферма в Большой Своротве — неожиданно популярный аттракцион для семей с детьми.",
          "Августовский канал — живописный водный путь вдоль польско-белорусской границы, идеален для прогулок и велопоходов.",
        ],
      },
      { type: "h2", text: "Практические советы перед поездкой" },
      {
        type: "table",
        headers: ["Вопрос", "Ответ"],
        rows: [
          ["Нужна ли белорусская валюта?", "Белорусский рубль (BYN). Карты Visa/Mastercard принимают большинство магазинов и ресторанов, но иметь наличные полезно."],
          ["Работают ли карты в Беларуси?", "Карты, выпущенные в странах ЕС, могут не приниматься после 2022 года — уточняйте у банка. МИР, Union Pay работают."],
          ["Мобильный интернет?", "Роуминг ЕС в Беларуси не действует. Рекомендуем купить белорусскую SIM-карту (A1, MTS, life:)) по прилёту — от 5 BYN."],
          ["Безопасность?", "Беларусь традиционно считается одной из самых безопасных стран региона по уровню уличной преступности."],
          ["Языковой барьер?", "В Минске молодое поколение неплохо говорит по-английски, особенно в сфере туризма. В регионах — сложнее. Водители ComfortLine общаются на английском."],
        ],
      },
      { type: "h2", text: "Часто задаваемые вопросы" },
      { type: "h3", text: "Можно ли въехать по внутреннему паспорту ЕС?" },
      {
        type: "p",
        text: "Не считайте любую ID-карту ЕС достаточным документом для Беларуси. Для аэропортового режима МИД требует обычный паспорт, а для европейского наземного режима указывает действительный проездной документ. Признание именно вашего документа и его срок действия подтвердите в консульстве до поездки.",
      },
      { type: "h3", text: "Нужна ли виза при въезде через польскую или литовскую границу?" },
      {
        type: "p",
        text: "Для граждан 38 европейских государств действует наземный безвиз до 31.12.2026: обычно 30 суток за въезд, для PL/LT/LV и неграждан Латвии — 90, всего не более 90 суток за календарный год. Для других гражданств проверьте отдельные безвизовые соглашения или необходимость визы. Аэропортовый режим для 76 государств не разрешает въезд по земле.",
      },
      { type: "h3", text: "Что будет, если превысить 30-дневный лимит?" },
      {
        type: "p",
        text: "Нарушение сроков пребывания влечёт административную ответственность — штраф и возможный запрет на въезд. Выезжайте строго до истечения разрешённого срока.",
      },
      { type: "h3", text: "Можно ли въехать и сразу выехать, чтобы обнулить дни?" },
      {
        type: "p",
        text: "Нет: выезд не обнуляет суммарный лимит. Европейский наземный безвиз допускает повторные въезды до 31.12.2026, но всего не более 90 суток в календарном году. Для более долгого пребывания заранее оформите подходящее законное основание.",
      },
      { type: "h3", text: "Можно ли работать в Беларуси по безвизовому режиму?" },
      {
        type: "p",
        text: "Нет. Безвизовый режим предполагает туристические и деловые поездки без трудоустройства. Для работы нужно соответствующее разрешение и виза.",
      },
      {
        type: "callout",
        text: "ComfortLine выполняет трансферы из Вильнюса, Каунаса, Варшавы, Риги и других европейских городов прямо до вашего адреса в Беларуси. Один звонок — и комфортный автомобиль с русскоязычным водителем заберёт вас у терминала прилёта. Детские кресла, помощь с документами на границе, актуальная информация об очередях — всё включено.",
      },
      { type: "h2", id: "official-sources", text: "Официальные источники" },
      { type: "link", href: "https://mfa.gov.by/visa/freemove/general/", label: "Безвизовый въезд — Министерство иностранных дел Республики Беларусь — mfa.gov.by", description: "Официальный актуальный список стран и условия безвизового въезда в Беларусь" },
      { type: "link", href: "https://gpk.gov.by/", label: "Государственный пограничный комитет Республики Беларусь — gpk.gov.by", description: "Официальная информация о пограничных переходах, условиях въезда и пребывания" },
      { type: "link", href: "https://gtk.gov.by", label: "Государственный таможенный комитет Беларуси — gtk.gov.by", description: "Таможенные правила, нормы ввоза и вывоза товаров" },
      { type: "info-notice", text: "Правила безвизового въезда, сроки пребывания и перечень стран могут изменяться. Перед поездкой проверяйте актуальную информацию на официальном сайте МИД Беларуси." },
    ],
    categoryEn: "Entering Belarus",
    introEn:
      "Belarus is open to European visitors: in 2026, citizens of dozens of countries can enter without a visa. Mir and Nesvizh Castles, Białowieża Forest, Brest Fortress, Minsk restaurants — all of it without any visa paperwork. Here we cover the current entry regimes, required documents, border crossings and the most comfortable way to get there.",
    bodyEn: [
      {
        type: "callout",
        text: "The official list of countries and visa-free entry conditions is published by the Ministry of Foreign Affairs of the Republic of Belarus: mfa.gov.by/visa/freemove/general/ — check before your trip, rules are updated periodically.",
      },
      { type: "h2", text: "Two Main Visa-Free Entry Regimes in 2026" },
      { type: "editorial-correction", heading: "Conditions rechecked on 16 October 2026", text: "The European land waiver covers 38 states until 31 December 2026, with a combined maximum of 90 days per calendar year. The airport waiver is separate: departure under it must be through the listed airports. Entry to Belarus, return to the EU and vehicle admission are separate checks." },
      { type: "link", href: "https://mfa.gov.by/en/visa/freemove/europe", label: "Belarus MFA: land waiver, countries, limits and exceptions" },
      { type: "link", href: "https://mfa.gov.by/en/visa/freemove/airport", label: "Belarus MFA: airport waiver and additional documents" },
      { type: "link", href: "/blog/driving-to-belarus-by-car-2026-rules-checker", label: "New guide: vehicles, crossings and the return journey", description: "Passenger visa or waiver eligibility does not remove vehicle sanctions or customs requirements." },
      {
        type: "p",
        text: "Belarus offers two main visa-free entry formats differing by arrival method: by air and by land. There are also special regional programmes (Grodno region, Augustów Canal). It is important to determine which regime applies to you before you travel.",
      },
      {
        type: "table",
        headers: ["Regime", "Duration", "Entry via", "Countries covered"],
        rows: [
          [
            "Belarusian airports",
            "up to 30 days",
            "Entry and exit: Minsk, Brest, Vitebsk, Gomel, Grodno, Mogilev; no flights from/to Russia",
            "76 states",
          ],
          [
            "Land border (road & rail)",
            "up to 30 days per entry; PL/LT/LV citizens and Latvian non-citizens — up to 90; maximum 90 days per calendar year",
            "Operating international road and railway border crossings",
            "38 European states; until 31 December 2026",
          ],
        ],
      },
      { type: "h2", text: "Regime 1 — Belarusian Airports: Up to 30 Days" },
      {
        type: "p",
        text: "The airport waiver allows citizens of the 76 states on the MFA's separate list to stay for up to 30 days. Both entry and exit must be via Minsk National Airport or the airports of Brest, Vitebsk, Gomel, Grodno or Mogilev. Flights from and to Russia are excluded. Some nationalities need additional documents, including a previously used multiple-entry EU/Schengen visa and an outbound flight ticket; check your country on the MFA page below.",
      },
      {
        type: "ul",
        items: [
          "Duration — no more than 30 days from the date of entry.",
          "Entry — through Minsk National Airport (MSQ), airports of Brest, Vitebsk, Gomel, Grodno, Mogilev.",
          "The regime does not apply to flights from or to Russia.",
          "Exit — only through one of the six listed airports, not through a land crossing.",
          "Purpose — tourism, business meetings, transit, visiting relatives.",
          "Required: medical insurance valid in Belarus.",
        ],
      },
      {
        type: "callout",
        text: "The airport waiver is not automatic for every passenger and does not allow departure by land. If you fly to Vilnius, Warsaw or Riga and then drive to Belarus, you need the land-entry waiver, a separate visa-free agreement or a visa. Check actual flight connections rather than assuming direct EU–Minsk flights exist.",
      },
      { type: "h2", text: "Regime 2 — Land and Railway Border: Up to 30 Days" },
      {
        type: "p",
        text: "The MFA page checked on 16 October 2026 covers 38 European states through 31 December 2026 inclusive. The usual limit is 30 days per entry; citizens of Poland, Lithuania and Latvia, including holders of Latvia's non-citizen status, may stay up to 90 days. All are subject to a combined maximum of 90 days per calendar year. Entry is via operating international road and railway checkpoints; this scheme does not permit transit to Russia.",
      },
      {
        type: "ul",
        items: [
          "Entry — through an operating international road or railway checkpoint; check the neighbouring country's restrictions separately.",
          "Duration — up to 30 days for most countries.",
          "For citizens of Poland, Lithuania and Latvia, including holders of Latvia's non-citizen status — up to 90 days per entry.",
          "Coverage: 38 European states; the Estonia entry also includes stateless permanent residents. Check the MFA's European waiver page for the full list and travel documents.",
          "Repeated entries are allowed until 31 December 2026, but do not reset the 90-day calendar-year total.",
          "Medical insurance is mandatory.",
        ],
      },
      {
        type: "callout",
        text: "Polish, Lithuanian and Latvian citizens and Latvian non-citizens may stay up to 90 days per entry, but no more than 90 days per calendar year under this scheme. Permission to enter Belarus does not establish the right to return to the EU or the vehicle's admissibility.",
      },
      { type: "h3", text: "Special Regional Programmes" },
      {
        type: "p",
        text: "The Brest–Grodno regional tourist waiver is a separate programme with territorial limits and tourist-document requirements. Do not confuse it with the nationwide European waiver or rely on old crossing lists: a checkpoint named in a programme is not necessarily open. Confirm your specific route with the MFA and border authorities.",
      },
      { type: "h2", text: "Countries with Visa-Free Entry Rights" },
      {
        type: "p",
        text: "The MFA publishes separate lists for the airport scheme, the European land waiver and bilateral agreements. Check your nationality and document type under the scheme you will actually use:",
      },
      {
        type: "ul",
        items: [
          "Airport list — 76 states; some nationalities have additional visa and flight-ticket requirements.",
          "European land waiver — 38 states on the MFA list, until 31 December 2026.",
          "Separate bilateral agreements can provide different durations or entry rights; do not transfer those conditions to the airport scheme.",
        ],
      },
      {
        type: "link",
        href: "https://mfa.gov.by/en/visa/freemove/airport",
        label: "Official list of countries and current conditions — Ministry of Foreign Affairs of Belarus",
        description: "Check before your trip: rules may be updated",
      },
      { type: "h2", text: "Documents Required at the Border" },
      {
        type: "p",
        text: "The document pack is short but every item is mandatory. Belarusian border guards check carefully — it is best to prepare in advance.",
      },
      {
        type: "ol",
        items: [
          "Valid passport or other recognised travel document for your scheme. The airport waiver requires an ordinary passport valid at least 90 days beyond your planned departure.",
          "Medical insurance valid in Belarus throughout your stay with at least EUR 10,000 coverage. EHIC does not replace this policy.",
          "Documents confirming purpose of visit: hotel booking, invitation letter, business meeting agenda, tourist itinerary.",
          "Sufficient funds: for the airport scheme the MFA specifies at least two base rates per day or 50 base rates for a full 30-day stay. Use the current base rate and exchange rate; check your specific scheme separately.",
          "For minors travelling without both parents — notarised parental consent.",
        ],
      },
      { type: "h3", text: "Medical Insurance: What to Check" },
      {
        type: "p",
        text: "Check the policy's territorial scope, dates and coverage. EHIC does not replace insurance valid in Belarus. Arrange a separate policy before travel if needed; confirm price and conditions with the insurer.",
      },
      { type: "h3", text: "Is Registration Required?" },
      {
        type: "p",
        text: "Hotels register guests at check-in. The MFA specifies registration for stays exceeding 10 working days, through a citizenship and migration office or portal.gov.by. Check nationality-specific exemptions and deadlines before travel.",
      },
      { type: "h2", text: "Why a Private Transfer Is the Best Way to Enter Belarus" },
      {
        type: "p",
        text: "You can fly to Warsaw, Vilnius, Riga or Kaunas and continue to Belarus by road only if you qualify for land entry. Belarus's airport-only waiver does not cover this route. Below we compare buses with private transfers.",
      },
      {
        type: "table",
        headers: ["Criteria", "Bus / minivan", "Private transfer ComfortLine"],
        rows: [
          ["Pick-up point", "Bus station", "Your hotel, airport or address"],
          ["Drop-off point", "Bus terminal in Minsk", "Your hotel or any address in Belarus"],
          ["Schedule", "Fixed timetable", "Matched to your flight or preferred time"],
          ["Border support", "None", "Driver assists, knows the procedure"],
          ["Journey time", "4–7 h + transfer wait", "Direct from A to B"],
          ["Comfort", "Seats, limited luggage", "Business car, A/C, Wi-Fi"],
          ["Child seats", "Not available", "On request, free of charge"],
          ["Route flexibility", "None", "Stops, detours — at your request"],
        ],
      },
      { type: "h3", text: "The Border: Why It Is Easier with Us" },
      {
        type: "p",
        text: "Crossing the Belarus–Lithuania or Belarus–Poland border can take anywhere from 2 to 8 hours depending on the day and time. Our drivers do this route regularly — they know which lane moves faster, when to set off, and how to prepare documents to speed up customs. This matters especially for first-time border crossers.",
      },
      {
        type: "ul",
        items: [
          "Your driver will tell you in advance which documents to have ready.",
          "Live queue information at border crossings — tracked in real time.",
          "During long waits — a comfortable car with climate control, a chance to sleep.",
          "Child seats, luggage assistance — included as standard.",
          "Meet-and-greet at the arrivals terminal with a name board.",
        ],
      },
      { type: "h2", text: "Popular Routes from Europe to Belarus" },
      { type: "h3", text: "Vilnius / VNO Airport → Minsk" },
      {
        type: "p",
        text: "From Vilnius airport, travel to Belarus via Kamenny Log–Medininkai or Benyakoni–Šalčininkai if operating on your travel date. Kotlovka–Lavoriškės is closed. This route requires the land waiver, another applicable entitlement or a visa. Journey time depends on the chosen checkpoint and queue.",
      },
      { type: "h3", text: "Warsaw / WAW and Modlin Airports → Minsk" },
      {
        type: "p",
        text: "Warsaw is the major hub for flights from Western Europe, North America and Asia. Warsaw to Minsk is about 550 km — a full road trip. Border crossing near Terespol / Brest. Popular for travellers connecting through Warsaw who want to continue to Belarus without additional transit.",
      },
      { type: "h3", text: "Kaunas / KUN Airport → Minsk" },
      {
        type: "p",
        text: "Kaunas Airport is a Ryanair and low-cost carrier base with direct flights from dozens of European cities at competitive fares. Kaunas–Minsk is around 270 km. The route passes through the same Belarus–Lithuania crossing as Vilnius.",
      },
      { type: "h3", text: "Riga / RIX Airport → Minsk" },
      {
        type: "p",
        text: "From Riga, the road route uses Grigorovshchina–Pāternieki: these are the two sides of one crossing, not alternatives. Silene is closed. Vehicles leaving Latvia require advance queue registration at lvborder.lv, subject to statutory exceptions. Confirm the crossing's status and allow extra time; BY-plated passenger cars generally cannot return to the EU through Latvia.",
      },
      { type: "link", href: "https://www.lvborder.lv/en/", label: "Official Latvian vehicle queue booking" },
      { type: "link", href: "https://www.vid.gov.lv/en/article/operation-silene-border-crossing-point-halted-19-september-2023", label: "Latvian Revenue Service: Silene closed, use Pāternieki" },
      { type: "h2", text: "What to See in Belarus: Top 10 Destinations" },
      {
        type: "p",
        text: "Belarus surprises visitors with its combination of nature, history and affordable prices. Here is what to include on your itinerary:",
      },
      {
        type: "ul",
        items: [
          "Mir Castle — a UNESCO World Heritage Site, one of the finest castles in Eastern Europe. 100 km from Minsk.",
          "Nesvizh Palace and Park Complex — the Radziwiłł family residence, also UNESCO-listed. Close to Mir.",
          "Brest Fortress — a powerful memorial complex, a symbol of resilience. 350 km from Minsk.",
          "Białowieża Forest — the oldest primeval forest in Europe, home of wild European bison and Belarus's Father Frost residence.",
          "Grodno — a historic city with Polish and Lithuanian heritage, old churches, castles and cosy cafés.",
          "Minsk — a modern capital with wide boulevards, Stalinist architecture, a vibrant food scene and museums.",
          "Dudutki — an open-air ethnographic museum with craft workshops, horse riding and traditional Belarusian cuisine.",
          "Khatyn Memorial — a moving complex commemorating the villages destroyed during World War II.",
          "Ostrich Farm in Bolshaya Svorotva — a surprisingly popular attraction for families with children.",
          "Augustów Canal — a scenic waterway along the Polish–Belarusian border, ideal for walking and cycling.",
        ],
      },
      { type: "h2", text: "Practical Tips Before Your Trip" },
      {
        type: "table",
        headers: ["Question", "Answer"],
        rows: [
          ["Do I need Belarusian currency?", "Belarusian ruble (BYN). Cards are accepted at most shops and restaurants, but cash is useful."],
          ["Do cards work in Belarus?", "Cards issued in EU countries may not be accepted since 2022 — check with your bank. Mir and UnionPay work."],
          ["Mobile data?", "EU roaming does not apply in Belarus. We recommend buying a local SIM (A1, MTS, life:)) on arrival — from BYN 5."],
          ["Safety?", "Belarus is traditionally considered one of the safest countries in the region in terms of street crime."],
          ["Language barrier?", "In Minsk the younger generation speaks reasonable English, especially in tourism. In rural areas it is harder. ComfortLine drivers communicate in English."],
        ],
      },
      { type: "h2", text: "Frequently Asked Questions" },
      { type: "h3", text: "Can I enter on an EU national ID card?" },
      {
        type: "p",
        text: "Do not assume any EU ID card is sufficient for Belarus. The MFA requires an ordinary passport for the airport scheme and specifies a valid travel document for the European land scheme. Confirm recognition of your particular document and its required validity with a consulate before travel.",
      },
      { type: "h3", text: "Is a visa needed when entering through the Polish or Lithuanian border?" },
      {
        type: "p",
        text: "The land waiver covers 38 European states until 31 December 2026: usually 30 days per entry, or 90 for PL/LT/LV citizens and Latvian non-citizens, with a combined maximum of 90 days per calendar year. Other nationalities must check separate visa-free agreements or obtain a visa where required. The 76-state airport scheme does not permit land entry.",
      },
      { type: "h3", text: "What happens if I overstay the 30-day limit?" },
      {
        type: "p",
        text: "Overstaying is an administrative offence — a fine and a potential entry ban. Leave strictly before your permitted period expires.",
      },
      { type: "h3", text: "Can I exit and re-enter immediately to reset the days?" },
      {
        type: "p",
        text: "No: leaving does not reset the total. The European land waiver allows repeated entries until 31 December 2026, but no more than 90 days in a calendar year. Arrange an appropriate lawful basis in advance for any longer stay.",
      },
      { type: "h3", text: "Can I work in Belarus on the visa-free regime?" },
      {
        type: "p",
        text: "No. The visa-free regime covers tourist and business visits only, not employment. Work requires the appropriate permit and visa.",
      },
      {
        type: "callout",
        text: "ComfortLine operates transfers from Vilnius, Kaunas, Warsaw, Riga and other European cities directly to your address in Belarus. One call — and a comfortable car with an English-speaking driver will meet you at the arrivals terminal. Child seats, border document assistance, live queue information — all included.",
      },
      { type: "h2", id: "official-sources", text: "Official Sources" },
      { type: "link", href: "https://mfa.gov.by/visa/freemove/general/", label: "Visa-free entry — Ministry of Foreign Affairs of Belarus — mfa.gov.by", description: "Official up-to-date list of eligible countries and visa-free entry conditions" },
      { type: "link", href: "https://gpk.gov.by/", label: "State Border Committee of Belarus — gpk.gov.by", description: "Official information on border crossings, entry and stay conditions" },
      { type: "link", href: "https://gtk.gov.by", label: "Belarusian State Customs Committee — gtk.gov.by", description: "Customs regulations and import/export rules" },
      { type: "info-notice", text: "Visa-free entry rules, permitted stay durations and eligible country lists may change. Check the official Belarusian MFA website before travelling." },
    ],
    related: ["граница-беларусь-литва", "аэропорт-варшавы-вав", "как-добраться-до-аэропорта-вильнюса"],
    ctaRoute: { label: "Забронировать трансфер из Европы в Беларусь", labelEn: "Book a transfer from Europe to Belarus", path: "/трансфер-минск-вильнюс-аэропорт", pathEn: "/minsk-vilnius-airport" },
  },
  {
    slug: "вывоз-60-евро-в-беларусь-из-литвы-латвии",
    slugEn: "eu-60-euro-cash-limit-belarus-lithuania-latvia",
    titleEn: "Cash to Belarus: Is €60 a Legal Limit?",
    descriptionEn: "EU banknote sanctions, personal-use exceptions, Lithuanian and Latvian customs guidance, and the separate €10,000 declaration threshold.",
    ogSlug: "blog-60-evro-litva-latvia-belarus",
    title: "Наличные в Беларусь: есть ли лимит €60?",
    description:
      "Санкции ЕС на банкноты, исключение для личных нужд, разъяснения таможни Литвы и Латвии и отдельный порог декларирования €10 000.",
    intro:
      "По сообщениям пассажиров, на границе при поездках из Литвы и Латвии в Беларусь €60 на человека часто применяют как фактический предел наличных евро. Это сообщения о практике проверок, а не установленный законом ЕС лимит €60. Вывоз банкнот валют стран ЕС в Беларусь ограничен санкциями, с исключением для необходимых личных нужд путешественника и сопровождающих его ближайших членов семьи. Ни €60, ни сумма меньше €10 000 не гарантируют разрешения на вывоз.",
    dateISO: "2026-06-28",
    dateModified: "2026-10-17",
    disclaimerBanner: true,
    readingMin: 7,
    category: "Граница",
    tags: ["наличные", "евро", "Литва", "Латвия", "санкции", "граница", "60 евро"],
    citation: [
      "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:02006R0765-20260724",
      "https://www.vid.gov.lv/en/cash",
      "https://mano.muitine.lt/en/knowledge-bank/prohibitions-and-restrictions/international-sanctions/international-restrictive-measures",
      "https://mano.muitine.lt/en/knowledge-bank/travelling-or-third-countries/import-and-export-cash",
      "https://eur-lex.europa.eu/eli/reg/2018/1672/oj/eng",
    ],
    body: [
      { type: "editorial-correction", heading: "Исправление от 16 октября 2026 года", text: "Ранее статья ошибочно представляла €60 как единый лимит для Литвы и Латвии и советовала обмен на польские злотые. В статье 1za Регламента № 765/2006 суммы €60 нет; злотые также являются валютой страны ЕС. Порог обязательного декларирования на внешней границе ЕС — €10 000 или более, включая ровно €10 000." },
      { type: "callout", text: "Практический совет: старайтесь не брать больше €60 наличными на человека при поездке из Литвы или Латвии в Беларусь. По сообщениям пассажиров, перевозящих наличные, эту сумму часто применяют как фактический предел на границе. Это мера предосторожности на основе пассажирского опыта, а не законная квота или гарантия пропуска. Фиксированной суммы €60 в законе ЕС нет, но санкционные ограничения на банкноты сохраняются. Это свидетельства пассажиров, переданные ComfortLine, а не независимо подтверждённая единая инструкция таможни: неизвестно, насколько они применимы ко всем КПП и датам поездки. Не рассчитывайте ни на автоматический пропуск €60, ни на разрешение большей суммы только из-за отсутствия числового лимита в законе. Уточняйте условия у таможни перед поездкой." },
      { type: "h2", text: "Что установлено законом, а что не подтверждено" },
      {
        type: "p",
        text:
          "Статья 1za(1) Регламента Совета (ЕС) № 765/2006 запрещает продажу, поставку, передачу или экспорт в Беларусь либо для использования в Беларуси банкнот любой официальной валюты государства — члена ЕС. Запрет изначально введён для евро в марте 2022 года и расширен на остальные валюты стран ЕС в апреле 2022 года. В проверенной консолидированной редакции от 24 июля 2026 года числового лимита €60 нет.",
      },
      {
        type: "p",
        text:
          "Статья 1za(2)(a) допускает банкноты, необходимые для личных нужд едущих в Беларусь физических лиц или сопровождающих их ближайших членов семьи. Это условное исключение, а не безусловная квота на человека или автомобиль. Отдельные исключения в пунктах (b) и (c) касаются официальных нужд дипломатических миссий, консульств и международных организаций с иммунитетом, а также деятельности гражданского общества и СМИ, непосредственно продвигающей демократию, права человека или верховенство права в Беларуси и финансируемой ЕС, государствами ЕС или странами из приложения Vba. Они не дают обычному пассажиру дополнительной квоты.",
      },
      {
        type: "link",
        href: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:02006R0765-20260724",
        label: "EUR-Lex: Регламент № 765/2006, статья 1za",
        description: "Консолидированная редакция от 24.07.2026: запрет и три категории исключений; суммы €60 нет.",
      },
      { type: "h2", text: "Как правило действует на литовской и латвийской границе" },
      {
        type: "table",
        headers: ["Направление", "Банкноты валют ЕС", "Декларирование на стороне ЕС"],
        rows: [
          ["Литва → Беларусь", "Запрет с исключениями по статье 1za; текущая норма €60 официально не подтверждена", "€10 000 или более в эквиваленте — обязательная декларация"],
          ["Латвия → Беларусь", "VID: разумная сумма для личных нужд поездки; фиксированные €60 не указаны", "€10 000 или более в эквиваленте — обязательная декларация"],
          ["Беларусь → ЕС", "Статья 1za не запрещает этот ввоз; иные ограничения проверяются отдельно", "€10 000 или более в эквиваленте — обязательная декларация"],
        ],
      },
      {
        type: "p",
        text:
          "Латвийская VID на странице Cash разрешает вывоз банкнот валют ЕС в Беларусь только в разумных суммах для личных нужд поездки либо дипломатических нужд. Фиксированной нормы €60 там нет. В проверенных материалах таможни Литвы о санкциях и наличных также не найдено действующего подтверждения €60. Поэтому эту цифру нельзя представлять как текущий закон или гарантированную национальную норму: для поездки через Литву заранее запросите у таможни разъяснение по сумме, цели и длительности поездки.",
      },
      { type: "h2", text: "Как подтвердить личную цель и что бывает при нарушении" },
      {
        type: "ul",
        items: [
          "Будьте готовы объяснить, зачем нужны банкноты, сколько продлится поездка и какие личные расходы предстоят. Подготовьте маршрут, бронирование проживания, расчёт расходов и документы о происхождении денег; сами по себе они не гарантируют разрешения.",
          "Личная цель не равнозначна любому использованию собственных денег. Передача наличных людям, которые не едут с вами, сбережения или коммерческие расходы не становятся разрешёнными только потому, что сумма небольшая.",
          "Не рассчитывайте, что таможня просто предложит обменять излишек или отпустит без последствий. Вывоз может быть остановлен; возможны задержание денег и ответственность по применимому национальному законодательству.",
          "Не скрывайте деньги и не выбирайте время или пункт пропуска ради меньшего числа проверок. Частота проверок не меняет законность вывоза.",
        ],
      },
      { type: "h2", text: "Как не попасть в неприятную ситуацию" },
      {
        type: "ul",
        items: [
          "Проверьте все банкноты, а не только евро. Польские злотые, чешские и шведские кроны тоже подпадают под статью 1za.",
          "Доллары США не охватываются именно этим запретом на банкноты валют ЕС. Это не означает неограниченного или автоматически законного вывоза: действуют декларирование, другие санкции и правила стран маршрута.",
          "Суммируйте наличные во всех валютах в эквиваленте евро. При €10 000 или более подайте декларацию на внешней границе ЕС и сохраните документы о происхождении и назначении средств.",
          "Проверяйте правила у таможни страны выезда до поездки. Водитель и перевозчик не вправе разрешать вывоз или гарантировать применение исключения.",
        ],
      },
      {
        type: "link",
        href: "https://www.vid.gov.lv/en/cash",
        label: "VID Латвии: Cash — санкции и декларирование",
        description: "Разумные суммы для личных нужд поездки; обязательное декларирование от €10 000 включительно.",
      },
      { type: "h2", text: "€10 000 — порог декларирования, а не разрешение на вывоз" },
      {
        type: "p",
        text:
          "По статье 3 Регламента (ЕС) 2018/1672 физическое лицо, которое ввозит в ЕС или вывозит из ЕС наличные на €10 000 или более в эквиваленте, обязано их задекларировать. Ровно €10 000 уже подлежат декларированию. Учитывается общая сумма у фактического перевозящего лица во всех валютах, даже если деньги принадлежат нескольким людям. В определение наличных входят также определённые предъявительские инструменты и золото, а не только банкноты и монеты. При признаках незаконной деятельности контроль возможен и ниже порога. Декларация не отменяет санкционный запрет и не подтверждает личную цель. Правила на белорусской стороне проверяйте отдельно у ГТК Беларуси.",
      },
      {
        type: "link",
        href: "https://eur-lex.europa.eu/eli/reg/2018/1672/oj/eng",
        label: "EUR-Lex: Регламент (ЕС) 2018/1672, статьи 2, 3 и 6",
        description: "Определение наличных, порог €10 000 или более и контроль меньших сумм.",
      },
      { type: "h2", text: "Часто задаваемые вопросы" },
      { type: "h3", text: "Ограничение касается только евро?" },
      {
        type: "p",
        text: "Изначально запрет касался только евро, но впоследствии был расширен на банкноты любой официальной валюты стран ЕС (злотые, чешские кроны, шведские кроны и т.д.). Доллары США и валюты стран, не входящих в ЕС, под этот запрет не подпадают.",
      },
      { type: "h3", text: "Если я въезжаю в ЕС из Беларуси с евро — тоже действует лимит?" },
      {
        type: "p",
        text: "Статья 1za не запрещает ввоз банкнот из Беларуси в ЕС. Но при €10 000 или более в эквиваленте нужна декларация на стороне ЕС; другие санкционные ограничения и правила белорусской стороны проверяются отдельно. Утверждать, что действует только декларирование, нельзя.",
      },
      { type: "h3", text: "Можно ли просто взять €60 каждому пассажиру?" },
      {
        type: "p",
        text: "€60 не является общей гарантированной квотой ЕС. Важно, необходимы ли банкноты для личных нужд путешественника и сопровождающих его ближайших членов семьи. Формальное разделение денег между пассажирами не превращает запрещённую цель в разрешённую. Для декларации отдельно считается сумма у фактического перевозящего лица.",
      },
      {
        type: "callout",
        text:
          "ComfortLine помогает организовать поездку, но не является таможенным или юридическим органом. Перевозчик не может гарантировать допустимую сумму наличных или решение таможни. При сомнениях получите официальное разъяснение до выезда.",
      },
      { type: "h2", id: "official-sources", text: "Официальные источники" },
      { type: "link", href: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:02006R0765-20260724", label: "Регламент № 765/2006: статья 1za — EUR-Lex", description: "Редакция от 24.07.2026; запрет, личные, дипломатические и целевые общественные/медийные исключения." },
      { type: "link", href: "https://mano.muitine.lt/en/knowledge-bank/prohibitions-and-restrictions/international-sanctions/international-restrictive-measures", label: "Таможня Литвы: международные санкции", description: "Опубликовано 15.09.2026; обзор применения санкций. Не устанавливает норму €60; ссылки на старые редакции не заменяют актуальный текст EUR-Lex." },
      { type: "link", href: "https://mano.muitine.lt/en/knowledge-bank/travelling-or-third-countries/import-and-export-cash", label: "Таможня Литвы: ввоз и вывоз наличных", description: "Опубликовано 04.05.2026; от €10 000 включительно, суммирование валют и документы о происхождении. Это правила декларирования, а не разрешение на санкционный экспорт." },
      { type: "link", href: "https://www.vid.gov.lv/en/cash", label: "VID Латвии: Cash", description: "Основной текст обновлён 03.12.2024; разумная сумма для личных нужд поездки, без фиксированных €60; от €10 000 включительно." },
      { type: "link", href: "https://finance.ec.europa.eu/publications/banknotes_en", label: "Еврокомиссия: FAQ о банкнотах", description: "Обновлено 01.08.2025. Разъясняет узкое понимание личных нужд по аналогичному российскому правилу (статья 5i); это пояснение, а не текст белорусской статьи 1za." },
      { type: "link", href: "https://gtk.gov.by/", label: "ГТК Беларуси", description: "Правила наличных на белорусской стороне проверяются независимо от требований ЕС." },
      { type: "info-notice", text: "Источники проверены редакцией 16.10.2026. Дата проверки не является датой принятия закона или подтверждением таможни для вашей поездки. Текущая официальная литовская норма €60 не подтверждена; перед выездом уточняйте сумму и цель у таможни, а актуальную редакцию закона — на EUR-Lex." },
    ],
    categoryEn: "Border",
    introEn:
      "According to passenger reports, €60 per person is commonly applied as a practical cash-euro limit at the border when travelling from Lithuania or Latvia to Belarus. This describes reported border practice, not a fixed €60 limit in EU law. EU sanctions restrict exporting EU-currency banknotes to Belarus, with an exception for necessary personal use by travellers and their accompanying immediate family. Neither €60 nor an amount below €10,000 guarantees permission to export.",
    bodyEn: [
      { type: "editorial-correction", heading: "Correction — 16 October 2026", text: "This article previously described €60 as a uniform Lithuanian and Latvian limit and recommended exchanging euros for Polish złoty. Article 1za of Regulation No 765/2006 contains no €60 amount; złoty is also an EU member-state currency. The mandatory EU external-border declaration threshold is €10,000 or more, including exactly €10,000." },
      { type: "callout", text: "Practical advice: try not to carry more than €60 in cash per person when travelling from Lithuania or Latvia to Belarus. According to reports from passengers carrying cash, this is commonly applied as a practical limit at the border. This is a precaution based on passenger experience, not a legal allowance or a guarantee of clearance. EU law sets no fixed €60 amount, but banknote sanctions still apply. These are passenger accounts relayed by ComfortLine, not an independently verified uniform customs instruction; their applicability to every checkpoint and travel date is unknown. Do not assume either automatic clearance for €60 or permission to carry more simply because the law has no numerical cap. Check with customs before travelling." },
      { type: "h2", text: "What the law says and what is not verified" },
      {
        type: "p",
        text:
          "Article 1za(1) of Council Regulation (EC) No 765/2006 prohibits selling, supplying, transferring or exporting banknotes denominated in any official currency of an EU member state to Belarus or for use there. Introduced for euros in March 2022, the ban was extended to other EU member-state currencies in April 2022. The consolidated version dated 24 July 2026 checked for this article contains no numerical €60 limit.",
      },
      {
        type: "p",
        text:
          "Article 1za(2)(a) permits banknotes necessary for the personal use of natural persons travelling to Belarus or their immediate family travelling with them. This is a conditional exception, not an unconditional quota per person or car. Separate exceptions in points (b) and (c) cover official purposes of diplomatic missions, consular posts and international organisations enjoying immunity, and civil society and media activities directly promoting democracy, human rights or the rule of law in Belarus which receive public funding from the EU, member states or countries listed in Annex Vba. These do not give ordinary passengers an extra allowance.",
      },
      {
        type: "link",
        href: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:02006R0765-20260724",
        label: "EUR-Lex: Regulation No 765/2006, Article 1za",
        description: "Consolidated version of 24 July 2026: prohibition and three exception categories; no €60 amount.",
      },
      { type: "h2", text: "How the rule is enforced at the Lithuanian and Latvian border" },
      {
        type: "table",
        headers: ["Direction", "EU-currency banknotes", "Declaration on the EU side"],
        rows: [
          ["Lithuania → Belarus", "Prohibition with Article 1za exceptions; current €60 allowance not officially verified", "€10,000 or more equivalent: mandatory declaration"],
          ["Latvia → Belarus", "VID: reasonable amounts for personal travel needs; no fixed €60 stated", "€10,000 or more equivalent: mandatory declaration"],
          ["Belarus → EU", "Article 1za does not prohibit this import; check other restrictions separately", "€10,000 or more equivalent: mandatory declaration"],
        ],
      },
      {
        type: "p",
        text:
          "Latvia's VID Cash page permits exporting EU-currency banknotes to Belarus only in reasonable amounts for personal travel needs or diplomatic requirements. It gives no fixed €60 allowance. The Lithuanian Customs sanctions and cash materials reviewed likewise did not confirm a current €60 rule. Do not present that figure as current legislation or a guaranteed national allowance: before travelling through Lithuania, ask customs for clarification based on the amount, purpose and duration of your trip.",
      },
      { type: "h2", text: "Showing personal need and the risks of a breach" },
      {
        type: "ul",
        items: [
          "Be ready to explain why you need the banknotes, how long you will travel and what personal expenses you expect. Bring your itinerary, accommodation booking, expense estimate and evidence of the money's origin; these do not themselves guarantee permission.",
          "Personal use does not mean any use of your own money. Delivering cash to people not travelling with you, savings or commercial expenses do not become permitted merely because the amount is small.",
          "Do not assume customs will simply offer an exchange or let you leave without consequences. Export may be stopped; cash may be detained and liability may arise under applicable national law.",
          "Do not conceal cash or choose a time or checkpoint to avoid checks. Check frequency does not change whether export is lawful.",
        ],
      },
      { type: "h2", text: "How to avoid a problem" },
      {
        type: "ul",
        items: [
          "Check all banknotes, not just euros. Polish złoty, Czech koruna and Swedish krona are also covered by Article 1za.",
          "US dollars are outside this particular ban on EU-currency banknotes. That does not mean unlimited or automatically lawful export: declaration requirements, other sanctions and the rules of countries on your route still apply.",
          "Add cash in all currencies together in euro equivalent. At €10,000 or more, declare it at the EU external border and retain documents showing its origin and intended use.",
          "Check with the customs authority of the departure country before travelling. A driver or carrier cannot authorise export or guarantee that an exception applies.",
        ],
      },
      {
        type: "link",
        href: "https://www.vid.gov.lv/en/cash",
        label: "Latvia's VID: Cash — sanctions and declarations",
        description: "Reasonable amounts for personal travel needs; mandatory declaration at €10,000 or more.",
      },
      { type: "h2", text: "€10,000 is a declaration threshold, not export permission" },
      {
        type: "p",
        text:
          "Under Article 3 of Regulation (EU) 2018/1672, a person entering or leaving the EU with cash worth €10,000 or more equivalent must declare it. Exactly €10,000 already requires declaration. The total is calculated across all currencies carried by the actual carrier, even if the money belongs to several people. Cash also includes certain bearer-negotiable instruments and gold, not only notes and coins. Controls may apply below the threshold where criminal activity is suspected. A declaration does not override sanctions or establish personal use. Check the Belarusian side's rules separately with the State Customs Committee.",
      },
      {
        type: "link",
        href: "https://eur-lex.europa.eu/eli/reg/2018/1672/oj/eng",
        label: "EUR-Lex: Regulation (EU) 2018/1672, Articles 2, 3 and 6",
        description: "Definition of cash, the €10,000-or-more threshold and controls below it.",
      },
      { type: "h2", text: "Frequently Asked Questions" },
      { type: "h3", text: "Does the restriction only apply to euros?" },
      {
        type: "p",
        text: "Originally it applied only to the euro, but the ban was later extended to banknotes of any official EU member-state currency (Polish złoty, Czech koruna, Swedish krona, etc.). US dollars and non-EU currencies are not covered.",
      },
      { type: "h3", text: "Does the limit apply when entering the EU from Belarus with euros?" },
      {
        type: "p",
        text: "Article 1za does not prohibit importing banknotes from Belarus into the EU. But €10,000 or more equivalent requires declaration on the EU side; other sanctions and Belarusian rules must be checked separately. It is not correct to say that only declaration rules apply.",
      },
      { type: "h3", text: "Can each passenger simply take €60?" },
      {
        type: "p",
        text: "€60 is not a guaranteed common EU allowance. The question is whether banknotes are necessary for the personal use of the traveller and their accompanying immediate family. Formally splitting money among passengers does not turn a prohibited purpose into a permitted one. For declaration purposes, separately count the amount carried by the actual carrier.",
      },
      {
        type: "callout",
        text:
          "ComfortLine helps arrange travel but is not a customs or legal authority. A carrier cannot guarantee an allowed cash amount or customs decision. If in doubt, obtain official clarification before departure.",
      },
      { type: "h2", id: "official-sources", text: "Official Sources" },
      { type: "link", href: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:02006R0765-20260724", label: "Regulation No 765/2006: Article 1za — EUR-Lex", description: "Version of 24 July 2026; prohibition and personal, diplomatic and targeted civil society/media exceptions." },
      { type: "link", href: "https://mano.muitine.lt/en/knowledge-bank/prohibitions-and-restrictions/international-sanctions/international-restrictive-measures", label: "Lithuanian Customs: international restrictive measures", description: "Published 15 September 2026; sanctions implementation overview. No €60 allowance; links to old versions do not replace current EUR-Lex legislation." },
      { type: "link", href: "https://mano.muitine.lt/en/knowledge-bank/travelling-or-third-countries/import-and-export-cash", label: "Lithuanian Customs: import and export of cash", description: "Published 4 May 2026; €10,000 or more, combined currencies and proof of origin. Declaration guidance, not permission for sanctioned exports." },
      { type: "link", href: "https://www.vid.gov.lv/en/cash", label: "Latvia's State Revenue Service (VID): Cash", description: "Main text updated 3 December 2024; reasonable amounts for personal travel needs, no fixed €60; declaration at €10,000 or more." },
      { type: "link", href: "https://finance.ec.europa.eu/publications/banknotes_en", label: "European Commission: banknotes FAQ", description: "Updated 1 August 2025. Explains narrow personal use under the analogous Russian provision (Article 5i); explanatory guidance, not the text of Belarus Article 1za." },
      { type: "link", href: "https://gtk.gov.by/", label: "State Customs Committee of Belarus", description: "Check Belarusian-side cash rules independently of EU requirements." },
      { type: "info-notice", text: "Sources inspected by the editorial team on 16 October 2026. This is not a law's adoption date or customs approval for your journey. A current official Lithuanian €60 allowance remains unverified; before departure, confirm your amount and purpose with customs and check EUR-Lex for the latest legislation." },
    ],
    related: ["граница-беларусь-литва", "какой-кпп-выбрать", "виза-свободный-въезд-в-беларусь-2026"],
    ctaRoute: { label: "Забронировать трансфер в Литву или Латвию", labelEn: "Book a transfer to Lithuania or Latvia", path: "/трансфер-в-литву", pathEn: "/lithuania-transfer" },
  },
  {
    slug: "советские-мозаики-минска",
    slugEn: "soviet-mosaics-minsk-guide",
    titleEn: "Soviet Mosaics of Minsk: Walking Guide",
    descriptionEn: "Find Minsk's best Soviet mosaics: Vostok-1, Oktyabrskaya metro and Dom Kino, with photos and directions.",
    ogSlug: "blog-sovetskie-mozaiki-minska",
    title: "Советские мозаики Минска: пеший маршрут",
    description:
      "Где искать лучшие советские мозаики Минска: Восток-1, «Октябрьская» и Дом кино — фото и маршрут.",
    intro:
      "Минск — один из самых недооценённых городов Европы для любителей советского монументального искусства. На фасадах жилых башен, в переходах метро и на кинотеатрах до сих пор сохранились огромные мозаичные панно 1960–1980-х годов — эпические сцены труда, космоса и культуры, выложенные смальтой и мрамором. Собрали маршрут по трём главным точкам, которые стоит увидеть своими глазами.",
    dateISO: "2026-07-05",
    readingMin: 8,
    category: "Минск",
    tags: ["Минск", "мозаика", "архитектура", "советское искусство", "экскурсия"],
    body: [
      { type: "h2", text: "Восток-1: «Золотые ворота» с мозаичными башнями" },
      {
        type: "p",
        text:
          "Главная точка маршрута — микрорайон Восток-1 у одноимённой станции метро. Две высотные жилые башни здесь называют «Золотыми воротами Минска»: их торцевые фасады, выходящие на проспект Независимости, полностью покрыты мозаикой на тему освоения космоса, науки, труда и искусства. Панно создавались в 1970-е годы группой белорусских художников-монументалистов и остаются одними из крупнейших мозаичных композиций в стране.",
      },
      {
        type: "img",
        src: "/mosaic-vostok-panorama.jpg",
        alt: "Жилая башня микрорайона Восток-1 в Минске с мозаикой на фасаде",
        caption: "Башня Восток-1 на проспекте Независимости — мозаика видна с проезжей части и из окон метро.",
      },
      {
        type: "p",
        text:
          "Каждая башня разбита на несколько крупных регистров: в верхней части — символика космоса и науки, ниже — фигуры рабочих, учёных и деятелей культуры в стилизованных арках. Композиция читается снизу вверх, как единое повествование о советском проекте будущего.",
      },
      {
        type: "img",
        src: "/mosaic-vostok-science.jpg",
        alt: "Крупный план мозаики «Город науки» на башне Восток-1 в Минске",
        caption: "Фрагмент «Город науки» — фигуры в золотой смальте на фоне символа СССР.",
      },
      {
        type: "img",
        src: "/mosaic-vostok-culture.jpg",
        alt: "Мозаика «Город культуры» на второй башне микрорайона Восток-1",
        caption: "Соседняя башня посвящена теме культуры и искусства — та же система арок и цветных лент.",
      },
      {
        type: "callout",
        text: "Лучшее время для фото — раннее утро или ближе к вечеру: солнце светит вдоль проспекта и подсвечивает смальту сбоку, из-за чего мозаика «загорается».",
      },
      { type: "h2", text: "Станция метро «Октябрьская»: флорентийская мозаика Кузнецова" },
      {
        type: "p",
        text:
          "В переходе станции метро «Октябрьская» сохранилась масштабная флорентийская мозаика (техника набора из природного камня и мрамора без смальты) работы художника Андрея Кузнецова — «Этапы большого пути». Композиция рассказывает историю индустриализации и достижений советской эпохи через фигуры рабочих, инженеров и символику труда.",
      },
      {
        type: "img",
        src: "/mosaic-oktyabrskaya-metro.jpg",
        alt: "Флорентийская мозаика в переходе станции метро Октябрьская в Минске",
        caption: "Мозаика «Этапы большого пути» над лестницей в переходе станции «Октябрьская».",
      },
      {
        type: "p",
        text:
          "В отличие от ярких мозаик Восток-1, здесь преобладает приглушённая палитра натурального камня — охра, тёмно-коричневый, серый мрамор. Это одна из немногих флорентийских мозаик такого масштаба, сохранившихся в интерьере действующего общественного пространства в Беларуси.",
      },
      { type: "h2", text: "Дом кино: фриз с партизанской темой" },
      {
        type: "p",
        text:
          "Здание бывшего Дома кино на улице Толбухина — ещё один пример советского монументального искусства, интегрированного в фасад общественного здания. Протяжённый декоративный фриз в верхней части здания посвящён партизанской и военной теме — узнаваемый мотив для белорусской монументальной живописи 1970-х годов, где память о войне соседствует с образами мирного труда и кино как искусства.",
      },
      {
        type: "img",
        src: "/mosaic-domkino-frieze.jpg",
        alt: "Мозаичный фриз с партизанской темой на здании бывшего Дома кино в Минске",
        caption: "Фриз на фасаде бывшего Дома кино — стилизованные лица и символика партизанского движения.",
      },
      {
        type: "p",
        text:
          "Здание неоднократно меняло назначение (сейчас в нём располагается Дворец детей и молодёжи), но фасадный декор сохранён. Стоит заглянуть сюда, если вы уже смотрите башни Восток-1 — это в 10–15 минутах на машине.",
      },
      {
        type: "callout",
        text:
          "Маршрут по всем трём точкам занимает около 2–3 часов с учётом переездов на машине и остановок для фото. Многие туристы объединяют его с посещением проспекта Независимости — крупнейшего цельного ансамбля сталинской архитектуры в Европе.",
      },
      { type: "h2", text: "Как спланировать маршрут" },
      {
        type: "ol",
        items: [
          "Начните с башен Восток-1 (метро «Восток») — это самая эффектная и фотогеничная точка.",
          "Доедьте до станции метро «Октябрьская» и спуститесь в переход к мозаике Кузнецова.",
          "Завершите маршрут у здания бывшего Дома кино на Толбухина, чтобы увидеть фриз.",
        ],
      },
      {
        type: "p",
        text:
          "Если вы прилетаете в Минск транзитом или у вас несколько свободных часов между рейсами, водитель ComfortLine может провести вас по этому маршруту на комфортном автомобиле с остановками у каждой точки — без необходимости разбираться в общественном транспорте.",
      },
    ],
    categoryEn: "Minsk",
    introEn:
      "Minsk is one of Europe's most underrated cities for fans of Soviet monumental art. Huge mosaic panels from the 1960s–1980s — epic scenes of labour, space and culture rendered in smalt and marble — still cover residential towers, metro passages and cinema façades across the city. Here is a route to the four most rewarding spots.",
    bodyEn: [
      { type: "h2", text: "Vostok-1: the 'Golden Gates' mosaic towers" },
      {
        type: "p",
        text:
          "The route's centrepiece is the Vostok-1 neighbourhood, next to the metro station of the same name. Locals call its two high-rise residential towers the 'Golden Gates of Minsk': their end walls, facing Independence Avenue, are completely covered in mosaics on the themes of space exploration, science, labour and art. The panels were created in the 1970s by a group of Belarusian monumental artists and remain among the largest mosaic compositions in the country.",
      },
      {
        type: "img",
        src: "/mosaic-vostok-panorama.jpg",
        alt: "Vostok-1 residential tower in Minsk with a large mosaic on its facade",
        caption: "A Vostok-1 tower on Independence Avenue — the mosaic is visible from the street and from the metro exit.",
      },
      {
        type: "p",
        text:
          "Each tower is divided into large registers: cosmic and scientific symbolism at the top, then figures of workers, scientists and cultural figures set within stylised arches below. The composition reads bottom-to-top as a single narrative about the Soviet vision of the future.",
      },
      {
        type: "img",
        src: "/mosaic-vostok-science.jpg",
        alt: "Close-up of the 'City of Science' mosaic on the Vostok-1 tower in Minsk",
        caption: "A fragment of 'City of Science' — figures in gold smalt against a Soviet emblem.",
      },
      {
        type: "img",
        src: "/mosaic-vostok-culture.jpg",
        alt: "'City of Culture' mosaic on the second Vostok-1 tower",
        caption: "The neighbouring tower is dedicated to culture and the arts, using the same arch-and-ribbon system.",
      },
      {
        type: "callout",
        text: "The best light for photos is early morning or early evening, when the sun rakes along the avenue and lights the smalt from the side, making the mosaic 'glow'.",
      },
      { type: "h2", text: "Oktyabrskaya metro station: Kuznetsov's Florentine mosaic" },
      {
        type: "p",
        text:
          "The underground passage at Oktyabrskaya metro station holds a large Florentine mosaic (a technique using inlaid natural stone and marble rather than smalt) by artist Andrey Kuznetsov, titled 'Stages of the Great Journey'. The composition tells the story of industrialisation and Soviet-era achievement through figures of workers, engineers and labour symbolism.",
      },
      {
        type: "img",
        src: "/mosaic-oktyabrskaya-metro.jpg",
        alt: "Florentine mosaic in the underpass at Oktyabrskaya metro station in Minsk",
        caption: "'Stages of the Great Journey' above the stairway in the Oktyabrskaya station passage.",
      },
      {
        type: "p",
        text:
          "Unlike the bright colours of Vostok-1, this piece is dominated by a muted natural-stone palette — ochre, dark brown, grey marble. It's one of the few Florentine mosaics of this scale still preserved inside a working public space in Belarus.",
      },
      { type: "h2", text: "Dom Kino: the partisan-themed frieze" },
      {
        type: "p",
        text:
          "The former Dom Kino (House of Cinema) building on Talbukhina Street is another example of Soviet monumental art built into a public façade. A long decorative frieze along the top of the building is dedicated to the partisan and wartime theme — a recurring motif in Belarusian monumental painting of the 1970s, where memory of the war sits alongside images of peaceful labour and cinema as an art form.",
      },
      {
        type: "img",
        src: "/mosaic-domkino-frieze.jpg",
        alt: "Mosaic frieze with a partisan theme on the former Dom Kino building in Minsk",
        caption: "The frieze on the former Dom Kino façade — stylised faces and partisan-movement symbolism.",
      },
      {
        type: "p",
        text:
          "The building has changed function more than once (it now houses a children's and youth centre), but the façade decoration has been preserved. Worth a short stop if you're already visiting the Vostok-1 towers — it's a 10–15 minute drive away.",
      },
      {
        type: "callout",
        text:
          "The full three-stop route takes about 2–3 hours including driving time and photo stops. Many visitors combine it with a walk down Independence Avenue, the largest intact ensemble of Stalinist architecture in Europe.",
      },
      { type: "h2", text: "How to plan the route" },
      {
        type: "ol",
        items: [
          "Start at the Vostok-1 towers (Vostok metro station) — the most striking and photogenic stop.",
          "Head to Oktyabrskaya metro station and go down into the passage to see the Kuznetsov mosaic.",
          "Finish at the former Dom Kino building on Talbukhina Street to see the frieze.",
        ],
      },
      {
        type: "p",
        text:
          "If you're passing through Minsk between flights or have a few free hours, a ComfortLine driver can take you along this route in a comfortable car with stops at each site — no need to figure out public transport.",
      },
    ],
    related: ["как-добраться-до-аэропорта-вильнюса", "аэропорт-варшавы-вав"],
    ctaRoute: { label: "Заказать трансфер и экскурсию по Минску", labelEn: "Book a Minsk transfer and city tour", path: "/трансфер-по-минску", pathEn: "/minsk-city-transfer" },
  },
];

export function findArticle(slug: string): Article | undefined {
  const decoded = decodeURIComponent(slug);
  return ARTICLES.find((a) => a.slug === decoded || a.slugEn === decoded);
}
