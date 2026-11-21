import test from "node:test";
import assert from "node:assert/strict";
import worker, { parseOfficialQueue, fetchBorderQueue } from "./worker.mjs";

const url = "https://comfortline.example";

test("health endpoint is operational", async () => {
  const response = await worker.fetch(new Request(url + "/api/healthz"), {});
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: "ok" });
});

test("unknown API and SEO routes produce real 404s", async () => {
  const api = await worker.fetch(new Request(url + "/api/does-not-exist"), {});
  assert.equal(api.status, 404);
  const page = await worker.fetch(new Request(url + "/not-a-real-route"), {});
  assert.equal(page.status, 404);
  assert.equal(page.headers.get("X-Robots-Tag"), "noindex");
});

test("Instagram without token returns nonconfigured shape", async () => {
  const response = await worker.fetch(new Request(url + "/api/instagram/posts"), {});
  assert.deepEqual(await response.json(), { posts: [], configured: false });
});

test("contact with missing secret fails safely", async () => {
  const response = await worker.fetch(new Request(url + "/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Test", phone: "+1000000", message: "Test inquiry" }),
  }), {});
  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), { ok: false, error: "email_not_configured" });
});

test("booking data is HTML-escaped and sent through Resend", async () => {
  const originalFetch = globalThis.fetch;
  let sent;
  globalThis.fetch = async (requestUrl, init) => {
    assert.equal(requestUrl, "https://api.resend.com/emails");
    assert.equal(init.headers.Authorization, "Bearer test-secret");
    sent = JSON.parse(init.body);
    return new Response(JSON.stringify({ id: "test" }), { status: 200 });
  };
  try {
    const response = await worker.fetch(new Request(url + "/api/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Minsk", to: "Warsaw", lang: "en", phone: "+1000000",
        routeName: "Minsk → Warsaw transfer", planName: "Business van",
        email: "customer@example.com", name: "<script>alert(1)</script>",
      }),
    }), { RESEND_API_KEY: "test-secret" });
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { ok: true });
    assert.equal(sent.to[0], "info@comfortline.by");
    assert.equal(sent.reply_to, "customer@example.com");
    assert.ok(sent.html.includes("Minsk → Warsaw transfer"));
    assert.ok(sent.html.includes("Business van"));
    assert.ok(sent.html.includes("&lt;script&gt;"));
    assert.ok(!sent.html.includes("<script>"));
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("Resend HTTP error never produces a false success", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response("unauthorized", { status: 401 });
  try {
    const response = await worker.fetch(new Request(url + "/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Test", message: "Hello" }),
    }), { RESEND_API_KEY: "invalid" });
    assert.equal(response.status, 502);
    assert.equal((await response.json()).ok, false);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("invalid booking payload is rejected", async () => {
  const response = await worker.fetch(new Request(url + "/api/booking", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ from: "Minsk" }),
  }), { RESEND_API_KEY: "test" });
  assert.equal(response.status, 400);
});

test("public checkpoint summary produces accurate aggregate totals", () => {
  const data = { result: [
    { name: "Брест", countCar: 3, countTruck: 0, countBus: 1, countMotorcycle: 0, countAll: 4, countPriority: 0 },
    { name: "Каменный Лог", countCar: 0, countTruck: 248, countBus: 0, countMotorcycle: 0, countAll: 248, countPriority: 25 },
  ] };
  const parsed = parseOfficialQueue(data);
  assert.equal(parsed.updatedAt, null);
  assert.deepEqual(parsed.checkpoints[0], {
    name: "Брест", cars: 3, trucks: 0, buses: 1, moto: 0, total: 4, priority: 0,
  });
  assert.equal(parsed.checkpoints[1].trucks, 248);
  assert.throws(() => parseOfficialQueue({ result: [] }), /no checkpoint list/);
  const impossible = structuredClone(data);
  impossible.result[0].countAll = 1;
  assert.throws(() => parseOfficialQueue(impossible), /Inconsistent queue total/);
});

test("public summary is preferred before the backup reader", async () => {
  const original = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (target) => {
    calls.push(String(target));
    return new Response(JSON.stringify({ result: [
      { name: "Брест", countCar: 3, countTruck: 0, countBus: 1, countMotorcycle: 0, countAll: 4, countPriority: 0 },
      { name: "Брузги", countCar: 2, countTruck: 0, countBus: 0, countMotorcycle: 0, countAll: 2, countPriority: 0 },
    ] }), { status: 200 });
  };
  try {
    const result = await fetchBorderQueue();
    assert.equal(result.checkpoints.length, 2);
    assert.equal(calls.length, 1);
    assert.match(calls[0], /belarusborder/);
  } finally { globalThis.fetch = original; }
});
