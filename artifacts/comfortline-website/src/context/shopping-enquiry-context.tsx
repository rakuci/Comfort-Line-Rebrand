import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { ENQUIRY_FIELDS, type EnquiryValues } from "@/data/shopping-enquiry";

export type EnquiryLang = "ru" | "en";

interface Draft {
  text: string;
  /** Snapshot of values used to generate this draft; null when never generated. */
  signature: string | null;
  /** True once the user typed into the generated draft. */
  edited: boolean;
}

interface ShoppingEnquiryState {
  values: EnquiryValues;
  setValue: (key: string, value: string) => void;
  resetValues: () => void;
  signature: string;
  drafts: Record<EnquiryLang, Draft>;
  setDraftText: (lang: EnquiryLang, text: string) => void;
  applyGenerated: (lang: EnquiryLang, text: string) => void;
}

const emptyDraft: Draft = { text: "", signature: null, edited: false };

export function makeEmptyEnquiryValues(): EnquiryValues {
  const v: EnquiryValues = {};
  for (const f of ENQUIRY_FIELDS) v[f.key] = "";
  return v;
}

export function enquirySignature(values: EnquiryValues): string {
  return JSON.stringify(ENQUIRY_FIELDS.map((f) => values[f.key] ?? ""));
}

const Ctx = createContext<ShoppingEnquiryState | null>(null);

/** In-memory only: no storage, no network. A page refresh clears everything. */
export function ShoppingEnquiryProvider({ children }: { children: ReactNode }) {
  const [values, setValues] = useState<EnquiryValues>(makeEmptyEnquiryValues);
  const [drafts, setDrafts] = useState<Record<EnquiryLang, Draft>>({ ru: emptyDraft, en: emptyDraft });

  const setValue = useCallback((key: string, value: string) => {
    setValues((p) => ({ ...p, [key]: value }));
  }, []);
  const resetValues = useCallback(() => setValues(makeEmptyEnquiryValues()), []);
  const setDraftText = useCallback((lang: EnquiryLang, text: string) => {
    setDrafts((p) => ({ ...p, [lang]: { ...p[lang], text, edited: true } }));
  }, []);
  const signature = useMemo(() => enquirySignature(values), [values]);
  const applyGenerated = useCallback(
    (lang: EnquiryLang, text: string) => {
      setDrafts((p) => ({ ...p, [lang]: { text, signature, edited: false } }));
    },
    [signature],
  );

  const value = useMemo(
    () => ({ values, setValue, resetValues, signature, drafts, setDraftText, applyGenerated }),
    [values, setValue, resetValues, signature, drafts, setDraftText, applyGenerated],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useShoppingEnquiry(): ShoppingEnquiryState {
  const c = useContext(Ctx);
  if (!c) throw new Error("useShoppingEnquiry must be used inside ShoppingEnquiryProvider");
  return c;
}
