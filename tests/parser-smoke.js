const fs = require("node:fs");
const vm = require("node:vm");

function fakeElement() {
  return {
    value: "",
    valueAsDate: null,
    hidden: true,
    textContent: "",
    dataset: {},
    style: {},
    classList: { toggle() {} },
    addEventListener() {},
    setAttribute() {},
    removeAttribute() {},
    append() {},
    replaceChildren() {},
    querySelector() {
      return fakeElement();
    },
  };
}

const store = new Map();
const context = {
  console,
  setTimeout,
  crypto: { randomUUID: () => "test-id" },
  navigator: { userAgent: "Node.js" },
  location: { protocol: "http:" },
  alert() {},
  localStorage: {
    getItem(key) {
      return store.get(key) || null;
    },
    setItem(key, value) {
      store.set(key, value);
    },
  },
  addEventListener() {},
  document: {
    documentElement: {
      dataset: {},
      removeAttribute() {},
    },
    querySelector(selector) {
      if (selector === "#emptyTemplate") {
        return {
          content: {
            firstElementChild: {
              cloneNode() {
                return fakeElement();
              },
            },
          },
        };
      }
      return fakeElement();
    },
    querySelectorAll() {
      return [];
    },
  },
};

context.window = context;
context.matchMedia = () => ({ matches: false });

vm.createContext(context);
vm.runInContext(fs.readFileSync("app.js", "utf8"), context);

const input = [
  "[신한카드] 04/02 09:12 승인 17,000원 NETFLIX 잔액 120,300원",
  "[신한카드] 05/02 09:12 승인금액 17,000원 가맹점 NETFLIX",
  "[신한카드] 06/02 09:12 NETFLIX 17,000원 승인",
  "",
  "[현대카드]",
  "04/05 07:40",
  "쿠팡와우",
  "7,890원 결제",
  "",
  "[현대카드] 05/05 07:41 쿠팡와우 7,890원 결제",
  "[현대카드] 06/05 07:42 쿠팡와우 7,890원 결제",
  "04/09,APPLE.COM/BILL,14900",
  "05/09,APPLE.COM/BILL,14900",
  "06/09,APPLE.COM/BILL,14900",
  '06/10,"ADOBE, CREATIVE CLOUD","24,000",삼성카드',
  "05/15 OPENAI *CHATGPT $20",
  "06/15 OPENAI *CHATGPT $20",
  "06/18 동네마트 43,200원 승인",
  "06/22 카페 5,500원 승인",
].join("\n");

const transactions = context.window.SubscriptionCleaningParser.parseTransactions(input);
const candidates = context.window.SubscriptionCleaningParser.buildCandidates(transactions);

const merchants = candidates.map((candidate) => candidate.merchant).sort();
const required = ["ADOBE CREATIVE CLOUD", "APPLE.COM/BILL", "NETFLIX", "OPENAI *CHATGPT", "쿠팡와우"];

for (const merchant of required) {
  if (!merchants.includes(merchant)) {
    throw new Error(`Missing candidate: ${merchant}\nFound: ${merchants.join(", ")}`);
  }
}

if (transactions.length < 13) {
  throw new Error(`Expected at least 13 transactions, got ${transactions.length}`);
}

const cardGroups = context.window.SubscriptionCleaningParser.summarizeCardGroups(transactions);
const shinhan = cardGroups.find((group) => group.provider === "신한카드");
const hyundai = cardGroups.find((group) => group.provider === "현대카드");
const samsung = cardGroups.find((group) => group.provider === "삼성카드");
const unknown = cardGroups.find((group) => group.provider === "카드 정보 없음");

if (!shinhan || shinhan.count !== 3) {
  throw new Error(`Expected 3 Shinhan transactions, got ${shinhan ? shinhan.count : 0}`);
}

if (!hyundai || hyundai.count !== 3) {
  throw new Error(`Expected 3 Hyundai transactions, got ${hyundai ? hyundai.count : 0}`);
}

if (!samsung || samsung.count !== 1) {
  throw new Error(`Expected 1 Samsung transaction, got ${samsung ? samsung.count : 0}`);
}

if (!unknown || unknown.count < 6) {
  throw new Error(`Expected unknown card group, got ${unknown ? unknown.count : 0}`);
}

if (cardGroups.at(-1).provider !== "카드 정보 없음") {
  throw new Error(`Expected unknown card group last, got ${cardGroups.at(-1).provider}`);
}

const netflix = candidates.find((candidate) => candidate.merchant === "NETFLIX");
const adobe = candidates.find((candidate) => candidate.merchant === "ADOBE CREATIVE CLOUD");
const apple = candidates.find((candidate) => candidate.merchant === "APPLE.COM/BILL");

if (!netflix || netflix.detectedDates.join(",") !== "2026-04-02,2026-05-02,2026-06-02") {
  throw new Error(`Expected Netflix detected dates, got ${netflix ? netflix.detectedDates : "none"}`);
}

if (!adobe || adobe.detectedDates.join(",") !== "2026-06-10") {
  throw new Error(`Expected Adobe single detected date, got ${adobe ? adobe.detectedDates : "none"}`);
}

if (!apple || apple.detectedDates.join(",") !== "2026-04-09,2026-05-09,2026-06-09") {
  throw new Error(`Expected Apple detected dates, got ${apple ? apple.detectedDates : "none"}`);
}

console.log(
  `parser-smoke ok: ${transactions.length} transactions, ${candidates.length} candidates, ${cardGroups.length} card groups`,
);
