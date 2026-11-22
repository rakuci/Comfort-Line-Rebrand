import { useState, useEffect, ElementType } from "react";
import { Menu, X, Phone, Sun, Moon } from "lucide-react";
import { useLang } from "@/context/language-context";
import { SiWhatsapp, SiTelegram, SiViber, SiMessenger, SiThreads } from "react-icons/si";
import { Instagram } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { Logo } from "@/components/brand/Logo";
import { NavBorderQueueBadge } from "@/components/layout/NavBorderQueueBadge";
import { gtagEvent, gtagPhoneConversion } from "@/lib/gtag";
import { analyticsPage, trackEvent } from "@/lib/analytics";
import { useLocation } from "wouter";
import { getAlternateLangHref } from "@/lib/lang-urls";

/** Maps each nav href to the section id it represents (for IntersectionObserver) */
const SECTION_MAP: Record<string, string> = {
  "/#services":     "services",
  "/en#services":   "services",
  "/#fleet":        "fleet",
  "/en#fleet":      "fleet",
  "/#advantages":   "advantages",
  "/en#advantages": "advantages",
  "/#reviews":      "reviews",
  "/en#reviews":    "reviews",
  "/#contact":      "contact",
  "/en#contact":    "contact",
};

export function Navbar() {
  const [isScrolled, setIsScrolled]       = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeHref, setActiveHref]       = useState<string | null>(null);
  const [hoveredHref, setHoveredHref]     = useState<string | null>(null);
  const { lang, t }                       = useLang();
  const { resolvedTheme, setTheme }       = useTheme();
  const [mounted, setMounted]             = useState(false);
  const [location]                        = useLocation();
  const ruHref = getAlternateLangHref(location, "ru");
  const enHref = getAlternateLangHref(location, "en");
  const isDark = !mounted || resolvedTheme === "dark";

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Detect active section via IntersectionObserver (homepage only)
  useEffect(() => {
    const isHome = window.location.pathname === "/";

    // For non-home pages, set active based on pathname
    if (!isHome) {
      const path = decodeURIComponent(window.location.pathname);
      if (path.startsWith("/faq") || path.startsWith("/en/faq"))  setActiveHref(lang === "en" ? "/en/faq" : "/faq");
      else if (path.includes("blog") || path.includes("блог")) setActiveHref(lang === "ru" ? "/блог" : "/blog");
      else setActiveHref(null);
      return;
    }

    const sectionIds = Object.values(SECTION_MAP);
    const hrefBySection: Record<string, string> = Object.fromEntries(
      Object.entries(SECTION_MAP).map(([href, id]) => [id, href])
    );

    const observers: IntersectionObserver[] = [];

    // Track which sections are currently intersecting
    const visible = new Map<string, number>();

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            visible.set(id, entry.intersectionRatio);
          } else {
            visible.delete(id);
          }
          // Pick the section with highest intersection ratio
          if (visible.size === 0) return;
          const best = [...visible.entries()].sort((a, b) => b[1] - a[1])[0][0];
          setActiveHref(hrefBySection[best] ?? null);
        },
        { threshold: [0.1, 0.3], rootMargin: "-64px 0px 0px 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [lang]);

  // Hash-section links must use the /en shell on shared pages so the landing
  // page loads in the correct language (/ defaults to Russian).
  const homePrefix = lang === "en" ? "/en" : "/";
  const navLinks = [
    { name: t.nav.services,   href: `${homePrefix}#services` },
    { name: t.nav.fleet,      href: `${homePrefix}#fleet` },
    { name: t.nav.advantages, href: `${homePrefix}#advantages` },
    { name: t.nav.reviews,    href: `${homePrefix}#reviews` },
    { name: t.nav.faq,        href: lang === "en" ? "/en/faq" : "/faq" },
    { name: lang === "ru" ? "Блог" : "Blog", href: lang === "ru" ? "/блог" : "/blog" },
    { name: t.nav.contacts,   href: `${homePrefix}#contact` },
  ];

  const socialLinks = [
    { icon: SiTelegram,  href: "https://t.me/+375447620649",              label: "Telegram",  bg: "#229ED9" },
    { icon: SiViber,     href: "viber://chat?number=%2B375447620649",             label: "Viber",     bg: "#7360F2" },
    { icon: SiWhatsapp,  href: "https://wa.me/375447620649",                      label: "WhatsApp",  bg: "#25D366" },
    { icon: Instagram,   href: "https://www.instagram.com/transfer_comfortline/",   label: "Instagram", bg: "linear-gradient(45deg,#f09433,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888)" },
    { icon: SiThreads,   href: "https://www.threads.com/@transferwarsaw_taxi",    label: "Threads",   bg: "#000000" },
    { icon: SiMessenger, href: "https://m.me/103816619260365",                    label: "Messenger", bg: "linear-gradient(45deg,#0084FF,#B34FFF)" },
  ];

  const SocialIcon = ({ icon: Icon, href, label, bg, size = 28 }: {
    icon: ElementType; href: string; label: string; bg: string; size?: number;
  }) => {
    const isMessenger = label === "Telegram" || label === "WhatsApp";
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        onClick={() => {
          if (isMessenger) {
            gtagEvent("contact", { event_category: "messenger", event_label: label });
          }
          trackEvent("contact_clicked", {
            channel: label.toLowerCase(),
            location: "navbar",
            page: analyticsPage(),
          });
        }}
        className="flex-shrink-0 rounded-full flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95 opacity-80 hover:opacity-100"
        style={{ width: size, height: size, background: bg }}
      >
        <Icon style={{ width: size * 0.5, height: size * 0.5 }} />
      </a>
    );
  };

  return (
    <>
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        isScrolled
          ? "bg-background/90 backdrop-blur-md border-border/60 py-3"
          : "bg-background/60 backdrop-blur-sm border-border/30 py-3"
      }`}
    >
      <div className="container mx-auto px-3 min-[400px]:px-4 lg:px-6">
          <div className="flex items-center justify-between h-14 min-[1700px]:h-9">

          {/* Logo */}
          <a href={lang === "en" ? "/en" : "/"} className="shrink-0 opacity-90 hover:opacity-100 transition-opacity">
            <Logo
              variant="full"
              scheme={isDark ? "dark" : "light"}
              height={34}
              className="hidden min-[1700px]:block overflow-visible"
            />

            <Logo
              variant="full"
              scheme={isDark ? "dark" : "light"}
              height={40}
              className="block min-[1700px]:hidden overflow-visible"
            />
          </a>

          {/* Desktop nav */}
            <div className="hidden min-[1700px]:flex items-center gap-3 min-[1850px]:gap-4">

            {/* Nav links — hover: pen oval · active: pen underline */}
              <div className="flex items-center gap-1 min-[1850px]:gap-2">
              {navLinks.map((link) => {
                const isActive  = activeHref  === link.href;
                const isHovered = hoveredHref === link.href && !isActive;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onMouseEnter={() => setHoveredHref(link.href)}
                    onMouseLeave={() => setHoveredHref(null)}
                    className={`relative text-[11px] tracking-[0.12em] uppercase font-medium transition-colors whitespace-nowrap px-2 py-1.5 ${
                      isActive ? "text-foreground" : "text-foreground/55 hover:text-foreground"
                    }`}
                  >
                    {/* Hover: hand-drawn encircling loop (heart-oval) */}
                    <AnimatePresence>
                      {isHovered && (
                        <motion.svg
                          key={`heart-loop-${link.href}`}
                          viewBox="0 0 200 66"
                          fill="none"
                          className="absolute pointer-events-none"
                          style={{ left: "-12px", top: "-10px", width: "calc(100% + 24px)", height: "calc(100% + 20px)" }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.1 }}
                        >
                          {/* Elegant two-lobe heart: soft dip at top, thin stroke, small tail at bottom */}
                          <motion.path
                            d="M100,63 C90,58 66,57 42,51 C16,44 0,32 4,19 C8,8 26,2 52,2 C76,2 94,16 100,28 C106,16 124,2 150,2 C176,2 194,8 196,19 C200,32 184,44 158,51 C134,57 110,58 100,63"
                            stroke="currentColor"
                            strokeWidth="1.0"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            exit={{ pathLength: 0 }}
                            transition={{ duration: 0.65, ease: [0.33, 1, 0.68, 1] }}
                          />
                        </motion.svg>
                      )}
                    </AnimatePresence>

                    {/* Active: hand-drawn wavy underline */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.svg
                          key={`underline-${link.href}`}
                          viewBox="0 0 100 7"
                          fill="none"
                          preserveAspectRatio="none"
                          className="absolute pointer-events-none"
                          style={{ left: "4px", bottom: "-1px", width: "calc(100% - 8px)", height: "7px" }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.12 }}
                        >
                          <motion.path
                            d="M1,3.5 C12,1.5 25,5.5 38,3 C51,0.5 64,5 77,3 C88,1.5 95,4 99,3.5"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            exit={{ pathLength: 0 }}
                            transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
                          />
                        </motion.svg>
                      )}
                    </AnimatePresence>

                    <span className="relative z-10">{link.name}</span>
                  </a>
                );
              })}
            </div>

            <div className="h-4 w-px bg-border/50" />

            {/* Social icons */}
            <div className="flex items-center gap-1.5">
              {socialLinks.map((s) => <SocialIcon key={s.label} {...s} size={26} />)}
            </div>

            <div className="h-4 w-px bg-border/50" />

            {/* Border queue live status */}
            <NavBorderQueueBadge variant="desktop" />

              <div className="h-4 w-px bg-border/50 hidden min-[1850px]:block" />

            {/* Phone — only visible at 2xl (1536px+) to keep RU/EN always in view */}
            <a
              href="tel:+375447620649"
              onClick={() => {
                gtagPhoneConversion();
                trackEvent("contact_clicked", {
                  channel: "phone",
                  location: "navbar",
                  page: analyticsPage(),
                });
              }}
              className="hidden min-[1850px]:flex items-center gap-1.5 text-[11px] tracking-[0.08em] uppercase font-medium text-foreground/60 hover:text-primary transition-colors whitespace-nowrap"
            >
              <Phone className="h-3 w-3 text-primary" />
              +375 (44) 762-06-49
            </a>

            <div className="h-4 w-px bg-border/50" />

            {/* Language toggle */}
            <div className="shrink-0 flex items-center gap-0.5 text-[11px] tracking-[0.12em] uppercase font-medium">
              <a
                href={ruHref}
                hrefLang="ru"
                className={`px-1.5 py-0.5 transition-colors ${lang === "ru" ? "text-foreground" : "text-foreground/40 hover:text-foreground/70"}`}
              >
                RU
              </a>
              <span className="text-border/60">/</span>
              <a
                href={enHref}
                hrefLang="en"
                className={`px-1.5 py-0.5 transition-colors ${lang === "en" ? "text-foreground" : "text-foreground/40 hover:text-foreground/70"}`}
              >
                EN
              </a>
            </div>

            {/* Theme toggle */}
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              aria-label="Toggle theme"
              className="relative w-[44px] h-[24px] rounded-full border border-border/60 bg-muted/50 flex items-center transition-colors hover:border-primary/40 shrink-0"
            >
              <motion.div
                className="absolute w-[18px] h-[18px] rounded-full bg-primary flex items-center justify-center shadow-sm"
                animate={{ x: isDark ? 3 : 23 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <AnimatePresence mode="wait">
                  {isDark ? (
                    <motion.div key="moon" initial={{ opacity: 0, rotate: -30 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 30 }} transition={{ duration: 0.15 }}>
                      <Moon className="h-2.5 w-2.5 text-primary-foreground" />
                    </motion.div>
                  ) : (
                    <motion.div key="sun" initial={{ opacity: 0, rotate: 30 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: -30 }} transition={{ duration: 0.15 }}>
                      <Sun className="h-2.5 w-2.5 text-primary-foreground" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </button>

          </div>

          {/* Mobile right side */}
            <div className="flex items-center min-[1700px]:hidden gap-1 min-[400px]:gap-2">
            {/* Language + theme always visible in mobile header */}
            <div className="flex items-center gap-1 min-[400px]:gap-2">
              <div className="flex items-center gap-0.5 text-[10px] min-[400px]:text-[11px] tracking-[0.1em] uppercase font-medium">
                <a href={ruHref} hrefLang="ru" className={`px-1 py-0.5 transition-colors ${lang === "ru" ? "text-foreground" : "text-foreground/40"}`}>RU</a>
                <span className="text-border/60">/</span>
                <a href={enHref} hrefLang="en" className={`px-1 py-0.5 transition-colors ${lang === "en" ? "text-foreground" : "text-foreground/40"}`}>EN</a>
              </div>
              <button
                onClick={() => setTheme(isDark ? "light" : "dark")}
                aria-label="Toggle theme"
                className="relative shrink-0 w-[36px] h-[20px] rounded-full border border-border/60 bg-muted/50 flex items-center transition-colors"
              >
                <motion.div
                  className="absolute w-[14px] h-[14px] rounded-full bg-primary flex items-center justify-center shadow-sm"
                  animate={{ x: isDark ? 3 : 19 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  {isDark ? <Moon className="h-2 w-2 text-primary-foreground" /> : <Sun className="h-2 w-2 text-primary-foreground" />}
                </motion.div>
              </button>
            </div>
            {/* Primary messengers in compact desktop header */}
            <div className="hidden min-[900px]:flex items-center gap-1.5">
              {socialLinks
                .filter((social) =>
                  ["Telegram", "Viber", "WhatsApp", "Instagram"].includes(social.label)
                )
                .map((social) => (
                  <SocialIcon
                    key={social.label}
                    {...social}
                    size={28}
                  />
                ))}
            </div>
            <NavBorderQueueBadge variant="mobile" />
            <a
              href="tel:+375447620649"
              onClick={() => {
                gtagPhoneConversion();
                trackEvent("contact_clicked", {
                  channel: "phone",
                  location: "navbar_mobile",
                  page: analyticsPage(),
                });
              }}
              className="flex items-center gap-2 text-[11px] tracking-[0.08em] uppercase font-medium text-foreground/70 shrink-0"
            >
              <Phone className="h-5 w-5 min-[400px]:h-6 min-[400px]:w-6 text-primary" />
              <span className="hidden sm:inline">+375 (44) 762-06-49</span>
            </a>
            <button
              aria-label={mobileMenuOpen ? "Закрыть меню" : "Открыть меню"}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1 min-[400px]:p-2 text-foreground/70 hover:text-foreground transition-colors shrink-0"
            >
              {mobileMenuOpen ? <X className="h-6 w-6 min-[400px]:h-7 min-[400px]:w-7" /> : <Menu className="h-6 w-6 min-[400px]:h-7 min-[400px]:w-7" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop — tap outside to close */}
            <motion.div
              key="mobile-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="min-[1700px]:hidden fixed inset-0 top-full z-[-1]"
              onClick={() => setMobileMenuOpen(false)}
            />
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="min-[1700px]:hidden absolute top-full left-0 right-0 bg-background/98 backdrop-blur-lg border-b border-border shadow-lg"
          >
            <div className="container mx-auto px-6 py-6 flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-[11px] tracking-[0.18em] uppercase font-medium py-3 border-b border-border/30 last:border-0 transition-colors ${
                    activeHref === link.href ? "text-foreground" : "text-foreground/60 hover:text-foreground"
                  }`}
                >
                  {link.name}
                </a>
              ))}

              <div className="pt-5 flex items-center">
                <div className="flex items-center gap-2">
                  {socialLinks.map((s) => <SocialIcon key={s.label} {...s} size={34} />)}
                </div>
              </div>
            </div>
          </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>

    {/* Floating social sidebar — mobile only */}
    <div className="lg:hidden fixed right-0 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2 pr-2">
      {socialLinks.map((s) => <SocialIcon key={s.label} {...s} size={36} />)}
    </div>
    </>
  );
}
