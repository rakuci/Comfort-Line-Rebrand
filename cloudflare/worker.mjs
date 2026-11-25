// Cloudflare-native API for comfortline.by.
// Static prerendered pages are served from assets; only /api/* executes first.
const EMAIL_TO = "info@comfortline.by";
const EMAIL_FROM = "ComfortLine <noreply@comfortline.by>";
const RESEND_URL = "https://api.resend.com/emails";
// Public aggregate checkpoint data endpoint used by the official monitor.
// Do not fetch vehicle registrations, phone numbers or other personal data.
const QUEUE_AGGREGATES_URL = "https://belarusborder.by/info/checkpoint?token=bts47d5f-6420-4f74-8f78-42e8e4370cc4";
const JINA_URL = "https://r.jina.ai/https://mon.declarant.by/%23/zone"; // fallback
const QUEUE_TTL = 5 * 60 * 1000;
const QUEUE_MAX_STALE = 45 * 60 * 1000;
const REFRESH_COOLDOWN = 20 * 1000;
const INSTAGRAM_TTL = 15 * 60 * 1000;

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
    ...(data.routeName ? [[ru ? "Маршрут / предложение" : "Route offer", field(data.routeName)]] : []),
    ...(data.planName ? [[ru ? "Выбранный вариант" : "Selected plan", field(data.planName)]] : []),
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

// The official checkpoint-summary API returns counts for each category.
// Parse only aggregate counters, never pass through personal or unrelated fields.
function nonNegativeCount(value) {
  if (typeof value === "number" && Number.isSafeInteger(value) && value >= 0) return value;
  if (typeof value === "string" && /^\d+$/.test(value)) {
    const n = Number(value);
    if (Number.isSafeInteger(n)) return n;
  }
  throw new Error("Invalid queue count");
}

export function parseOfficialQueue(payload) {
  if (!Array.isArray(payload?.result) || payload.result.length < 2) {
    throw new Error("Official queue has no checkpoint list");
  }
  const names = new Set();
  const checkpoints = payload.result.map((cp) => {
    if (typeof cp?.name !== "string" || !cp.name.trim() || names.has(cp.name)) {
      throw new Error("Invalid or duplicated queue checkpoint");
    }
    names.add(cp.name);
    const cars = nonNegativeCount(cp.countCar);
    const trucks = nonNegativeCount(cp.countTruck);
    const buses = nonNegativeCount(cp.countBus);
    const moto = nonNegativeCount(cp.countMotorcycle);
    const total = nonNegativeCount(cp.countAll);
    const priority = nonNegativeCount(cp.countPriority);
    if (total < cars + trucks + buses + moto) throw new Error("Inconsistent queue total");
    return { name: cp.name.trim(), cars, trucks, buses, moto, total, priority };
  });
  // The public summary does not specify the last upstream update timestamp:
  // never present the request time as an authoritative source-update time.
  return { updatedAt: null, checkpoints };
}

export async function fetchBorderQueue() {
  try {
    const response = await fetch(QUEUE_AGGREGATES_URL, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) throw new Error("Official queue HTTP " + response.status);
    return parseOfficialQueue(await response.json());
  } catch (error) {
    console.warn("Official aggregate queue failed; trying backup reader", String(error));
    const response = await fetch(JINA_URL, {
      headers: { "x-wait-for-selector": "tbody tr", "x-no-cache": "true", "x-timeout": "12" },
      signal: AbortSignal.timeout(13_000),
    });
    if (!response.ok) throw new Error("Queue backup HTTP " + response.status);
    const parsed = parseQueue(await response.text());
    if (!parsed.checkpoints.length) throw new Error("No queue checkpoints parsed by backup");
    return parsed;
  }
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
    if (queueCache && now - queueCache.fetchedAt < QUEUE_MAX_STALE) return json({
      ...queueCache.data, fetchedAt: new Date(queueCache.fetchedAt).toISOString(), stale: true, error: false,
    });
    return json({ updatedAt: null, fetchedAt: new Date(now).toISOString(), checkpoints: [], stale: false, error: true });
  }
}

async function fetchInstagram(env) {
  const token = env.INSTAGRAM_ACCESS_TOKEN.trim();
  const version = env.INSTAGRAM_API_VERSION || "v27.0";
  const user = env.INSTAGRAM_USER_ID || "me";
  const facebookLogin = token.startsWith("EAA");
  if (!/^v\d+\.\d+$/.test(version) || !(user === "me" || /^\d+$/.test(user)) ||
      (facebookLogin && user === "me")) throw new Error("account_configuration");
  const host = facebookLogin ? "graph.facebook.com" : "graph.instagram.com";
  const url = new URL(`https://${host}/${version}/${user}/media`);
  url.searchParams.set("fields", "id,username,caption,media_type,media_url,thumbnail_url,permalink,timestamp");
  url.searchParams.set("limit", "50");
  const posts = new Map();
  for (let page = 0; page < 5; page++) {
    const response = await fetch(url, { headers: { Authorization: "Bearer " + token } });
    const body = await response.json();
    if (!response.ok || body.error) {
      const code = body.error?.code;
      const subcode = body.error?.error_subcode;
      throw new Error(Number.isInteger(code)
        ? `meta_${code}${Number.isInteger(subcode) ? "_" + subcode : ""}` : "upstream_error");
    }
    if (!Array.isArray(body.data)) throw new Error("Missing Instagram media");
    for (const post of body.data) {
      if (post.username?.toLowerCase() !== "transfer_comfortline" || post.media_type !== "VIDEO" ||
          !/^\d+$/.test(post.id) || !post.media_url?.startsWith("https://")) continue;
      posts.set(post.id, post);
    }
    if (posts.size >= 12 || !body.paging?.next || !body.paging.cursors?.after) break;
    url.searchParams.set("after", body.paging.cursors.after);
  }
  return [...posts.values()].sort((a, b) => b.timestamp.localeCompare(a.timestamp)).slice(0, 12);
}

// Only mark a video as locally available after its complete object was written.
async function mirrorInstagram(posts, bucket) {
  if (!bucket) return posts;
  return Promise.all(posts.map(async post => {
    const key = "instagram/" + post.id + ".mp4";
    try {
      if (!(await bucket.head(key))) {
        const video = await fetch(post.media_url);
        if (!video.ok || !video.body) return post;
        await bucket.put(key, video.body, { httpMetadata: { contentType: "video/mp4" } });
      }
      return { ...post, media_url: "/api/" + key };
    } catch {
      return post;
    }
  }));
}

async function serveInstagramVideo(request, bucket, key) {
  if (!bucket) return new Response(null, { status: 404 });
  const obj = await bucket.get(key, { range: request.headers });
  if (!obj) return new Response(null, { status: 404 });
  const headers = new Headers({ "Content-Type": "video/mp4", "Accept-Ranges": "bytes",
    "Cache-Control": "public, max-age=3600", ETag: obj.httpEtag });
  if (obj.range && "offset" in obj.range && "length" in obj.range) {
    const { offset, length } = obj.range;
    headers.set("Content-Range", `bytes ${offset}-${offset + length - 1}/${obj.size}`);
    headers.set("Content-Length", String(length));
    return new Response(obj.body, { status: 206, headers });
  }
  headers.set("Content-Length", String(obj.size));
  return new Response(obj.body, { headers });
}

async function handleInstagram(env) {
  if (!env.INSTAGRAM_ACCESS_TOKEN) return json({ posts: [], configured: false });
  const now = Date.now();
  if (instagramCache && now - instagramCache.fetchedAt < INSTAGRAM_TTL) {
    return json({ posts: instagramCache.posts, configured: true, cached: true });
  }
  try {
    if (!instagramInFlight) instagramInFlight = fetchInstagram(env)
      .then(posts => mirrorInstagram(posts, env.INSTAGRAM_VIDEOS))
      .finally(() => { instagramInFlight = null; });
    const posts = await instagramInFlight;
    instagramCache = { fetchedAt: now, posts };
    return json({ posts, configured: true, cached: false });
  } catch (err) {
    console.warn("Instagram upstream failed", String(err));
    if (instagramCache) return json({ posts: instagramCache.posts, configured: true, cached: true, stale: true });
    const reason = /^(account_configuration|meta_\d+(?:_\d+)?)$/.test(err?.message) ? err.message : "upstream_error";
    return json({ posts: [], configured: true, error: true, reason });
  }
}

let eurRate = null;
async function handleEurRate() {
  const day = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Minsk", year: "numeric", month: "2-digit", day: "2-digit",
  }).format(new Date());
  if (eurRate?.date === day) return json(eurRate);
  try {
    const response = await fetch("https://api.nbrb.by/exrates/rates/EUR?parammode=2&ondate=" + day, {
      signal: AbortSignal.timeout(5000), cf: { cacheEverything: true, cacheTtl: 3600 },
    });
    if (!response.ok) throw new Error("rate unavailable");
    const row = await response.json();
    if (row.Cur_Abbreviation !== "EUR" || row.Date?.slice(0, 10) !== day ||
        row.Cur_Scale !== 1 || !Number.isFinite(row.Cur_OfficialRate) || row.Cur_OfficialRate <= 0) {
      throw new Error("invalid rate");
    }
    eurRate = { date: day, bynPerEur: row.Cur_OfficialRate };
    return json(eurRate);
  } catch {
    return eurRate ? json(eurRate) : json({ error: "rate_unavailable" }, 503);
  }
}

export default {
  async scheduled(_event, env, ctx) {
    if (env.INSTAGRAM_ACCESS_TOKEN && env.INSTAGRAM_VIDEOS) ctx.waitUntil(handleInstagram(env));
  },
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method.toUpperCase();
    if (path === "/api/eur-rate" && method === "GET") return handleEurRate();
    if (path === "/api/healthz" && method === "GET") return json({ status: "ok" });
    if (path === "/api/booking" && method === "POST") return handleForm(request, env, "booking");
    if (path === "/api/contact" && method === "POST") return handleForm(request, env, "contact");
    if (path === "/api/border-queue" && method === "GET") return handleQueue(url);
    if (method === "GET" && /^\/api\/instagram\/\d+\.mp4$/.test(path)) return serveInstagramVideo(request, env.INSTAGRAM_VIDEOS, path.slice(5));
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
