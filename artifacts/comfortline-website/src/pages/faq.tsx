import { useState } from "react";
import { ContactModal } from "@/components/sections/ContactModal";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Calendar,
  CreditCard,
  Plane,
  Globe2,
  Car,
  Users,
  Briefcase,
  MapPin,
  PackageCheck,
  type LucideIcon,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useLang } from "@/context/language-context";
import { Seo } from "@/seo/Seo";
import { faqJsonLd } from "@/seo/jsonld";
import { BorderQueueWidget } from "@/components/sections/BorderQueueWidget";

interface FaqItem {
  q: string;
  a: string;
  sub?: string[];
  liveQueue?: boolean;
}

interface FaqSection {
  icon: LucideIcon;
  label: string;
  title: string;
  items: FaqItem[];
}

const ruFaq: FaqSection[] = [
  {
    icon: Calendar,
    label: "Организация поездки",
    title: "Бронирование и заказ",
    items: [
      {
        q: "Как сделать заказ?",
        a: "Оставьте заявку на сайте или напишите нам в WhatsApp / Viber — менеджер свяжется в ближайшее время и согласует маршрут, время, класс автомобиля и стоимость.",
      },
      {
        q: "За сколько времени нужно бронировать?",
        a: "Рекомендуем оформлять заказ минимум за 24 часа. Для международных трансферов — за 2–3 дня, особенно в пиковые периоды.",
      },
      {
        q: "Можно ли изменить или отменить заказ?",
        a: "Да. Свяжитесь с нами как можно раньше — по телефону или в мессенджере. Условия отмены оговариваются при бронировании.",
      },
      {
        q: "Что будет, если мой рейс задержали?",
        a: "Мы отслеживаем статус вашего рейса и корректируем время встречи автоматически. Водитель будет ждать — доплат за ожидание при задержке рейса нет.",
      },
    ],
  },
  {
    icon: CreditCard,
    label: "Стоимость",
    title: "Цены и оплата",
    items: [
      {
        q: "Сколько стоит трансфер?",
        a: "Цена зависит от маршрута и класса автомобиля. Вы получаете фиксированную стоимость до поездки — без скрытых доплат. Уточните цену через форму на сайте или в WhatsApp.",
      },
      {
        q: "Как можно оплатить?",
        a: "Принимаем наличные и банковскую карту. Способ оплаты согласовывается при подтверждении заказа.",
      },
      {
        q: "Есть ли скрытые доплаты?",
        a: "Нет. Вы платите ровно ту сумму, которая согласована при бронировании. Ожидание при задержке рейса, встреча с табличкой, помощь с багажом — всё включено.",
      },
      {
        q: "Можно ли получить чек или документ для отчётности?",
        a: "Да, по запросу предоставим необходимые документы. Уточните это при оформлении заказа.",
      },
    ],
  },
  {
    icon: Plane,
    label: "Трансфер",
    title: "Встреча и посадка",
    items: [
      {
        q: "Где именно водитель встретит меня в аэропорту?",
        a: "Водитель ждёт вас в зале прилётов с именной табличкой. Мы заранее согласуем точное место встречи и отправим контакт водителя.",
      },
      {
        q: "Помогут ли с багажом?",
        a: "Да. Погрузка и выгрузка вещей — стандартная часть нашего сервиса.",
      },
      {
        q: "Водитель приедет прямо к выходу из моего дома?",
        a: "Да. Трансфер — «от двери до двери». Водитель приедет по указанному адресу точно в назначенное время.",
      },
    ],
  },
  {
    icon: Globe2,
    label: "Пересечение КПП",
    title: "Граница и документы",
    items: [
      {
        q: "Нужно ли менять машину на границе?",
        a: "В некоторых случаях — да, в зависимости от действующих правил регистрации ТС и пограничной политики. Если пересадка нужна, мы организуем её быстро: водитель с европейской стороны уже будет ждать вас.",
      },
      {
        q: "Сколько времени займёт пересечение границы?",
        a: "В среднем от 2 до 12 часов — зависит от очереди, времени суток и пропускного пункта. Мы отслеживаем очереди в реальном времени и выбираем наиболее свободный КПП.",
      },
      {
        q: "Какие документы нужны для пересечения границы?",
        a: "Для поездки в ЕС вам понадобятся:",
        sub: ["Действующий загранпаспорт", "Виза или право на безвизовый въезд", "Медицинская страховка (для стран Шенгена)", "Дополнительные документы по требованию конкретной страны"],
      },
      {
        q: "Помогает ли водитель на КПП?",
        a: "Да. Водитель сопровождает вас, знает актуальные правила на пропускных пунктах и помогает сориентироваться. Ваша задача — иметь при себе актуальные документы.",
      },
    ],
  },
  {
    icon: PackageCheck,
    label: "Таможня и подготовка",
    title: "Таможня и советы для границы",
    items: [
      {
        q: "Что взять с собой при долгом ожидании на границе?",
        a: "Очереди на КПП могут затянуться на 8–20 часов. Опытные пассажиры всегда берут с собой:",
        sub: ["Бутылку воды и лёгкий перекус", "Тёплые вещи и плед (даже летом ночью прохладно)", "Зарядку и пауэрбанк", "Развлечения для детей и наушники", "Лекарства первой необходимости"],
      },
      {
        q: "Зелёный или красный коридор — что выбрать?",
        a: "«Зелёный коридор» — для пассажиров без декларируемых товаров. «Красный коридор» — если везёте товар сверх беспошлинной нормы, валюту свыше лимита, лекарства строгого учёта или предметы для коммерческой реализации. Если сомневаетесь — выбирайте красный, это снимает риски штрафа.",
      },
      {
        q: "Какие нормы беспошлинного ввоза действуют сейчас?",
        a: "Лимиты по весу, стоимости, алкоголю и табаку периодически меняются. Перед поездкой уточните актуальные нормы у вашего водителя — мы следим за изменениями и подсказываем перед каждым рейсом. Для крупных покупок планируйте маршрут так, чтобы пройти через красный коридор без давки.",
      },
      {
        q: "Какая беспошлинная норма ввоза товаров в Беларусь наземным транспортом?",
        a: "С 1 апреля 2024 года беспошлинная норма для въезда в Беларусь наземным транспортом (машина, автобус, пешком) — до 500 € стоимости и до 25 кг веса на одного взрослого пассажира. Для авиапассажиров лимит выше — до 10 000 € и 50 кг. Табак — отдельная норма независимо от способа въезда: 200 сигарет, или 50 сигар, или 200 стиков нагреваемого табака, или 250 г табака. Алкоголь крепостью более 0,5% — не более 3 л. Если везёте больше — сверх нормы наземным транспортом взимается 30% от суммы превышения (но не менее 4 € за кг), а алкоголь от 3 до 5 л облагается по 10 € за литр превышения. Официальные нормы опубликованы на сайте ГТК Беларуси (customs.gov.by).",
        sub: [
          "До 500 € стоимости и до 25 кг веса на одного человека (наземный транспорт, с 1 апреля 2024)",
          "Табак — 200 сигарет, или 50 сигар, или 200 стиков, или 250 г (одна норма для всех способов ввоза)",
          "Алкоголь — до 3 л беспошлинно, от 18 лет; свыше 3 л (до 5 л) — пошлина 10 €/л",
          "Сверх нормы по весу/стоимости — пошлина 30% от превышения, но не менее 4 €/кг",
          "Продукты животного происхождения (мясо, молочка, сыр) — строго ограничены",
          "Лекарства строгого учёта — только с рецептом",
        ],
      },
      {
        q: "Что нельзя ввозить из Беларуси в Литву (и в ЕС)?",
        a: "При въезде из Беларуси в Литву и другие страны ЕС полностью запрещён ввоз алкоголя, табачных изделий и многих продуктов питания (особенно мясо, молочные продукты, сыр, мёд, яйца). Ограничения регулярно обновляются — наш водитель знает актуальные правила Литвы, Польши и других стран ЕС и подскажет, что лучше оставить дома, чтобы не было проблем на КПП Беларусь–Литва или Беларусь–Польша.",
        sub: [
          "Алкоголь любой крепости — запрещён к ввозу из Беларуси в Литву",
          "Сигареты и табачные изделия — запрещены",
          "Мясо, молочка, сыр, яйца, мёд — ограничены или запрещены",
          "Свежие фрукты и овощи — под ограничением",
          "Семена, растения, корма для животных — требуют разрешения",
          "Топливо в канистрах сверх бака — запрещено",
        ],
      },
      {
        q: "Можно ли провозить лекарства, технику и продукты?",
        a: "Личные лекарства — да, желательно с рецептом или упаковкой. Электроника для личного пользования (ноутбук, телефон, фотоаппарат) — без проблем в разумных количествах. Продукты животного происхождения (мясо, молочка, сыр) ограничены при въезде в ЕС — лучше не брать. Свежие фрукты и овощи также под ограничением.",
      },
      {
        q: "Что делать, если очередь стоит больше 10 часов?",
        a: "Мы отслеживаем загрузку всех КПП в реальном времени и можем перенаправить машину на менее загруженный переход (например, с Бреста на Гродно или на латвийское направление). На случай длинного ожидания держите при себе паспорт, телефон и тёплые вещи — выходить из машины можно, но далеко не уходите.",
        sub: [
          "Лучший источник живой информации об очередях на границе в интернете — официальный сервис mon.declarant.by/#/zone (электронная очередь в зонах ожидания). Если сайт не открывается — попробуйте зайти через VPN.",
        ],
        liveQueue: true,
      },
      {
        q: "Правда, что из Литвы и Латвии в Беларусь нельзя вывозить больше 60 евро наличными?",
        a: "Единого лимита €60 в законодательстве ЕС нет. Статья 1za Регламента № 765/2006 запрещает вывоз в Беларусь банкнот любой официальной валюты страны ЕС, кроме предусмотренных исключений, включая необходимые личные нужды путешественника и сопровождающих его ближайших членов семьи. VID Латвии указывает разумные суммы для личных нужд поездки, без фиксированных €60. Действующее официальное подтверждение литовской нормы €60 при проверке 16.10.2026 не найдено. Ни €60, ни сумма ниже €10 000 не гарантируют разрешения. Вывоз может быть остановлен, деньги задержаны; не рассчитывайте, что вам просто предложат обмен. Перед выездом уточните сумму и цель у таможни.",
        sub: [
          "В качестве практической меры предосторожности старайтесь не брать больше €60 наличными на человека. По сообщениям пассажиров, перевозящих наличные из Литвы или Латвии в Беларусь, эту сумму часто применяют как фактический предел на границе. Это не законная квота и не гарантия пропуска; единая инструкция и применение ко всем КПП и датам не подтверждены.",
          "Польские злотые и другие валюты стран ЕС тоже охватываются запретом. Доллары США не охватываются именно этой нормой, но другие ограничения остаются.",
          "На внешней границе ЕС при ввозе или вывозе €10 000 или более в эквиваленте, включая ровно €10 000, нужна декларация. Суммируются все валюты у фактического перевозящего лица; декларация не отменяет санкции.",
          "Статья 1za не запрещает обратный ввоз банкнот в ЕС, но другие санкции и правила белорусской стороны проверяются отдельно.",
          "Источники: EUR-Lex, Регламент № 765/2006, статья 1za (редакция 24.07.2026); Регламент 2018/1672, статьи 2, 3 и 6; VID — vid.gov.lv/en/cash; таможня Литвы — mano.muitine.lt. Подробные ссылки и оговорки — в статье о наличных в Беларусь.",
        ],
      },
    ],
  },
  {
    icon: Car,
    label: "Автопарк",
    title: "Автомобили и комфорт",
    items: [
      {
        q: "Какие автомобили у вас есть?",
        a: "В автопарке ComfortLine:",
        sub: ["Бизнес-седаны — до 3 пассажиров с багажом, просторный багажник", "Минивэны — до 5–8 пассажиров, большое грузовое отделение", "Автомобили бизнес- и премиум-класса для VIP-поездок"],
      },
      {
        q: "Есть ли Wi-Fi и зарядка в машине?",
        a: "Да — в наших автомобилях есть Wi-Fi и USB/зарядки для телефонов.",
      },
      {
        q: "Можно ли остановиться в пути?",
        a: "Да. Мы делаем остановки по запросу — на заправке, кафе или по другой причине. Просто сообщите водителю.",
      },
      {
        q: "Курение в машине разрешено?",
        a: "Нет. Курение в автомобиле запрещено. При необходимости водитель сделает остановку.",
      },
    ],
  },
  {
    icon: Users,
    label: "Семьи",
    title: "Дети и питомцы",
    items: [
      {
        q: "Можно ли заказать детское кресло?",
        a: "Да. Детские автокресла и бустеры предоставляются по предварительному запросу. Укажите возраст и вес ребёнка при бронировании.",
      },
      {
        q: "Можно ли ехать с грудным ребёнком?",
        a: "Да, мы регулярно перевозим семьи с маленькими детьми. Упомяните при заказе — водитель будет готов к комфортным остановкам.",
      },
      {
        q: "Можно ли взять питомца в поездку?",
        a: "По предварительному согласованию — да. Уточните при бронировании породу, размер животного и наличие переноски.",
      },
    ],
  },
  {
    icon: Briefcase,
    label: "Вещи",
    title: "Багаж",
    items: [
      {
        q: "Сколько багажа можно взять?",
        a: "Зависит от выбранного автомобиля. Седаны вмещают 2–3 стандартных чемодана. Минивэны — значительно больше, подходят для больших семей и объёмного груза.",
      },
      {
        q: "Можно ли перевезти велосипед, самокат или лыжи?",
        a: "По предварительной договорённости — да. Сообщите нам о габаритном грузе заранее, и мы подберём подходящий автомобиль.",
      },
      {
        q: "Можно ли везти много вещей при переезде?",
        a: "Да. Для переездов с большим количеством вещей подходит минивэн с вместительным багажным отделением. Обсудите объём при бронировании.",
      },
    ],
  },
  {
    icon: MapPin,
    label: "Направления",
    title: "Маршруты",
    items: [
      {
        q: "В каких направлениях вы работаете?",
        a: "Основные маршруты ComfortLine:",
        sub: ["Минск ↔ Варшава (аэропорт Шопен и Модлин)", "Минск ↔ Вильнюс (аэропорт VNO)", "Минск ↔ Берлин", "Минск ↔ Прага", "По Беларуси и в Россию", "Групповые трансферы"],
      },
      {
        q: "Работаете ли вы по Минску и Беларуси?",
        a: "Да. Мы выполняем трансферы по всему Минску (аэропорт, вокзал, отели, офисы) и по всей Беларуси.",
      },
      {
        q: "Работаете ли вы 24/7?",
        a: "Да. Принимаем заказы и выполняем поездки круглосуточно, включая выходные и праздники.",
      },
    ],
  },
];

const enFaq: FaqSection[] = [
  {
    icon: Calendar,
    label: "Planning your trip",
    title: "Booking & Orders",
    items: [
      {
        q: "How do I book a transfer?",
        a: "Submit a request on our website or message us on WhatsApp / Viber — a manager will contact you shortly to confirm the route, timing, vehicle class, and exact price.",
      },
      {
        q: "How far in advance should I book?",
        a: "We recommend booking at least 24 hours ahead. For international transfers, 2–3 days is ideal — especially during busy periods.",
      },
      {
        q: "Can I change or cancel my booking?",
        a: "Yes. Contact us as soon as possible by phone or messenger. Cancellation terms depend on how much time is left before your journey and will be agreed when booking.",
      },
      {
        q: "What if my flight is delayed?",
        a: "We monitor your flight status and adjust the pickup time automatically. Your driver will wait — there are no extra charges for flight-delay waiting.",
      },
    ],
  },
  {
    icon: CreditCard,
    label: "Costs",
    title: "Pricing & Payment",
    items: [
      {
        q: "How much does a transfer cost?",
        a: "The price depends on the route and vehicle class. You receive a fixed, agreed price before the trip — no hidden charges, no meter. Request a quote via the website form or WhatsApp.",
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept cash and bank card. The exact payment method is confirmed when your booking is finalised.",
      },
      {
        q: "Are there any hidden fees?",
        a: "No. You pay exactly the amount agreed at booking. Flight-delay waiting, airport meet & greet, and luggage assistance are all included.",
      },
      {
        q: "Can I get a receipt or invoice?",
        a: "Yes — on request. Let us know when you book and we will prepare the necessary documents.",
      },
    ],
  },
  {
    icon: Plane,
    label: "Transfer",
    title: "Pickup & Drop-off",
    items: [
      {
        q: "Where exactly will the driver meet me at the airport?",
        a: "Your driver waits in the arrivals hall with a name board. We agree the exact meeting point in advance and send you the driver's contact details.",
      },
      {
        q: "Will the driver help with luggage?",
        a: "Yes. Loading and unloading luggage is a standard part of our service.",
      },
      {
        q: "Will the driver come to my front door?",
        a: "Yes. This is a true door-to-door service. Your driver arrives at the address you provide, exactly on time.",
      },
    ],
  },
  {
    icon: Globe2,
    label: "Border crossing",
    title: "Border & Documents",
    items: [
      {
        q: "Do I need to change cars at the border?",
        a: "Sometimes, yes — depending on current vehicle registration rules and border policy. If a transfer is needed, we organise it seamlessly: a driver on the European side will already be waiting for you.",
      },
      {
        q: "How long does the border crossing take?",
        a: "Typically 2–12 hours, depending on the queue, time of day, and checkpoint. We monitor queues in real time and choose the least congested crossing.",
      },
      {
        q: "What documents do I need for the EU border?",
        a: "For travel to the EU you will need:",
        sub: ["Valid international passport", "Schengen visa or visa-free eligibility", "Medical / travel insurance (required for Schengen countries)", "Any additional documents required by the specific country"],
      },
      {
        q: "Will the driver help at the checkpoint?",
        a: "Yes. Your driver knows current border procedures and will guide you through. You only need to have your own documents ready.",
      },
    ],
  },
  {
    icon: PackageCheck,
    label: "Customs & prep",
    title: "Customs & border tips",
    items: [
      {
        q: "What should I bring for a long border wait?",
        a: "Border queues can stretch to 8–20 hours. Experienced passengers always pack:",
        sub: ["Bottled water and a light snack", "Warm layers and a blanket (chilly even on summer nights)", "Phone charger and a power bank", "Entertainment for kids and headphones", "Essential medication"],
      },
      {
        q: "Green or red corridor — which one to pick?",
        a: "The green corridor is for passengers with nothing to declare. The red corridor is for goods over the duty-free limit, currency above the threshold, controlled medication or items intended for resale. If in doubt, pick red — it removes the risk of a fine.",
      },
      {
        q: "What are the current duty-free limits?",
        a: "Weight, value, alcohol and tobacco limits change periodically. Confirm current rules with your driver before the trip — we monitor changes and brief passengers ahead of every run. For larger shopping trips, plan for the red corridor so you avoid the queue crush.",
      },
      {
        q: "What is the duty-free limit for entering Belarus by road?",
        a: "Since 1 April 2024, the duty-free allowance for entering Belarus by land transport (car, bus, or on foot) is up to €500 in value and up to 25 kg per adult passenger. Air passengers have a higher limit — up to €10,000 and 50 kg. Tobacco has its own allowance regardless of the mode of entry: 200 cigarettes, or 50 cigars, or 200 heated-tobacco sticks, or 250 g of tobacco. Alcohol over 0.5% ABV — no more than 3 l. Above these limits, land-transport baggage is charged 30% of the excess value (minimum €4 per kg), and alcohol between 3 and 5 l is charged €10 per litre over the limit. Official allowances are published on the Belarus State Customs Committee website (customs.gov.by).",
        sub: [
          "Up to €500 in value and up to 25 kg per person (land transport, since 1 April 2024)",
          "Tobacco — 200 cigarettes, or 50 cigars, or 200 sticks, or 250 g (one allowance for every mode of entry)",
          "Alcohol — up to 3 l duty-free, age 18+; 3–5 l is charged €10 per litre over the limit",
          "Above the value/weight limit — 30% duty on the excess, minimum €4 per kg",
          "Animal-origin products (meat, dairy, cheese) — strictly restricted",
          "Controlled medication — prescription required",
        ],
      },
      {
        q: "What can't I bring from Belarus into Lithuania (or the EU)?",
        a: "When entering Lithuania (and other EU countries) from Belarus, alcohol, tobacco products and many foods (especially meat, dairy, cheese, honey, eggs) are completely prohibited. The rules update regularly — our driver knows current Lithuanian, Polish and EU customs rules and will advise what to leave at home so you have no issues at the Belarus–Lithuania or Belarus–Poland border.",
        sub: [
          "Alcohol of any strength — prohibited when entering Lithuania from Belarus",
          "Cigarettes and tobacco products — prohibited",
          "Meat, dairy, cheese, eggs, honey — restricted or prohibited",
          "Fresh fruit and vegetables — restricted",
          "Seeds, plants, animal feed — permits required",
          "Fuel in jerry cans beyond the tank — prohibited",
        ],
      },
      {
        q: "Can I bring medication, electronics and food?",
        a: "Personal medication — yes, ideally with a prescription or original packaging. Personal-use electronics (laptop, phone, camera) are fine in reasonable quantities. Animal-origin products (meat, dairy, cheese) are restricted when entering the EU — best left at home. Fresh fruit and vegetables are also restricted.",
      },
      {
        q: "What if the queue is over 10 hours?",
        a: "We track real-time loads at every checkpoint and can reroute the car to a quieter crossing (e.g. switch from Brest to Grodno or to a Latvian crossing). For long waits keep your passport, phone and warm clothes with you — you can step out of the car but don't go far.",
        sub: [
          "The best live border-queue information available online is the official mon.declarant.by/#/zone service (electronic queue at waiting zones). If the site doesn't load, try opening it with a VPN.",
        ],
        liveQueue: true,
      },
      {
        q: "Is it true that you can't take more than €60 in cash from Lithuania or Latvia to Belarus?",
        a: "There is no uniform €60 limit in EU law. Article 1za of Regulation No 765/2006 prohibits exporting banknotes in any official EU member-state currency to Belarus unless an exception applies, including necessary personal use by travellers and their accompanying immediate family. Latvia's VID specifies reasonable amounts for personal travel needs, not a fixed €60. This review on 16 October 2026 found no current official confirmation of a Lithuanian €60 allowance. Neither €60 nor an amount below €10,000 guarantees permission. Export may be stopped and cash detained; do not assume you will simply be offered an exchange. Confirm your amount and purpose with customs before departure.",
        sub: [
          "As a practical precaution, try not to carry more than €60 in cash per person. According to reports from passengers carrying cash from Lithuania or Latvia to Belarus, this is commonly applied as a practical border limit. This is not a legal allowance or a guarantee of clearance; a uniform instruction and applicability to every checkpoint and date are unconfirmed.",
          "Polish złoty and other EU member-state currencies are also covered. US dollars are outside this particular provision, but other restrictions still apply.",
          "At the EU external border, cash entering or leaving worth €10,000 or more equivalent, including exactly €10,000, requires declaration. Combine all currencies carried by the actual carrier; declaring does not override sanctions.",
          "Article 1za does not prohibit bringing banknotes back into the EU, but other sanctions and Belarusian-side rules must be checked separately.",
          "Sources: EUR-Lex, Regulation No 765/2006, Article 1za (version of 24 July 2026); Regulation 2018/1672, Articles 2, 3 and 6; VID — vid.gov.lv/en/cash; Lithuanian Customs — mano.muitine.lt. See the cash-to-Belarus article for detailed links and caveats.",
        ],
      },
    ],
  },
  {
    icon: Car,
    label: "Fleet",
    title: "Vehicles & Comfort",
    items: [
      {
        q: "What vehicles are available?",
        a: "The ComfortLine fleet includes:",
        sub: ["Executive sedans — up to 3 passengers with luggage, generous boot", "Premium minivans — up to 5–8 passengers, large cargo space", "Business and luxury-class cars for VIP trips"],
      },
      {
        q: "Is there Wi-Fi and phone charging in the car?",
        a: "Yes — all our vehicles are equipped with Wi-Fi and USB / power charging points.",
      },
      {
        q: "Can we stop during the journey?",
        a: "Yes. We make stops on request — at a petrol station, cafe, or anywhere else. Just let the driver know.",
      },
      {
        q: "Is smoking allowed in the car?",
        a: "No. Smoking inside the vehicle is not permitted. The driver will be happy to make a stop if needed.",
      },
    ],
  },
  {
    icon: Users,
    label: "Families",
    title: "Children & Pets",
    items: [
      {
        q: "Can I request a child seat?",
        a: "Yes. Child seats and booster seats are available on request. Please provide the child's age and weight when booking so we can fit the right seat.",
      },
      {
        q: "Can I travel with an infant?",
        a: "Yes — we regularly travel with families with young children. Mention it when booking and the driver will be ready for comfortable stops when needed.",
      },
      {
        q: "Can I bring a pet?",
        a: "By prior arrangement — yes. Let us know the breed, size, and whether you have a carrier when booking.",
      },
    ],
  },
  {
    icon: Briefcase,
    label: "Luggage",
    title: "Baggage",
    items: [
      {
        q: "How much luggage can I bring?",
        a: "It depends on the vehicle. Sedans comfortably fit 2–3 standard suitcases. Minivans offer significantly more space — perfect for families and bulky items.",
      },
      {
        q: "Can I bring a bicycle, scooter, or skis?",
        a: "By prior arrangement — yes. Let us know about oversized items when booking and we will choose the right vehicle.",
      },
      {
        q: "I'm moving and have a lot of bags. Can you help?",
        a: "Yes. Our minivans have a very large cargo area — ideal for relocation trips. Discuss the volume with us when booking.",
      },
    ],
  },
  {
    icon: MapPin,
    label: "Destinations",
    title: "Routes",
    items: [
      {
        q: "Which routes do you cover?",
        a: "Main ComfortLine routes:",
        sub: ["Minsk ↔ Warsaw (Chopin & Modlin airports)", "Minsk ↔ Vilnius (VNO airport)", "Minsk ↔ Berlin", "Minsk ↔ Prague", "Across Belarus", "Group transfers"],
      },
      {
        q: "Do you operate within Minsk and Belarus?",
        a: "Yes. We handle transfers across all of Minsk (airport, station, hotels, offices) and throughout Belarus.",
      },
      {
        q: "Do you operate 24/7?",
        a: "Yes. We accept bookings and run journeys around the clock, including weekends and public holidays.",
      },
    ],
  },
];

function AccordionItem({ item, index, isOpen, onToggle }: {
  item: FaqItem;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={`rounded-xl overflow-hidden transition-all duration-200 ${
      isOpen
        ? "border border-primary/30 bg-card shadow-sm shadow-primary/5"
        : "border border-border/60 bg-card/40 hover:border-border hover:bg-card/70"
    }`}>
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-start justify-between gap-4 px-5 py-4 text-left group"
      >
        <div className="flex items-start gap-3 min-w-0">
          <span className={`shrink-0 text-[10px] font-bold tracking-widest mt-0.5 w-5 text-right transition-colors ${isOpen ? "text-primary" : "text-muted-foreground/40"}`}>
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className={`text-sm font-semibold leading-snug transition-colors ${isOpen ? "text-foreground" : "text-foreground/80 group-hover:text-foreground"}`}>
            {item.q}
          </span>
        </div>
        <ChevronDown className={`h-4 w-4 shrink-0 mt-0.5 transition-all duration-200 ${isOpen ? "rotate-180 text-primary" : "text-muted-foreground/50 group-hover:text-primary/70"}`} />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pl-12 pr-5 pb-5">
              <div className="h-px bg-gradient-to-r from-primary/20 via-primary/10 to-transparent mb-4" />
              <p className="text-sm text-muted-foreground leading-relaxed font-light">{item.a}</p>
              {item.sub && (
                <ul className="space-y-2 mt-3">
                  {item.sub.map((s, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <span className="text-primary shrink-0 mt-1.5 text-[8px]">◆</span>
                      <span className="font-light leading-relaxed">{s}</span>
                    </li>
                  ))}
                </ul>
              )}
              {item.liveQueue && <BorderQueueWidget />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FaqPage() {
  const { lang } = useLang();
  const sections = lang === "ru" ? ruFaq : enFaq;
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});
  const [contactOpen, setContactOpen] = useState(false);

  function toggle(key: string) {
    setOpenMap(m => ({ ...m, [key]: !m[key] }));
  }

  const faqEntries = sections.flatMap((s) => s.items.map((it) => ({ question: it.q, answer: it.a })));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Seo
        titleRu="FAQ — Частые вопросы о трансфере | ComfortLine"
        titleEn="FAQ — Transfer Questions Answered | ComfortLine"
        descRu="Ответы на частые вопросы о трансфере ComfortLine: бронирование, цены, оплата, граница, документы, детские кресла."
        descEn="Answers to frequently asked questions about ComfortLine transfers: booking, pricing, payment, borders, documents, child seats, luggage."
        pathRu="/faq"
        pathEn="/en/faq"
        breadcrumbsRu={[
          { name: "Главная", path: "/" },
          { name: "FAQ", path: "/faq" },
        ]}
        breadcrumbsEn={[
          { name: "Home", path: "/" },
          { name: "FAQ", path: "/faq" },
        ]}
        jsonLd={faqJsonLd(faqEntries)}
      />
      <Navbar />

      {/* Hero */}
      <div className="pt-28 pb-14 border-b border-border/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 md:px-6 max-w-3xl text-center relative">
          <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-primary mb-4">
            {lang === "ru" ? "Частые вопросы" : "Frequently Asked Questions"}
          </p>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight text-foreground mb-3">
            FAQ
          </h1>
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary/60" />
            <div className="h-1 w-8 rounded-full bg-primary" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary/60" />
          </div>
          <p className="text-muted-foreground text-sm font-light tracking-wide max-w-md mx-auto">
            {lang === "ru"
              ? "Всё, что вам нужно знать о трансфере с ComfortLine"
              : "Everything you need to know about travelling with ComfortLine"}
          </p>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="container mx-auto px-4 md:px-6 max-w-3xl py-14 space-y-14">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              {/* Section header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <Icon className="h-4.5 w-4.5 text-primary" style={{ width: "1.125rem", height: "1.125rem" }} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-primary/60 leading-none mb-1">
                    {section.label}
                  </p>
                  <h2 className="text-base font-bold text-foreground leading-tight">
                    {section.title}
                  </h2>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-border/50 to-transparent ml-1" />
              </div>

              {/* Accordion items */}
              <div className="space-y-2">
                {section.items.map((item, i) => {
                  const key = `${section.title}-${i}`;
                  return (
                    <AccordionItem
                      key={key}
                      item={item}
                      index={i}
                      isOpen={!!openMap[key]}
                      onToggle={() => toggle(key)}
                    />
                  );
                })}
              </div>
            </motion.div>
          );
        })}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/8 via-primary/4 to-transparent p-8 md:p-10 text-center"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center mx-auto mb-4">
            <MapPin className="h-4.5 w-4.5 text-primary" style={{ width: "1.125rem", height: "1.125rem" }} />
          </div>
          <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-primary mb-2">
            {lang === "ru" ? "Связаться" : "Get in touch"}
          </p>
          <p className="text-foreground font-bold text-lg mb-2">
            {lang === "ru" ? "Остались вопросы?" : "Still have questions?"}
          </p>
          <p className="text-muted-foreground text-sm font-light mb-6 max-w-sm mx-auto leading-relaxed">
            {lang === "ru"
              ? "Свяжитесь с нами — ответим быстро и подберём маршрут под ваши задачи."
              : "Contact us — we respond fast and will find the right route for you."}
          </p>
          <button
            type="button"
            onClick={() => setContactOpen(true)}
            className="inline-block px-8 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm tracking-wide hover:opacity-90 transition-opacity shadow-lg shadow-primary/20 cursor-pointer"
          >
            {lang === "ru" ? "Связаться с нами" : "Contact us"}
          </button>
        </motion.div>
      </div>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
      <Footer />
    </div>
  );
}
