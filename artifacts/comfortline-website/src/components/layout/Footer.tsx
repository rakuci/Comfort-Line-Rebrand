import { useEffect, useRef, useState } from "react";
import { PhoneCall, Send } from "lucide-react";
import { Instagram } from "lucide-react";
import { SiTelegram, SiViber, SiWhatsapp, SiMessenger, SiThreads } from "react-icons/si";
import { useTheme } from "next-themes";
import { useLang } from "@/context/language-context";
import { Logo } from "@/components/brand/Logo";
import { ReviewLinks } from "@/components/layout/ReviewLinks";
import { gtagEvent, gtagPhoneConversion } from "@/lib/gtag";
import { analyticsPage, trackEvent } from "@/lib/analytics";

const navHrefs = ["#services", "#fleet", "#advantages", "#reviews"];
const BRANDBOOK_KEY = "comfortline-brandbook-revealed";
const TAP_THRESHOLD = 5;
const TAP_WINDOW_MS = 3000;

export function Footer() {
  const { t, lang } = useLang();
  const f = t.footer;
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const logoScheme = mounted && resolvedTheme === "light" ? "light" : "dark";
  const [brandbookVisible, setBrandbookVisible] = useState(false);
  const tapCount = useRef(0);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const trackContact = (channel: string) => {
    trackEvent("contact_clicked", {
      channel,
      location: "footer",
      page: analyticsPage(),
    });
  };

  useEffect(() => {
    setMounted(true);
    try {
      setBrandbookVisible(localStorage.getItem(BRANDBOOK_KEY) === "1");
    } catch {
      /* ignore */
    }
  }, []);

  const handleCopyrightTap = () => {
    tapCount.current += 1;
    if (tapTimer.current) clearTimeout(tapTimer.current);
    tapTimer.current = setTimeout(() => {
      tapCount.current = 0;
    }, TAP_WINDOW_MS);

    if (tapCount.current >= TAP_THRESHOLD) {
      tapCount.current = 0;
      if (tapTimer.current) clearTimeout(tapTimer.current);
      setBrandbookVisible((prev) => {
        const next = !prev;
        try {
          if (next) localStorage.setItem(BRANDBOOK_KEY, "1");
          else localStorage.removeItem(BRANDBOOK_KEY);
        } catch {
          /* ignore */
        }
        return next;
      });
    }
  };

  return (
    <footer className="bg-background border-t border-border pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Logo & About */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <a href="#" className="inline-block mb-6">
              <Logo variant="stacked" scheme={logoScheme} height={72} showTagline />
            </a>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              {f.tagline}
            </p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/transfer_comfortline/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" onClick={() => trackContact("instagram")} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://www.threads.com/@transferwarsaw_taxi" target="_blank" rel="noopener noreferrer" aria-label="Threads" onClick={() => trackContact("threads")} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                <SiThreads className="h-5 w-5" />
              </a>
              <a href="https://t.me/+375447620649" target="_blank" rel="noopener noreferrer" aria-label="Telegram" onClick={() => { gtagEvent("contact", { event_category: "messenger", event_label: "Telegram" }); trackContact("telegram"); }} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                <SiTelegram className="h-5 w-5" />
              </a>
              <a href="https://wa.me/375447620649" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" onClick={() => { gtagEvent("contact", { event_category: "messenger", event_label: "WhatsApp" }); trackContact("whatsapp"); }} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                <SiWhatsapp className="h-5 w-5" />
              </a>
              <a href="viber://chat?number=%2B375447620649" aria-label="Viber" onClick={() => trackContact("viber")} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                <SiViber className="h-5 w-5" />
              </a>
              <a href="https://m.me/103816619260365" target="_blank" rel="noopener noreferrer" aria-label="Messenger" onClick={() => trackContact("messenger")} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                <SiMessenger className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="font-bold text-foreground mb-6">{f.navHeading}</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {f.navLinks.map((label, i) => (
                <li key={i}><a href={navHrefs[i]} className="hover:text-primary transition-colors">{label}</a></li>
              ))}
              <li><a href={f.blogHref} className="hover:text-primary transition-colors">{f.blogLabel}</a></li>
              <li><a href={f.faqHref} className="hover:text-primary transition-colors">{f.faqLabel}</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold text-foreground mb-6">{f.servicesHeading}</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {f.serviceLinks.map((link, i) => (
                <li key={i}><a href={link.href} className="hover:text-primary transition-colors">{link.label}</a></li>
              ))}
              <li>
                <a href={lang === "ru" ? "/трансферы-по-городам-беларуси" : "/belarus-city-transfers"}
                   className="hover:text-primary transition-colors font-semibold">
                  {lang === "ru" ? "Города Беларуси ↔ Европа" : "Belarus cities ↔ Europe"}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-foreground mb-6">{f.contactsHeading}</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <PhoneCall className="h-5 w-5 text-primary shrink-0" />
                <a href="tel:+375447620649" onClick={() => { gtagPhoneConversion(); trackContact("phone"); }} className="hover:text-primary transition-colors font-medium text-foreground">+375 (44) 762-06-49</a>
              </li>
              <li className="flex items-start gap-3">
                <Send className="h-5 w-5 text-primary shrink-0" />
                <a href="mailto:info@comfortline.by" onClick={() => trackContact("email")} className="hover:text-primary transition-colors">info@comfortline.by</a>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 w-2 h-2 rounded-full bg-primary shrink-0" />
                <span>г. Минск, ул. Фёдорова, 19-10</span>
              </li>
            </ul>
            <div className="mt-5">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">{t.reviewLinks.heading}</div>
              <ReviewLinks variant="icons" />
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p
            onClick={handleCopyrightTap}
            className="cursor-default select-none"
            title=""
          >
            © {new Date().getFullYear()} ComfortLine. {f.copyright}
          </p>
          <div className="flex flex-wrap gap-4 items-center">
            <span>{f.legalName}</span>
            <span>{f.unp}</span>
            <a href="/privacy" className="hover:text-primary transition-colors underline underline-offset-2">
              {f.privacyPolicy}
            </a>
            <a href="/terms" className="hover:text-primary transition-colors underline underline-offset-2">
              {f.terms}
            </a>
            {brandbookVisible && (
              <a href="/brandbook" className="hover:text-primary transition-colors underline underline-offset-2">
                {f.brandbook}
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
