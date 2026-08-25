const assert = require("node:assert/strict");
const handler = require("../api/ai-insight.js");

function responseStub() {
  return {
    statusCode: 200,
    headers: {},
    body: "",
    setHeader(name, value) {
      this.headers[name] = value;
    },
    end(value) {
      this.body = value || "";
    },
  };
}

async function run() {
  const candidate = {
    merchant: "NETFLIX",
    category: "콘텐츠",
    currency: "KRW",
    averageAmount: 17000,
    monthlyKrw: 17000,
    cadence: "월간",
    nextDate: "2026-07-02",
    occurrences: 3,
    confidence: 96,
    detectedDates: ["2026-04-02", "2026-05-02", "2026-06-02"],
    cardProviders: ["신한카드"],
    status: "unknown",
  };

  assert.equal(handler.normalizeCandidate(candidate).merchant, "NETFLIX");
  assert.equal(handler.normalizeCandidate({ merchant: "", currency: "KRW", occurrences: 1, confidence: 50 }), null);
  assert.match(handler.buildInput(candidate), /결제 원문은 전달되지 않았고/);

  const oldKey = process.env.OPENAI_API_KEY;
  const oldFetch = global.fetch;
  process.env.OPENAI_API_KEY = "test-key";
  global.fetch = async (_url, options) => {
    const body = JSON.parse(options.body);
    assert.equal(body.store, false);
    assert.equal(body.input.includes("NETFLIX"), true);
    return {
      ok: true,
      async json() {
        return { output_text: "판단: 반복 결제 후보입니다.\n영향: 월 17,000원입니다." };
      },
    };
  };

  const response = responseStub();
  await handler({ method: "POST", body: candidate }, response);
  assert.equal(response.statusCode, 200);
  assert.match(response.body, /반복 결제 후보/);

  global.fetch = oldFetch;
  if (oldKey === undefined) delete process.env.OPENAI_API_KEY;
  else process.env.OPENAI_API_KEY = oldKey;
  console.log("ai-insight-smoke ok");
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
