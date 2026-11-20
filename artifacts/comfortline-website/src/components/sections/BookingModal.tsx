import { useState, useEffect, useId } from "react";
import { createPortal } from "react-dom";
import { X, ArrowRight, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/context/language-context";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { gtagEvent } from "@/lib/gtag";
import { analyticsPage, trackEvent } from "@/lib/analytics";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { useModalFocus } from "@/hooks/use-modal-focus";

type VehicleClass = "any" | "comfort" | "business" | "premium";

interface PassengerState {
  adults: number;
  children: number;
  babies: number;
  pets: number;
  suitcases: number;
  vehicleClass: VehicleClass;
}

export interface BookingModalProps {
  open: boolean;
  onClose: () => void;
  prefilledDate?: string;
  prefilledPax?: PassengerState;
  routeName?: string;
  planName?: string;
  planPrice?: string;
  prefilledFrom?: string;
  prefilledTo?: string;
}

function plural(n: number, one: string, few: string, many: string) {
  if (n === 1) return `${n} ${one}`;
  if (n >= 2 && n <= 4) return `${n} ${few}`;
  return `${n} ${many}`;
}

function SmallCounter({ label, value, onChange, min = 0, max = 8 }: {
  label: string; value: number; onChange: (v: number) => void; min?: number; max?: number;
}) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-700">{label}</span>
      <div className="flex items-center gap-2.5">
        <button type="button" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min}
          className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-primary hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-sm leading-none">
          −
        </button>
        <span className="w-4 text-center text-sm font-bold text-gray-800">{value}</span>
        <button type="button" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max}
          className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-primary hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-sm leading-none">
          +
        </button>
      </div>
    </div>
  );
}

export function BookingModal({
  open, onClose,
  prefilledDate = "",
  prefilledPax,
  routeName,
  planName,
  planPrice,
  prefilledFrom = "",
  prefilledTo = "",
}: BookingModalProps) {
  const { t } = useLang();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const m = t.modal;
  const b = t.booking;
  const titleId = useId();
  const bookingFormId = useId();
  const citySuggestionsId = useId();
  const dialogRef = useModalFocus(open, onClose);

  const defaultPax: PassengerState = { adults: 1, children: 0, babies: 0, pets: 0, suitcases: 1, vehicleClass: "any" };

  const [date, setDate] = useState(prefilledDate);
  // A booking may be opened from the hero without first selecting a route.
  // Keep these editable so we never submit an empty origin/destination.
  const [fromInput, setFromInput] = useState(prefilledFrom);
  const [toInput, setToInput] = useState(prefilledTo);
  const [routeError, setRouteError] = useState("");
  const [pax, setPax] = useState<PassengerState>(prefilledPax ?? defaultPax);
  const [paxOpen, setPaxOpen] = useState(false);

  const [name,      setName]      = useState("");
  const [email,     setEmail]     = useState("");
  const [phone,     setPhone]     = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [comment,   setComment]   = useState("");
  const [agreed,    setAgreed]    = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [phoneResetKey, setPhoneResetKey] = useState(0);

  function validatePhone(value: string): string {
    const digits = value.replace(/\D/g, "");
    if (!value.trim()) return t.lang === "ru" ? "Введите номер телефона" : "Phone number is required";
    if (digits.length < 9)  return t.lang === "ru" ? "Слишком короткий номер" : "Number is too short";
    if (digits.length > 15) return t.lang === "ru" ? "Слишком длинный номер" : "Number is too long";
    if (/^(\d)\1+$/.test(digits)) return t.lang === "ru" ? "Введите настоящий номер телефона" : "Please enter a real phone number";
    return "";
  }

  useEffect(() => {
    if (!open) return;
    trackEvent("booking_form_opened", {
      page: analyticsPage(),
      language: t.lang,
      context: routeName ? "route" : planName ? "plan" : "general",
    });
    setDate(prefilledDate);
    setFromInput(prefilledFrom);
    setToInput(prefilledTo);
    setRouteError("");
    setPax(prefilledPax ?? defaultPax);
    setPaxOpen(false);
    setName(""); setEmail(""); setPhone(""); setPhoneError(""); setComment(""); setAgreed(false);
    setPhoneResetKey(k => k + 1);
  }, [open]);

  const classOptions: { key: VehicleClass; label: string }[] = [
    { key: "any",      label: b.classAny     },
    { key: "comfort",  label: b.classComfort  },
    { key: "business", label: b.classBusiness },
    { key: "premium",  label: b.classPremium  },
  ];

  const classLabel = classOptions.find(c => c.key === pax.vehicleClass)?.label ?? b.classAny;
  const totalPax   = pax.adults + pax.children + pax.babies;
  const paxSummary = plural(totalPax, m.passenger, m.passengerFew, m.passengerMany)
    + (pax.vehicleClass !== "any" ? ` · ${classLabel}` : "");

  const formattedDate = date
    ? new Intl.DateTimeFormat(t.lang === "ru" ? "ru-RU" : "en-GB", {
        day: "numeric", month: "long", year: "numeric",
      }).format(new Date(date))
    : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!agreed) return;
    const origin = fromInput.trim();
    const destination = toInput.trim();
    if (!origin || !destination) {
      setRouteError(t.lang === "ru" ? "Укажите пункт отправления и назначения" : "Enter both pickup and destination");
      return;
    }
    const err = validatePhone(phone);
    if (err) { setPhoneError(err); return; }
    setSubmitting(true);
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from: origin,
          to: destination,
          routeName, planName,
          date,
          adults: pax.adults, children: pax.children, babies: pax.babies,
          pets: pax.pets, suitcases: pax.suitcases, vehicleClass: pax.vehicleClass,
          lang: t.lang, name, email, phone, comment,
        }),
      });
      if (res.ok) {
        gtagEvent("generate_lead", { event_category: "booking" });
        trackEvent("booking_submitted", {
          page: analyticsPage(),
          language: t.lang,
          vehicle_class: pax.vehicleClass,
          passenger_count: pax.adults + pax.children + pax.babies,
          has_children: pax.children + pax.babies > 0,
          has_pets: pax.pets > 0,
          has_route_preset: Boolean(routeName || prefilledFrom || prefilledTo),
        });
        onClose();
        navigate("/thank-you");
      } else {
        const result = await res.json().catch(() => ({}));
        const emailIssue = result?.error === "email_not_configured" || result?.error === "email_delivery_failed";
        const description = emailIssue
          ? (t.lang === "ru" ? "Не удалось отправить письмо. Попробуйте связаться с нами по телефону." : "Email delivery is unavailable. Please contact us by phone.")
          : (t.lang === "ru" ? "Не удалось отправить заявку. Проверьте данные и попробуйте ещё раз." : "Could not send booking. Check your details and try again.");
        toast({ title: t.lang === "ru" ? "Ошибка" : "Error", description, variant: "destructive" });
      }
    } catch {
      toast({ title: t.lang === "ru" ? "Ошибка" : "Error",
        description: t.lang === "ru" ? "Ошибка сети. Проверьте соединение." : "Network error. Check your connection.",
        variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  }

  const inputCls = "w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition bg-white";

  // React's synchronous SSR renderers (renderToStaticMarkup/renderToString)
  // reject portals outright, even when their content is empty. This modal is
  // always closed on first paint, so it's safe to skip entirely during the
  // build-time SSR pass (see scripts/prerender.mjs) — the client render
  // mounts it normally in the browser.
  if ((globalThis as { __SSR_PRERENDER__?: boolean }).__SSR_PRERENDER__) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div key="backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              role="dialog"
              ref={dialogRef}
              tabIndex={-1}
              aria-modal="true"
              aria-labelledby={titleId}
              className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl pointer-events-auto max-h-[90dvh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
                <h2 id={titleId} className="text-xl font-bold text-gray-900">{m.title}</h2>
                <button type="button" onClick={onClose} aria-label="Close"
                  className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="px-6 py-5 space-y-5">

                {/* Route / plan summary (shown when coming from Pricing or Fleet with context) */}
                {routeName && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-sm font-semibold px-3 py-1.5 rounded-full">
                      <ArrowRight className="h-3.5 w-3.5 shrink-0" />
                      {routeName}
                    </span>
                    {planName && (
                      <span className="bg-gray-100 text-gray-700 text-sm font-medium px-3 py-1.5 rounded-full">
                        {planName}
                      </span>
                    )}
                    {planPrice && (
                      <span className="border border-gray-200 text-gray-500 text-sm px-3 py-1.5 rounded-full">
                        {planPrice}
                      </span>
                    )}
                  </div>
                )}

                {/* From → To when no preset route but custom entered */}
                {!routeName && (prefilledFrom || prefilledTo) && (
                  <div className="flex items-center gap-2 flex-wrap">
                    {prefilledFrom && <span className="font-bold text-gray-900">{prefilledFrom}</span>}
                    {prefilledFrom && prefilledTo && <ArrowRight className="h-4 w-4 text-primary shrink-0" />}
                    {prefilledTo && <span className="font-bold text-gray-900">{prefilledTo}</span>}
                  </div>
                )}

                {/* Route selection must be available even if the modal opens directly. */}
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-gray-900">{t.lang === "ru" ? "Маршрут" : "Your route"}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <label className="block">
                        <span className="block text-xs font-semibold text-gray-500 mb-1">{b.from}</span>
                        <input type="text" name="from" data-testid="booking-modal-from" autoComplete="off"
                          form={bookingFormId} list={citySuggestionsId}
                          value={fromInput} onChange={e => { setFromInput(e.target.value); setRouteError(""); }}
                          required maxLength={200} placeholder={b.from} className={inputCls} />
                      </label>
                      <label className="block">
                        <span className="block text-xs font-semibold text-gray-500 mb-1">{b.to}</span>
                        <input type="text" name="to" data-testid="booking-modal-to" autoComplete="off"
                          form={bookingFormId} list={citySuggestionsId}
                          value={toInput} onChange={e => { setToInput(e.target.value); setRouteError(""); }}
                          required maxLength={200} placeholder={b.to} className={inputCls} />
                      </label>
                    </div>
                    <datalist id={citySuggestionsId}>
                      {b.popularDests.map(city => <option key={city} value={city} />)}
                    </datalist>
                    {routeError && <p role="alert" className="text-xs text-red-600">{routeError}</p>}
                  </div>

                {/* Date */}
                <div>
                  <label htmlFor="booking-modal-date" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    {b.date}
                  </label>
                  <input id="booking-modal-date" type="date" value={date} onChange={e => setDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className={`${inputCls} [color-scheme:light]`}
                  />
                  {formattedDate && <p className="text-xs text-gray-400 mt-1">{formattedDate}</p>}
                </div>

                {/* Passengers */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    {b.passengersClass}
                  </label>
                  <button type="button" onClick={() => setPaxOpen(v => !v)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 hover:border-primary/40 transition-colors bg-white">
                    <span>{paxSummary}</span>
                    <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${paxOpen ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {paxOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.15 }}
                        className="mt-1 bg-white border border-gray-200 rounded-xl shadow-md p-4"
                      >
                        <SmallCounter label={b.adults}    value={pax.adults}    min={1} max={8} onChange={v => setPax(p => ({ ...p, adults: v }))} />
                        <SmallCounter label={b.children}  value={pax.children}  max={5}         onChange={v => setPax(p => ({ ...p, children: v }))} />
                        <SmallCounter label={b.babies}    value={pax.babies}    max={4}         onChange={v => setPax(p => ({ ...p, babies: v }))} />
                        <SmallCounter label={b.pets}      value={pax.pets}      max={2}         onChange={v => setPax(p => ({ ...p, pets: v }))} />
                        <div className="my-2 border-t border-gray-100" />
                        <SmallCounter label={b.suitcases} value={pax.suitcases} max={10}        onChange={v => setPax(p => ({ ...p, suitcases: v }))} />
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-xs font-semibold text-gray-600 mb-2">{b.vehicleClass}</p>
                          <div className="grid grid-cols-2 gap-1.5">
                            {classOptions.map(opt => (
                              <button key={opt.key} type="button"
                                onClick={() => setPax(p => ({ ...p, vehicleClass: opt.key }))}
                                className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-colors ${
                                  pax.vehicleClass === opt.key
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "border-gray-200 text-gray-700 hover:border-primary/40"
                                }`}>
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </div>
                        <button type="button" onClick={() => setPaxOpen(false)}
                          className="mt-3 w-full py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-opacity">
                          {b.apply}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Contact form */}
                <form id={bookingFormId} onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-1">{m.contactHeading}</h3>
                    <p className="text-sm text-gray-500">{m.contactSubtext}</p>
                  </div>

                  <input type="text" placeholder={m.name} aria-label={m.name} value={name}
                    onChange={e => setName(e.target.value)} required className={inputCls} />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input type="email" placeholder={m.email} aria-label={m.email} value={email}
                      onChange={e => setEmail(e.target.value)} className={inputCls} />
                    <div className="space-y-1">
                      <PhoneInput
                        placeholder={m.phone}
                        required
                        error={!!phoneError}
                        resetKey={phoneResetKey}
                        onChange={full => { setPhone(full); if (phoneError) setPhoneError(validatePhone(full)); }}
                        onBlur={() => setPhoneError(validatePhone(phone))}
                      />
                      {phoneError && <p className="text-xs text-red-500 font-medium pl-1">{phoneError}</p>}
                    </div>
                  </div>

                  <textarea placeholder={m.comment} aria-label={m.comment} value={comment}
                    onChange={e => setComment(e.target.value)} rows={2}
                    className={`${inputCls} resize-none`} />

                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative mt-0.5 shrink-0">
                      <input type="checkbox" checked={agreed}
                        onChange={e => setAgreed(e.target.checked)}
                        className="sr-only peer" required />
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gray-900 ${
                        agreed ? "bg-primary border-primary" : "border-gray-300 group-hover:border-primary/50"
                      }`}>
                        {agreed && (
                          <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-gray-600 leading-snug">
                      {m.privacyText}{" "}
                      <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:opacity-80">{m.privacyLink}</a>
                      {" "}{m.privacyAnd}{" "}
                      <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:opacity-80">{m.termsLink}</a>
                    </span>
                  </label>

                  <button type="submit" disabled={submitting || !agreed}
                    className="w-full py-4 bg-primary text-primary-foreground font-bold text-sm rounded-xl hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed">
                    {submitting ? "..." : m.submit}
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
