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

function runHandler(body) {
  const response = responseStub();
  return handler({ method: "POST", body }, response).then(() => ({ response, payload: JSON.parse(response.body) }));
}

async function run() {
  const candidates = [
    {
      key: "netflix",
      merchant: "Netflix",
      canonicalMerchant: "Netflix",
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
      raw: "카드번호 1234 5678 1234 5678 전화번호 010-1234-5678 user@example.com",
    },
    {
      key: "apple",
      merchant: "Apple",
      canonicalMerchant: "Apple",
      category: "AI 도구",
      currency: "KRW",
      averageAmount: 14900,
      monthlyKrw: 14900,
      annualKrw: 178800,
      cadence: "월간",
      occurrences: 3,
      confidence: 96,
      status: "keep",
      priorityScore: 10,
      priorityRank: 2,
    },
  ];

  assert.equal(handler.normalizeCandidates({ candidates }).length, 2);
  assert.equal(handler.normalizeCandidate({ merchant: "", currency: "KRW", occurrences: 1, confidence: 50 }), null);
  assert.equal(handler.normalizeGeminiModel("Gemini 3.6 Flash"), "gemini-3.6-flash");
  assert.equal(handler.normalizeGeminiModel("models/gemini-2.5-flash"), "gemini-2.5-flash");

  const input = handler.buildInput(candidates);
  assert.match(input, /최소 요약값 배열/);
  assert.match(input, /Netflix/);
  assert.match(input, /Apple/);
  assert.doesNotMatch(input, /NETFLIX/);
  assert.doesNotMatch(input, /신한카드/);
  assert.doesNotMatch(input, /2026-04-02/);
  assert.doesNotMatch(input, /1234 5678/);
  assert.doesNotMatch(input, /010-1234-5678/);
  assert.doesNotMatch(input, /user@example.com/);

  const oldKey = process.env.GEMINI_API_KEY;
  const oldModel = process.env.GEMINI_MODEL;
  const oldFetch = global.fetch;
  process.env.GEMINI_API_KEY = "test-gemini-key";
  process.env.GEMINI_MODEL = "Gemini 3.6 Flash";

  global.fetch = async (url, options) => {
    assert.equal(url, "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent");
    assert.equal(options.headers["x-goog-api-key"], "test-gemini-key");
    const body = JSON.parse(options.body);
    assert.equal(body.generationConfig.responseMimeType, "application/json");
    assert.equal(body.generationConfig.responseSchema.type, "ARRAY");
    assert.equal(body.contents[0].parts[0].text.includes("user@example.com"), false);
    assert.equal(body.contents[0].parts[0].text.includes("신한카드"), false);
    return {
      ok: true,
      async json() {
        return {
          candidates: [{
            content: {
              parts: [{
                text: JSON.stringify([
                    {
                      merchantCategory: "Netflix / OTT",
                      candidateReason: "최근 3회 월간 반복 결제가 확인됩니다.",
                      priority: "모름 상태의 참고 우선순위 1위입니다.",
                      savings: "월 17,000원, 1년 204,000원입니다.",
                      nextAction: "다음 결제 전 실제 이용 여부를 확인하세요.",
                      caution: "금융 조언이 아닌 참고 정보입니다.",
                    },
                    {
                      merchantCategory: "Apple / AI 도구",
                      candidateReason: "최근 3회 반복 결제가 확인됩니다.",
                      priority: "유지 상태라 해지를 권하지 않습니다.",
                      savings: "월 14,900원, 1년 178,800원입니다.",
                      nextAction: "현재 이용 상태를 계속 확인하세요.",
                      caution: "금융 조언이 아닌 참고 정보입니다.",
                    },
                ]),
              }],
            },
          }],
        };
      },
    };
  };

  const success = await runHandler({ candidates });
  assert.equal(success.response.statusCode, 200);
  assert.equal(success.payload.source, "gemini-generateContent");
  assert.equal(success.payload.insights.length, 2);
  assert.match(success.payload.insights[0], /Netflix \/ OTT/);
  assert.match(success.payload.insights[1], /178,800원/);

  global.fetch = async () => ({ ok: false, status: 429, async json() { return { error: { message: "private upstream detail" } }; } });
  const rateLimited = await runHandler({ candidates });
  assert.equal(rateLimited.response.statusCode, 502);
  assert.equal(rateLimited.payload.error, "AI 서비스에서 응답을 받지 못했습니다.");
  assert.doesNotMatch(rateLimited.response.body, /private upstream detail|429/);

  global.fetch = async () => ({ ok: true, async json() { return { candidates: [{ content: { parts: [{ text: "not json" }] } }] }; } });
  const invalidJson = await runHandler({ candidates });
  assert.equal(invalidJson.response.statusCode, 502);
  assert.equal(invalidJson.payload.error, "AI 응답을 해석하지 못했습니다.");

  delete process.env.GEMINI_API_KEY;
  const noKey = await runHandler({ candidates });
  assert.equal(noKey.response.statusCode, 503);
  assert.equal(noKey.payload.error, "AI 연결이 아직 설정되지 않았습니다.");
  assert.doesNotMatch(noKey.response.body, /test-gemini-key/);

  global.fetch = oldFetch;
  if (oldKey === undefined) delete process.env.GEMINI_API_KEY;
  else process.env.GEMINI_API_KEY = oldKey;
  if (oldModel === undefined) delete process.env.GEMINI_MODEL;
  else process.env.GEMINI_MODEL = oldModel;
  console.log("ai-insight-smoke ok");
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
