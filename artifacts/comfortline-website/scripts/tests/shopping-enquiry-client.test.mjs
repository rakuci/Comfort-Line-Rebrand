import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import ts from "typescript";
import { JSDOM } from "jsdom";
import React, { act } from "react";

const root = fileURLToPath(new URL("../../", import.meta.url));
const dom = new JSDOM("<!doctype html><html><body><div id='root'></div></body></html>", { url: "https://comfortline.by/" });
for (const key of ["window", "document", "HTMLElement", "HTMLInputElement", "HTMLTextAreaElement", "Event", "MouseEvent"]) global[key] = key === "window" ? dom.window : dom.window[key];
Object.defineProperty(global, "navigator", { value: dom.window.navigator, configurable: true });
global.IS_REACT_ACT_ENVIRONMENT = true;
global.requestAnimationFrame = (callback) => { callback(); return 0; };
const { createRoot } = await import("react-dom/client");
const require = createRequire(import.meta.url);
const Lang = React.createContext({ lang: "en" });
const cache = new Map();
// Test our dialog decision/callbacks, not Radix's portal/focus implementation.
const dialog = {
  AlertDialog: ({ open, children }) => open ? React.createElement("div", { role: "alertdialog" }, children) : null,
};
for (const name of ["AlertDialogContent", "AlertDialogHeader", "AlertDialogFooter", "AlertDialogTitle", "AlertDialogDescription"]) {
  dialog[name] = ({ children }) => React.createElement("div", null, children);
}
for (const name of ["AlertDialogAction", "AlertDialogCancel"]) {
  dialog[name] = ({ children, onClick }) => React.createElement("button", { type: "button", onClick }, children);
}
function load(file) {
  if (cache.has(file)) return cache.get(file).exports;
  const module = { exports: {} };
  cache.set(file, module);
  const code = ts.transpileModule(readFileSync(file, "utf8"), {
    fileName: file,
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText;
  function resolve(specifier) {
    if (specifier === "@/context/language-context") return { useLang: () => React.useContext(Lang) };
    if (specifier === "@/components/ui/alert-dialog") return dialog;
    if (specifier.startsWith("@/") || specifier.startsWith(".")) {
      const base = specifier.startsWith("@/") ? path.join(root, "src", specifier.slice(2)) : path.resolve(path.dirname(file), specifier);
      const target = [base + ".ts", base + ".tsx"].find(existsSync);
      assert(target, `Cannot resolve ${specifier}`);
      return load(target);
    }
    return require(specifier);
  }
  new Function("require", "module", "exports", code)(resolve, module, module.exports);
  return module.exports;
}
const { ShoppingEnquiryProvider, useShoppingEnquiry } = load(path.join(root, "src/context/shopping-enquiry-context.tsx"));
const { ShoppingEnquiry } = load(path.join(root, "src/components/sections/ShoppingEnquiry.tsx"));
let state;
function Probe() { state = useShoppingEnquiry(); return null; }
function App({ lang }) {
  return React.createElement(ShoppingEnquiryProvider, null,
    React.createElement(Probe),
    React.createElement(Lang.Provider, { value: { lang } }, React.createElement(ShoppingEnquiry, { key: lang })));
}
const query = (id) => document.querySelector(`[data-testid="${id}"]`);

test("real enquiry UI generates, edits, copies, flags stale input and preserves drafts across language remounts without storage or requests", async () => {
  let requests = 0, writes = 0;
  const oldFetch = global.fetch;
  global.fetch = async () => { requests++; throw new Error("Unexpected network request"); };
  const storage = { getItem() { writes++; throw new Error("Unexpected storage read"); }, setItem() { writes++; throw new Error("Unexpected storage write"); } };
  Object.defineProperty(dom.window, "localStorage", { value: storage });
  Object.defineProperty(dom.window, "sessionStorage", { value: storage });
  const client = createRoot(document.getElementById("root"));
  try {
    await act(() => client.render(React.createElement(App, { lang: "en" })));
    assert.equal(document.querySelectorAll("input[required],textarea[required],select[required]").length, 0);
    await act(() => state.setValue("valueEUR", "501"));
    await act(() => query("button-prepare-enquiry").click());
    assert.match(query("enquiry-message").value, /Purchases exceed €500 or 25 kg/);
    const message = query("enquiry-message");
    const setText = Object.getOwnPropertyDescriptor(dom.window.HTMLTextAreaElement.prototype, "value").set;
    await act(() => { setText.call(message, message.value + "\nMy edited enquiry"); message.dispatchEvent(new dom.window.Event("input", { bubbles: true })); });
    assert.equal(state.drafts.en.edited, true);
    await act(() => state.setValue("route", "Vilnius — Minsk"));
    assert(query("enquiry-stale"));
    assert.equal(query("button-email-enquiry").tagName, "BUTTON");
    assert.equal(query("button-email-enquiry").disabled, true);

    await act(() => client.render(React.createElement(App, { lang: "ru" })));
    assert.equal(query("enquiry-valueEUR").value, "501");
    assert.equal(query("enquiry-message"), null);
    await act(() => query("button-prepare-enquiry").click());
    assert.match(query("enquiry-message").value, /Здравствуйте, ComfortLine/);
    await act(() => client.render(React.createElement(App, { lang: "en" })));
    assert.match(query("enquiry-message").value, /My edited enquiry/);
    assert(query("enquiry-stale"));
    await act(() => query("button-prepare-enquiry").click());
    assert(document.querySelector('[role="alertdialog"]'), "Overwriting edited text requires confirmation");
    assert.match(query("enquiry-message").value, /My edited enquiry/);
    await act(() => [...document.querySelectorAll('[role="alertdialog"] button')].find((button) => button.textContent === "Replace").click());
    assert.doesNotMatch(query("enquiry-message").value, /My edited enquiry/);
    assert.equal(query("enquiry-stale"), null);
    const email = query("button-email-enquiry");
    assert.equal(email.tagName, "A");
    assert(email.href.startsWith("mailto:info@comfortline.by?"));
    assert.equal(new URL(email.href).searchParams.get("body"), query("enquiry-message").value);

    let copied;
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: async (text) => { copied = text; } } });
    await act(async () => { query("button-copy-enquiry").click(); await Promise.resolve(); });
    assert.equal(copied, query("enquiry-message").value);
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: undefined });
    await act(async () => { query("button-copy-enquiry").click(); await Promise.resolve(); });
    assert.match(document.querySelector('[role="alert"]').textContent, /copy it manually/);
    assert.equal(query("enquiry-message").selectionStart, 0);
    assert.equal(query("enquiry-message").selectionEnd, query("enquiry-message").value.length);
    assert.equal(requests, 0);
    assert.equal(writes, 0);
  } finally {
    await act(() => client.unmount());
    global.fetch = oldFetch;
    dom.window.close();
  }
});
