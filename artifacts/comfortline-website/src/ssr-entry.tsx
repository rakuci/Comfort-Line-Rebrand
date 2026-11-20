// Build-time SSR entry used ONLY by scripts/prerender.mjs (via Vite's
// ssrLoadModule). It renders actual page component markup into a static
// HTML string for search engines / crawlers.
//
// It intentionally mirrors src/App.tsx's provider tree and route table, but:
//  - uses EAGER (non-lazy) imports, because React's synchronous
//    renderToStaticMarkup cannot wait on a lazy()/Suspense boundary — it
//    would just serialize the `null` fallback instead of real content.
//  - uses a static location hook (fixed to a single `path`) instead of
//    useBrowserLocation, so wouter's real Switch/Route matching resolves the
//    correct page for that path, including vehicle slug wrappers and the
//    blog `:slug` param route.
//
// This file is NOT imported by src/main.tsx or src/App.tsx and has no
// effect on the client bundle.
//
// IMPORTANT: keep this route table in sync with src/App.tsx's <Router />.

import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/context/language-context";
import { ShoppingEnquiryProvider } from "@/context/shopping-enquiry-context";
import { SeoRenderContext, type SeoData } from "@/seo/use-seo";

import cityRoutePages from "@/data/belarus-city-route-pages.json";
import BelarusCityRoutePage from "@/pages/belarus-city-routes";
import BelarusCityRoutesIndexPage from "@/pages/belarus-city-routes-index";
import LandingPage from "@/pages/landing";
import PrivacyPolicyPage from "@/pages/privacy-policy";
import TermsPage from "@/pages/terms";
import FaqPage from "@/pages/faq";
import MinskVilniusAirportPage from "@/pages/minsk-vilnius-airport";
import MinskWarsawAirportPage from "@/pages/minsk-warsaw-airport";
import MinskWarsawModlinAirportPage from "@/pages/minsk-warsaw-modlin-airport";
import MinskKaunasAirportPage from "@/pages/minsk-kaunas-airport";
import MinskVentspilsTransferPage from "@/pages/minsk-ventspils-transfer";
import MinskLiepajaTransferPage from "@/pages/minsk-liepaja-transfer";
import MinskJurmalaTransferPage from "@/pages/minsk-jurmala-transfer";
import MinskDaugavpilsTransferPage from "@/pages/minsk-daugavpils-transfer";
import MinskRigaAirportPage from "@/pages/minsk-riga-airport";
import BlogIndexPage from "@/pages/blog/index";
import BlogArticlePage from "@/pages/blog/article";
import { VehiclePage } from "@/pages/vehicle-page";
import MinskCityTransferPage from "@/pages/minsk-city-transfer";
import BelarusTransferPage from "@/pages/belarus-transfer";
import GroupTransferPage from "@/pages/group-transfer";
import WarsawTransferPage from "@/pages/warsaw-transfer";
import BerlinTransferPage from "@/pages/berlin-transfer";
import PragueTransferPage from "@/pages/prague-transfer";
import RigaTransferPage from "@/pages/riga-transfer";
import SanatoriumTransferPage from "@/pages/sanatorium-transfer";
import SkiTransferPage from "@/pages/ski-transfer";
import VipTransferPage from "@/pages/vip-transfer";
import MercedesVClassPage from "@/pages/mercedes-v-class";
import NotFound from "@/pages/not-found";
import EuropeTransferPage from "@/pages/europe-transfer";
import LithuaniaTransferPage from "@/pages/lithuania-transfer";
import LatviaTransferPage from "@/pages/latvia-transfer-country";
import PolandTransferPage from "@/pages/poland-transfer-country";
import FranceTransferPage from "@/pages/france-transfer";
import GermanyTransferPage from "@/pages/germany-transfer-country";
import MinskPalangaTransferPage from "@/pages/minsk-palanga-transfer";
import MinskKatowiceTransferPage from "@/pages/minsk-katowice-transfer";
import MinskLodzTransferPage from "@/pages/minsk-lodz-transfer";
import MinskPoznanTransferPage from "@/pages/minsk-poznan-transfer";
import MinskKrakowTransferPage from "@/pages/minsk-krakow-transfer";
import MinskWroclawTransferPage from "@/pages/minsk-wroclaw-transfer";
import MinskGdanskTransferPage from "@/pages/minsk-gdansk-transfer";
import MinskVilniusTransferPage from "@/pages/minsk-vilnius-transfer";
import MinskTrakaiTransferPage from "@/pages/minsk-trakai-transfer";
import MinskKlaipedaTransferPage from "@/pages/minsk-klaipeda-transfer";
import MinskDruskininkaiTransferPage from "@/pages/minsk-druskininkai-transfer";
import MinskKaunasTransferPage from "@/pages/minsk-kaunas-transfer";

// Prerender installs jsdom globals, so Query treats this CLI as a browser.
// Disable browser-style cache GC timers that otherwise keep the build alive.
const queryClient = new QueryClient({
  defaultOptions: { queries: { gcTime: Infinity } },
});

function VehiclePageMercedes() { return <VehiclePage slug="mercedes-e-class" />; }
function VehiclePageKia()      { return <VehiclePage slug="kia-carnival" />; }
function VehiclePageHyundai()  { return <VehiclePage slug="hyundai-palisade" />; }
function VehiclePageFiat()     { return <VehiclePage slug="fiat-scudo" />; }
function VehiclePageAudi()     { return <VehiclePage slug="audi-a6" />; }

function SsrRouter() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/en" component={LandingPage} />
      <Route path="/privacy" component={PrivacyPolicyPage} />
      <Route path="/en/privacy" component={PrivacyPolicyPage} />
      <Route path="/terms" component={TermsPage} />
      <Route path="/en/terms" component={TermsPage} />
      <Route path="/faq" component={FaqPage} />
      <Route path="/en/faq" component={FaqPage} />

      <Route path="/minsk-vilnius-airport" component={MinskVilniusAirportPage} />
      <Route path="/трансфер-минск-вильнюс-аэропорт" component={MinskVilniusAirportPage} />
      <Route path="/minsk-warsaw-airport" component={MinskWarsawAirportPage} />
      <Route path="/трансфер-минск-варшава-шопен" component={MinskWarsawAirportPage} />
      <Route path="/minsk-warsaw-modlin-airport" component={MinskWarsawModlinAirportPage} />
      <Route path="/трансфер-минск-варшава-модлин" component={MinskWarsawModlinAirportPage} />
      <Route path="/minsk-kaunas-airport" component={MinskKaunasAirportPage} />
      <Route path="/трансфер-минск-каунас-аэропорт" component={MinskKaunasAirportPage} />
      <Route path="/minsk-ventspils-transfer" component={MinskVentspilsTransferPage} />
      <Route path="/трансфер-минск-вентспилс" component={MinskVentspilsTransferPage} />
      <Route path="/minsk-liepaja-transfer" component={MinskLiepajaTransferPage} />
      <Route path="/трансфер-минск-лиепая" component={MinskLiepajaTransferPage} />
      <Route path="/minsk-jurmala-transfer" component={MinskJurmalaTransferPage} />
      <Route path="/трансфер-минск-юрмала" component={MinskJurmalaTransferPage} />
      <Route path="/minsk-daugavpils-transfer" component={MinskDaugavpilsTransferPage} />
      <Route path="/трансфер-минск-даугавпилс" component={MinskDaugavpilsTransferPage} />
      <Route path="/minsk-riga-airport" component={MinskRigaAirportPage} />
      <Route path="/трансфер-минск-рига-аэропорт" component={MinskRigaAirportPage} />

      <Route path="/blog" component={BlogIndexPage} />
      <Route path="/блог" component={BlogIndexPage} />
      <Route path="/blog/:slug" component={BlogArticlePage} />
      <Route path="/блог/:slug" component={BlogArticlePage} />

      <Route path="/mercedes-e-class-transfer" component={VehiclePageMercedes} />
      <Route path="/трансфер-мерседес-е-класс" component={VehiclePageMercedes} />
      <Route path="/kia-carnival-transfer" component={VehiclePageKia} />
      <Route path="/трансфер-киа-карнавал" component={VehiclePageKia} />
      <Route path="/hyundai-palisade-transfer" component={VehiclePageHyundai} />
      <Route path="/трансфер-хендай-палисад" component={VehiclePageHyundai} />
      <Route path="/fiat-scudo-transfer" component={VehiclePageFiat} />
      <Route path="/трансфер-фиат-скудо" component={VehiclePageFiat} />
      <Route path="/audi-a6-transfer" component={VehiclePageAudi} />
      <Route path="/трансфер-ауди-а6" component={VehiclePageAudi} />

      <Route path="/minsk-city-transfer" component={MinskCityTransferPage} />
      <Route path="/трансфер-по-минску" component={MinskCityTransferPage} />
      <Route path="/belarus-transfer" component={BelarusTransferPage} />
      <Route path="/трансфер-по-беларуси" component={BelarusTransferPage} />

      <Route path="/group-transfer" component={GroupTransferPage} />
      <Route path="/групповой-трансфер" component={GroupTransferPage} />

      <Route path="/warsaw-transfer" component={WarsawTransferPage} />
      <Route path="/трансфер-варшава" component={WarsawTransferPage} />
      <Route path="/berlin-transfer" component={BerlinTransferPage} />
      <Route path="/трансфер-берлин" component={BerlinTransferPage} />
      <Route path="/prague-transfer" component={PragueTransferPage} />
      <Route path="/трансфер-прага" component={PragueTransferPage} />
      <Route path="/riga-transfer" component={RigaTransferPage} />
      <Route path="/трансфер-рига" component={RigaTransferPage} />

      <Route path="/sanatorium-transfer" component={SanatoriumTransferPage} />
      <Route path="/трансфер-в-санаторий" component={SanatoriumTransferPage} />
      <Route path="/ski-transfer" component={SkiTransferPage} />
      <Route path="/лыжный-трансфер" component={SkiTransferPage} />
      <Route path="/vip-transfer" component={VipTransferPage} />
      <Route path="/вип-трансфер" component={VipTransferPage} />
      <Route path="/mercedes-v-class-transfer" component={MercedesVClassPage} />
      <Route path="/трансфер-мерседес-в-класс" component={MercedesVClassPage} />

      <Route path="/europe-transfer" component={EuropeTransferPage} />
      <Route path="/трансфер-в-европу" component={EuropeTransferPage} />

      <Route path="/lithuania-transfer" component={LithuaniaTransferPage} />
      <Route path="/трансфер-в-литву" component={LithuaniaTransferPage} />
      <Route path="/latvia-transfer" component={LatviaTransferPage} />
      <Route path="/трансфер-в-латвию" component={LatviaTransferPage} />
      <Route path="/poland-transfer" component={PolandTransferPage} />
      <Route path="/трансфер-в-польшу" component={PolandTransferPage} />
      <Route path="/france-transfer" component={FranceTransferPage} />
      <Route path="/трансфер-во-францию" component={FranceTransferPage} />
      <Route path="/germany-transfer" component={GermanyTransferPage} />
      <Route path="/трансфер-в-германию" component={GermanyTransferPage} />

      <Route path="/minsk-kaunas-transfer" component={MinskKaunasTransferPage} />
      <Route path="/трансфер-минск-каунас" component={MinskKaunasTransferPage} />
      <Route path="/minsk-palanga-transfer" component={MinskPalangaTransferPage} />
      <Route path="/трансфер-минск-паланга" component={MinskPalangaTransferPage} />
      <Route path="/minsk-katowice-transfer" component={MinskKatowiceTransferPage} />
      <Route path="/трансфер-минск-катовице" component={MinskKatowiceTransferPage} />
      <Route path="/minsk-lodz-transfer" component={MinskLodzTransferPage} />
      <Route path="/трансфер-минск-лодзь" component={MinskLodzTransferPage} />
      <Route path="/minsk-poznan-transfer" component={MinskPoznanTransferPage} />
      <Route path="/трансфер-минск-познань" component={MinskPoznanTransferPage} />
      <Route path="/minsk-krakow-transfer" component={MinskKrakowTransferPage} />
      <Route path="/трансфер-минск-краков" component={MinskKrakowTransferPage} />
      <Route path="/minsk-wroclaw-transfer" component={MinskWroclawTransferPage} />
      <Route path="/трансфер-минск-вроцлав" component={MinskWroclawTransferPage} />
      <Route path="/minsk-gdansk-transfer" component={MinskGdanskTransferPage} />
      <Route path="/трансфер-минск-гданьск" component={MinskGdanskTransferPage} />
      <Route path="/minsk-vilnius-transfer" component={MinskVilniusTransferPage} />
      <Route path="/трансфер-минск-вильнюс" component={MinskVilniusTransferPage} />
      <Route path="/minsk-trakai-transfer" component={MinskTrakaiTransferPage} />
      <Route path="/трансфер-минск-тракай" component={MinskTrakaiTransferPage} />
      <Route path="/minsk-klaipeda-transfer" component={MinskKlaipedaTransferPage} />
      <Route path="/трансфер-минск-клайпеда" component={MinskKlaipedaTransferPage} />
      <Route path="/minsk-druskininkai-transfer" component={MinskDruskininkaiTransferPage} />
      <Route path="/трансфер-минск-друскининкай" component={MinskDruskininkaiTransferPage} />

      <Route path="/трансферы-по-городам-беларуси" component={BelarusCityRoutesIndexPage} />
      <Route path="/belarus-city-transfers" component={BelarusCityRoutesIndexPage} />
      {cityRoutePages.flatMap((route) => [
        <Route key={route.pathRu} path={route.pathRu} component={BelarusCityRoutePage} />,
        <Route key={route.pathEn} path={route.pathEn} component={BelarusCityRoutePage} />,
      ])}
      <Route component={NotFound} />
    </Switch>
  );
}

function makeStaticLocationHook(path: string) {
  return function useStaticLocation(): [string, (to: string) => void] {
    return [path, () => {}];
  };
}

export function SsrApp({ path, onSeo }: { path: string; onSeo?: (data: SeoData) => void }) {
  return (
    <SeoRenderContext.Provider value={onSeo ?? null}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} forcedTheme="dark">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base="" hook={makeStaticLocationHook(path)}>
            <LanguageProvider>
              <ShoppingEnquiryProvider>
                <SsrRouter />
              </ShoppingEnquiryProvider>
            </LanguageProvider>
          </WouterRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
    </SeoRenderContext.Provider>
  );
}
