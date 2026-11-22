import { MapPin, ShieldCheck, Building2 } from "lucide-react";
import {
  RouteLandingPage,
  type RoutePageData,
} from "./route-landing-page";

const data: RoutePageData = {
  ru: {
    badge: "Трансфер Минск — Варшава — Минск",

    title: "Трансфер Минск — Варшава и Варшава — Минск",

    subtitle:
       "Индивидуальное такси Минск — Варшава и обратно от двери до двери. Отдельный автомобиль без попутчиков, подача по адресу и стоимость поездки по запросу.",

    stats: [
      {
        label: "Расстояние",
        value: "Около 550–600 км",
      },
      {
        label: "Формат поездки",
        value: "От двери до двери",
      },
      {
        label: "Пассажиры",
        value: "Только ваша группа",
      },
      {
        label: "Стоимость",
        value: "За автомобиль",
      },
    ],

    photosTitle: "Варшава — место назначения",

    // Пока не добавляйте сюда фотографии аэропортов WAW/WMI.
    // Для городской страницы позже используйте только локальные фото Варшавы.
    photos: [
      {
        src: "/img/warsaw/warsaw-old-town.webp",
        caption: "Старый город и Замковая площадь Варшавы",
      },
      {
        src: "/img/warsaw/warsaw-royal-castle.webp",
        caption: "Королевский замок в Варшаве",
      },
      {
        src: "/img/warsaw/warsaw-city-centre.webp",
        caption: "Современный центр Варшавы",
      },
    ],

    howTitle: "Как проходит трансфер Минск — Варшава в обе стороны",

    steps: [
      {
        icon: MapPin,
        title: "Подача автомобиля в Минске",
        desc:
          "Водитель заберёт вас от дома, гостиницы, офиса, вокзала или другого согласованного адреса в Минске. Не требуется добираться до общего места отправления.",
      },
      {
        icon: ShieldCheck,
        title: "Поездка через границу",
        desc:
          "Перед поездкой проверяется действующий статус пассажирских пунктов пропуска и возможные ограничения. Продолжительность прохождения границы заранее гарантировать невозможно.",
      },
      {
        icon: Building2,
        title: "Доставка по адресу в Варшаве",
        desc:
          "Довезём в центр Варшавы, Śródmieście, Mokotów, Wola, к Warszawa Centralna, Warszawa Zachodnia, гостинице, квартире, офису или другому согласованному адресу.",
      },
    ],

     infoTitle: "Условия поездки Минск — Варшава",

    infoRows: [
      {
        label: "Цена и валюта расчёта",
        value:
          "Стоимость предоставляется по запросу и рассчитывается за весь автомобиль в одну сторону, а не за одного пассажира. Все расчёты и платежи производятся в белорусских рублях (BYN) по сумме, согласованной до поездки.",
      },
      {
        label: "Направление",
        value: "Минск → граница Беларусь–Польша → Варшава",
      },
      {
        label: "Расстояние",
        value:
          "Около 550–600 км в зависимости от адресов подачи и прибытия",
      },
      {
        label: "Прибытие в Варшаве",
        value:
          "Śródmieście, Mokotów, Wola, Warszawa Centralna, Warszawa Zachodnia, отель, квартира, офис или другой адрес",
      },
      {
        label: "Обратная поездка",
        value:
          "Индивидуальное такси Варшава — Минск доступно по предварительному заказу",
      },
    ],

    includedTitle: "Что входит в стоимость трансфера",

    included: [
      "Подача автомобиля по согласованному адресу в Минске",
      "Индивидуальный автомобиль без посторонних пассажиров",
      "Прямая поездка без пересадок",
      "Помощь водителя с багажом",
      "Ожидание автомобиля во время пограничного контроля",
      "Питьевая вода в салоне",
      "Детское кресло или бустер по предварительному запросу",
      "Фиксированная стоимость после подтверждения заказа",
    ],

    whyTitle: "Почему выбирают ComfortLine",

    whyItems: [
      "Работаем в сфере индивидуальных трансферов с 2015 года",
      "Автомобиль предоставляется только вашей группе",
      "Подача от двери в согласованное время",
      "Комфортные седаны, кроссоверы, минивэны и микроавтобусы",
      "Подходит для семей, деловых поездок и большого багажа",
      "Можно заказать обратный трансфер Варшава — Минск",
      "Менеджер подтверждает детали поездки до выезда",
      "Дополнительные остановки можно согласовать заранее",
    ],

    faqTitle:
      "Частые вопросы о трансферах Минск — Варшава — Минск",

    faq: [
      {
        q: "Сколько стоит индивидуальное такси Минск — Варшава?",
        a:
          "Стоимость предоставляется по запросу и зависит от класса автомобиля: легковой Эконом, легковой Комфорт, Бизнес, VIP, Минивэн Комфорт или Минивэн Бизнес. Итоговая фиксированная стоимость подтверждается до выезда.",
      },
      {
        q: "Цена указана за человека или за машину?",
        a:
          "Стоимость рассчитывается за весь автомобиль в одну сторону, а не за одного пассажира. При поездке семьёй или группой итоговую сумму можно распределить между всеми пассажирами.",
      },
      {
        q: "В какой валюте производится расчёт и являются ли цены окончательными?",
        a:
          "Стоимость предоставляется по запросу. Все расчёты и платежи производятся в белорусских рублях (BYN). Информация на странице не является публичной офертой. Окончательная стоимость, автомобиль и условия поездки должны быть подтверждены водителем ComfortLine до выезда.",
      },
      {
        q: "Чем трансфер отличается от обычного такси или автобуса?",
        a:
          "Индивидуальный трансфер бронируется заранее на конкретную дату и маршрут. Машина предоставляется только вам и вашей группе, без подсадки посторонних пассажиров. Водитель забирает вас по адресу в Минске и доставляет непосредственно по адресу в Варшаве.",
      },
      {
        q: "Сколько времени занимает поездка из Минска в Варшаву?",
        a:
          "Расстояние составляет приблизительно 550–600 км. Итоговое время зависит от выбранного маршрута, движения на дорогах, очереди и продолжительности пограничного контроля. Поэтому точное время прибытия заранее гарантировать невозможно.",
      },
      {
        q: "Откуда водитель забирает пассажиров в Минске?",
        a:
          "Подача возможна от дома, гостиницы, офиса, железнодорожного вокзала или другого согласованного адреса. В Варшаве водитель также доставляет пассажиров непосредственно к указанному адресу.",
      },
      {
        q: "Какой пограничный переход используется?",
        a:
          "Маршрут определяется перед поездкой с учётом официального статуса пассажирских пунктов пропуска и действующих ограничений. Пассажирам также рекомендуется самостоятельно проверить официальные правила пересечения границы перед выездом.",
      },





      
      {
        q: "Можно ли заказать трансфер Варшава — Минск?",
        a:
          "Да. Обратную поездку можно оформить одновременно с поездкой из Минска либо отдельным заказом. Возможна подача в центре Варшавы, Śródmieście, Mokotów, Wola, у Warszawa Centralna, Warszawa Zachodnia, отеля или частного адреса.",
      },
      {
        q: "Можно ли ехать с ребёнком?",
        a:
          "Да. При оформлении заявки сообщите возраст и вес ребёнка. Менеджер подтвердит наличие подходящего детского кресла или бустера для выбранного автомобиля.",
      },
      {
        q: "Можно ли перевозить большой багаж или домашнее животное?",
        a:
          "Да, но это необходимо указать заранее. Сообщите количество чемоданов, размеры крупного багажа и информацию о животном, чтобы менеджер подобрал подходящий автомобиль.",
      },
      {
        q: "Можно ли доехать до аэропорта Шопена или Модлина?",
        a:
          "Да, но для поездок к конкретному рейсу предусмотрены отдельные страницы: трансфер Минск — аэропорт Варшавы Шопен WAW и трансфер Минск — аэропорт Варшавы Модлин WMI. Эта страница предназначена прежде всего для поездки к адресу в городе Варшава.",
      },
    ],

    ctaTitle: "Заказать индивидуальный трансфер Минск — Варшава",

    ctaDesc:
      "Укажите дату, время, адреса, количество пассажиров и багажа — менеджер рассчитает стоимость по запросу. Все расчёты производятся в BYN. Информация не является публичной офертой, а окончательная стоимость подтверждается водителем до выезда.",

    ctaBtn: "Заказать такси",

    prefilledFrom: "Минск",
    prefilledTo: "Варшава",

    backBtn: "← Все трансферы в Польшу",
  },

  en: {
    badge: "Minsk — Warsaw — Minsk Transfer",

    title: "Minsk to Warsaw and Warsaw to Minsk Transfer",

    subtitle:
       "Private door-to-door taxi from Minsk to Warsaw and back. Travel in a dedicated vehicle with no shared passengers, pickup at your address and a price provided on request.",

    stats: [
      {
        label: "Distance",
        value: "About 550–600 km",
      },
      {
        label: "Service",
        value: "Door to door",
      },
      {
        label: "Passengers",
        value: "Your group only",
      },
      {
        label: "Price",
        value: "Per vehicle",
      },
    ],

    photosTitle: "Your destination — Warsaw",

    photos: [
      {
        src: "/img/warsaw/warsaw-old-town.webp",
        caption: "Warsaw Old Town and Castle Square",
      },
      {
        src: "/img/warsaw/warsaw-royal-castle.webp",
        caption: "Royal Castle in Warsaw",
      },
      {
        src: "/img/warsaw/warsaw-city-centre.webp",
        caption: "Warsaw city centre skyline",
      },
    ],

    howTitle: "How the transfer works in both directions",

    steps: [
      {
        icon: MapPin,
        title: "Pickup in Minsk",
        desc:
          "Your driver collects you from your home, hotel, office, railway station or another agreed address in Minsk.",
      },
      {
        icon: ShieldCheck,
        title: "Cross-border journey",
        desc:
          "The current official status of passenger border checkpoints and applicable restrictions is checked before departure. Border processing time cannot be guaranteed.",
      },
      {
        icon: Building2,
        title: "Drop-off in Warsaw",
        desc:
          "We take you directly to central Warsaw, Śródmieście, Mokotów, Wola, Warszawa Centralna, Warszawa Zachodnia, a hotel, apartment, office or another agreed address.",
      },
    ],

    infoTitle: "Minsk to Warsaw booking details",

    infoRows: [
      {
        label: "Price and settlement currency",
        value:
          "The price is provided on request and applies to the whole vehicle for a one-way journey, not per passenger. All settlements and payments are made in Belarusian rubles (BYN) in the amount agreed before departure.",
      },
      {
        label: "Route",
        value: "Minsk → Belarus–Poland border → Warsaw",
      },
      {
        label: "Distance",
        value:
          "Approximately 550–600 km depending on pickup and drop-off addresses",
      },
      {
        label: "Warsaw drop-off",
        value:
          "Śródmieście, Mokotów, Wola, Warszawa Centralna, Warszawa Zachodnia, hotel, apartment, office or another address",
      },
      {
        label: "Return journey",
        value: "Private Warsaw to Minsk taxi is available by advance booking",
      },
    ],

    includedTitle: "What is included",

    included: [
      "Pickup from an agreed address in Minsk",
      "Private vehicle with no shared passengers",
      "Direct journey without transfers",
      "Driver assistance with luggage",
      "Vehicle waiting during border formalities",
      "Bottled water in the vehicle",
      "Child seat or booster by advance request",
      "Price confirmed before departure",
    ],

    whyTitle: "Why choose ComfortLine",

    whyItems: [
      "Providing private transfer services since 2015",
      "Vehicle dedicated exclusively to your group",
      "Door-to-door pickup at an agreed time",
      "Comfort sedans, SUVs, minivans and minibuses",
      "Suitable for families, business travel and heavy luggage",
      "Return Warsaw to Minsk transfer available",
      "Journey details confirmed before departure",
      "Additional stops can be arranged in advance",
    ],

    faqTitle: "Minsk to Warsaw and Warsaw to Minsk transfer FAQ",

    faq: [
      {
        q: "How much is a private taxi from Minsk to Warsaw?",
        a:
           "The price is provided on request and depends on the vehicle class, travel date, pickup and destination addresses, passenger count and luggage. The final fixed price is confirmed before departure.",
      },
      {
        q: "Is the price per passenger or per vehicle?",
        a:
           "The requested price is for the whole vehicle for a one-way journey, not per passenger. Families and groups can share the total cost.",
      },
      {
        q: "Which currency is used, and are the displayed prices final?",
        a:
           "The price is provided on request. All settlements and payments are made in Belarusian rubles (BYN). The information on this page does not constitute a public offer. The final price, vehicle and journey conditions must be confirmed by the ComfortLine driver before departure.",
      },
      {
        q: "How is a private transfer different from a taxi or bus?",
        a:
          "The transfer is booked in advance for a specific date and route. The vehicle is dedicated exclusively to your group, with no shared passengers. Pickup and drop-off are provided directly at your agreed addresses.",
      },
      {
        q: "How long does the Minsk to Warsaw journey take?",
        a:
          "The distance is approximately 550–600 km. Total journey time depends on the route, road conditions, border queues and duration of passport and customs controls, so an exact arrival time cannot be guaranteed.",
      },
      {
        q: "Where can the driver collect me in Minsk?",
        a:
          "Pickup is available from your home, hotel, office, railway station or another agreed address. In Warsaw, the driver also takes you directly to your requested address.",
      },
      {
        q: "Which border checkpoint is used?",
        a:
          "The route is selected before departure according to the current official status of passenger checkpoints and applicable restrictions. Travellers should also verify official border requirements before travelling.",
      },
      {
        q: "Can I book a return transfer from Warsaw to Minsk?",
        a:
          "Yes. The return journey can be booked with the outbound trip or separately. Pickup is available in central Warsaw, Śródmieście, Mokotów, Wola, at Warszawa Centralna, Warszawa Zachodnia, a hotel or a private address.",
      },
      {
        q: "Can I travel with children?",
        a:
          "Yes. Provide the child's age and weight when booking so that a suitable child seat or booster can be confirmed.",
      },
      {
        q: "Can I travel with large luggage or a pet?",
        a:
          "Yes, but please provide the details in advance. The number of suitcases, oversized items and pet requirements help us select an appropriate vehicle.",
      },
      {
        q: "Can you take me to Warsaw Chopin or Modlin Airport?",
        a:
          "Yes, but airport journeys have separate pages for Warsaw Chopin Airport WAW and Warsaw Modlin Airport WMI. This page is primarily intended for transfers to addresses within Warsaw city.",
      },
    ],

    ctaTitle: "Book a private Minsk to Warsaw transfer",

    ctaDesc:
       "Provide the date, time, addresses, passenger count and luggage to receive a price on request. All settlements are made in BYN. This page is not a public offer, and the final price must be confirmed by the driver before departure.",

    ctaBtn: "Book private taxi",

    prefilledFrom: "Minsk",
    prefilledTo: "Warsaw",

    backBtn: "← All Poland transfers",
  },

  seo: {
    titleRu:
       "Трансфер Варшава — Минск и обратно | ComfortLine",

    titleEn:
       "Warsaw to Minsk & Return Transfer | ComfortLine",

    descRu:
       "Трансфер Варшава — Минск и Минск — Варшава. Поездка между городами от €399 за автомобиль. Итоговую стоимость подтверждает водитель.",

    descEn:
       "Private Warsaw to Minsk and Minsk to Warsaw transfer. City-to-city fares from €399 per vehicle. Your driver confirms the final fare.",

    pathRu: "/трансфер-варшава",
    pathEn: "/warsaw-transfer",

    breadcrumbRu: "Индивидуальный трансфер Минск — Варшава",
    breadcrumbEn: "Private Minsk to Warsaw transfer",

    fromName: "Минск",
    toName: "Варшава",
    reverseFromName: "Варшава",
    reverseToName: "Минск",


    keywordsRu:
      "такси минск варшава, индивидуальный трансфер минск варшава, трансфер варшава минск, такси варшава минск, частный трансфер варшава минск, заказать трансфер из варшавы в минск, минск варшава без попутчиков",

    keywordsEn:
      "minsk to warsaw taxi, private transfer minsk warsaw, warsaw minsk transfer, warsaw to minsk transfer, warsaw to minsk taxi, private transfer warsaw minsk, door to door minsk warsaw",
  },
};

export default function WarsawTransferPage() {
  return <RouteLandingPage data={data} />;
}