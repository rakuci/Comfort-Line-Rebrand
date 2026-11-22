import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Fleet } from "@/components/sections/Fleet";
import { Advantages } from "@/components/sections/Advantages";
import { Reviews } from "@/components/sections/Reviews";
import { InstagramFeed } from "@/components/sections/InstagramFeed";
import { Contact } from "@/components/sections/Contact";
import { Seo } from "@/seo/Seo";

export default function LandingPage() {
  return (
    <div className="min-h-[100dvh] flex flex-col w-full bg-background selection:bg-primary/30">
      <Seo
        titleRu="Трансферы по Беларуси и в Европу | ComfortLine"
        titleEn="Private Transfers in Belarus and to Europe | ComfortLine"
        descRu="Выберите трансфер по Беларуси или между Минском, Вильнюсом, Варшавой и Ригой. Смотрите маршруты и начальные цены. Запросите стоимость поездки у водителя."
        descEn="Plan a private transfer within Belarus or between Minsk, Vilnius, Warsaw and Riga. Compare city and airport routes, see starting fares and request a quote."
        pathRu="/"
        pathEn="/en"
        keywordsRu="трансфер минск вильнюс аэропорт, трансфер минск варшава аэропорт, минск vno, минск waw, такси минск аэропорт вильнюса, такси минск аэропорт варшавы, комфортный трансфер из минска, трансфер минск европа, ComfortLine"
        keywordsEn="minsk vilnius airport transfer, minsk warsaw airport transfer, minsk vno taxi, minsk waw taxi, comfortable transfer minsk to vilnius, comfortable transfer minsk to warsaw, minsk europe transfer, ComfortLine"
      />
      <Navbar />
      <main className="flex-1 w-full">
        <Hero />
        <Services />
        <Fleet />
        <Advantages />
        <Reviews />
        <InstagramFeed />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
