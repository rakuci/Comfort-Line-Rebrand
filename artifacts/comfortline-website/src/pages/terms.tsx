import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useLang } from "@/context/language-context";
import { Seo } from "@/seo/Seo";

const ruContent = {
  title: "Публичная оферта",
  subtitle: "на оказание услуг по организации индивидуального трансфера",
  operator: `ИП Мурашко Андрей Антонович
УНП: 193255422
Адрес: Республика Беларусь, г. Минск, ул. Фёдорова, 19-10
Email: info@comfortline.by
Телефон: +375 (44) 762-06-49`,
  sections: [
    {
      heading: "1. Общие положения",
      body: `1.1. Настоящий документ является публичной офертой в соответствии со статьями 405 и 407 Гражданского кодекса Республики Беларусь.

1.2. ИП Мурашко Андрей Антонович (далее — Исполнитель) предлагает любому дееспособному лицу (далее — Заказчик) заключить договор на оказание услуг трансфера на условиях, изложенных ниже.

1.3. Акцептом оферты является:
• оформление заявки на Сайте Comfortline.by
• либо подтверждение заказа по телефону / мессенджеру
• либо оплата услуги`,
    },
    {
      heading: "2. Предмет договора",
      body: `2.1. Исполнитель оказывает услуги по организации индивидуального трансфера (перевозки пассажиров) по маршрутам, согласованным с Заказчиком.

2.2. Услуги включают:
• предоставление автомобиля с водителем
• перевозку по указанному маршруту
• дополнительные услуги (при необходимости)`,
    },
    {
      heading: "3. Порядок оформления заказа",
      body: `3.1. Заказ оформляется через:
• сайт
• телефон
• мессенджеры

3.2. Заказ считается принятым после подтверждения Исполнителем.

3.3. Заказчик обязан предоставить достоверные данные:
• контактную информацию
• маршрут
• дату и время поездки`,
    },
    {
      heading: "4. Стоимость и порядок оплаты",
      body: `4.1. Цены указаны в белорусских рублях (BYN). Все расчёты производятся только в BYN. По заявке клиента водитель согласует окончательную стоимость до выезда.

4.2. Оплата может осуществляться:
• наличными
• безналичным способом
• онлайн-оплатой (при наличии)

4.3. Исполнитель вправе запросить предоплату.`,
    },
    {
      heading: "5. Отмена и изменения заказа",
      body: `5.1. Заказчик вправе отменить заказ:
• более чем за 24 часа — бесплатно
• менее чем за 24 часа — возможен штраф до 100% стоимости
• неявка (no-show) — 100% стоимости

5.2. Изменение маршрута или времени возможно по согласованию и может повлиять на стоимость.`,
    },
    {
      heading: "6. Обязанности сторон",
      body: `Исполнитель обязуется:
• предоставить исправный автомобиль
• обеспечить подачу автомобиля в согласованное время
• обеспечить вежливое обслуживание

Заказчик обязуется:
• своевременно прибыть к месту подачи
• соблюдать правила поведения
• не наносить ущерб имуществу`,
    },
    {
      heading: "7. Ответственность",
      body: `7.1. Исполнитель не несёт ответственности за:
• задержки, вызванные дорожной ситуацией, погодой, действиями третьих лиц
• опоздание пассажира

7.2. В случае повреждения автомобиля Заказчик обязан возместить ущерб.`,
    },
    {
      heading: "8. Форс-мажор",
      body: `8.1. Стороны освобождаются от ответственности при обстоятельствах непреодолимой силы (форс-мажор):
• стихийные бедствия
• военные действия
• ограничения органов власти`,
    },
    {
      heading: "9. Персональные данные",
      body: "9.1. Заказчик даёт согласие на обработку персональных данных в соответствии с Политикой конфиденциальности, размещённой на сайте.",
    },
    {
      heading: "10. Разрешение споров",
      body: `10.1. Споры решаются путём переговоров.

10.2. В случае недостижения соглашения — в соответствии с законодательством Республики Беларусь.`,
    },
    {
      heading: "11. Заключительные положения",
      body: `11.1. Исполнитель вправе изменять условия оферты.

11.2. Актуальная версия доступна на сайте Comfortline.by`,
    },
  ],
};

const enContent = {
  title: "Public Offer (Terms of Service)",
  subtitle: "Private transfer and chauffeur services",
  operator: `Sole Proprietor Murashko Andrey Antonovich
UNP: 193255422
Address: Minsk, Republic of Belarus
Email: info@comfortline.by
Phone: +375 (44) 762-06-49`,
  sections: [
    {
      heading: "1. General",
      body: "This document is a public offer in accordance with the Civil Code of the Republic of Belarus. By placing an order via the website, phone, messenger, or making payment, the customer accepts these terms.",
    },
    {
      heading: "2. Service",
      body: `The Company provides private chauffeur and transfer services including:
• A vehicle with a driver
• Transportation along the agreed route
• Additional services on request`,
    },
    {
      heading: "3. Booking",
      body: `Orders can be placed via the website, phone, or messaging apps.

The order is confirmed upon acknowledgment by the Company.

The customer must provide accurate information:
• Contact details
• Route
• Date and time of travel`,
    },
    {
      heading: "4. Payment",
      body: `Prices are quoted in Belarusian rubles (BYN). All payments are made in BYN only. Upon request, the driver confirms the final fare with the customer before departure.

Payment options:
• Cash
• Bank transfer
• Online payment (where available)

The Company may require a prepayment.`,
    },
    {
      heading: "5. Cancellation Policy",
      body: `• 24+ hours before the trip: free cancellation
• Less than 24 hours: up to 100% cancellation fee
• No-show: 100% of the trip cost

Route or time changes are possible by agreement and may affect the price.`,
    },
    {
      heading: "6. Obligations",
      body: `The Company undertakes to:
• Provide a roadworthy vehicle
• Arrive at the agreed time and location
• Ensure courteous service

The customer undertakes to:
• Arrive at the pickup point on time
• Comply with conduct rules
• Not damage the vehicle or its equipment`,
    },
    {
      heading: "7. Liability",
      body: `The Company is not liable for:
• Delays caused by traffic, weather, or third parties
• Passenger lateness

If the vehicle is damaged by the customer, the customer is liable to compensate the full cost of repairs.`,
    },
    {
      heading: "8. Force Majeure",
      body: `The parties are released from liability in the event of circumstances beyond their control, including:
• Natural disasters
• Military actions
• Government restrictions`,
    },
    {
      heading: "9. Personal Data",
      body: "The customer consents to the processing of personal data in accordance with the Privacy Policy published on this website.",
    },
    {
      heading: "10. Dispute Resolution",
      body: "Disputes are resolved through negotiation. If no agreement is reached, disputes are settled in accordance with the laws of the Republic of Belarus.",
    },
    {
      heading: "11. Final Provisions",
      body: "The Company reserves the right to amend these terms. The current version is always available at Comfortline.by.",
    },
  ],
};

export default function TermsPage() {
  const { lang } = useLang();
  const content = lang === "ru" ? ruContent : enContent;

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <Seo
        titleRu="Публичная оферта и условия | ComfortLine"
        titleEn="Public Offer & Terms | ComfortLine"
        descRu="Публичная оферта ComfortLine: условия предоставления услуг трансфера, права и обязанности сторон, оплата и отмена бронирования."
        descEn="ComfortLine public offer & terms: transfer service conditions, rights and obligations of the parties, payment and cancellation."
        pathRu="/terms"
        pathEn="/en/terms"
      />
      <Navbar />
      <main className="flex-1 pt-28 pb-20">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              {content.title}
            </h1>
            <p className="text-muted-foreground">{content.subtitle}</p>
            <div className="w-16 h-1 bg-primary rounded-full mt-6 mb-6" />
            <p className="text-sm text-muted-foreground whitespace-pre-line border border-border rounded-xl px-4 py-3 bg-muted/30">
              {content.operator}
            </p>
          </div>

          <div className="space-y-8">
            {content.sections.map((section) => (
              <div key={section.heading}>
                <h2 className="text-lg font-bold text-primary mb-3">
                  {section.heading}
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
                  {section.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
