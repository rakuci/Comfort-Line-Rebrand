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
const dom = new JSDOM("<!doctype html><html><head></head><body><div id='root'></div></body></html>", { url: "https://comfortline.by/" });
for (const key of ["window", "document", "HTMLElement", "HTMLInputElement", "Event", "MouseEvent"]) global[key] = dom.window[key];
Object.defineProperty(global, "navigator", { value: dom.window.navigator, configurable: true });
global.IS_REACT_ACT_ENVIRONMENT = true;
const { createRoot } = await import("react-dom/client");
const require = createRequire(import.meta.url);
const cache = new Map();
const labels = new Proxy({ popularDests: [] }, { get: (target, key) => target[key] ?? String(key) });
// Animation is irrelevant to the semantics and control behavior under test.
const motion = {
  div: React.forwardRef(({ initial, animate, exit, transition, ...props }, ref) => React.createElement("div", { ...props, ref })),
};
function load(file) {
  if (cache.has(file)) return cache.get(file).exports;
  const module = { exports: {} };
  cache.set(file, module);
  const code = ts.transpileModule(readFileSync(file, "utf8"), {
    fileName: file,
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText;
  function resolve(specifier) {
    if (specifier === "@/context/language-context") return { useLang: () => ({ t: { lang: "en", booking: labels, modal: labels } }) };
    if (specifier === "@/hooks/use-toast") return { useToast: () => ({ toast() {} }) };
    if (specifier === "wouter") return { useLocation: () => ["/", () => {}] };
    if (specifier === "@/lib/analytics") return { trackEvent() {}, analyticsPage: () => "/" };
    if (specifier === "@/lib/gtag") return { gtagEvent() {} };
    if (specifier === "framer-motion") return { motion, AnimatePresence: ({ children }) => children };
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
const { BookingWidget } = load(path.join(root, "src/components/sections/BookingWidget.tsx"));
const { ContactModal } = load(path.join(root, "src/components/sections/ContactModal.tsx"));
const { BookingModal } = load(path.join(root, "src/components/sections/BookingModal.tsx"));
const { BRAND_SCHEMES, applyBrandScheme } = load(path.join(root, "src/lib/brand-schemes.ts"));

test("route inputs have connected labels and both date inputs retain visible keyboard outlines", async () => {
  const client = createRoot(document.getElementById("root"));
  try {
    await act(() => client.render(React.createElement(BookingWidget)));
    const desktop = document.querySelector(".hidden.md\\:flex");
    for (const input of desktop.querySelectorAll('input[type="text"]')) {
      assert(input.id);
      assert.equal(input.labels.length, 1);
      assert(["from", "to"].includes(input.labels[0].textContent));
      assert(input.labels[0].classList.contains("text-gray-600"));
      // Tailwind gray-600 is #4b5563, on the rendered widget's white surface.
      const linear = [75, 85, 99].map(v => ((v / 255 + 0.055) / 1.055) ** 2.4);
      const luminance = linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
      assert(1.05 / (luminance + 0.05) >= 4.5);
    }
    const dates = [...document.querySelectorAll('input[type="date"]')];
    assert.equal(dates.length, 2);
    for (const date of dates) {
      assert(date.labels[0].textContent);
      assert(date.classList.contains("focus-visible:outline-2"));
      assert(date.classList.contains("focus-visible:outline-gray-900"));
    }
  } finally {
    await act(() => client.unmount());
  }
});

test("both public overlays are named modal dialogs with visible consent focus and labelled country search", async () => {
  for (const Modal of [BookingModal, ContactModal]) {
    const client = createRoot(document.getElementById("root"));
    try {
      await act(() => client.render(React.createElement(Modal, { open: true, onClose() {} })));
      const dialog = document.querySelector('[role="dialog"]');
      assert.equal(dialog.getAttribute("aria-modal"), "true");
      const title = document.getElementById(dialog.getAttribute("aria-labelledby"));
      assert(title?.textContent);
      assert(dialog.contains(title));
      const consent = dialog.querySelector('input[type="checkbox"]');
      assert(consent.required);
      assert(consent.classList.contains("peer"));
      assert(consent.nextElementSibling.classList.contains("peer-focus-visible:outline-2"));
      assert(consent.nextElementSibling.classList.contains("peer-focus-visible:outline-gray-900"));
      await act(() => consent.click());
      assert(consent.checked);
      await act(() => dialog.querySelector('[aria-haspopup="listbox"]').click());
      const search = dialog.querySelector('input[placeholder="Search country…"]');
      assert.equal(search.getAttribute("aria-label"), "Search country");
      const setValue = Object.getOwnPropertyDescriptor(dom.window.HTMLInputElement.prototype, "value").set;
      await act(() => { setValue.call(search, "Lith"); search.dispatchEvent(new dom.window.Event("input", { bubbles: true })); });
      assert.equal(search.getAttribute("aria-label"), "Search country");
      assert.match(dialog.textContent, /Lithuania/);
    } finally {
      await act(() => client.unmount());
    }
  }
});

test("both dialogs take focus, contain Tab and Shift+Tab, and restore focus on close", async () => {
  for (const Modal of [BookingModal, ContactModal]) {
    const trigger = document.createElement("button");
    trigger.textContent = "Open form";
    document.body.append(trigger);
    trigger.focus();
    const client = createRoot(document.getElementById("root"));
    let closed = false;
    try {
      await act(() => client.render(React.createElement(Modal, { open: true, onClose() { closed = true; } })));
      const dialog = document.querySelector('[role="dialog"]');
      const first = dialog.querySelector("button");
      assert.equal(document.activeElement, first, "initial focus moves to close button");
      await act(() => document.dispatchEvent(new dom.window.KeyboardEvent("keydown", { key: "Tab", shiftKey: true, bubbles: true, cancelable: true })));
      const last = document.activeElement;
      assert.notEqual(last, first);
      assert(dialog.contains(last));
      await act(() => document.dispatchEvent(new dom.window.KeyboardEvent("keydown", { key: "Tab", bubbles: true, cancelable: true })));
      assert.equal(document.activeElement, first, "Tab wraps to first control");
      await act(() => trigger.focus());
      assert(dialog.contains(document.activeElement), "background focus is redirected");
      await act(() => document.dispatchEvent(new dom.window.KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true })));
      assert(closed, "Escape calls close");
      await act(() => client.render(React.createElement(Modal, { open: false, onClose() {} })));
      assert.equal(document.activeElement, trigger, "focus returns to trigger");
      assert.equal(document.body.style.overflow, "");
    } finally {
      await act(() => client.unmount());
      trigger.remove();
    }
  }
});

function luminance(triple) {
  const [h, s, l] = triple.match(/[\d.]+/g).map(Number);
  const a = s / 100 * Math.min(l / 100, 1 - l / 100);
  const rgb = [0, 8, 4].map(n => {
    const k = (n + h / 30) % 12;
    const c = l / 100 - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
}
function contrast(a, b) {
  const values = [luminance(a), luminance(b)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}
test("runtime text accents pass AA on light surfaces without changing brand fills; muted tags pass AA", () => {
  for (const scheme of BRAND_SCHEMES) {
    applyBrandScheme(scheme.id);
    const css = document.head.textContent;
    const text = css.match(/--primary-on-light:\s*([^;!]+)/)[1];
    for (const surface of ["0 0% 100%", "0 0% 98%"]) {
      assert(contrast(text, surface) >= 4.5, `${scheme.id} against ${surface}`);
    }
    assert(css.includes(`--primary: ${scheme.primary} !important`));
  }
  const css = readFileSync(path.join(root, "src/index.css"), "utf8");
  const light = css.slice(css.indexOf(":root {"), css.indexOf(".dark {"));
  const token = name => light.match(new RegExp(`--${name}:\\s*([^;]+)`))[1];
  assert(contrast(token("muted-foreground"), token("muted")) >= 4.5);
  const widget = readFileSync(path.join(root, "src/components/sections/BookingWidget.tsx"), "utf8");
  assert.match(widget, /const floatingLabel = "[^"]*text-primary-on-light/);
  assert.equal((widget.match(/peer-focus:text-primary-on-light/g) ?? []).length, 4);
});
