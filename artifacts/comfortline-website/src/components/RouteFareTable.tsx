import { fareClasses, referenceEuros, routeFares } from "@/data/route-fares";

interface Props {
  lang: "ru" | "en";
  cityRoute: string;
  from: string;
  to: string;
}

export function RouteFareTable({ lang, cityRoute, from, to }: Props) {
  const fares = routeFares[cityRoute];
  if (!fares) return null;
  const isRu = lang === "ru";
  const format = (value: number) => value.toLocaleString(isRu ? "ru-BY" : "en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return (
    <section className="mt-8 max-w-2xl">
      <h2 className="text-xl font-semibold">{isRu ? "Стоимость поездки" : "Transfer fares"}</h2>
      <table className="my-4 w-full text-left text-sm">
        <caption className="pb-3 text-left text-muted-foreground">
          {isRu ? "Ориентировочные цены в евро за автомобиль в одну сторону" : "Indicative starting fares in euros per vehicle, one way"}
        </caption>
        <thead><tr>
          <th scope="col">{isRu ? "Класс" : "Vehicle class"}</th>
          <th scope="col">{from} → {to}</th>
          <th scope="col">{to} → {from}</th>
        </tr></thead>
        <tbody>{fareClasses[lang].map((label, i) => (
          <tr key={label} className="border-b border-border">
            <th scope="row" className="py-2 font-normal">{label}</th>
            {[fares.outbound, fares.inbound].map((direction, j) => (
              <td key={j} className="px-1 tabular-nums">{direction[i] !== undefined
                ? <>
                    <strong className="block">{isRu ? "От" : "Starting at"} €{referenceEuros(direction[i])}</strong>
                    <span className="block text-xs text-muted-foreground">{format(direction[i])} BYN</span>
                  </> : (isRu ? "По запросу" : "On request")}</td>
            ))}
          </tr>
        ))}</tbody>
      </table>
      <p className="text-sm text-muted-foreground">{isRu
        ? "Оплата только в белорусских рублях (BYN). По вашей заявке водитель подтвердит окончательную стоимость в BYN до выезда. Суммы в евро приведены для справки. Цена зависит от даты и времени, адресов, класса автомобиля, числа пассажиров, багажа и дополнительных остановок."
        : "Payment is accepted only in Belarusian rubles (BYN). When you request a quote, your driver will confirm the final fare in BYN before departure. Euro amounts are for reference. The fare depends on the date and time, addresses, vehicle class, passengers, luggage and extra stops."}</p>
    </section>
  );
}
