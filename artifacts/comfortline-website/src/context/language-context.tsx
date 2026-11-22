import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useLocation } from "wouter";

type Lang = "ru" | "en";

interface Translations {
  lang: "ru" | "en";
  modal: {
    title: string;
    passenger: string;
    passengerFew: string;
    passengerMany: string;
    adult: string;
    adultFew: string;
    adultMany: string;
    suitcase: string;
    suitcaseFew: string;
    suitcaseMany: string;
    classLabel: string;
    contactHeading: string;
    contactSubtext: string;
    name: string;
    email: string;
    phone: string;
    comment: string;
    privacyText: string;
    privacyLink: string;
    privacyAnd: string;
    termsLink: string;
    submit: string;
    step1Title: string;
    step2Title: string;
    selectPlan: string;
    back: string;
    planLabel: string;
  };
  nav: {
    services: string;
    fleet: string;
    prices: string;
    advantages: string;
    reviews: string;
    contacts: string;
    faq: string;
  };
  hero: {
    badge: string;
    headline1: string;
    headline2: string;
    checkmarks: string[];
    cta: string;
    ctaSecondary: string;
  };
  booking: {
    from: string;
    fromPlaceholder: string;
    to: string;
    toPlaceholder: string;
    date: string;
    datePlaceholder: string;
    passengersClass: string;
    passengerOne: string;
    passengerFew: string;
    passengerMany: string;
    adults: string;
    adultsNote: string;
    children: string;
    childrenNote: string;
    babies: string;
    babiesNote: string;
    pets: string;
    petsNote: string;
    maxPassengers: string;
    suitcases: string;
    vehicleClass: string;
    classAny: string;
    classComfort: string;
    classBusiness: string;
    classPremium: string;
    apply: string;
    cta: string;
    toastTitle: string;
    toastDesc: string;
    popularDestsLabel: string;
    popularDests: string[];
  };
  services: {
    label: string;
    heading: string;
    items: { title: string; description: string }[];
  };
  fleet: {
    label: string;
    heading: string;
    filterAll: string;
    book: string;
    seats: string;
    trunk: string;
    wifi: string;
    airportLabel: string;
    from: string;
    perHour: string;
  };
  pricing: {
    label: string;
    heading: string;
    subheading: string;
    popular: string;
    book: string;
    routes: {
      name: string;
      plans: { name: string; price: string; features: string[]; popular?: boolean }[];
    }[];
  };
  advantages: {
    label: string;
    heading: string;
    items: { title: string; description: string }[];
  };
  reviews: {
    label: string;
    heading: string;
    items: { name: string; city: string; text: string }[];
  };
  instagram: {
    label: string;
    heading: string;
    subheading: string;
    cta: string;
    profileUrl: string;
    loadMore: string;
    viewOnInstagram: string;
  };
  contact: {
    label: string;
    heading: string;
    subheading: string;
    phone: string;
    email: string;
    address: string;
    licensing: {
      badge: string;
      heading: string;
      text: string;
      registryLabel: string;
      registryUrl1: string;
      registryUrl2: string;
      directLinkLabel: string;
      directLinkUrl: string;
    };
  };
  reviewLinks: {
    heading: string;
    google: string;
    yandex: string;
    tripadvisor: string;
  };
  footer: {
    tagline: string;
    navHeading: string;
    navLinks: string[];
    servicesHeading: string;
    serviceLinks: { label: string; href: string }[];
    blogLabel: string;
    blogHref: string;
    faqLabel: string;
    faqHref: string;
    contactsHeading: string;
    copyright: string;
    legalName: string;
    unp: string;
    privacyPolicy: string;
    terms: string;
    brandbook: string;
  };
}

const ru: Translations = {
  lang: "ru",
  modal: {
    title: "Оформление трансфера",
    passenger: "пассажир",
    passengerFew: "пассажира",
    passengerMany: "пассажиров",
    adult: "взрослый",
    adultFew: "взрослых",
    adultMany: "взрослых",
    suitcase: "чемодан",
    suitcaseFew: "чемодана",
    suitcaseMany: "чемоданов",
    classLabel: "Класс",
    contactHeading: "Контактные данные",
    contactSubtext: "Для оформления заказа оставьте контакты — менеджер свяжется с вами в ближайшее время.",
    name: "Ваше имя",
    email: "Ваш email",
    phone: "Ваш телефон",
    comment: "Комментарий",
    privacyText: "Я согласен с",
    privacyLink: "политикой конфиденциальности",
    privacyAnd: "и",
    termsLink: "публичной офертой",
    submit: "Заказать трансфер",
    step1Title: "Выберите маршрут",
    step2Title: "Оформить заказ",
    selectPlan: "Выбрать",
    back: "Назад",
    planLabel: "Тариф",
  },
  nav: {
    services: "Услуги",
    fleet: "Автопарк",
    prices: "Тарифы",
    advantages: "Преимущества",
    reviews: "Отзывы",
    contacts: "Контакты",
    faq: "FAQ",
  },
  hero: {
    badge: "Всегда вовремя. Работаем с 2015 года.",
    headline1: "Индивидуальный трансфер, которому доверяют",
    headline2: "",
    checkmarks: ["по Беларуси и России", "по всей Европе", "трансфер в Аэропорт", "перевозим с детьми и питомцами"],
    cta: "Заказать трансфер",
    ctaSecondary: "Узнать цены",
  },
  booking: {
    from: "Откуда",
    fromPlaceholder: "Город / аэропорт",
    to: "Куда",
    toPlaceholder: "Город / аэропорт",
    date: "Дата поездки",
    datePlaceholder: "Выберите дату",
    passengersClass: "Пассажиры, класс",
    passengerOne: "пассажир",
    passengerFew: "пассажира",
    passengerMany: "пассажиров",
    adults: "Взрослые",
    adultsNote: "12+ лет",
    children: "Дети",
    childrenNote: "2–12 лет",
    babies: "Младенцы",
    babiesNote: "до 2 лет",
    pets: "Питомцы",
    petsNote: "до 30 кг",
    maxPassengers: "Максимум 6 пассажиров",
    suitcases: "Количество чемоданов",
    vehicleClass: "Класс",
    classAny: "Любой",
    classComfort: "Комфорт",
    classBusiness: "Бизнес",
    classPremium: "Премиум",
    apply: "Применить",
    cta: "Заказать трансфер",
    toastTitle: "Заявка отправлена!",
    toastDesc: "Наш менеджер свяжется с вами в ближайшее время.",
    popularDestsLabel: "Популярные направления",
    popularDests: ["Минск, Беларусь", "Аэропорт Минск-2 (MSQ)", "Вильнюс, Литва", "Варшава, Польша", "Рига, Латвия", "Брест, Беларусь", "Гродно, Беларусь", "Витебск, Беларусь"],
  },
  services: {
    label: "Наши Услуги",
    heading: "Направления комфорта",
    items: [
      { title: "Трансфер в Аэропорт", description: "Индивидуальный и групповой. Фиксированная цена. Предварительный заказ. Детские кресла. Встретим с табличкой." },
      { title: "Группы / Делегации до 8 человек", description: "Трансферы, экскурсии. Вместительные микроавтобусы (8 мест), большие багажные отделения." },
      { title: "Поездки по Минску, Беларуси и России", description: "Почасовая оплата в городе, подсчёт по километражу между городами. Седаны, микроавтобусы." },
      { title: "Поездки по Европе (Литва, Латвия, Польша)", description: "На выбор автомобили разных классов и типов кузова. Комфортное прохождение границы." },
    ],
  },
  fleet: {
    label: "Автопарк",
    heading: "Наш Автопарк",
    filterAll: "Все",
    book: "Забронировать",
    seats: "Мест",
    trunk: "Багажник",
    wifi: "Wi-Fi",
    airportLabel: "Трансфер в аэропорт",
    from: "начиная от",
    perHour: "час",
  },
  pricing: {
    label: "Тарифы",
    heading: "Цены на трансфер",
    subheading: "Выберите маршрут, чтобы посмотреть начальную цену и запросить расчёт поездки.",
    popular: "Популярный выбор",
    book: "Заказать",
    routes: [
      {
        name: "Минск → Аэропорт",
        plans: [
          { name: "Легковая — Эконом", price: "По запросу", features: ["Встреча с табличкой", "Помощь с багажом", "Детское кресло по запросу", "Ожидание при задержке рейса"] },
          { name: "Комфорт", price: "По запросу", popular: true, features: ["Встреча с табличкой", "Помощь с багажом", "Wi-Fi в салоне", "Вода для пассажиров"] },
          { name: "Бизнес", price: "По запросу", features: ["Mercedes E-Class", "Встреча с табличкой", "Wi-Fi в салоне", "Вода для пассажиров"] },
          { name: "Минивэн (до 6 чел.)", price: "По запросу", features: ["Kia Carnival", "Встреча с табличкой", "Много места для багажа", "Детское кресло по запросу"] },
          { name: "Микроавтобус (до 8 чел.)", price: "По запросу", features: ["Fiat Scudo", "Встреча с табличкой", "Подходит для групп", "Детские кресла по запросу"] },
        ],
      },
      {
        name: "Минск → Вильнюс",
        plans: [
          { name: "Легковой авто", price: "По запросу", features: ["Сопровождение до двери", "Помощь с багажом", "Ожидание при задержке"] },
          { name: "Минивэн", price: "По запросу", popular: true, features: ["Kia Carnival, до 5 пас.", "Сопровождение до двери", "Много места для багажа"] },
          { name: "Бизнес", price: "По запросу", features: ["Mercedes E-Class", "Сопровождение до двери", "Wi-Fi в салоне"] },
        ],
      },
      {
        name: "Минск → Варшава",
        plans: [
          { name: "Легковая", price: "По запросу", features: ["Сопровождение до двери", "Помощь с багажом", "Ожидание при задержке"] },
          { name: "Бизнес", price: "По запросу", features: ["Mercedes E-Class", "Сопровождение до двери", "Wi-Fi в салоне"] },
          { name: "Минивэн", price: "По запросу", popular: true, features: ["Kia Carnival, до 5 пас.", "Сопровождение до двери", "Много места для багажа"] },
        ],
      },
    ],
  },
  advantages: {
    label: "Почему ComfortLine",
    heading: "Безупречный сервис в каждой поездке",
    items: [
      { title: "Вся линейка транспорта", description: "Седаны эконом и комфорт, микроавтобусы до 8 мест. Подберем авто под ваши нужды." },
      { title: "Всегда вовремя", description: "Менеджер координирует весь процесс. Подача машины точно в назначенное время." },
      { title: "Профессиональные водители", description: "Вежливые, опытные, отлично знают город и маршруты. Всегда пунктуальны и дисциплинированы." },
      { title: "Предзаказ и день в день", description: "Принимаем заявки заранее и срочные заказы минимум за 5 часов до прибытия." },
      { title: "Пассажиры застрахованы", description: "Ваша безопасность — наш приоритет. Жизнь и здоровье каждого пассажира застрахованы на время поездки." },
      { title: "Гибкие тарифы", description: "Фиксированные цены на популярные направления и специальные условия для постоянных корпоративных клиентов." },
    ],
  },
  reviews: {
    label: "Отзывы",
    heading: "Что говорят наши клиенты",
    items: [
      { name: "Александра", city: "Минск", text: "Ездили коллективом на экскурсию в Дудутки. Водитель приехал за 15 минут до оговоренного времени. Машина была чистой и аккуратной. Спасибо за высокий уровень сервиса!" },
      { name: "Евгений", city: "Москва", text: "Приезжали в Минск компанией 6 человек. Обратились в ComfortLine. Нас встретили в аэропорту с табличкой, доехали быстро и дешево. Отличная организация трансфера." },
      { name: "Юлия", city: "Молодечно", text: "Решили семьёй поехать в Египет. Семья не маленькая, трое детей. Воспользовались трансфером и не прогадали. В микроавтобусе было просторно, комфортно. Спасибо!" },
      { name: "Дмитрий", city: "Гродно", text: "Заказывал трансфер Минск — Вильнюс. Водитель был пунктуален, ехали комфортно, без задержек. Очень приятный сервис, уже рекомендовал коллегам." },
      { name: "Наталья", city: "Брест", text: "Возвращались из Варшавы с большим количеством вещей. Водитель помог с багажом, в салоне было просторно. Граница прошла быстро, всё организовано отлично." },
      { name: "Сергей", city: "Варшава", text: "Летел из Минска — трансфер в аэропорт заказал за день. Всё прошло идеально: приехали вовремя, водитель знал терминал, довёз с запасом времени." },
      { name: "Виктория", city: "Минск", text: "Деловая поездка в Вильнюс. Сидела с ноутбуком всю дорогу — тихо, Wi-Fi работал. Это совсем другой уровень по сравнению с обычными такси." },
      { name: "Андрей", city: "Вильнюс", text: "Заказывал трансфер для родителей Минск — аэропорт. Пожилым людям понравилось — водитель помог с вещами, был вежлив и терпелив. Большое спасибо!" },
      { name: "Татьяна", city: "Минск", text: "Сделала мужу подарок — поездка на день рождения в бизнес-классе. Автомобиль был шикарным, встреча с цветами. Произвело очень сильное впечатление." },
      { name: "Игорь", city: "Гомель", text: "Корпоративный трансфер для делегации из 8 человек. Два автомобиля подали одновременно, никто не ждал. Профессиональный подход к работе, рекомендую." },
      { name: "Ольга", city: "Минск", text: "Езжу с ComfortLine уже больше года — на встречи, в аэропорт, иногда просто по городу. Надёжность на высшем уровне, за всё время не было ни одного опоздания." },
      { name: "Максим", city: "Москва", text: "Прилетал в Минск на конференцию. Встретили прямо у выхода, помогли с чемоданами. В машине уже ждала вода. Приятно удивлён уровнем сервиса." },
      { name: "Елена", city: "Брест", text: "Трансфер Польша — Минск с тремя пересадками пугал, но всё организовали безупречно. Водитель был на связи весь путь. Доехали спокойно и вовремя." },
    ],
  },
  instagram: {
    label: "Мы в Instagram",
    heading: "Поездки наших клиентов",
    subheading: "Реальные кадры из наших трансферов — автомобили, маршруты и моменты в дороге. Подписывайтесь, чтобы видеть свежие поездки.",
    cta: "Открыть @transfer_comfortline",
    profileUrl: "https://www.instagram.com/transfer_comfortline/",
    loadMore: "Показать ещё",
    viewOnInstagram: "Открыть пост в Instagram",
  },
  contact: {
    label: "Связаться с нами",
    heading: "Заказать трансфер",
    subheading: "Заполните форму выше или свяжитесь с нами напрямую — наш менеджер подтвердит детали и организует поездку. Работаем круглосуточно.",
    phone: "Телефон",
    email: "Email",
    address: "Адрес",
    licensing: {
      badge: "Официальный перевозчик",
      heading: "Лицензионная информация",
      text: "Индивидуальный предприниматель Мурашко Андрей Антонович имеет действительную лицензию на международные автомобильные перевозки пассажиров за № 02190/1-85358 (номер лицензии в Едином реестре лицензий — 13230000078378). Дата принятия решения о выдаче лицензии за № 13-ЛИ – 30 июня 2023 года. Срок действия лицензии – бессрочный.",
      registryLabel: "Единый реестр лицензий:",
      registryUrl1: "https://license.gov.by/",
      registryUrl2: "https://лицензия.бел",
      directLinkLabel: "Лицензия ИП Мурашко А.А.:",
      directLinkUrl: "https://license.gov.by/onelicense/157966",
    },
  },
  reviewLinks: {
    heading: "Оставить отзыв",
    google: "Google Карты",
    yandex: "Яндекс",
    tripadvisor: "Tripadvisor",
  },
  footer: {
    tagline: "Индивидуальный трансфер по Беларуси и Европе. Работаем с 2015 года.",
    navHeading: "Навигация",
    navLinks: ["Услуги", "Автопарк", "Преимущества", "Отзывы"],
    servicesHeading: "Направления",
    serviceLinks: [
      { label: "Минск — Вильнюс (город)", href: "/трансфер-минск-вильнюс" },
      { label: "Минск — Вильнюс (VNO)", href: "/трансфер-минск-вильнюс-аэропорт" },
      { label: "Такси Минск — Варшава", href: "/трансфер-варшава" },
      { label: "Минск — Варшава (WAW)", href: "/трансфер-минск-варшава-шопен" },
      { label: "Минск — Варшава (Модлин)", href: "/трансфер-минск-варшава-модлин" },
      { label: "Минск — Каунас (KUN)", href: "/трансфер-минск-каунас-аэропорт" },
      { label: "Минск — Рига (RIX)", href: "/трансфер-минск-рига-аэропорт" },
      { label: "Трансфер в Берлин", href: "/трансфер-берлин" },
      { label: "Трансфер в Прагу", href: "/трансфер-прага" },
      { label: "Трансфер в Ригу", href: "/трансфер-рига" },
      { label: "Трансфер по Минску", href: "/трансфер-по-минску" },
      { label: "Межгород по Беларуси", href: "/трансфер-по-беларуси" },
      { label: "Групповой трансфер", href: "/групповой-трансфер" },
      { label: "Трансфер в санаторий", href: "/трансфер-в-санаторий" },
      { label: "Лыжный трансфер", href: "/лыжный-трансфер" },
      { label: "VIP трансфер", href: "/вип-трансфер" },
    ],
    blogLabel: "Блог",
    blogHref: "/блог",
    faqLabel: "FAQ",
    faqHref: "/faq",
    contactsHeading: "Контакты",
    copyright: "Все права защищены.",
    legalName: "ИП Мурашко Андрей Антонович",
    unp: "УНП 193255422",
    privacyPolicy: "Политика конфиденциальности",
    terms: "Публичная оферта",
    brandbook: "Брендбук",
  },
};

const en: Translations = {
  lang: "en",
  modal: {
    title: "Transfer order",
    passenger: "passenger",
    passengerFew: "passengers",
    passengerMany: "passengers",
    adult: "Adult",
    adultFew: "Adults",
    adultMany: "Adults",
    suitcase: "Suitcase",
    suitcaseFew: "Suitcases",
    suitcaseMany: "Suitcases",
    classLabel: "Class",
    contactHeading: "Contact details",
    contactSubtext: "To place an order, leave your contacts and our manager will get in touch shortly.",
    name: "Your name",
    email: "Your email",
    phone: "Your phone number",
    comment: "Your comment",
    privacyText: "I agree to the",
    privacyLink: "privacy policy",
    privacyAnd: "and",
    termsLink: "terms of service",
    submit: "Order a transfer",
    step1Title: "Choose your route",
    step2Title: "Complete your booking",
    selectPlan: "Select",
    back: "Back",
    planLabel: "Plan",
  },
  nav: {
    services: "Services",
    fleet: "Fleet",
    prices: "Rates",
    advantages: "Why Us",
    reviews: "Reviews",
    contacts: "Contacts",
    faq: "FAQ",
  },
  hero: {
    badge: "Always on time. Operating since 2015.",
    headline1: "Private transfers you can trust",
    headline2: "",
    checkmarks: ["across Belarus & Europe", "across all of Europe", "airport transfers", "kids & pets welcome"],
    cta: "Book a Transfer",
    ctaSecondary: "See Rates",
  },
  booking: {
    from: "From",
    fromPlaceholder: "City / airport",
    to: "To",
    toPlaceholder: "City / airport",
    date: "Date of trip",
    datePlaceholder: "Choose date",
    passengersClass: "Passengers, class",
    passengerOne: "passenger",
    passengerFew: "passengers",
    passengerMany: "passengers",
    adults: "Adults",
    adultsNote: "12+ years",
    children: "Children",
    childrenNote: "2–12 years",
    babies: "Babies",
    babiesNote: "under 2 years",
    pets: "Pets",
    petsNote: "up to 30 kg",
    maxPassengers: "Maximum 6 passengers",
    suitcases: "Number of suitcases",
    vehicleClass: "Class",
    classAny: "Any",
    classComfort: "Comfort",
    classBusiness: "Business",
    classPremium: "Premium",
    apply: "Apply",
    cta: "Order a transfer",
    toastTitle: "Request sent!",
    toastDesc: "Our manager will contact you shortly.",
    popularDestsLabel: "Popular destinations",
    popularDests: ["Minsk, Belarus", "Minsk Airport (MSQ)", "Vilnius, Lithuania", "Warsaw, Poland", "Riga, Latvia", "Brest, Belarus", "Grodno, Belarus", "Vitebsk, Belarus"],
  },
  services: {
    label: "Our Services",
    heading: "Routes of Comfort",
    items: [
      { title: "Airport Transfer", description: "Individual and group. Fixed price. Pre-booking available. Child seats. Meet & greet with name board." },
      { title: "Groups / Delegations up to 8", description: "Transfers and excursions. Spacious minivans (8 seats) with large luggage compartments." },
      { title: "Trips in Minsk & Belarus", description: "Hourly rate in the city, per-kilometer rate between cities. Sedans and minivans for any road." },
      { title: "Trips Across Europe (Lithuania, Latvia, Poland)", description: "Choose from a wide range of vehicle classes. Comfortable border crossing included." },
    ],
  },
  fleet: {
    label: "Fleet",
    heading: "Our Fleet",
    filterAll: "All",
    book: "Book",
    seats: "Seats",
    trunk: "Luggage",
    wifi: "Wi-Fi",
    airportLabel: "Airport transfer",
    from: "starting from",
    perHour: "hr",
  },
  pricing: {
    label: "Rates",
    heading: "Transfer Prices",
    subheading: "Choose a route to see its starting fare and request a quote.",
    popular: "Most popular",
    book: "Book",
    routes: [
      {
        name: "Minsk → Airport",
        plans: [
          { name: "Sedan — Economy", price: "On request", features: ["Meet & greet with board", "Luggage assistance", "Child seat on request", "Wait for delayed flights"] },
          { name: "Comfort", price: "On request", popular: true, features: ["Meet & greet with board", "Luggage assistance", "In-car Wi-Fi", "Water for passengers"] },
          { name: "Business", price: "On request", features: ["Mercedes E-Class", "Meet & greet with board", "In-car Wi-Fi", "Water for passengers"] },
          { name: "Minivan (up to 6 pax)", price: "On request", features: ["Kia Carnival", "Meet & greet with board", "Ample luggage space", "Child seat on request"] },
          { name: "Minibus (up to 8 pax)", price: "On request", features: ["Fiat Scudo", "Meet & greet with board", "Suitable for groups", "Child seats on request"] },
        ],
      },
      {
        name: "Minsk → Vilnius",
        plans: [
          { name: "Sedan", price: "On request", features: ["Door-to-door service", "Luggage assistance", "Wait for delays"] },
          { name: "Minivan", price: "On request", popular: true, features: ["Kia Carnival, up to 5 pax", "Door-to-door service", "Ample luggage space"] },
          { name: "Business", price: "On request", features: ["Mercedes E-Class", "Door-to-door service", "In-car Wi-Fi"] },
        ],
      },
      {
        name: "Minsk → Warsaw",
        plans: [
          { name: "Sedan", price: "On request", features: ["Door-to-door service", "Luggage assistance", "Wait for delays"] },
          { name: "Business", price: "On request", features: ["Mercedes E-Class", "Door-to-door service", "In-car Wi-Fi"] },
          { name: "Minivan", price: "On request", popular: true, features: ["Kia Carnival, up to 5 pax", "Door-to-door service", "Ample luggage space"] },
        ],
      },
    ],
  },
  advantages: {
    label: "Why ComfortLine",
    heading: "Impeccable service every ride",
    items: [
      { title: "Full range of vehicles", description: "Economy and comfort sedans, minivans up to 8 seats. We will find the right car for your needs." },
      { title: "Always on time", description: "Our manager coordinates the entire process. Your car arrives exactly on schedule." },
      { title: "Professional drivers", description: "Polite, experienced, and knowledgeable. Business attire available on request." },
      { title: "Pre-booking & same-day", description: "Accept advance bookings and urgent orders with at least 5 hours' notice." },
      { title: "Passengers insured", description: "Your safety is our priority. The life and health of every passenger is insured for the journey." },
      { title: "Flexible rates", description: "Fixed prices on popular routes and special terms for regular corporate clients." },
    ],
  },
  reviews: {
    label: "Reviews",
    heading: "What our clients say",
    items: [
      { name: "Alexandra", city: "Minsk", text: "We took a group excursion to Dudutki. The driver arrived 15 minutes early. The car was spotless. Thank you for the outstanding level of service!" },
      { name: "Evgeny", city: "Moscow", text: "We came to Minsk as a group of 6. Used ComfortLine — they met us at the airport with a name board, got us to the hotel quickly. Excellent transfer." },
      { name: "Julia", city: "Molodechno", text: "Family trip to Egypt — three kids and lots of luggage. The minivan was spacious and comfortable. Couldn't have managed without this service. Thank you!" },
      { name: "Dmitry", city: "Grodno", text: "Booked a transfer from Minsk to Vilnius. The driver was on time, the ride was smooth and quiet. Great service — I've already recommended ComfortLine to my colleagues." },
      { name: "Natalia", city: "Brest", text: "Coming back from Warsaw with a lot of luggage. The driver helped with everything, the car was spacious. The border crossing was quick and well organized." },
      { name: "Sergei", city: "Warsaw", text: "Had an early flight from Minsk — booked the airport transfer the day before. Everything went perfectly: arrived on time, driver knew the terminal, got there with time to spare." },
      { name: "Victoria", city: "Minsk", text: "Business trip to Vilnius. I worked on my laptop the entire way — quiet, Wi-Fi worked. A completely different experience compared to regular taxis." },
      { name: "Andrew", city: "Vilnius", text: "Ordered a transfer for my elderly parents from Minsk to the airport. They loved it — the driver helped with bags and was patient and kind. Very grateful!" },
      { name: "Tatiana", city: "Minsk", text: "Treated my husband to a business-class ride for his birthday. The car was stunning, the greeting was personal. It really made an impression." },
      { name: "Igor", city: "Gomel", text: "Corporate transfer for a delegation of 8. Two cars showed up simultaneously, no one waited. Very professional approach — highly recommended for business travel." },
      { name: "Olga", city: "Minsk", text: "I've been using ComfortLine for over a year — meetings, airport runs, occasional city rides. Reliable every single time. Not a single delay in all that time." },
      { name: "Max", city: "Moscow", text: "Flew into Minsk for a conference. Was met right at the exit, luggage handled, water already in the car. Genuinely impressed by the level of service." },
      { name: "Elena", city: "Brest", text: "The Poland–Minsk transfer with border crossing worried me, but everything was arranged perfectly. The driver stayed in touch the whole way. Arrived on time, stress-free." },
    ],
  },
  instagram: {
    label: "Follow us on Instagram",
    heading: "Our clients on the road",
    subheading: "Real photos from our transfers — vehicles, routes and moments en route. Follow us to see the latest trips.",
    cta: "Open @transfer_comfortline",
    profileUrl: "https://www.instagram.com/transfer_comfortline/",
    loadMore: "Show more",
    viewOnInstagram: "View post on Instagram",
  },
  contact: {
    label: "Get in Touch",
    heading: "Book a Transfer",
    subheading: "Use the booking form above or contact us directly — our manager will confirm the details and arrange your trip. We operate around the clock.",
    phone: "Phone",
    email: "Email",
    address: "Address",
    licensing: {
      badge: "Official Licensed Carrier",
      heading: "Licensing Information",
      text: "Individual Entrepreneur Murashko Andrey Antonovich holds a valid licence for international passenger road transport, No. 02190/1-85358 (registry number 13230000078378). Licence decision date: 30 June 2023. Validity: unlimited.",
      registryLabel: "Unified Licence Registry:",
      registryUrl1: "https://license.gov.by/",
      registryUrl2: "https://лицензия.бел",
      directLinkLabel: "Licence — Murashko A.A.:",
      directLinkUrl: "https://license.gov.by/onelicense/157966",
    },
  },
  reviewLinks: {
    heading: "Leave a Review",
    google: "Google Maps",
    yandex: "Yandex",
    tripadvisor: "Tripadvisor",
  },
  footer: {
    tagline: "Individual transfer across Belarus and Europe. Operating since 2015.",
    navHeading: "Navigation",
    navLinks: ["Services", "Fleet", "Why Us", "Reviews"],
    servicesHeading: "Routes",
    serviceLinks: [
      { label: "Minsk — Vilnius city transfer", href: "/minsk-vilnius-transfer" },
      { label: "Minsk — Vilnius (VNO)", href: "/minsk-vilnius-airport" },
      { label: "Minsk — Warsaw city transfer", href: "/warsaw-transfer" },
      { label: "Minsk — Warsaw (WAW)", href: "/minsk-warsaw-airport" },
      { label: "Minsk — Warsaw (Modlin)", href: "/minsk-warsaw-modlin-airport" },
      { label: "Minsk — Kaunas (KUN)", href: "/minsk-kaunas-airport" },
      { label: "Minsk — Riga (RIX)", href: "/minsk-riga-airport" },
      { label: "Berlin transfer", href: "/berlin-transfer" },
      { label: "Prague transfer", href: "/prague-transfer" },
      { label: "Riga transfer", href: "/riga-transfer" },
      { label: "Trips in Minsk", href: "/minsk-city-transfer" },
      { label: "Intercity in Belarus", href: "/belarus-transfer" },
      { label: "Group transfer", href: "/group-transfer" },
      { label: "Sanatorium transfer", href: "/sanatorium-transfer" },
      { label: "Ski transfer", href: "/ski-transfer" },
      { label: "VIP transfer", href: "/vip-transfer" },
    ],
    blogLabel: "Blog",
    blogHref: "/blog",
    faqLabel: "FAQ",
    faqHref: "/en/faq",
    contactsHeading: "Contacts",
    copyright: "All rights reserved.",
    legalName: "IE Murashko Andrey Antonovich",
    unp: "TIN 193255422",
    privacyPolicy: "Privacy Policy",
    terms: "Terms of Service",
    brandbook: "Brandbook",
  },
};

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "ru",
  setLang: () => {},
  t: ru,
});

// Takes a decoded path (wouter's useLocation already calls decodeURI on it).
// window.location.pathname can be percent-encoded in some proxied environments,
// so we never read it directly for Cyrillic detection.
function getLangFromPath(path: string): Lang {
  const param =
    typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("lang") : null;
  if (param === "en" || param === "ru") return param;

  // Path-based English shell for shared pages (/en, /en/faq, /en/privacy, /en/terms).
  const normalizedForEnCheck = path.replace(/\/+$/, "") || "/";
  if (normalizedForEnCheck === "/en" || normalizedForEnCheck.startsWith("/en/")) return "en";

  // Cyrillic characters in the decoded path → always Russian
  if (/[\u0400-\u04FF]/.test(path)) return "ru";

  // Paths that are shared between both languages (same URL) → default Russian
  const normalized = path.replace(/\/+$/, "") || "/";
  const sharedPaths = ["/", "/faq", "/privacy", "/terms", "/brandbook", "/thank-you"];
  if (sharedPaths.includes(normalized)) return "ru";

  // Latin-only slug that is not a shared path → English service page or blog
  return "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [lang, setLang] = useState<Lang>(() => getLangFromPath(location));

  useEffect(() => {
    setLang(getLangFromPath(location));
  }, [location]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: lang === "ru" ? ru : en }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
