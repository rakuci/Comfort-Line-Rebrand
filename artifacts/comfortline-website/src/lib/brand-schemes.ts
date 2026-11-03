export type BrandScheme = {
  id: string;
  name: string;
  nameRu: string;
  description: string;
  descriptionRu: string;
  swatch: string;
  primary: string;
  primaryForeground: string;
  ring: string;
};

export const BRAND_SCHEMES: BrandScheme[] = [
  {
    id: "signature-gold",
    name: "Signature Gold",
    nameRu: "Фирменное золото",
    description: "The original ComfortLine — burnished gold on charcoal.",
    descriptionRu: "Оригинал ComfortLine — патинированное золото на угольном.",
    swatch: "#B59C73",
    primary: "37 32% 58%",
    primaryForeground: "248 14% 8%",
    ring: "37 32% 58%",
  },
  {
    id: "champagne",
    name: "Champagne",
    nameRu: "Шампань",
    description: "Lighter, softer luxury with a champagne finish.",
    descriptionRu: "Светлее и мягче — финиш шампанского.",
    swatch: "#D9C49A",
    primary: "40 45% 72%",
    primaryForeground: "248 14% 8%",
    ring: "40 45% 72%",
  },
  {
    id: "royal-bronze",
    name: "Royal Bronze",
    nameRu: "Королевская бронза",
    description: "Warm bronze — deeper, more grounded than gold.",
    descriptionRu: "Тёплая бронза — глубже и солиднее золота.",
    swatch: "#A37247",
    primary: "25 42% 46%",
    primaryForeground: "39 30% 96%",
    ring: "25 42% 46%",
  },
  {
    id: "platinum-silver",
    name: "Platinum Silver",
    nameRu: "Платиновое серебро",
    description: "Cool, modern, neutral. Reads as tech-luxury.",
    descriptionRu: "Холодное, современное, нейтральное. Технолюкс.",
    swatch: "#B8BCC2",
    primary: "215 8% 72%",
    primaryForeground: "248 14% 8%",
    ring: "215 8% 72%",
  },
  {
    id: "emerald-lounge",
    name: "Emerald Lounge",
    nameRu: "Изумрудный лаундж",
    description: "Refined emerald — like a private members' club.",
    descriptionRu: "Изумруд клубного зала — сдержанный, статусный.",
    swatch: "#3F8F6E",
    primary: "157 38% 41%",
    primaryForeground: "39 30% 96%",
    ring: "157 38% 41%",
  },
  {
    id: "sapphire-night",
    name: "Sapphire Night",
    nameRu: "Сапфировая ночь",
    description: "Deep cobalt — corporate authority, trustworthy.",
    descriptionRu: "Глубокий кобальт — доверие и солидность.",
    swatch: "#4A6FAE",
    primary: "217 39% 49%",
    primaryForeground: "39 30% 96%",
    ring: "217 39% 49%",
  },
  {
    id: "ruby-crimson",
    name: "Ruby Crimson",
    nameRu: "Рубиновый кримсон",
    description: "Bold ruby — passion, urgency, premium hospitality.",
    descriptionRu: "Смелый рубин — страсть, премиум-гостеприимство.",
    swatch: "#B5354B",
    primary: "352 56% 46%",
    primaryForeground: "39 30% 96%",
    ring: "352 56% 46%",
  },
];

export const DEFAULT_SCHEME_ID = "signature-gold";
const STORAGE_KEY = "comfortline-scheme";
const LOGO_STORAGE_KEY = "comfortline-logo-scheme";

const STYLE_ID = "brand-scheme-override";
const LOGO_STYLE_ID = "brand-logo-override";

function parseHsl(triple: string): { h: number; s: number; l: number } {
  const m = triple.trim().match(/^([\d.]+)\s+([\d.]+)%\s+([\d.]+)%$/);
  if (!m) return { h: 0, s: 0, l: 50 };
  return { h: parseFloat(m[1]), s: parseFloat(m[2]), l: parseFloat(m[3]) };
}

function hsl(h: number, s: number, l: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(100, v));
  return `hsl(${h.toFixed(1)}, ${clamp(s).toFixed(1)}%, ${clamp(l).toFixed(1)}%)`;
}

/** Derive 4 gradient stops from a primary HSL (highlight → deep). */
function deriveGradientStops(primary: string): [string, string, string, string] {
  const { h, s, l } = parseHsl(primary);
  return [
    hsl(h, Math.max(s - 10, 15), l + 22), // bright highlight
    hsl(h, s, l + 10),
    hsl(h, s, l),
    hsl(h, Math.min(s + 5, 95), l - 18),  // deep shade
  ];
}

export function applyBrandScheme(schemeId: string): void {
  if (typeof document === "undefined") return;
  const scheme = BRAND_SCHEMES.find((s) => s.id === schemeId);
  if (!scheme) return;
  const [g1, g2, g3, g4] = deriveGradientStops(scheme.primary);
  // Keep the original accent for fills and decoration; use a darker shade
  // for small text on fixed light surfaces (including the booking widget).
  const { h, s, l } = parseHsl(scheme.primary);
  const primaryOnLight = `${h} ${s}% ${Math.min(l, 32)}%`;
  const css = `:root, .dark, .light {
    --primary: ${scheme.primary} !important;
    --primary-on-light: ${primaryOnLight} !important;
    --primary-foreground: ${scheme.primaryForeground} !important;
    --ring: ${scheme.ring} !important;
    --sidebar-primary: ${scheme.primary} !important;
    --sidebar-primary-foreground: ${scheme.primaryForeground} !important;
    --sidebar-ring: ${scheme.ring} !important;
    --logo-grad-1: ${g1};
    --logo-grad-2: ${g2};
    --logo-grad-3: ${g3};
    --logo-grad-4: ${g4};
  }`;
  let style = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
  if (!style) {
    style = document.createElement("style");
    style.id = STYLE_ID;
    document.head.appendChild(style);
  }
  style.textContent = css;
  document.documentElement.dataset.brandScheme = scheme.id;
}

export function loadStoredScheme(): string {
  if (typeof window === "undefined") return DEFAULT_SCHEME_ID;
  try {
    return window.localStorage.getItem(STORAGE_KEY) || DEFAULT_SCHEME_ID;
  } catch {
    return DEFAULT_SCHEME_ID;
  }
}

export function saveScheme(schemeId: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, schemeId);
  } catch {
    /* ignore */
  }
}

/**
 * Apply a separate logo color scheme that overrides the site-accent-derived
 * logo gradient. Pass null to clear and let the logo follow the site accent.
 */
export function applyLogoScheme(schemeId: string | null): void {
  if (typeof document === "undefined") return;
  const existing = document.getElementById(LOGO_STYLE_ID);
  if (!schemeId) {
    if (existing) existing.remove();
    delete document.documentElement.dataset.logoScheme;
    return;
  }
  const scheme = BRAND_SCHEMES.find((s) => s.id === schemeId);
  if (!scheme) return;
  const [g1, g2, g3, g4] = deriveGradientStops(scheme.primary);
  const css = `:root, .dark, .light {
    --logo-grad-1: ${g1} !important;
    --logo-grad-2: ${g2} !important;
    --logo-grad-3: ${g3} !important;
    --logo-grad-4: ${g4} !important;
  }`;
  let style = existing as HTMLStyleElement | null;
  if (!style) {
    style = document.createElement("style");
    style.id = LOGO_STYLE_ID;
    document.head.appendChild(style);
  }
  style.textContent = css;
  document.documentElement.dataset.logoScheme = scheme.id;
}

export function loadStoredLogoScheme(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(LOGO_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function saveLogoScheme(schemeId: string | null): void {
  if (typeof window === "undefined") return;
  try {
    if (schemeId) window.localStorage.setItem(LOGO_STORAGE_KEY, schemeId);
    else window.localStorage.removeItem(LOGO_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export function bootstrapBrandScheme(): void {
  applyBrandScheme(loadStoredScheme());
  const logoScheme = loadStoredLogoScheme();
  if (logoScheme) applyLogoScheme(logoScheme);
}
