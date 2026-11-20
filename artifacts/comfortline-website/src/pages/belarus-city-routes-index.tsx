import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Seo } from "@/seo/Seo";
import { useLang } from "@/context/language-context";
import routes from "@/data/belarus-city-route-pages.json";
import catalog from "@/data/belarus-city-route-catalog.json";

export default function BelarusCityRoutesIndexPage() {
  const { lang } = useLang();
  const ru = lang === "ru";
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Seo
        titleRu="Трансферы по городам Беларуси и Европы | ComfortLine"
        titleEn="Belarus City Transfers from Europe | ComfortLine"
        descRu="Индивидуальные трансферы между Гродно, Брестом, Витебском, Гомелем, Могилёвом, Лидой, Барановичами и городами ЕС. Маршруты в обе стороны."
        descEn="Private transfers between major Belarusian cities and Vilnius, Warsaw or Riga. Explore both directions, pickup details and destination landmarks."
        pathRu="/трансферы-по-городам-беларуси"
        pathEn="/belarus-city-transfers"
      />
      <Navbar />
      <main className="container mx-auto px-4 md:px-6 max-w-5xl pt-28 pb-20">
        <p className="text-xs tracking-widest uppercase text-primary font-bold">
          {ru ? "Направления ComfortLine" : "ComfortLine destinations"}
        </p>
        <h1 className="mt-4 text-3xl sm:text-5xl font-bold leading-tight">
          {ru ? "Трансферы между городами Беларуси и Европы" : "Private transfers between Belarusian cities and Europe"}
        </h1>
        <p className="text-base md:text-lg text-muted-foreground mt-6 max-w-3xl">
          {ru
            ? "Выберите конкретное направление, чтобы узнать об адресах подачи, возможностях поездки и достопримечательностях города назначения. Каждая поездка и обратный маршрут оформляются по запросу; пограничные правила необходимо проверять перед выездом."
            : "Choose a direction to review pickup options, route-specific considerations and authentic landmarks in the destination city. Every journey and its return direction is quoted individually, subject to current border access rules."}
        </p>
        <section className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6" aria-label={ru ? "Направления" : "Directions"}>
          {catalog.pairs.map((pair) => {
            const forward = routes.find((r) => r.from === pair.a && r.to === pair.b);
            const reverse = routes.find((r) => r.from === pair.b && r.to === pair.a);
            const origin = catalog.cities[pair.a as keyof typeof catalog.cities];
            const dest = catalog.cities[pair.b as keyof typeof catalog.cities];
            if (!forward || !reverse) return null;
            return (
              <article key={pair.key} className="rounded-2xl border border-border bg-card overflow-hidden">
                <div className="aspect-[16/9] relative bg-muted overflow-hidden">
                  <img src={dest.photo.src} alt={ru ? dest.landmarkRu : dest.landmarkEn}
                    width={900} height={506} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                </div>
                <div className="p-5">
                  <h2 className="font-bold text-xl">{ru ? origin.ru + " ↔ " + dest.ru : origin.en + " ↔ " + dest.en}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {ru ? pair.reasonRu : pair.reasonEn}
                  </p>
                  <div className="grid grid-cols-1 gap-2 mt-5">
                    {[forward, reverse].map((r) => {
                      const a = catalog.cities[r.from as keyof typeof catalog.cities];
                      const b = catalog.cities[r.to as keyof typeof catalog.cities];
                      return (
                        <a key={r.key} href={ru ? r.pathRu : r.pathEn}
                          className="rounded-lg border border-border hover:border-primary/70 px-4 py-3 text-sm font-semibold">
                          {ru ? a.ru + " → " + b.ru : a.en + " → " + b.en}
                        </a>
                      );
                    })}
                  </div>
                  <p className="mt-3 text-[11px] text-muted-foreground">
                    {ru ? "Фото: " : "Image: "}
                    <a href={dest.photo.source} target="_blank" rel="noopener noreferrer" className="underline">
                      {dest.photo.author + " · " + dest.photo.license + " · Wikimedia Commons"}
                    </a>
                  </p>
                </div>
              </article>
            );
          })}
        </section>
        <p className="text-sm text-muted-foreground mt-8">
          {ru ? "Информация о КПП, документах и ограничениях может меняться. Проверяйте официальные источники и подтверждайте маршрут перед оплатой."
            : "Checkpoint rules, documents and restrictions can change. Consult official sources and confirm the route before paying."}
        </p>
      </main>
      <Footer />
    </div>
  );
}
