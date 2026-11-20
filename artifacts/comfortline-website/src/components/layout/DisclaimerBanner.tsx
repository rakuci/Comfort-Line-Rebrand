import { useState } from "react";
import { AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { useLang } from "@/context/language-context";

interface DisclaimerBannerProps {
  /** href for the "check official sources" button. Defaults to "#official-sources". */
  officialSourcesHref?: string;
}

const SHORT: Record<string, string> = {
  ru: "Важно: ComfortLine — частный перевозчик, а не таможенный, пограничный, миграционный или юридический орган. Материалы носят исключительно информационный характер. Правила могут измениться без уведомления.",
  en: "Important: ComfortLine is a private transport company, not a customs, border, immigration or legal authority. This content is for information purposes only. Rules may change without notice.",
  pl: "Ważne: ComfortLine jest prywatnym przewoźnikiem, a nie organem celnym, granicznym, imigracyjnym ani prawnym. Materiały mają charakter wyłącznie informacyjny. Przepisy mogą ulec zmianie bez uprzedniego powiadomienia.",
  fr: "Important : ComfortLine est un transporteur privé, pas une autorité douanière, frontalière, migratoire ou juridique. Ce contenu est fourni à titre informatif uniquement. Les règles peuvent changer sans préavis.",
};

const FULL: Record<string, string[]> = {
  ru: [
    "ComfortLine является частным перевозчиком и не является государственным, таможенным, пограничным, миграционным или юридическим консультативным органом.",
    "Материалы представлены только в информационных целях. Правила ввоза товаров, санкционные ограничения, таможенные нормы и процедуры на границе могут изменяться без предварительного уведомления.",
    "Перед поездкой обязательно проверьте требования на официальных сайтах таможенных и государственных органов страны въезда.",
    "При поездке с ComfortLine пассажир может попросить водителя предоставить последнюю доступную нам практическую информацию. Такая помощь предоставляется только для удобства клиента и не является официальной консультацией или гарантией допуска товара через границу.",
  ],
  en: [
    "ComfortLine is a private transport company and is not a government, customs, border, immigration or legal advisory body.",
    "The content is provided for information purposes only. Import rules, sanctions restrictions, customs allowances and border procedures may change without prior notice.",
    "Before travelling, please verify requirements on the official websites of the customs and government authorities of your country of entry.",
    "When travelling with ComfortLine, passengers may ask the driver to share the latest practical information available to us. This is provided for the passenger's convenience only and does not constitute official advice or a guarantee of clearance at the border.",
  ],
  pl: [
    "ComfortLine jest prywatnym przewoźnikiem i nie jest organem rządowym, celnym, granicznym, imigracyjnym ani doradztwa prawnego.",
    "Treść jest udostępniana wyłącznie w celach informacyjnych. Przepisy dotyczące przywozu, ograniczenia sankcyjne, normy celne i procedury graniczne mogą ulec zmianie bez uprzedniego powiadomienia.",
    "Przed podróżą należy zweryfikować wymagania na oficjalnych stronach organów celnych i rządowych kraju wjazdu.",
    "Podróżując z ComfortLine, pasażerowie mogą poprosić kierowcę o udostępnienie najnowszych informacji praktycznych, którymi dysponujemy. Jest to udogodnienie dla pasażera i nie stanowi oficjalnej porady ani gwarancji odprawy na granicy.",
  ],
  fr: [
    "ComfortLine est un transporteur privé et n'est pas un organisme gouvernemental, douanier, frontalier, migratoire ou de conseil juridique.",
    "Le contenu est fourni à titre informatif uniquement. Les règles d'importation, les restrictions liées aux sanctions, les franchises douanières et les procédures frontalières peuvent changer sans préavis.",
    "Avant de voyager, veuillez vérifier les exigences sur les sites officiels des autorités douanières et gouvernementales du pays d'entrée.",
    "Lorsqu'ils voyagent avec ComfortLine, les passagers peuvent demander au chauffeur de partager les dernières informations pratiques dont nous disposons. Cette aide est fournie pour la commodité du passager et ne constitue pas un avis officiel ni une garantie de dédouanement à la frontière.",
  ],
};

const EXPAND_LABEL: Record<string, string> = { ru: "Подробнее", en: "Read more", pl: "Więcej", fr: "En savoir plus" };
const COLLAPSE_LABEL: Record<string, string> = { ru: "Свернуть", en: "Collapse", pl: "Zwiń", fr: "Réduire" };
const SOURCES_LABEL: Record<string, string> = {
  ru: "Проверить официальные источники",
  en: "Check official sources",
  pl: "Sprawdź oficjalne źródła",
  fr: "Consulter les sources officielles",
};

export const BORDER_SOURCES = [
  { href: "https://www.lrmuitine.lt/web/guest/fiziniams-asmenims", ru: "Таможня Литвы — lrmuitine.lt", en: "Lithuanian Customs — lrmuitine.lt", ruDesc: "Нормы провоза, запреты, оформление для физических лиц", enDesc: "Allowances, prohibitions and procedures for individuals" },
  { href: "https://www.podatki.gov.pl/clo/clo-dla-podroznych/", ru: "Таможня Польши — podatki.gov.pl", en: "Polish Customs — podatki.gov.pl", ruDesc: "Беспошлинные нормы для путешественников", enDesc: "Duty-free allowances for travellers" },
  { href: "https://www.vid.gov.lv/lv/muita-privatpersonam", ru: "Таможня Латвии (VID) — vid.gov.lv", en: "Latvian Customs (VID) — vid.gov.lv", ruDesc: "Таможенные правила для физических лиц", enDesc: "Customs rules for individuals" },
  { href: "https://gtk.gov.by", ru: "ГТК Беларуси — gtk.gov.by", en: "Belarusian State Customs Committee — gtk.gov.by", ruDesc: "Правила ввоза и вывоза товаров, таможенные нормы", enDesc: "Official customs regulations and import/export rules" },
  { href: "https://finance.ec.europa.eu/eu-and-world/sanctions-restrictive-measures_en", ru: "Санкции ЕС — Европейская комиссия", en: "EU Sanctions — European Commission", ruDesc: "Официальная база санкционных ограничений в отношении Беларуси", enDesc: "Official EU restrictive measures concerning Belarus" },
  { href: "https://mon.declarant.by/#/zone", ru: "Электронная очередь — mon.declarant.by", en: "Live border queue — mon.declarant.by", ruDesc: "Актуальные очереди на КПП в реальном времени", enDesc: "Real-time vehicle queue counts at border checkpoints" },
] as const;

/** Standalone official-sources section for custom (non-template) pages. */
export function BorderOfficialSources({ isRu }: { isRu: boolean }) {
  return (
    <section id="official-sources" className="scroll-mt-28">
      <h2 className="text-2xl font-bold text-foreground mb-3">
        {isRu ? "Официальные источники" : "Official Sources"}
      </h2>
      <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
        {isRu
          ? "Правила пересечения границы, таможенные нормы и санкционные ограничения могут изменяться. Перед поездкой проверяйте актуальную информацию на официальных сайтах."
          : "Border crossing rules, customs allowances and sanctions restrictions may change. Always verify current information on official websites before travelling."}
      </p>
      <div className="space-y-2">
        {BORDER_SOURCES.map((s, i) => (
          <a
            key={i}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 rounded-xl border border-border bg-card px-4 py-3 hover:border-primary/40 hover:bg-primary/5 transition-all group"
          >
            <span className="text-primary text-base mt-0.5 shrink-0">↗</span>
            <span>
              <span className="block text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{isRu ? s.ru : s.en}</span>
              <span className="block text-xs text-muted-foreground mt-0.5">{isRu ? s.ruDesc : s.enDesc}</span>
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

export function DisclaimerBanner({ officialSourcesHref = "#official-sources" }: DisclaimerBannerProps) {
  const { lang } = useLang();
  const locale = (lang in SHORT) ? lang : "en";
  const [expanded, setExpanded] = useState(false);

  return (
    <div data-regulatory-disclaimer="true" className="bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-800">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl py-3">
        <div className="flex items-start gap-2.5">
          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-amber-900 dark:text-amber-200 leading-relaxed">
              {SHORT[locale]}
            </p>
            {expanded && (
              <div className="mt-2 text-sm text-amber-800 dark:text-amber-300 leading-relaxed space-y-1.5">
                {FULL[locale].map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            )}
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <button
                onClick={() => setExpanded((e) => !e)}
                className="inline-flex items-center gap-1 text-xs text-amber-700 dark:text-amber-400 hover:underline"
                aria-expanded={expanded}
              >
                {expanded ? (
                  <><ChevronUp className="h-3 w-3" />{COLLAPSE_LABEL[locale]}</>
                ) : (
                  <><ChevronDown className="h-3 w-3" />{EXPAND_LABEL[locale]}</>
                )}
              </button>
              <a
                href={officialSourcesHref}
                aria-label={SOURCES_LABEL[locale]}
                className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 dark:text-amber-400 border border-amber-400/60 rounded-md px-2.5 py-1 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors"
              >
                {SOURCES_LABEL[locale]} ↓
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
