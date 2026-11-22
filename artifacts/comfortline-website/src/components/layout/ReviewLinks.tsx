import { SiGoogle, SiTripadvisor } from "react-icons/si";
import { useLang } from "@/context/language-context";
import { gtagEvent } from "@/lib/gtag";

const GOOGLE_REVIEW_URL =
  "https://www.google.com/maps?cid=8221901216004637668";

const YANDEX_REVIEW_URL =
  "https://yandex.by/profile/225346737717";

const TRIPADVISOR_REVIEW_URL =
  "https://www.tripadvisor.com/Attraction_Review-g294448-d34505679-Reviews-ComfortLine-Minsk_Minsk_Region.html";

function YandexIcon({
  className = "",
}: {
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`${className} inline-flex items-center justify-center font-black leading-none`}
    >
      Я
    </span>
  );
}

interface ReviewLinksProps {
  variant?: "buttons" | "icons";
  
  className?: string;
}

export function ReviewLinks({ variant = "buttons", className = "" }: ReviewLinksProps) {
  const { t } = useLang();
  const r = t.reviewLinks;

  const links = [
    {
      key: "google",
      icon: SiGoogle,
      href: GOOGLE_REVIEW_URL,
      label: r.google,
      cls: "hover:bg-[#4285F4] hover:text-white",
    },
    {
      key: "yandex",
      icon: YandexIcon,
      href: YANDEX_REVIEW_URL,
      label: r.yandex,
      cls: "hover:bg-[#FC3F1D] hover:text-white",
    },
    {
      key: "tripadvisor",
      icon: SiTripadvisor,
      href: TRIPADVISOR_REVIEW_URL,
      label: r.tripadvisor,
      cls: "hover:bg-[#34E0A1] hover:text-black",
    },
  ];

  if (variant === "icons") {
    return (
      <div className={`flex gap-3 ${className}`}>
        {links.map(({ key, icon: Icon, href, label, cls }) => (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            onClick={() => gtagEvent("contact", { event_category: "review", event_label: label })}
            className={`w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-foreground transition-colors ${cls}`}
          >
            <Icon className="h-5 w-5" />
          </a>
        ))}
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {links.map(({ key, icon: Icon, href, label, cls }) => (
        <a
          key={key}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => gtagEvent("contact", { event_category: "review", event_label: label })}
          className={`inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3.5 py-2 text-xs font-medium text-foreground transition-colors ${cls}`}
        >
          <Icon className="h-4 w-4" />
          {label}
        </a>
      ))}
    </div>
  );
}
