import { useState, useEffect, useId } from "react";
import { createPortal } from "react-dom";
import { X, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/context/language-context";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { useModalFocus } from "@/hooks/use-modal-focus";

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
}

const copy = {
  ru: {
    title: "Связаться с нами",
    subtitle: "Ответим быстро — обычно в ближайшее время.",
    name: "Ваше имя",
    phone: "Телефон *",
    email: "Email (необязательно)",
    message: "Вопрос или комментарий",
    privacyText: "Отправляя форму, вы соглашаетесь с",
    privacyLink: "политикой конфиденциальности",
    privacyAnd: "и",
    termsLink: "условиями использования",
    submit: "Отправить",
    toastTitle: "Сообщение отправлено",
    toastDesc: "Мы свяжемся с вами в ближайшее время.",
    phoneRequired: "Введите номер телефона",
    phoneTooShort: "Слишком короткий номер",
    phoneTooLong: "Слишком длинный номер",
    phoneInvalid: "Введите настоящий номер телефона",
  },
  en: {
    title: "Contact us",
    subtitle: "We respond fast — usually shortly.",
    name: "Your name",
    phone: "Phone *",
    email: "Email (optional)",
    message: "Question or comment",
    privacyText: "By submitting you agree to our",
    privacyLink: "privacy policy",
    privacyAnd: "and",
    termsLink: "terms of use",
    submit: "Send message",
    toastTitle: "Message sent",
    toastDesc: "We'll get back to you shortly.",
    phoneRequired: "Phone number is required",
    phoneTooShort: "Number is too short",
    phoneTooLong: "Number is too long",
    phoneInvalid: "Please enter a real phone number",
  },
};

export function ContactModal({ open, onClose }: ContactModalProps) {
  const { t } = useLang();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const lang = t.lang as "ru" | "en";
  const c = copy[lang];
  const titleId = useId();
  const dialogRef = useModalFocus(open, onClose);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [phoneResetKey, setPhoneResetKey] = useState(0);

  useEffect(() => {
    if (!open) return;
    setName(""); setPhone(""); setEmail(""); setMessage("");
    setPhoneError(""); setAgreed(false);
    setPhoneResetKey(k => k + 1);
  }, [open]);

  function validatePhone(value: string): string {
    const digits = value.replace(/\D/g, "");
    if (!value.trim()) return c.phoneRequired;
    if (digits.length < 9)  return c.phoneTooShort;
    if (digits.length > 15) return c.phoneTooLong;
    if (/^(\d)\1+$/.test(digits)) return c.phoneInvalid;
    return "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!agreed) return;
    const err = validatePhone(phone);
    if (err) { setPhoneError(err); return; }
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email, message, lang }),
      });
      if (res.ok) {
        onClose();
        navigate("/thank-you");
      } else {
        toast({ title: "Error", description: "Failed to send. Please try again.", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Failed to send. Please try again.", variant: "destructive" });
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
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl pointer-events-auto max-h-[90dvh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <MessageSquare className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h2 id={titleId} className="text-lg font-bold text-gray-900 leading-tight">{c.title}</h2>
                    <p className="text-xs text-gray-500 mt-0.5">{c.subtitle}</p>
                  </div>
                </div>
                <button type="button" onClick={onClose} aria-label="close"
                  className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors ml-2 shrink-0">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">

                <input type="text" placeholder={c.name} aria-label={c.name} value={name}
                  onChange={e => setName(e.target.value)} required className={inputCls} />

                <div className="space-y-1">
                  <PhoneInput
                    placeholder={c.phone}
                    required
                    error={!!phoneError}
                    resetKey={phoneResetKey}
                    onChange={full => { setPhone(full); if (phoneError) setPhoneError(validatePhone(full)); }}
                    onBlur={() => setPhoneError(validatePhone(phone))}
                  />
                  {phoneError && <p className="text-xs text-red-500 font-medium pl-1">{phoneError}</p>}
                </div>

                <input type="email" placeholder={c.email} aria-label={c.email} value={email}
                  onChange={e => setEmail(e.target.value)} className={inputCls} />

                <textarea placeholder={c.message} aria-label={c.message} value={message}
                  onChange={e => setMessage(e.target.value)} rows={3}
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
                    {c.privacyText}{" "}
                    <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:opacity-80">{c.privacyLink}</a>
                    {" "}{c.privacyAnd}{" "}
                    <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:opacity-80">{c.termsLink}</a>
                  </span>
                </label>

                <button type="submit" disabled={submitting || !agreed}
                  className="w-full py-4 bg-primary text-primary-foreground font-bold text-sm rounded-xl hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed">
                  {submitting ? "..." : c.submit}
                </button>

              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
