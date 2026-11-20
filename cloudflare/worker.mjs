// Cloudflare-native API for comfortline.by.
// Static prerendered pages are served from assets; only /api/* executes first.
const EMAIL_TO = "info@comfortline.by";
const EMAIL_FROM = "ComfortLine <noreply@comfortline.by>";
const RESEND_URL = "https://api.resend.com/emails";
const JINA_URL = "https://r.jina.ai/https://mon.declarant.by/%23/zone";
const QUEUE_TTL = 5 * 60 * 1000;
const REFRESH_COOLDOWN = 20 * 1000;
const INSTAGRAM_TTL = 6 * 60 * 60 * 1000;

let queueCache = null;
let queueInFlight = null;
let instagramCache = null;
let instagramInFlight = null;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });
}

function field(value, limit = 1000) {
  return String(value == null ? "" : value).slice(0, limit);
}

function escapeHtml(value) {
  return field(value, 4000).replace(/[&<>"']/g, (ch) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]
  );
}

async function readForm(request) {
  const input = await request.text();
  if (input.length > 16000) throw new Error("payload_too_large");
  const type = request.headers.get("content-type") || "";
  if (type.includes("application/json")) {
    const value = JSON.parse(input);
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      throw new Error("invalid_payload");
    }
    return value;
  }
  if (type.includes("application/x-www-form-urlencoded")) {
    return Object.fromEntries(new URLSearchParams(input));
  }
  throw new Error("unsupported_content_type");
}

function makeEmailTable(rows, isRu, heading) {
  const trs = rows.map(([label, value], i) => {
    const background = i % 2 === 0 ? ' style="background:#f9f9f9"' : "";
    return "<tr" + background + '><td style="padding:10px 16px;font-weight:bold;border:1px solid #eee;width:40%">' +
      escapeHtml(label) + '</td><td style="padding:10px 16px;border:1px solid #eee;white-space:pre-wrap">' +
      escapeHtml(value || "—") + "</td></tr>";
  }).join("");
  return '<div style="font-family:sans-serif;max-width:620px;margin:auto;color:#1a1a1a">' +
    '<h2 style="color:#B59C73;border-bottom:2px solid #B59C73;padding-bottom:8px">' +
    escapeHtml(heading) + '</h2><table style="width:100%;border-collapse:collapse">' +
    trs + '</table><p style="margin-top:24px;color:#888;font-size:12px">' +
    'ComfortLine Transfer — comfortline.by</p></div>';
}

async function sendMail(env, subject, html, email) {
  if (!env.RESEND_API_KEY) return json({ ok: false, error: "email_not_configured" }, 503);
  const payload = {
    from: EMAIL_FROM,
    to: [EMAIL_TO],
    subject: field(subject, 200),
    html,
  };
  const reply = field(email, 254).trim();
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reply)) payload.reply_to = reply;
  let response;
  try {
    response = await fetch(RESEND_URL, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + env.RESEND_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error("Resend network error", String(err));
    return json({ ok: false, error: "email_delivery_failed" }, 502);
  }
  if (!response.ok) {
    console.error("Resend rejected message", response.status);
    return json({ ok: false, error: "email_delivery_failed" }, 502);
  }
  return json({ ok: true });
}

async function handleForm(request, env, kind) {
  let data;
  try {
    data = await readForm(request);
  } catch (err) {
    return json({ ok: false, error: String(err).includes("payload_too_large") ? "payload_too_large" : "invalid_payload" }, 400);
  }
  const ru = data.lang === "ru";
  if (kind === "contact") {
    const name = field(data.name);
    const phone = field(data.phone);
    const email = field(data.email);
    const message = field(data.message, 4000);
    if (!name && !phone && !email && !message) return json({ ok: false, error: "missing_details" }, 400);
    const html = makeEmailTable([
      [ru ? "Имя" : "Name", name],
      [ru ? "Телефон" : "Phone", phone],
      ["Email", email],
      [ru ? "Сообщение" : "Message", message],
    ], ru, ru ? "Новое обращение с сайта" : "New Contact Form Submission");
    return sendMail(env, ru ? "Новое сообщение с сайта от " + (name || "—") :
      "New contact message from " + (name || "—"), html, email);
  }
  const from = field(data.from);
  const to = field(data.to);
  const email = field(data.email);
  const phone = field(data.phone);
  if (!from || !to || (!email && !phone)) return json({ ok: false, error: "missing_details" }, 400);
  const classes = {
    any: ru ? "Любой" : "Any",
    comfort: ru ? "Комфорт" : "Comfort",
    business: ru ? "Бизнес" : "Business",
    premium: ru ? "Премиум" : "Premium",
  };
  const rows = [
    [ru ? "Откуда" : "From", from],
    [ru ? "Куда" : "To", to],
    [ru ? "Дата" : "Date", field(data.date)],
    [ru ? "Взрослые" : "Adults", field(data.adults == null ? 1 : data.adults)],
    [ru ? "Дети (2–12 лет)" : "Children (2–12)", field(data.children == null ? 0 : data.children)],
    [ru ? "Младенцы" : "Babies", field(data.babies == null ? 0 : data.babies)],
    [ru ? "Питомцы" : "Pets", field(data.pets == null ? 0 : data.pets)],
    [ru ? "Чемоданы" : "Suitcases", field(data.suitcases == null ? 1 : data.suitcases)],
    [ru ? "Класс" : "Class", classes[data.vehicleClass] || field(data.vehicleClass)],
    [ru ? "Имя" : "Name", field(data.name)],
    [ru ? "Телефон" : "Phone", phone],
    ["Email", email],
    [ru ? "Комментарий" : "Comment", field(data.comment, 4000)],
  ];
  const html = makeEmailTable(rows, ru, ru ? "Новая заявка на трансфер" : "New Transfer Request");
  const subject = (ru ? "Новая заявка на трансфер: " : "New transfer request: ") + from + " → " + to;
  return sendMail(env, subject, html, email);
}

function toMinskTime(value) {
  const m = value.match(/^(\d{2})\.(\d{2})\.(\d{4})\s*\|\s*(\d{2}):(\d{2})$/);
  if (!m) return value;
  const ms = Date.UTC(Number(m[3]), Number(m[2]) - 1, Number(m[1]), Number(m[4]), Number(m[5])) + 10800000;
  const d = new Date(ms);
  const pad = (n) => String(n).padStart(2, "0");
  return pad(d.getUTCDate()) + "." + pad(d.getUTCMonth() + 1) + "." + d.getUTCFullYear() +
    " | " + pad(d.getUTCHours()) + ":" + pad(d.getUTCMinutes());
}

function parseQueue(markdown) {
  let updatedAt = null;
  const checkpoints = [];
  for (const line of markdown.split("\n").map((s) => s.trim())) {
    const status = line.match(/По состоянию на:\s*(.+)/);
    if (status) { updatedAt = toMinskTime(status[1].trim()); continue; }
    if (!line.startsWith("|")) continue;
    const cells = line.split("|").map((s) => s.trim()).filter(Boolean);
    if (cells.length !== 7 || cells[0] === "Название" || cells.every((x) => /^-+$/.test(x))) continue;
    const [name, cars, trucks, buses, moto, total, priority] = cells;
    checkpoints.push({ name, cars: Number(cars) || 0, trucks: Number(trucks) || 0,
      buses: Number(buses) || 0, moto: Number(moto) || 0, total: Number(total) || 0,
      priority: Number(priority) || 0 });
  }
  return { updatedAt, checkpoints };
}

async function fetchBorderQueue() {
  const res = await fetch(JINA_URL, {
    headers: { "x-wait-for-selector": "tbody tr", "x-no-cache": "true", "x-timeout": "25" },
  });
  if (!res.ok) throw new Error("Queue upstream HTTP " + res.status);
  const parsed = parseQueue(await res.text());
  if (!parsed.checkpoints.length) throw new Error("No queue checkpoints parsed");
  return parsed;
}

async function handleQueue(url) {
  const now = Date.now();
  const force = ["1", "true"].includes(url.searchParams.get("force")) &&
    (!queueCache || now - queueCache.fetchedAt >= REFRESH_COOLDOWN);
  if (!force && queueCache && now - queueCache.fetchedAt < QUEUE_TTL) {
    return json({ ...queueCache.data, fetchedAt: new Date(queueCache.fetchedAt).toISOString(), stale: false, error: false });
  }
  try {
    if (!queueInFlight) queueInFlight = fetchBorderQueue().finally(() => { queueInFlight = null; });
    const data = await queueInFlight;
    queueCache = { fetchedAt: now, data };
    return json({ ...data, fetchedAt: new Date(now).toISOString(), stale: false, error: false });
  } catch (err) {
    console.warn("Border queue upstream failed", String(err));
    if (queueCache) return json({
      ...queueCache.data, fetchedAt: new Date(queueCache.fetchedAt).toISOString(), stale: true, error: false,
    });
    return json({ updatedAt: null, fetchedAt: new Date(now).toISOString(), checkpoints: [], stale: false, error: true });
  }
}

async function fetchInstagram(token) {
  const url = new URL("https://graph.instagram.com/me/media");
  url.searchParams.set("fields", "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp");
  url.searchParams.set("limit", "12");
  url.searchParams.set("access_token", token);
  const response = await fetch(url);
  const body = await response.json();
  if (!response.ok || body.error) throw new Error("Instagram Graph request failed");
  return body.data || [];
}

async function handleInstagram(env) {
  if (!env.INSTAGRAM_ACCESS_TOKEN) return json({ posts: [], configured: false });
  const now = Date.now();
  if (instagramCache && now - instagramCache.fetchedAt < INSTAGRAM_TTL) {
    return json({ posts: instagramCache.posts, configured: true, cached: true });
  }
  try {
    if (!instagramInFlight) instagramInFlight = fetchInstagram(env.INSTAGRAM_ACCESS_TOKEN)
      .finally(() => { instagramInFlight = null; });
    const posts = await instagramInFlight;
    instagramCache = { fetchedAt: now, posts };
    return json({ posts, configured: true, cached: false });
  } catch (err) {
    console.warn("Instagram upstream failed", String(err));
    if (instagramCache) return json({ posts: instagramCache.posts, configured: true, cached: true, stale: true });
    return json({ posts: [], configured: true, error: true });
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method.toUpperCase();
    if (path === "/api/healthz" && method === "GET") return json({ status: "ok" });
    if (path === "/api/booking" && method === "POST") return handleForm(request, env, "booking");
    if (path === "/api/contact" && method === "POST") return handleForm(request, env, "contact");
    if (path === "/api/border-queue" && method === "GET") return handleQueue(url);
    if (path === "/api/instagram/posts" && method === "GET") return handleInstagram(env);
    if (path.startsWith("/api/")) return json({ error: "not_found" }, 404);
    // Called on static asset misses only; avoid soft 404s on unknown SEO routes.
    return new Response("<!doctype html><html><head><meta name=\"robots\" content=\"noindex\"></head>" +
      "<body><h1>404 — Page not found</h1><a href=\"/\">ComfortLine</a></body></html>", {
      status: 404,
      headers: { "Content-Type": "text/html; charset=utf-8", "X-Robots-Tag": "noindex" },
    });
  },
};
