import type { FareRate } from "@/hooks/use-fare-rate";
import { fareClasses, roundedByn, routeFares } from "@/data/route-fares";

interface Props {
  lang: "ru" | "en";
  cityRoute: string;
  rate: FareRate;
  from: string;
  to: string;
}

export function RouteFareTable({ lang, cityRoute, from, to, rate }: Props) {
  const fares = routeFares[cityRoute];
  if (!fares) return null;
  const isRu = lang === "ru";
  const locale = isRu ? "ru-BY" : "en-GB";
  const same = fares.outbound.every((value, i) => value === fares.inbound[i]);
  const directions = same ? [fares.outbound] : [fares.outbound, fares.inbound];
  const labels = same ? [`${from} ↔ ${to}`] : [`${from} → ${to}`, `${to} → ${from}`];
  const rateDate = new Date(rate.date + "T12:00:00Z").toLocaleDateString(locale, {
    day: "numeric", month: "short", year: "numeric", timeZone: "UTC",
  });
  return (
    <section className="mt-8 max-w-3xl">
      <h2 className="mb-3 text-xl font-semibold">{isRu ? "Стоимость поездки" : "Transfer fares"}</h2>
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full table-fixed text-left text-sm">
          <caption className="px-3 py-3 text-left text-muted-foreground sm:px-5">
            {isRu ? "Начальные цены за автомобиль в одну сторону" : "Starting fares per vehicle, one way"}
          </caption>
          <thead className="border-y border-border bg-primary/10"><tr>
            <th scope="col" className="w-[30%] px-2 py-3 sm:px-5">{isRu ? "Класс" : "Vehicle class"}</th>
            {labels.map(label => <th key={label} scope="col" className="px-2 py-3 sm:px-4">{label}</th>)}
          </tr></thead>
          <tbody className="divide-y divide-border">{fareClasses[lang].map((label, i) => (
            <tr key={label}>
              <th scope="row" className="px-2 py-3 font-medium sm:px-5">{label}</th>
              {directions.map((direction, j) => (
                <td key={labels[j]} className="px-2 py-3 sm:px-4">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 leading-snug tabular-nums">
                    <strong className="text-primary">{isRu ? "От" : "Starting at"} <span className="whitespace-nowrap">€{direction[i]}</span></strong>
                    <span className="whitespace-nowrap font-medium">{roundedByn(direction[i], rate.bynPerEur).toLocaleString(locale)} BYN</span>
                  </div>
                </td>
              ))}
            </tr>
          ))}</tbody>
        </table>
      </div>
      <p className="my-3 text-xs leading-relaxed text-muted-foreground">
        <a className="underline underline-offset-2" href={`https://api.nbrb.by/exrates/rates/EUR?parammode=2&ondate=${rate.date}`}>{isRu ? "Курс НБРБ" : "NBRB rate"}</a>
        {" · "}{rateDate}{" · 1 EUR = "}{rate.bynPerEur.toLocaleString(locale, { maximumFractionDigits: 4 })} BYN.
        {isRu ? " Сумма в BYN округлена вверх до 10 рублей." : " BYN fares are rounded up to the nearest 10 rubles."}
      </p>
      <p className="text-sm text-muted-foreground">{isRu
        ? "Оплата только в белорусских рублях (BYN). По вашей заявке водитель подтвердит окончательную стоимость в BYN до выезда. Суммы в евро приведены для справки. Цена зависит от даты и времени, адресов, класса автомобиля, числа пассажиров, багажа и дополнительных остановок."
        : "Payment is accepted only in Belarusian rubles (BYN). When you request a quote, your driver will confirm the final fare in BYN before departure. Euro amounts are for reference. The fare depends on the date and time, addresses, vehicle class, passengers, luggage and extra stops."}</p>
    </section>
  );
}
