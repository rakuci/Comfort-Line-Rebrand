import { useId, useRef, useState } from "react";
import { AlertTriangle, Copy, Lock, Mail, RotateCcw } from "lucide-react";
import { useLang } from "@/context/language-context";
import { useShoppingEnquiry } from "@/context/shopping-enquiry-context";
import { ENQUIRY_DISCLAIMER, ENQUIRY_FIELDS, buildShoppingEnquiry } from "@/data/shopping-enquiry";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const fieldCls =
  "w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary";

const WIDE = new Set(["route", "vehicleDetails", "entryHistory", "inventory", "specialItems", "transferNeeds", "citizenships", "travelDocument", "entryBasis"]);
const EMAIL = "info@comfortline.by";

export function ShoppingEnquiry() {
  const { lang } = useLang();
  const ru = lang === "ru";
  const t = (a: string, b: string) => (ru ? a : b);
  const uid = useId().replace(/:/g, "");
  const id = (n: string) => `${uid}-${n}`;
  const { values, setValue, resetValues, signature, drafts, setDraftText, applyGenerated } = useShoppingEnquiry();
  const draft = drafts[lang];
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [copyState, setCopyState] = useState<"idle" | "ok" | "fail">("idle");
  const textRef = useRef<HTMLTextAreaElement>(null);

  const hasDraft = draft.signature !== null;
  const stale = hasDraft && draft.signature !== signature;

  const generate = () => {
    applyGenerated(lang, buildShoppingEnquiry(values, lang));
    setCopyState("idle");
    requestAnimationFrame(() => textRef.current?.focus());
  };
  const onPrepare = () => {
    if (hasDraft && draft.edited) setConfirmOpen(true);
    else generate();
  };

  const copy = async () => {
    try {
      if (!navigator.clipboard) throw new Error("no clipboard");
      await navigator.clipboard.writeText(draft.text);
      setCopyState("ok");
    } catch {
      setCopyState("fail");
      textRef.current?.focus();
      textRef.current?.select();
    }
  };

  const subject = t("Запрос: поездка ЕС — Беларусь на автомобиле", "Enquiry: EU — Belarus trip by car");
  const mailto = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(draft.text)}`;
  const mailDisabled = !draft.text.trim() || stale;

  const btnPrimary =
    "h-auto whitespace-normal text-left inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 active:scale-[0.98] transition shadow-lg shadow-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";
  const btnSecondary =
    "h-auto whitespace-normal text-left inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-border text-sm font-semibold text-foreground/80 hover:border-primary/50 hover:text-primary active:scale-[0.98] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none";

  return (
    <section
      aria-labelledby={id("title")}
      className="not-prose my-10 rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/5 via-transparent to-transparent p-4 md:p-7"
      data-testid="shopping-enquiry"
    >
      <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-primary mb-2">{t("Запрос", "Enquiry")}</p>
      <h2 id={id("title")} className="text-2xl font-bold text-foreground mb-2">
        {t("Параметры вашей поездки", "Your trip details")}
      </h2>
      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
        {t(
          "Все поля необязательны. Незаполненное поле будет отмечено в запросе как требующее уточнения, а не как благоприятный ответ.",
          "All fields are optional. Anything left blank is marked in the enquiry as needing clarification, never treated as a favourable answer.",
        )}
      </p>
      <p className="flex items-start gap-2 text-xs text-foreground/75 mb-6 rounded-xl border border-border bg-card px-3 py-2">
        <Lock className="h-3.5 w-3.5 mt-0.5 shrink-0 text-primary" aria-hidden="true" />
        {t(
          "Данные хранятся только в памяти этой вкладки браузера и никуда не отправляются, пока вы сами не откроете черновик письма в почтовой программе. Обновление страницы всё очищает. Не указывайте номера паспортов, сканы документов и банковские данные.",
          "Details stay only in this browser tab's memory and are not sent anywhere until you explicitly open the email draft in your mail client. Refreshing the page clears everything. Do not enter passport numbers, document scans or banking details.",
        )}
      </p>

      <form onSubmit={(e) => { e.preventDefault(); onPrepare(); }} noValidate className="space-y-4">
        <fieldset className="rounded-2xl border border-border bg-card p-4 md:p-5">
          <legend className="px-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">{t("Поездка, документы, автомобиль, багаж", "Trip, documents, vehicle, luggage")}</legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ENQUIRY_FIELDS.map((f) => {
              const fid = id(f.key);
              const label = ru ? f.ru : f.en;
              const v = values[f.key] ?? "";
              const on = (x: string) => setValue(f.key, x);
              return (
                <div key={f.key} className={`space-y-1.5 ${WIDE.has(f.key) || f.type === "textarea" ? "sm:col-span-2" : ""}`}>
                  <Label htmlFor={fid} className="block text-xs font-semibold text-foreground/90">{label}</Label>
                  {f.options ? (
                    <select id={fid} className={fieldCls} value={v} onChange={(e) => on(e.target.value)} data-testid={`enquiry-${f.key}`}>
                      <option value="">{t("Неизвестно / уточнить", "Unknown / to clarify")}</option>
                      {f.options.map((o) => (
                        <option key={o.value} value={o.value}>{ru ? o.ru : o.en}</option>
                      ))}
                    </select>
                  ) : f.type === "textarea" || WIDE.has(f.key) ? (
                    <Textarea id={fid} rows={3} className={`${fieldCls} h-auto resize-y`} value={v} onChange={(e) => on(e.target.value)} data-testid={`enquiry-${f.key}`} />
                  ) : (
                    <Input
                      id={fid}
                      type={f.type === "date" ? "date" : "text"}
                      inputMode={f.type === "decimal" || f.type === "number" ? "decimal" : undefined}
                      className={`${fieldCls} h-auto`}
                      value={v}
                      onChange={(e) => on(e.target.value)}
                      data-testid={`enquiry-${f.key}`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </fieldset>

        <div className="flex flex-wrap gap-3">
          <Button type="submit" className={btnPrimary} data-testid="button-prepare-enquiry">
            {t("Подготовить запрос", "Prepare enquiry")}
          </Button>
          <Button type="button" variant="ghost" className={btnSecondary} onClick={resetValues} data-testid="button-reset-enquiry">
            <RotateCcw className="h-4 w-4" aria-hidden="true" /> {t("Очистить поля", "Clear fields")}
          </Button>
        </div>
      </form>

      <div className="mt-8 space-y-3" aria-live="polite">
        {stale && (
          <p role="status" className="flex items-start gap-2 rounded-xl border border-amber-500/50 bg-amber-500/10 px-3 py-2 text-sm text-foreground" data-testid="enquiry-stale">
            <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0 text-amber-700 dark:text-amber-400" aria-hidden="true" />
            {t(
              "Поля изменились после подготовки текста. Нажмите «Подготовить запрос», чтобы обновить сообщение; отправка письма недоступна до обновления.",
              "Fields changed after the text was prepared. Press “Prepare enquiry” to update the message; the email action is disabled until then.",
            )}
          </p>
        )}
        {hasDraft && (
          <>
            <Label htmlFor={id("msg")} className="block text-sm font-bold text-foreground">
              {t("Текст запроса (можно редактировать)", "Enquiry text (editable)")}
            </Label>
            <Textarea
              id={id("msg")}
              ref={textRef}
              rows={14}
              className={`${fieldCls} h-auto text-sm leading-relaxed resize-y`}
              value={draft.text}
              onChange={(e) => { setDraftText(lang, e.target.value); setCopyState("idle"); }}
              data-testid="enquiry-message"
            />
            <div className="flex flex-wrap gap-3">
              <Button type="button" variant="ghost" className={btnSecondary} onClick={copy} disabled={!draft.text.trim()} data-testid="button-copy-enquiry">
                <Copy className="h-4 w-4" aria-hidden="true" /> {t("Скопировать текст", "Copy text")}
              </Button>
              {mailDisabled ? (
                <Button type="button" variant="ghost" className={btnSecondary} disabled aria-disabled="true" data-testid="button-email-enquiry">
                  <Mail className="h-4 w-4" aria-hidden="true" /> {t(`Открыть письмо на ${EMAIL}`, `Open email to ${EMAIL}`)}
                </Button>
              ) : (
                <Button asChild variant="ghost" className={btnSecondary}>
                  <a href={mailto} data-testid="button-email-enquiry">
                    <Mail className="h-4 w-4 shrink-0" aria-hidden="true" /> <span>{t(`Открыть письмо на ${EMAIL}`, `Open email to ${EMAIL}`)}</span>
                  </a>
                </Button>
              )}
            </div>
            {copyState === "ok" && <p role="status" className="text-xs text-primary font-semibold">{t("Текст скопирован.", "Text copied.")}</p>}
            {copyState === "fail" && (
              <p role="alert" className="text-xs font-medium text-destructive dark:text-red-400">
                {t(
                  "Не удалось скопировать автоматически. Текст выделен в поле выше — скопируйте его вручную (Ctrl+C / Cmd+C или долгое нажатие).",
                  "Automatic copy failed. The text is selected in the box above — copy it manually (Ctrl+C / Cmd+C or long-press).",
                )}
              </p>
            )}
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t(
                "Кнопка письма только открывает черновик в вашей почтовой программе; отправляете его вы сами. Автоматической отправки нет. Некоторые почтовые программы обрезают длинные черновики — проверьте текст письма и при необходимости вставьте скопированный текст.",
                "The email button only opens a draft in your mail client; you send it yourself. Nothing is sent automatically. Some email clients truncate long drafts — check the email body and paste the copied text if needed.",
              )}
            </p>
          </>
        )}
      </div>

      <p className="mt-6 text-xs text-muted-foreground leading-relaxed border-t border-border pt-3" data-testid="enquiry-disclaimer">
        {ru ? ENQUIRY_DISCLAIMER.ru : ENQUIRY_DISCLAIMER.en}
      </p>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("Заменить отредактированный текст?", "Replace your edited text?")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t(
                "Вы изменяли текст запроса вручную. Новый текст по текущим полям заменит ваши правки.",
                "You edited the enquiry text manually. A new text from the current fields will replace your edits.",
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("Оставить мой текст", "Keep my text")}</AlertDialogCancel>
            <AlertDialogAction onClick={generate}>{t("Заменить", "Replace")}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
