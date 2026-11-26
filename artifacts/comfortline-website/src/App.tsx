import { HolidayRide } from "./components/HolidayRide";
import { lazy, Suspense } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { useBrowserLocation } from "wouter/use-browser-location";
import cityRoutePages from "@/data/belarus-city-route-pages.json";

function useNormalizedLocation(): [string, (to: string) => void] {
  const [loc, navigate] = useBrowserLocation();
  const normalized = loc.length > 1 ? loc.replace(/\/+$/, "") || "/" : loc;
  return [normalized, navigate];
}

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/context/language-context";
import { ShoppingEnquiryProvider } from "@/context/shopping-enquiry-context";

const BelarusCityRoutePage = lazy(() => import("@/pages/belarus-city-routes"));
const BelarusCityRoutesIndexPage = lazy(() => import("@/pages/belarus-city-routes-index"));
const LandingPage                  = lazy(() => import("@/pages/landing"));
const PrivacyPolicyPage            = lazy(() => import("@/pages/privacy-policy"));
const TermsPage                    = lazy(() => import("@/pages/terms"));
const FaqPage                      = lazy(() => import("@/pages/faq"));
const MinskVilniusAirportPage      = lazy(() => import("@/pages/minsk-vilnius-airport"));
const MinskWarsawAirportPage       = lazy(() => import("@/pages/minsk-warsaw-airport"));
const MinskWarsawModlinAirportPage = lazy(() => import("@/pages/minsk-warsaw-modlin-airport"));
const MinskKaunasAirportPage       = lazy(() => import("@/pages/minsk-kaunas-airport"));
const MinskVentspilsTransferPage   = lazy(() => import("@/pages/minsk-ventspils-transfer"));
const MinskLiepajaTransferPage     = lazy(() => import("@/pages/minsk-liepaja-transfer"));
const MinskJurmalaTransferPage     = lazy(() => import("@/pages/minsk-jurmala-transfer"));
const MinskDaugavpilsTransferPage  = lazy(() => import("@/pages/minsk-daugavpils-transfer"));
const MinskRigaAirportPage         = lazy(() => import("@/pages/minsk-riga-airport"));
const BlogIndexPage                = lazy(() => import("@/pages/blog/index"));
const BlogArticlePage              = lazy(() => import("@/pages/blog/article"));
const VehiclePageModule            = lazy(() => import("@/pages/vehicle-page").then(m => ({ default: m.VehiclePage })));
const BrandbookPage                = lazy(() => import("@/pages/brandbook"));
const MinskCityTransferPage        = lazy(() => import("@/pages/minsk-city-transfer"));
const BelarusTransferPage          = lazy(() => import("@/pages/belarus-transfer"));
const GroupTransferPage            = lazy(() => import("@/pages/group-transfer"));
const WarsawTransferPage           = lazy(() => import("@/pages/warsaw-transfer"));
const BerlinTransferPage           = lazy(() => import("@/pages/berlin-transfer"));
const PragueTransferPage           = lazy(() => import("@/pages/prague-transfer"));
const RigaTransferPage             = lazy(() => import("@/pages/riga-transfer"));
const SanatoriumTransferPage       = lazy(() => import("@/pages/sanatorium-transfer"));
const SkiTransferPage              = lazy(() => import("@/pages/ski-transfer"));
const VipTransferPage              = lazy(() => import("@/pages/vip-transfer"));
const MercedesVClassPage           = lazy(() => import("@/pages/mercedes-v-class"));
const ThankYouPage                 = lazy(() => import("@/pages/thank-you"));
const NotFound                     = lazy(() => import("@/pages/not-found"));
const EuropeTransferPage           = lazy(() => import("@/pages/europe-transfer"));
const LithuaniaTransferPage        = lazy(() => import("@/pages/lithuania-transfer"));
const LatviaTransferPage           = lazy(() => import("@/pages/latvia-transfer-country"));
const PolandTransferPage           = lazy(() => import("@/pages/poland-transfer-country"));
const FranceTransferPage           = lazy(() => import("@/pages/france-transfer"));
const GermanyTransferPage          = lazy(() => import("@/pages/germany-transfer-country"));
const MinskPalangaTransferPage         = lazy(() => import("@/pages/minsk-palanga-transfer"));
const MinskKatowiceTransferPage        = lazy(() => import("@/pages/minsk-katowice-transfer"));
const MinskLodzTransferPage            = lazy(() => import("@/pages/minsk-lodz-transfer"));
const MinskPoznanTransferPage          = lazy(() => import("@/pages/minsk-poznan-transfer"));
const MinskKrakowTransferPage          = lazy(() => import("@/pages/minsk-krakow-transfer"));
const MinskWroclawTransferPage         = lazy(() => import("@/pages/minsk-wroclaw-transfer"));
const MinskGdanskTransferPage          = lazy(() => import("@/pages/minsk-gdansk-transfer"));
const MinskVilniusTransferPage         = lazy(() => import("@/pages/minsk-vilnius-transfer"));
const MinskTrakaiTransferPage          = lazy(() => import("@/pages/minsk-trakai-transfer"));
const MinskKlaipedaTransferPage        = lazy(() => import("@/pages/minsk-klaipeda-transfer"));
const MinskDruskininkaiTransferPage    = lazy(() => import("@/pages/minsk-druskininkai-transfer"));
const MinskKaunasTransferPage      = lazy(() => import("@/pages/minsk-kaunas-transfer"));

const queryClient = new QueryClient();

function VehiclePageMercedes()  { return <Suspense fallback={null}><VehiclePageModule slug="mercedes-e-class" /></Suspense>; }
function VehiclePageKia()       { return <Suspense fallback={null}><VehiclePageModule slug="kia-carnival" /></Suspense>; }
function VehiclePageHyundai()   { return <Suspense fallback={null}><VehiclePageModule slug="hyundai-palisade" /></Suspense>; }
function VehiclePageFiat()      { return <Suspense fallback={null}><VehiclePageModule slug="fiat-scudo" /></Suspense>; }
function VehiclePageAudi()      { return <Suspense fallback={null}><VehiclePageModule slug="audi-a6" /></Suspense>; }

function Router() {
  return (
    <Suspense fallback={null}>
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
        <Route path="/brandbook" component={BrandbookPage} />
        <Route path="/thank-you" component={ThankYouPage} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")} hook={useNormalizedLocation}>
            <LanguageProvider>
              <ShoppingEnquiryProvider>
                <Router />
                <HolidayRide />
              </ShoppingEnquiryProvider>
            </LanguageProvider>
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
