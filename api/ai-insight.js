const MAX_MERCHANT_LENGTH = 120;
const ALLOWED_CURRENCIES = new Set(["KRW", "USD", "JPY", "EUR"]);

function jsonResponse(response, status, payload) {
  response.statusCode = status;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.end(JSON.stringify(payload));
}

function normalizeCandidate(value) {
  if (!value || typeof value !== "object") return null;

  const merchant = String(value.merchant || "").trim().slice(0, MAX_MERCHANT_LENGTH);
  const currency = String(value.currency || "KRW").toUpperCase();
  const occurrences = Number(value.occurrences);
  const confidence = Number(value.confidence);

  if (!merchant || !ALLOWED_CURRENCIES.has(currency)) return null;
  if (!Number.isFinite(occurrences) || occurrences < 1 || occurrences > 120) return null;
  if (!Number.isFinite(confidence) || confidence < 0 || confidence > 100) return null;

  return {
    merchant,
    category: String(value.category || "기타").slice(0, 40),
    currency,
    averageAmount: Number.isFinite(Number(value.averageAmount)) ? Number(value.averageAmount) : 0,
    monthlyKrw: Number.isFinite(Number(value.monthlyKrw)) ? Number(value.monthlyKrw) : 0,
    cadence: String(value.cadence || "확인 필요").slice(0, 30),
    nextDate: String(value.nextDate || "").slice(0, 20),
    occurrences,
    confidence,
    detectedDates: Array.isArray(value.detectedDates) ? value.detectedDates.slice(0, 12).map(String) : [],
    cardProviders: Array.isArray(value.cardProviders) ? value.cardProviders.slice(0, 4).map(String) : [],
    status: String(value.status || "unknown").slice(0, 20),
  };
}

function buildInput(candidate) {
  return [
    "당신은 구독청소의 소비 패턴 설명 도우미입니다.",
    "사용자가 붙여넣은 결제 원문은 전달되지 않았고, 아래는 브라우저에서 추출한 요약값입니다.",
    "금융상품 추천, 확정적인 해지 판단, 카드사 조회를 하지 말고 참고용 설명만 작성하세요.",
    "한국어로 다음 4개 항목을 짧게 작성하세요: 판단, 영향, 다음 행동, 주의.",
    "각 항목은 한두 문장 이내로 쓰고, 확인되지 않은 사실이나 해지 링크를 만들어내지 마세요.",
    `요약값: ${JSON.stringify(candidate)}`,
  ].join("\n");
}

function extractOutputText(payload) {
  if (typeof payload.output_text === "string") return payload.output_text.trim();
  const chunks = [];
  for (const item of payload.output || []) {
    for (const content of item.content || []) {
      if (typeof content.text === "string") chunks.push(content.text);
    }
  }
  return chunks.join("\n").trim();
}

async function handler(request, response) {
  if (request.method === "OPTIONS") {
    response.statusCode = 204;
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type");
    response.end();
    return;
  }

  if (request.method !== "POST") {
    jsonResponse(response, 405, { error: "POST 요청만 사용할 수 있습니다." });
    return;
  }

  const candidate = normalizeCandidate(request.body);
  if (!candidate) {
    jsonResponse(response, 400, { error: "유효한 결제 요약값이 필요합니다." });
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    jsonResponse(response, 503, { error: "AI 연결이 아직 설정되지 않았습니다." });
    return;
  }

  try {
    const upstream = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-5-mini",
        store: false,
        input: buildInput(candidate),
        max_output_tokens: 260,
      }),
    });
    const payload = await upstream.json();
    if (!upstream.ok) {
      jsonResponse(response, 502, { error: "AI 서비스에서 응답을 받지 못했습니다." });
      return;
    }

    const insight = extractOutputText(payload);
    if (!insight) {
      jsonResponse(response, 502, { error: "AI 설명이 비어 있습니다." });
      return;
    }

    jsonResponse(response, 200, { insight, source: "openai-responses" });
  } catch {
    jsonResponse(response, 502, { error: "AI 연결 중 잠시 문제가 생겼습니다." });
  }
}

module.exports = handler;
module.exports.normalizeCandidate = normalizeCandidate;
module.exports.buildInput = buildInput;
