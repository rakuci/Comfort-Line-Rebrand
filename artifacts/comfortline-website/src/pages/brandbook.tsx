import { useEffect, useState } from "react";
import { Seo } from "@/seo/Seo";
import { motion } from "framer-motion";
import { Download, Copy, Check, Printer, Palette, RotateCcw, Type } from "lucide-react";
import { Logo, LogoMark } from "@/components/brand/Logo";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  BRAND_SCHEMES,
  DEFAULT_SCHEME_ID,
  applyBrandScheme,
  loadStoredScheme,
  saveScheme,
} from "@/lib/brand-schemes";
import {
  FONT_THEMES,
  DEFAULT_FONT_ID,
  applyFontTheme,
  loadStoredFont,
  saveFont,
} from "@/lib/font-themes";
import {
  LOGO_PALETTES,
  DEFAULT_LOGO_PALETTE_ID,
  applyLogoPalette,
  loadStoredLogoPalette,
  saveLogoPalette,
} from "@/lib/logo-palettes";
import { useLang } from "@/context/language-context";

const palette = [
  { name: "Charcoal Core", hex: "#0E0D13", role: "Deepest background", light: true },
  { name: "Background", hex: "#131218", role: "Main dark surface", light: true },
  { name: "Surface", hex: "#1C1B24", role: "Cards & panels", light: true },
  { name: "Gold Primary", hex: "#B59C73", role: "Brand accent", light: false },
  { name: "Gold Light", hex: "#CDB896", role: "Hover / highlight", light: false },
  { name: "Gold Dark", hex: "#8A7555", role: "Pressed / deep", light: true },
  { name: "Warm White", hex: "#F5F0E8", role: "Text on dark", light: false },
  { name: "Muted", hex: "#8A8378", role: "Secondary text", light: false },
  { name: "Light BG", hex: "#F8F7F5", role: "Light mode base", light: false },
];

const typeWeights = [
  { weight: 200, label: "ExtraLight", sample: "COMFORT" },
  { weight: 300, label: "Light", sample: "Premium transfer across Europe" },
  { weight: 400, label: "Regular", sample: "Premium transfer across Europe" },
  { weight: 500, label: "Medium", sample: "Premium transfer across Europe" },
  { weight: 600, label: "SemiBold", sample: "Premium transfer across Europe" },
  { weight: 700, label: "Bold", sample: "Premium transfer across Europe" },
  { weight: 800, label: "ExtraBold", sample: "Premium transfer across Europe" },
  { weight: 900, label: "Black", sample: "LINE" },
];

const MARK_PATH_EXPORT =
  "M 60 9 C 59 10 59 17 55 14 A 27 27 0 1 0 55 56 " +
  "C 59 53 59 59 60 61 C 59 60 51 44 47 47 A 15 15 0 1 1 47 23 " +
  "C 51 26 59 10 60 9 Z";

const svgMark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 70" fill="none">
  <defs>
    <linearGradient id="g" x1="62" y1="7" x2="10" y2="63" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#EDD9A8"/>
      <stop offset="22%" stop-color="#D4B07A"/>
      <stop offset="58%" stop-color="#B59C73"/>
      <stop offset="100%" stop-color="#8A7555"/>
    </linearGradient>
  </defs>
  <path d="${MARK_PATH_EXPORT}" fill="url(#g)"/>
</svg>`;

const svgLogoFull = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 70" fill="none">
  <defs>
    <linearGradient id="g" x1="62" y1="7" x2="10" y2="63" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#EDD9A8"/>
      <stop offset="22%" stop-color="#D4B07A"/>
      <stop offset="58%" stop-color="#B59C73"/>
      <stop offset="100%" stop-color="#8A7555"/>
    </linearGradient>
  </defs>
  <path d="${MARK_PATH_EXPORT}" fill="url(#g)"/>
  <text x="84" y="29" font-family="Montserrat,sans-serif" font-weight="200" font-size="13" fill="#F5F0E8" letter-spacing="5">COMFORT</text>
  <text x="84" y="55" font-family="Montserrat,sans-serif" font-weight="900" font-size="17" fill="#B59C73" letter-spacing="1.5">LINE</text>
</svg>`;

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-colors"
    >
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      {copied ? "Copied!" : label}
    </button>
  );
}

function DownloadSvg({ content, filename }: { content: string; filename: string }) {
  const download = () => {
    const blob = new Blob([content], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <button
      onClick={download}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-muted border border-border text-foreground/70 hover:text-foreground hover:bg-muted/80 transition-colors"
    >
      <Download className="h-3 w-3" />
      SVG
    </button>
  );
}

function DownloadPng({
  content,
  filename,
  scale = 4,
}: {
  content: string;
  filename: string;
  scale?: number;
}) {
  const [busy, setBusy] = useState(false);

  const download = () => {
    setBusy(true);
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "image/svg+xml");
    const svgEl = doc.documentElement as unknown as SVGSVGElement;
    const vb = svgEl.getAttribute("viewBox")?.split(/[\s,]+/).map(Number) ?? [0, 0, 250, 70];
    const w = vb[2] * scale;
    const h = vb[3] * scale;

    const blob = new Blob([content], { type: "image/svg+xml" });
    const url  = URL.createObjectURL(blob);
    const img  = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width  = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      const a = document.createElement("a");
      a.href     = canvas.toDataURL("image/png");
      a.download = filename;
      a.click();
      setBusy(false);
    };
    img.onerror = () => { URL.revokeObjectURL(url); setBusy(false); };
    img.src = url;
  };

  return (
    <button
      onClick={download}
      disabled={busy}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-colors disabled:opacity-50"
    >
      <Download className="h-3 w-3" />
      {busy ? "…" : "PNG"}
    </button>
  );
}

const sectionVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function SchemePicker() {
  const { lang } = useLang();
  const [activeId, setActiveId] = useState<string>(DEFAULT_SCHEME_ID);

  useEffect(() => {
    setActiveId(loadStoredScheme());
  }, []);

  const select = (id: string) => {
    applyBrandScheme(id);
    saveScheme(id);
    setActiveId(id);
  };

  const reset = () => select(DEFAULT_SCHEME_ID);

  return (
    <motion.section
      variants={sectionVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      data-no-print="true"
    >
      <SectionHeader index="00" title={lang === "ru" ? "Цветовая схема" : "Color Scheme"} />
      <p className="text-muted-foreground text-sm mt-2 mb-8 max-w-2xl">
        {lang === "ru"
          ? "Семь акцентных схем. Задают цвет кнопок, ссылок и всех акцентов сайта (а также логотипа, если ниже выбран «Фирменный градиент»). Выбор сохраняется в браузере."
          : "Seven accent schemes. Drive the buttons, links and every accent across the site (and the logo when «Brand Gradient» is selected below). Saved in this browser."}
      </p>

      {/* Live logo preview — confirms how the chosen scheme paints the brand mark */}
      <div className="rounded-2xl border border-border bg-[#0E0D13] p-10 mb-6 flex items-center justify-center">
        <Logo variant="full" scheme="dark" height={48} showTagline />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {BRAND_SCHEMES.map((s) => {
          const isActive = s.id === activeId;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => select(s.id)}
              aria-pressed={isActive}
              className={`group text-left rounded-2xl border-2 p-4 transition-all bg-card hover:border-primary/60 ${
                isActive ? "border-primary shadow-lg shadow-primary/10" : "border-border"
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-full ring-2 ring-border shrink-0"
                  style={{ background: s.swatch }}
                />
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-foreground truncate">
                    {lang === "ru" ? s.nameRu : s.name}
                  </p>
                  <code className="text-[10px] text-muted-foreground font-mono">{s.swatch}</code>
                </div>
                {isActive && (
                  <Check className="h-4 w-4 text-primary ml-auto shrink-0" />
                )}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {lang === "ru" ? s.descriptionRu : s.description}
              </p>
            </button>
          );
        })}

        {/* Reset card */}
        <button
          type="button"
          onClick={reset}
          className="group rounded-2xl border-2 border-dashed border-border p-4 transition-all hover:border-primary/60 bg-card flex flex-col items-center justify-center text-center min-h-[140px]"
        >
          <RotateCcw className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors mb-2" />
          <p className="text-sm font-semibold text-foreground">
            {lang === "ru" ? "Сбросить" : "Reset"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {lang === "ru" ? "Фирменное золото" : "Signature Gold"}
          </p>
        </button>
      </div>

      <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
        <Palette className="h-3.5 w-3.5" />
        <span>
          {lang === "ru"
            ? "Изменения применяются к кнопкам, ссылкам, акцентам по всему сайту."
            : "Changes apply to buttons, links and accents site-wide."}
        </span>
      </div>
    </motion.section>
  );
}

function LogoColorPicker() {
  const { lang } = useLang();
  const [activeId, setActiveId] = useState<string>(DEFAULT_LOGO_PALETTE_ID);

  useEffect(() => {
    setActiveId(loadStoredLogoPalette());
  }, []);

  const select = (id: string) => {
    applyLogoPalette(id);
    saveLogoPalette(id);
    setActiveId(id);
  };

  const reset = () => select(DEFAULT_LOGO_PALETTE_ID);

  return (
    <motion.section
      variants={sectionVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      data-no-print="true"
    >
      <SectionHeader index="00a" title={lang === "ru" ? "Цвет логотипа" : "Logo Colour"} />
      <p className="text-muted-foreground text-sm mt-2 mb-8 max-w-2xl">
        {lang === "ru"
          ? "Шесть вариантов окраски логотипа: фирменный градиент, четыре сплошных цвета и анимированная радуга. Применяется ко всем логотипам сайта — в шапке, подвале и брендбуке. Выбор сохраняется в браузере."
          : "Six logo colour options: the brand gradient, four solid colours and an animated rainbow. Applied to every logo across the site — header, footer and brandbook. Saved in this browser."}
      </p>

      {/* Live preview — confirms how the chosen palette paints the brand mark */}
      <div className="rounded-2xl border border-border bg-[#0E0D13] p-10 mb-6 flex items-center justify-center">
        <Logo variant="full" scheme="dark" height={48} showTagline />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3">
        {LOGO_PALETTES.map((p) => {
          const isActive = p.id === activeId;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => select(p.id)}
              aria-pressed={isActive}
              className={`group text-left rounded-2xl border-2 p-4 transition-all bg-card hover:border-primary/60 ${
                isActive ? "border-primary shadow-lg shadow-primary/10" : "border-border"
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-full ring-2 ring-border shrink-0"
                  style={{ background: p.swatch }}
                />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm text-foreground truncate">
                    {lang === "ru" ? p.nameRu : p.name}
                  </p>
                  <code className="text-[10px] text-muted-foreground font-mono">
                    {p.kind === "solid" ? p.color : p.kind}
                  </code>
                </div>
                {isActive && <Check className="h-4 w-4 text-primary shrink-0" />}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {lang === "ru" ? p.descriptionRu : p.description}
              </p>
            </button>
          );
        })}

        {/* Reset card */}
        <button
          type="button"
          onClick={reset}
          className="group rounded-2xl border-2 border-dashed border-border p-4 transition-all hover:border-primary/60 bg-card flex flex-col items-center justify-center text-center min-h-[140px]"
        >
          <RotateCcw className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors mb-2" />
          <p className="text-sm font-semibold text-foreground">
            {lang === "ru" ? "Сбросить" : "Reset"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {lang === "ru" ? "Фирменный градиент" : "Brand Gradient"}
          </p>
        </button>
      </div>

      <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
        <Palette className="h-3.5 w-3.5" />
        <span>
          {lang === "ru"
            ? "Применяется ко всем логотипам — в шапке, подвале и на странице брендбука."
            : "Applied to every logo — header, footer and the brandbook page."}
        </span>
      </div>
    </motion.section>
  );
}

function FloatingPrintButton() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrolled = window.scrollY + window.innerHeight;
      const total = doc.scrollHeight;
      // Hide when within 240px of page bottom (footer area)
      setHidden(total - scrolled < 240);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <button
      data-no-print="true"
      onClick={() => window.print()}
      aria-label="Save as PDF"
      title="Save as PDF"
      className={`fixed bottom-6 left-6 z-50 h-12 w-12 flex items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all duration-300 ${
        hidden ? "opacity-0 pointer-events-none translate-y-4" : "opacity-100"
      }`}
    >
      <Printer className="h-5 w-5" />
    </button>
  );
}

function FontPicker() {
  const { lang } = useLang();
  const [activeId, setActiveId] = useState<string>(DEFAULT_FONT_ID);

  useEffect(() => {
    setActiveId(loadStoredFont());
  }, []);

  const select = (id: string) => {
    applyFontTheme(id);
    saveFont(id);
    setActiveId(id);
  };

  const reset = () => select(DEFAULT_FONT_ID);

  return (
    <motion.section
      variants={sectionVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      data-no-print="true"
    >
      <SectionHeader index="00b" title={lang === "ru" ? "Шрифт сайта" : "Site Typography"} />
      <p className="text-muted-foreground text-sm mt-2 mb-8 max-w-2xl">
        {lang === "ru"
          ? "Семь актуальных шрифтовых пар 2026. Применяется ко всему сайту — заголовкам и тексту. Выбор сохраняется в браузере."
          : "Seven trending 2026 typefaces. Applied site-wide to headings and body. Saved in this browser."}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {FONT_THEMES.map((f) => {
          const isActive = f.id === activeId;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => select(f.id)}
              aria-pressed={isActive}
              className={`group text-left rounded-2xl border-2 p-5 transition-all bg-card hover:border-primary/60 ${
                isActive ? "border-primary shadow-lg shadow-primary/10" : "border-border"
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="min-w-0">
                  <p
                    className="font-semibold text-base text-foreground truncate"
                    style={{ fontFamily: f.heading }}
                  >
                    {f.name}
                  </p>
                  <p
                    className="text-xs text-muted-foreground mt-0.5"
                    style={{ fontFamily: f.body }}
                  >
                    {lang === "ru" ? f.descriptionRu : f.description}
                  </p>
                </div>
                {isActive && <Check className="h-4 w-4 text-primary shrink-0 mt-1" />}
              </div>
              <div className="border-t border-border/60 pt-3 space-y-1">
                <p
                  className="text-xl text-foreground leading-tight"
                  style={{ fontFamily: f.heading, fontWeight: 700 }}
                >
                  ComfortLine
                </p>
                <p
                  className="text-xs text-muted-foreground"
                  style={{ fontFamily: f.body }}
                >
                  {lang === "ru"
                    ? "Премиальные трансферы по Европе"
                    : "Premium transfers across Europe"}
                </p>
              </div>
            </button>
          );
        })}

        {/* Reset card */}
        <button
          type="button"
          onClick={reset}
          className="group rounded-2xl border-2 border-dashed border-border p-5 transition-all hover:border-primary/60 bg-card flex flex-col items-center justify-center text-center min-h-[140px]"
        >
          <Type className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors mb-2" />
          <p className="text-sm font-semibold text-foreground">
            {lang === "ru" ? "Сбросить" : "Reset"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Montserrat</p>
        </button>
      </div>
    </motion.section>
  );
}

export default function BrandbookPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Seo
        titleRu="Брендбук ComfortLine"
        titleEn="ComfortLine Brandbook"
        descRu="Внутренний брендбук ComfortLine — для команды и партнёров."
        descEn="Internal ComfortLine brandbook — for the team and partners."
        pathRu="/brandbook"
        pathEn="/brandbook"
        noindex
      />
      <Navbar />

      <FloatingPrintButton />

      <div className="pt-24 pb-32">

        {/* ── Hero ── */}
        <div className="bg-[#0E0D13] py-24">
          <div className="container mx-auto px-6 max-w-5xl flex flex-col items-center text-center">
            <Logo variant="stacked" scheme="dark" height={100} showTagline />
            <p className="mt-10 text-muted-foreground text-sm tracking-[0.2em] uppercase">Brand Identity System · 2026</p>
            <div className="mt-8 w-24 h-px bg-primary/40 mx-auto" />
          </div>
        </div>

        <div className="container mx-auto px-6 max-w-5xl space-y-28 mt-24">

          {/* ── Color Scheme Picker (drives accent + logo gradient) ── */}
          <SchemePicker />

          {/* ── Logo Color Picker (overrides logo gradient site-wide) ── */}
          <LogoColorPicker />

          {/* ── Font Picker ── */}
          <FontPicker />

          {/* ── Primary Logo ── */}
          <motion.section variants={sectionVariant} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <SectionHeader index="01" title="Primary Logo" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              {/* Dark version */}
              <div className="rounded-2xl border border-border bg-[#0E0D13] p-10 flex flex-col items-center gap-8">
                <Logo variant="full" scheme="dark" height={40} />
                <div className="flex gap-2">
                  <CopyButton text={svgLogoFull} label="Copy SVG" />
                  <DownloadSvg content={svgLogoFull} filename="comfortline-logo-dark.svg" />
                  <DownloadPng content={svgLogoFull} filename="comfortline-logo-dark.png" />
                </div>
                <p className="text-xs text-muted-foreground tracking-wider uppercase">On Dark</p>
              </div>
              {/* Light version */}
              <div className="rounded-2xl border border-border bg-[#F8F7F5] p-10 flex flex-col items-center gap-8">
                <Logo variant="full" scheme="light" height={40} />
                <div className="flex gap-2">
                  <CopyButton text={svgLogoFull.replace(/#F5F0E8/g, "#131218")} label="Copy SVG" />
                  <DownloadSvg
                    content={svgLogoFull.replace(/#F5F0E8/g, "#131218")}
                    filename="comfortline-logo-light.svg"
                  />
                  <DownloadPng
                    content={svgLogoFull.replace(/#F5F0E8/g, "#131218")}
                    filename="comfortline-logo-light.png"
                  />
                </div>
                <p className="text-xs text-[#8A8378] tracking-wider uppercase">On Light</p>
              </div>
              {/* With tagline */}
              <div className="rounded-2xl border border-border bg-[#131218] p-10 flex flex-col items-center gap-8">
                <Logo variant="full" scheme="dark" height={40} showTagline />
                <p className="text-xs text-muted-foreground tracking-wider uppercase">With Tagline</p>
              </div>
              {/* Stacked */}
              <div className="rounded-2xl border border-border bg-[#1C1B24] p-10 flex flex-col items-center gap-8">
                <Logo variant="stacked" scheme="dark" height={70} />
                <p className="text-xs text-muted-foreground tracking-wider uppercase">Stacked Variant</p>
              </div>
            </div>
          </motion.section>

          {/* ── Symbol Mark ── */}
          <motion.section variants={sectionVariant} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <SectionHeader index="02" title="Symbol Mark" />
            <p className="text-muted-foreground text-sm mt-2 mb-8 max-w-xl">
              A ribbon crescent with Sharps-style blade tips — the C arc tapers into two pointed tails
              that suggest motion and forward momentum. Gradient shine runs from bright gold at the tips
              to deep burnished gold at the body. Based on LogoLounge 2025 Crossovers + Sharps trends.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { bg: "#0E0D13", fill: undefined,    textColor: "#F5F0E8", label: "Primary",     gid: "bm-pri" },
                { bg: "var(--logo-grad-3, #B59C73)", fill: "#0E0D13", textColor: "#0E0D13", label: "Accent BG", gid: "bm-gld" },
                { bg: "#F8F7F5", fill: undefined,    textColor: "#131218", label: "On Light",    gid: "bm-lgt" },
                { bg: "#131218", fill: "#F5F0E8",    textColor: "#F5F0E8", label: "Monochrome",  gid: "bm-mno" },
              ].map((v) => (
                <div
                  key={v.label}
                  className="rounded-2xl border border-border p-8 flex flex-col items-center gap-4"
                  style={{ background: v.bg }}
                >
                  <LogoMark fillColor={v.fill} size={64} gradientId={v.gid} />
                  <p className="text-xs tracking-wider uppercase" style={{ color: v.textColor, opacity: 0.6 }}>
                    {v.label}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <CopyButton text={svgMark} label="Copy mark SVG" />
              <DownloadSvg content={svgMark} filename="comfortline-mark.svg" />
              <DownloadPng content={svgMark} filename="comfortline-mark.png" scale={8} />
            </div>
          </motion.section>

          {/* ── Favicon & App Icon ── */}
          <motion.section variants={sectionVariant} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <SectionHeader index="03" title="Favicon & App Icon" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              {[64, 48, 32, 16].map((sz) => (
                <div key={sz} className="rounded-2xl border border-border bg-card p-6 flex flex-col items-center gap-4">
                  <div className="rounded-[22%] overflow-hidden flex items-center justify-center" style={{ width: sz * 1.25, height: sz * 1.25, background: "#0E0D13" }}>
                    <svg width={sz} height={sz} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <linearGradient id={`fg-${sz}`} x1="20" y1="5" x2="3" y2="27" gradientUnits="userSpaceOnUse">
                          <stop offset="0%"   stopColor="var(--logo-grad-1, #EDD9A8)"/>
                          <stop offset="30%"  stopColor="var(--logo-grad-2, #D4B07A)"/>
                          <stop offset="70%"  stopColor="var(--logo-grad-3, #B59C73)"/>
                          <stop offset="100%" stopColor="var(--logo-grad-4, #8A7555)"/>
                        </linearGradient>
                      </defs>
                      <rect width="32" height="32" rx="7" fill="#0E0D13"/>
                      <path
                        d="M 20 5 L 18 7 A 9 9 0 1 0 18 21 L 20 23 L 15 18 A 5 5 0 1 1 15 10 Z"
                        fill={`url(#fg-${sz})`}
                      />
                    </svg>
                  </div>
                  <p className="text-xs text-muted-foreground">{sz}×{sz}</p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* ── Social Media Profiles ── */}
          <motion.section variants={sectionVariant} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <SectionHeader index="04" title="Social Profile Avatars" />
            <p className="text-muted-foreground text-sm mt-2 mb-8 max-w-xl">
              Instagram, Threads, Telegram, WhatsApp. The square variant is used; platforms crop to a circle automatically.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {/* Gold on Dark – primary */}
              <div className="rounded-2xl border border-border bg-card p-8 flex flex-col items-center gap-5">
                <div
                  className="rounded-full flex items-center justify-center"
                  style={{ width: 120, height: 120, background: "#0E0D13" }}
                >
                  <LogoMark size={72} gradientId="av-dark" />
                </div>
                <p className="text-xs text-muted-foreground">Primary dark</p>
              </div>
              {/* Gold on Light */}
              <div className="rounded-2xl border border-border bg-card p-8 flex flex-col items-center gap-5">
                <div
                  className="rounded-full flex items-center justify-center"
                  style={{ width: 120, height: 120, background: "#F8F7F5" }}
                >
                  <LogoMark size={72} gradientId="av-light" />
                </div>
                <p className="text-xs text-muted-foreground">On light</p>
              </div>
              {/* Gold BG */}
              <div className="rounded-2xl border border-border bg-card p-8 flex flex-col items-center gap-5">
                <div
                  className="rounded-full flex items-center justify-center"
                  style={{ width: 120, height: 120, background: "var(--logo-grad-3, #B59C73)" }}
                >
                  <LogoMark fillColor="#0E0D13" size={72} gradientId="av-gold" />
                </div>
                <p className="text-xs text-muted-foreground">Accent background</p>
              </div>
            </div>
          </motion.section>

          {/* ── Colour Palette ── */}
          <motion.section variants={sectionVariant} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <SectionHeader index="05" title="Colour System" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-8">
              {palette.map((c) => (
                <div key={c.hex} className="rounded-2xl border border-border overflow-hidden">
                  <div className="h-20" style={{ background: c.hex }} />
                  <div className="p-4 bg-card">
                    <p className="font-semibold text-sm text-foreground">{c.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{c.role}</p>
                    <div className="flex items-center justify-between mt-2">
                      <code className="text-xs text-primary font-mono">{c.hex}</code>
                      <CopyButton text={c.hex} label="Copy" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* ── Typography ── */}
          <motion.section variants={sectionVariant} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <SectionHeader index="06" title="Typography" />
            <div className="mt-6 rounded-2xl border border-border bg-card p-8">
              <div className="flex items-baseline gap-3 mb-8">
                <span className="text-6xl font-bold text-primary" style={{ fontFamily: "Montserrat, sans-serif" }}>Aa</span>
                <div>
                  <p className="text-xl font-bold text-foreground">Montserrat</p>
                  <p className="text-sm text-muted-foreground">Primary typeface — all weights</p>
                </div>
              </div>
              <div className="space-y-3">
                {typeWeights.map((t) => (
                  <div key={t.weight} className="flex items-baseline gap-4 py-3 border-b border-border/50 last:border-0">
                    <span className="w-24 text-xs text-muted-foreground shrink-0">{t.weight} · {t.label}</span>
                    <span
                      className="text-foreground text-base truncate"
                      style={{ fontFamily: "Montserrat, sans-serif", fontWeight: t.weight }}
                    >
                      {t.sample}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Type scale */}
            <div className="mt-4 rounded-2xl border border-border bg-card p-8 space-y-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-6">Type Scale</p>
              {[
                { label: "Display", size: "text-5xl font-extrabold", sample: "ComfortLine" },
                { label: "H1", size: "text-3xl font-bold", sample: "Индивидуальный трансфер" },
                { label: "H2", size: "text-xl font-semibold", sample: "Автопарк и маршруты" },
                { label: "Body", size: "text-base font-normal", sample: "Комфортный трансфер из Минска в аэропорты Европы с опытными водителями." },
                { label: "Caption", size: "text-sm font-light text-muted-foreground", sample: "Работаем с 2015 года · 24/7" },
              ].map((t) => (
                <div key={t.label} className="flex items-start gap-4 py-3 border-b border-border/30 last:border-0">
                  <span className="w-16 text-xs text-muted-foreground shrink-0 pt-1">{t.label}</span>
                  <p className={`${t.size} leading-tight`}>{t.sample}</p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* ── Clearspace & Size ── */}
          <motion.section variants={sectionVariant} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <SectionHeader index="07" title="Clear Space & Minimum Size" />
            <div className="grid md:grid-cols-2 gap-4 mt-8">
              <div className="rounded-2xl border border-dashed border-primary/30 bg-card p-10 flex flex-col items-center gap-6">
                <div className="border-2 border-dashed border-primary/30 p-8">
                  <Logo variant="full" scheme="dark" height={32} />
                </div>
                <p className="text-xs text-muted-foreground text-center max-w-xs">
                  Minimum clear space equals the height of the letter "C" in the wordmark on all four sides.
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-10 flex flex-col gap-6">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Minimum sizes</p>
                <div className="flex items-end gap-8">
                  <div className="flex flex-col items-center gap-3">
                    <Logo variant="full" scheme="dark" height={28} />
                    <p className="text-xs text-muted-foreground">28px · digital min</p>
                  </div>
                </div>
                <div className="flex items-end gap-8">
                  <div className="flex flex-col items-center gap-3">
                    <Logo variant="mark" scheme="dark" height={20} />
                    <p className="text-xs text-muted-foreground">20px · mark min</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* ── Don'ts ── */}
          <motion.section variants={sectionVariant} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <SectionHeader index="08" title="Usage Rules" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
              {[
                {
                  label: "Don't rotate",
                  el: (
                    <div style={{ transform: "rotate(25deg)" }}>
                      <Logo variant="full" scheme="dark" height={28} />
                    </div>
                  ),
                },
                {
                  label: "Don't stretch",
                  el: (
                    <div style={{ transform: "scaleX(1.5)" }}>
                      <Logo variant="full" scheme="dark" height={28} />
                    </div>
                  ),
                },
                {
                  label: "Don't recolour gold",
                  el: (
                    <svg width={160} height={28} viewBox="0 0 210 60" fill="none">
                      <path d="M 39 15 A 20 20 0 1 0 39 45" stroke="#FF4444" strokeWidth="4.5" strokeLinecap="round"/>
                      <line x1="42" y1="22" x2="57" y2="22" stroke="#F5F0E8" strokeWidth="3" strokeLinecap="round"/>
                      <line x1="42" y1="38" x2="51" y2="38" stroke="#F5F0E8" strokeWidth="3" strokeLinecap="round"/>
                      <text x="70" y="27" fontFamily="Montserrat,sans-serif" fontWeight="500" fontSize="13" fill="#F5F0E8" letterSpacing="3.5">COMFORT</text>
                      <text x="70" y="44" fontFamily="Montserrat,sans-serif" fontWeight="800" fontSize="13" fill="#FF4444" letterSpacing="5.5">LINE</text>
                    </svg>
                  ),
                },
                {
                  label: "Don't add effects",
                  el: (
                    <div style={{ filter: "blur(2px) brightness(1.5)" }}>
                      <Logo variant="full" scheme="dark" height={28} />
                    </div>
                  ),
                },
                {
                  label: "Don't use on busy BG",
                  el: (
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded">
                      <Logo variant="full" scheme="dark" height={24} />
                    </div>
                  ),
                },
                {
                  label: "Don't use old logo",
                  el: (
                    <div className="opacity-40 flex flex-col items-center">
                      <div className="text-base font-bold text-foreground/50">Comfort<span className="text-primary/50">Line</span></div>
                      <div className="text-xs text-foreground/30 tracking-widest mt-0.5">TEXT ONLY</div>
                    </div>
                  ),
                },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border-2 border-red-500/30 bg-red-500/5 p-6 flex flex-col items-center gap-4">
                  <div className="flex items-center justify-center h-16">{item.el}</div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-red-500 text-lg">✕</span>
                    <p className="text-xs text-foreground/60">{item.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

        </div>
      </div>

      <Footer />
    </div>
  );
}

function SectionHeader({ index, title }: { index: string; title: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-xs font-mono text-primary opacity-60">{index}</span>
      <h2 className="text-2xl font-bold text-foreground">{title}</h2>
      <div className="flex-1 h-px bg-border/60" />
    </div>
  );
}
