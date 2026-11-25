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

test("account feed mirrors the newest owned videos and serves a byte range", async t => {
  const token = "EAA-test-token";
  let copied = 0;
  const post = { id: "1", username: "transfer_comfortline", media_type: "VIDEO",
    timestamp: "2026-11-20", media_url: "https://cdn.example/1", permalink: "https://www.instagram.com/reel/one/" };
  t.mock.method(globalThis, "fetch", async (input, init) => {
    if (String(input) === post.media_url) return new Response("video");
    assert.equal(init.headers.Authorization, "Bearer " + token);
    assert.equal(new URL(input).origin + new URL(input).pathname, "https://graph.facebook.com/v27.0/17841456791586879/media");
    const page = new URL(input).searchParams.get("after");
    return Response.json(page ? { data: [post] } : { data: [
      { ...post, username: "another_account" }, { ...post, media_type: "IMAGE" }
    ], paging: { next: "next", cursors: { after: "second" } } });
  });
  const bucket = {
    head: async () => null,
    put: async (key, body) => {
      assert.equal(key, "instagram/1.mp4");
      assert.equal(await new Response(body).text(), "video");
      copied++;
    },
    get: async () => ({ body: "vid", size: 5, httpEtag: '"etag"', range: { offset: 0, length: 3 } })
  };
  const env = { INSTAGRAM_ACCESS_TOKEN: token, INSTAGRAM_USER_ID: "17841456791586879", INSTAGRAM_API_VERSION: "v27.0", INSTAGRAM_VIDEOS: bucket };
  const data = await (await worker.fetch(new Request(url + "/api/instagram/posts"), env)).json();
  assert.equal(copied, 1);
  assert.deepEqual(data.posts.map(p => p.media_url), ["/api/instagram/1.mp4"]);
  const video = await worker.fetch(new Request(url + data.posts[0].media_url, { headers: { Range: "bytes=0-2" } }), env);
  assert.equal(video.status, 206);
  assert.equal(video.headers.get("Content-Range"), "bytes 0-2/5");
});
