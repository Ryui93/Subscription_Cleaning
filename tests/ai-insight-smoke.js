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
    merchant: "Netflix",
    canonicalMerchant: "netflix",
    originalMerchants: ["NETFLIX", "넷플릭스"],
    category: "OTT",
    currency: "KRW",
    averageAmount: 17000,
    monthlyKrw: 17000,
    annualKrw: 204000,
    cadence: "월간",
    nextDate: "2026-07-02",
    occurrences: 3,
    confidence: 96,
    detectedDates: ["2026-04-02", "2026-05-02", "2026-06-02"],
    cardProviders: ["신한카드"],
    status: "unknown",
    priorityScore: 59,
    priorityRank: 1,
  };

  assert.equal(handler.normalizeCandidate(candidate).merchant, "Netflix");
  assert.equal(handler.normalizeCandidate({ merchant: "", currency: "KRW", occurrences: 1, confidence: 50 }), null);
  assert.match(handler.buildInput(candidate), /결제 원문은 전달되지 않았고/);
  assert.match(handler.buildInput(candidate), /canonicalMerchant와 merchant는 브라우저 규칙이 통합한 표시명/);
  assert.match(handler.buildInput(candidate), /자동결제 후보 설명, 해지 우선순위, 절약액, 다음 행동/);
  assert.doesNotMatch(handler.buildInput({ ...candidate, merchant: "010-1234-5678 카드번호 1234 5678 1234 5678" }), /010-1234/);

  const oldKey = process.env.OPENAI_API_KEY;
  const oldFetch = global.fetch;
  process.env.OPENAI_API_KEY = "test-key";
  global.fetch = async (_url, options) => {
    const body = JSON.parse(options.body);
    assert.equal(body.store, false);
    assert.equal(body.input.includes("Netflix"), true);
    assert.equal(body.input.includes('"raw"'), false);
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
