export type EnquiryValues = Record<string, string>;
type Field = {
  key: string; ru: string; en: string; type?: string;
  options?: { value: string; ru: string; en: string }[];
};
export const ENQUIRY_FIELDS: Field[] = [
  { key: "travelDate", ru: "Дата поездки", en: "Travel date", type: "date" },
  { key: "borderCountry", ru: "Страна пересечения границы", en: "Border country", options: [
    { value: "pl", ru: "Польша", en: "Poland" }, { value: "lt", ru: "Литва", en: "Lithuania" },
    { value: "lv", ru: "Латвия", en: "Latvia" }, { value: "other", ru: "Другая — укажите в маршруте", en: "Other — specify in route" },
    { value: "choose", ru: "Помогите подобрать", en: "Help me choose" },
  ] },
  { key: "direction", ru: "Направление", en: "Direction", options: [
    { value: "toBy", ru: "ЕС → Беларусь", en: "EU → Belarus" },
    { value: "round", ru: "Туда и обратно", en: "Round trip" },
    { value: "toEu", ru: "Беларусь → ЕС", en: "Belarus → EU" },
  ] },
  { key: "route", ru: "Откуда, куда, желаемый КПП", en: "Origin, destination, preferred checkpoint" },
  { key: "citizenships", ru: "Все гражданства / без гражданства", en: "All citizenships / stateless status" },
  { key: "travelDocument", ru: "Документ: тип, страна выдачи, срок действия (без номера)", en: "Travel document: type, issuer, validity (no number)" },
  { key: "residence", ru: "Страна постоянного проживания", en: "Country of habitual residence" },
  { key: "entryBasis", ru: "Виза / ВНЖ: тип, страна, срок; основание безвиза", en: "Visa / permit: type, issuer, validity; visa-free basis" },
  { key: "registration", ru: "Регистрация авто: любая страна / нужен трансфер / неизвестно", en: "Registration: any country / transfer requested / unknown" },
  { key: "ownership", ru: "Собственник автомобиля", en: "Vehicle ownership", options: [
    { value: "present", ru: "Собственник едет", en: "Owner travelling" },
    { value: "absent", ru: "Собственник не едет", en: "Owner absent" },
    { value: "rental", ru: "Аренда", en: "Rental" }, { value: "company", ru: "Служебный", en: "Company" },
    { value: "operator", ru: "Перевозчик", en: "Operator" },
  ] },
  { key: "vehicleDetails", ru: "Модель, тип двигателя, объём см³, клиренс (если известны)", en: "Model, engine type, capacity cm³, clearance (if known)" },
  { key: "purpose", ru: "Цель перемещения автомобиля", en: "Purpose of vehicle movement", options: [
    { value: "temporary", ru: "Временная поездка", en: "Temporary visit" },
    { value: "transit", ru: "Транзит", en: "Transit" }, { value: "relocation", ru: "ПМЖ", en: "Relocation" },
    { value: "import", ru: "Постоянный ввоз / продажа", en: "Permanent import / sale" },
  ] },
  { key: "frequency", ru: "Частота въездов", en: "Entry frequency", options: [
    { value: "daily", ru: "Чаще раза в день", en: "More than once a day" },
    { value: "threeDays", ru: "Чаще раза в 3 дня", en: "More than once every 3 days" },
    { value: "week", ru: "Чаще раза в 7, но не чаще раза в 3 дня", en: "More than once every 7 but not every 3 days" },
    { value: "oftenWeekly", ru: "Раз в 7 дней и реже", en: "Once every 7 days or less often" },
  ] },
  { key: "entryHistory", ru: "Даты предыдущих въездов и годовые категории уже ввезённых товаров", en: "Previous entry dates and annual-category goods already imported", type: "textarea" },
  { key: "valueEUR", ru: "Стоимость покупок, EUR на одного пассажира", en: "Shopping value, EUR per passenger", type: "decimal" },
  { key: "weightKG", ru: "Вес покупок, кг на одного пассажира", en: "Shopping weight, kg per passenger", type: "decimal" },
  { key: "inventory", ru: "Товар, артикул, материал, функция, количество, цена, вес, новый/б/у, для себя/продажи", en: "Item, product number, material, use, quantity, price, weight, new/used, personal/sale", type: "textarea" },
  { key: "specialItems", ru: "Еда, лекарства, алкоголь, табак, растения, питомцы, наличные: что уточнить", en: "Food, medicines, alcohol, tobacco, plants, pets, cash: what needs checking", type: "textarea" },
  { key: "transferNeeds", ru: "Пассажиры, возраст детей, кресла, чемоданы, обратная дата", en: "Passengers, children's ages, child seats, luggage, return date", type: "textarea" },
];
export const ENQUIRY_DISCLAIMER = {
  ru: "Ответ перевозчика не заменяет решения пограничной службы и таможни. Перед выездом проверьте актуальные официальные источники.",
  en: "An operator’s reply does not replace border-authority or customs decisions. Check current official sources before departure.",
};

export function parseShoppingNumber(value?: string): number | undefined {
  const input = value?.trim().replace(",", ".");
  if (!input || !/^\d+(?:\.\d+)?$/.test(input)) return undefined;
  const number = Number(input);
  return Number.isFinite(number) ? number : undefined;
}

// An enquiry checklist, deliberately not a permission / duty / visa calculator.
export function buildShoppingEnquiry(values: EnquiryValues, lang: "ru" | "en"): string {
  const ru = lang === "ru";
  const t = (r: string, e: string) => ru ? r : e;
  const unknown = t("Неизвестно — уточнить", "Unknown — clarify");
  const details = ENQUIRY_FIELDS.map((field) => {
    const raw = values[field.key]?.trim();
    const answer = field.options ? field.options.find((option) => option.value === raw)?.[lang] : raw;
    return `${field[lang]}: ${answer || unknown}`;
  });
  const checks = [
    t("Проверить документы каждого пассажира: въезд, транзит и возврат; гражданство, ВНЖ и таможенное резидентство не равнозначны.", "Verify each passenger’s documents for entry, transit and return; citizenship, residence permits and customs residence are distinct."),
    t("Проверить актуальный статус КПП обеих сторон, допустимые категории транспорта и требования очереди на дату поездки.", "Verify both sides’ current checkpoint arrangements, vehicle categories and queue requirements for the travel date."),
    t("Сопоставить фактические даты въездов, включая повторные въезды за сутки, и годовые категории уже ввезённых товаров. Артикул магазина не равен таможенному виду товара; неполных дат недостаточно для расчёта.", "Check actual entry dates, including repeat entries on one day, and annual-category goods already imported. A retailer’s product number is not a customs product type; incomplete dates cannot establish frequency eligibility."),
    t("Отдельно проверить специальные товары, документы/разрешения, личное назначение, чеки и количество; наличные от €10 000 при въезде/выезде из ЕС требуют проверки декларирования, независимо от санкций.", "Check special goods, documents/permits, personal use, receipts and quantity separately; cash of €10,000 or more entering/leaving the EU needs declaration checks independently of sanctions."),
  ];
  const border = ["pl", "lt", "lv"].includes(values.borderCountry) ? values.borderCountry : "";
  const toBy = values.direction !== "toEu";
  const toEu = values.direction !== "toBy";
  const byPlates = /(^|\s|[,(\/])by($|\s|[),/])|belarus|беларус|белорус/i.test(values.registration || "");
  if (byPlates) {
    checks.push(t("BY-номера: условия въезда в ЕС проверяются отдельно от выезда из ЕС.", "BY plates: conditions for EU entry must be checked separately from EU departure."));
    if (border === "pl" || !border) checks.push(t("Польша: уточнить личное некоммерческое использование, собственника за рулём или его присутствие и соблюдение санкций; одна регистрация не решает вопрос.", "Poland: clarify personal non-commercial use, the owner driving or being present, and sanctions compliance; registration alone does not decide the issue."));
    if (border === "lt" || !border) checks.push(t("Литва: уточнить узкое исключение, собственника-водителя и личное использование; для соответствующего случая гражданина Беларуси нужны именно литовская виза или литовский ВНЖ. Польский ВНЖ не заменяет литовский документ. Иные исключения проверяются отдельно.", "Lithuania: clarify the narrow exception, owner-driver and personal use; the relevant Belarusian-citizen case requires a Lithuanian visa or Lithuanian residence permit. A Polish permit does not replace a Lithuanian document. Other exceptions need separate verification."));
    if (border === "lv" || !border) checks.push(t("Латвия: общий запрет въезда в ЕС на BY-номерах; узкие исключения, например дипломатические, требуют отдельного подтверждения, не обещания проезда.", "Latvia: a general prohibition on EU entry with BY plates; narrow exceptions, such as diplomatic use, require separate confirmation, not a crossing promise."));
  }
  if (toBy) {
    checks.push(t("При выезде из ЕС отдельно проверить санкции на автомобиль и каждый товар: точный код, характеристики, получатель и цель. Низкая цена или малый двигатель не подтверждают право вывоза.", "For EU departure, separately check vehicle and goods sanctions: exact code, specifications, recipient and purpose. A low price or small engine does not establish export eligibility."));
    if (border === "lt" || !border) checks.push(t("Для выезда через Литву запросить тип двигателя, объём см³ и клиренс, сопоставить с актуальными ограничениями, включая сообщение от 26 августа 2026 года.", "For departure through Lithuania, request engine type, capacity in cm³ and ground clearance and check current restrictions, including the notice of 26 August 2026."));
    const value = parseShoppingNumber(values.valueEUR);
    const weight = parseShoppingNumber(values.weightKG);
    if ((value !== undefined && value > 500) || (weight !== undefined && weight > 25)) {
      checks.push(t("Покупки превышают €500 или 25 кг на одного пассажира: уточнить таможенный режим и платежи для обычных покупок, не рассчитывая их автоматически.", "Purchases exceed €500 or 25 kg per passenger: clarify customs treatment and payments for ordinary purchases without automatic calculations."));
    }
    if (value === undefined || weight === undefined) checks.push(t("Стоимость или вес не определены: уточнить оба показателя на каждого пассажира; неизвестное значение не считается нулём.", "Value or weight is unknown: clarify both figures per passenger; unknown is not zero."));
    checks.push(t("Даже при стоимости не более €500 и весе не более 25 кг нужны проверки личного пользования, частоты, годовых категорий и ограничений. Нормы пассажиров не суммируются.", "Even at no more than €500 and 25 kg, personal use, frequency, annual categories and restrictions still need checking. Do not pool passenger allowances."));
  }
  if (toEu) checks.push(t("Возврат/въезд в ЕС: заново проверить документы, автомобиль и обратный багаж по правилам страны въезда, не переносить нормы Беларуси.", "EU return/entry: recheck documents, vehicle and return luggage under the entry country’s rules; Belarus allowances do not carry over."));
  checks.push(t("Иностранная регистрация: отдельно уточнить временный ввоз, таможенное резидентство, обеспечение платежей и обратный вывоз. ПМЖ, постоянный ввоз или продажа автомобиля — отдельные процедуры, без расчёта залога или пошлин по предположениям.", "Foreign registration: separately clarify temporary admission, customs residence, payment security and re-export. Relocation, permanent vehicle import or sale involve separate procedures; do not calculate deposits or duties from assumptions."));
  if (!border || !values.direction || !values.registration?.trim()) checks.push(t("Страна границы, направление или регистрация требуют уточнения; неизвестные параметры не дают положительного результата.", "Border country, direction or registration needs clarification; unknown details are not a favourable result."));
  return [
    t("Здравствуйте, ComfortLine! Помогите подготовить маршрут и уточнить условия поездки.", "Hello ComfortLine! Please help prepare a route and clarify the trip details."),
    ...details,
    "", t("Что требуется проверить с компетентными органами:", "Checklist to verify with competent authorities:"),
    ...checks.map((check) => `• ${check}`),
    "", ENQUIRY_DISCLAIMER[lang],
  ].join("\n");
}
