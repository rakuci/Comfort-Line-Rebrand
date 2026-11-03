import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";

interface Country {
  code: string;
  dial: string;
  flag: string;
  name: string;
}

const PRIORITY: Country[] = [
  { code: "BY", dial: "+375", flag: "🇧🇾", name: "Belarus" },
  { code: "LT", dial: "+370", flag: "🇱🇹", name: "Lithuania" },
  { code: "PL", dial: "+48",  flag: "🇵🇱", name: "Poland" },
  { code: "LV", dial: "+371", flag: "🇱🇻", name: "Latvia" },
];

const REST: Country[] = [
  { code: "AT", dial: "+43",  flag: "🇦🇹", name: "Austria" },
  { code: "AZ", dial: "+994", flag: "🇦🇿", name: "Azerbaijan" },
  { code: "BE", dial: "+32",  flag: "🇧🇪", name: "Belgium" },
  { code: "CZ", dial: "+420", flag: "🇨🇿", name: "Czechia" },
  { code: "DE", dial: "+49",  flag: "🇩🇪", name: "Germany" },
  { code: "DK", dial: "+45",  flag: "🇩🇰", name: "Denmark" },
  { code: "EE", dial: "+372", flag: "🇪🇪", name: "Estonia" },
  { code: "ES", dial: "+34",  flag: "🇪🇸", name: "Spain" },
  { code: "FI", dial: "+358", flag: "🇫🇮", name: "Finland" },
  { code: "FR", dial: "+33",  flag: "🇫🇷", name: "France" },
  { code: "GB", dial: "+44",  flag: "🇬🇧", name: "United Kingdom" },
  { code: "GE", dial: "+995", flag: "🇬🇪", name: "Georgia" },
  { code: "GR", dial: "+30",  flag: "🇬🇷", name: "Greece" },
  { code: "HR", dial: "+385", flag: "🇭🇷", name: "Croatia" },
  { code: "HU", dial: "+36",  flag: "🇭🇺", name: "Hungary" },
  { code: "IE", dial: "+353", flag: "🇮🇪", name: "Ireland" },
  { code: "IL", dial: "+972", flag: "🇮🇱", name: "Israel" },
  { code: "IT", dial: "+39",  flag: "🇮🇹", name: "Italy" },
  { code: "KG", dial: "+996", flag: "🇰🇬", name: "Kyrgyzstan" },
  { code: "KZ", dial: "+7",   flag: "🇰🇿", name: "Kazakhstan" },
  { code: "MD", dial: "+373", flag: "🇲🇩", name: "Moldova" },
  { code: "NL", dial: "+31",  flag: "🇳🇱", name: "Netherlands" },
  { code: "NO", dial: "+47",  flag: "🇳🇴", name: "Norway" },
  { code: "PT", dial: "+351", flag: "🇵🇹", name: "Portugal" },
  { code: "RO", dial: "+40",  flag: "🇷🇴", name: "Romania" },
  { code: "RU", dial: "+7",   flag: "🇷🇺", name: "Russia" },
  { code: "SE", dial: "+46",  flag: "🇸🇪", name: "Sweden" },
  { code: "SK", dial: "+421", flag: "🇸🇰", name: "Slovakia" },
  { code: "TR", dial: "+90",  flag: "🇹🇷", name: "Turkey" },
  { code: "UA", dial: "+380", flag: "🇺🇦", name: "Ukraine" },
  { code: "US", dial: "+1",   flag: "🇺🇸", name: "United States" },
  { code: "UZ", dial: "+998", flag: "🇺🇿", name: "Uzbekistan" },
];

const ALL = [...PRIORITY, ...REST];

interface PhoneInputProps {
  onChange: (full: string) => void;
  onBlur?: () => void;
  error?: boolean;
  placeholder?: string;
  required?: boolean;
  resetKey?: number;
}

export function PhoneInput({ onChange, onBlur, error, placeholder, required, resetKey }: PhoneInputProps) {
  const [country, setCountry] = useState<Country>(PRIORITY[0]);
  const [local, setLocal] = useState("");
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCountry(PRIORITY[0]);
    setLocal("");
    setSearch("");
  }, [resetKey]);

  useEffect(() => {
    onChange(local.trim() ? country.dial + local : "");
  }, [country, local]);

  useEffect(() => {
    if (!open) { setSearch(""); return; }
    setTimeout(() => searchRef.current?.focus(), 50);
  }, [open]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function selectCountry(c: Country) {
    setCountry(c);
    setOpen(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  const filtered = search.trim()
    ? ALL.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.dial.includes(search) ||
        c.code.toLowerCase().includes(search.toLowerCase())
      )
    : null;

  const borderCls = error
    ? "border-red-400 focus-within:border-red-400 focus-within:ring-red-400/20"
    : "border-gray-200 focus-within:border-primary focus-within:ring-primary/20";

  return (
    <div ref={containerRef} className="relative w-full">
      <div className={`flex items-center w-full rounded-xl border bg-white focus-within:ring-2 transition overflow-hidden ${borderCls}`}>
        <button
          type="button"
          onClick={() => setOpen(v => !v)}
          className="flex items-center gap-1.5 px-3 py-3 border-r border-gray-200 shrink-0 hover:bg-gray-50 transition-colors text-sm text-gray-700 select-none"
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <span className="text-base leading-none">{country.flag}</span>
          <span className="font-medium tabular-nums">{country.dial}</span>
          <ChevronDown className={`h-3.5 w-3.5 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>

        <input
          ref={inputRef}
          type="tel"
          inputMode="tel"
          placeholder={placeholder ?? "Phone number"}
          aria-label={placeholder ?? "Phone number"}
          required={required}
          value={local}
          onChange={e => setLocal(e.target.value)}
          onBlur={onBlur}
          className="flex-1 px-3 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none bg-transparent min-w-0"
        />
      </div>

      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 w-64 bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden">
          <div className="p-2 border-b border-gray-100">
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-gray-50 border border-gray-200">
              <Search className="h-3.5 w-3.5 text-gray-400 shrink-0" />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search country…"
                aria-label="Search country"
                className="flex-1 text-xs text-gray-700 placeholder-gray-400 outline-none bg-transparent"
              />
            </div>
          </div>

          <div className="max-h-52 overflow-y-auto">
            {filtered ? (
              filtered.length === 0 ? (
                <div className="px-4 py-3 text-xs text-gray-400 text-center">No results</div>
              ) : (
                filtered.map(c => (
                  <CountryRow key={c.code} c={c} selected={c.code === country.code} onSelect={selectCountry} />
                ))
              )
            ) : (
              <>
                {PRIORITY.map(c => (
                  <CountryRow key={c.code} c={c} selected={c.code === country.code} onSelect={selectCountry} />
                ))}
                <div className="mx-3 my-1 border-t border-gray-100" />
                {REST.map(c => (
                  <CountryRow key={c.code} c={c} selected={c.code === country.code} onSelect={selectCountry} />
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function CountryRow({ c, selected, onSelect }: { c: Country; selected: boolean; onSelect: (c: Country) => void }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(c)}
      className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-gray-50 transition-colors text-left ${selected ? "bg-primary/5 text-primary font-medium" : "text-gray-700"}`}
    >
      <span className="text-base leading-none shrink-0">{c.flag}</span>
      <span className="flex-1 truncate">{c.name}</span>
      <span className="text-xs text-gray-400 tabular-nums shrink-0">{c.dial}</span>
    </button>
  );
}
