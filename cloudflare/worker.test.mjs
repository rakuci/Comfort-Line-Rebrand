import test from "node:test";
import assert from "node:assert/strict";
import worker from "./worker.mjs";

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
