(function () {
  const STORAGE_KEY = "subscription-cleaning:v1";
  const FEEDBACK_KEY = "subscription-cleaning:feedback:v1";
  const THEME_KEY = "subscription-cleaning:theme";
  const today = new Date();
  let deferredInstallPrompt = null;

  const categoryRules = [
    {
      id: "media",
      label: "콘텐츠",
      words: ["NETFLIX", "YOUTUBE", "DISNEY", "TVING", "WAVVE", "WATCHA", "SPOTIFY", "멜론", "지니"],
    },
    {
      id: "software",
      label: "소프트웨어",
      words: ["OPENAI", "CHATGPT", "ANTHROPIC", "CLAUDE", "ADOBE", "NOTION", "GOOGLE", "MICROSOFT", "APPLE.COM"],
    },
    {
      id: "shopping",
      label: "멤버십",
      words: ["쿠팡", "COUPANG", "와우", "NAVER", "네이버", "컬리", "마켓컬리"],
    },
    {
      id: "finance",
      label: "금융/보험",
      words: ["보험", "생명", "손해", "카드", "대출", "적금"],
    },
    {
      id: "life",
      label: "생활",
      words: ["헬스", "필라테스", "요가", "정수기", "렌탈", "통신", "SKT", "KT", "LGU"],
    },
  ];

  const cardProviderWords = [
    "KB국민카드",
    "국민카드",
    "신한카드",
    "삼성카드",
    "현대카드",
    "롯데카드",
    "우리카드",
    "하나카드",
    "비씨카드",
    "BC카드",
    "농협카드",
    "NH카드",
    "카카오뱅크",
    "토스뱅크",
    "카카오페이",
    "네이버페이",
    "페이북",
    "PAYCO",
    "페이코",
  ];
  const noiseWords = [
    "승인",
    "승인금액",
    "승인번호",
    "결제",
    "결제금액",
    "이용",
    "이용금액",
    "사용",
    "출금",
    "일시불",
    "체크",
    "카드",
    "가맹점",
    "잔액",
    "누적",
    "한도",
    "국내",
    "해외",
    "원화",
    "알림",
    "고객",
    "회원",
    "님",
  ];
  const ignoredRecordPattern = /취소|승인취소|결제취소|환불|거절|실패|오류/;
  const UNKNOWN_PROVIDER = "카드 정보 없음";
  const cardProviderPattern = new RegExp(cardProviderWords.sort((a, b) => b.length - a.length).map(escapeRegex).join("|"), "gi");
  const noiseWordPattern = new RegExp(noiseWords.sort((a, b) => b.length - a.length).map(escapeRegex).join("|"), "gi");
  const subscriptionKeywords = categoryRules.flatMap((rule) => rule.words).map((word) => word.toUpperCase());
  const filterLabels = {
    all: "전체",
    keep: "유지",
    cancel: "해지예정",
    unknown: "모름",
  };
  const state = loadState();
  const feedbackState = {
    entries: loadFeedback(),
  };

  const elements = {
    input: document.querySelector("#paymentInput"),
    analyzeButton: document.querySelector("#analyzeButton"),
    sampleButton: document.querySelector("#sampleButton"),
    installButton: document.querySelector("#installButton"),
    themeButton: document.querySelector("#themeButton"),
    resetButton: document.querySelector("#resetButton"),
    manualToggleButton: document.querySelector("#manualToggleButton"),
    manualForm: document.querySelector("#manualForm"),
    manualDate: document.querySelector("#manualDate"),
    manualMerchant: document.querySelector("#manualMerchant"),
    manualAmount: document.querySelector("#manualAmount"),
    manualCurrency: document.querySelector("#manualCurrency"),
    goalForm: document.querySelector("#goalForm"),
    goalInput: document.querySelector("#goalInput"),
    goalSavedAmount: document.querySelector("#goalSavedAmount"),
    goalStatusText: document.querySelector("#goalStatusText"),
    goalProgressBar: document.querySelector("#goalProgressBar"),
    cancelFocusButton: document.querySelector("#cancelFocusButton"),
    reportArea: document.querySelector("#reportArea"),
    monthlyTotal: document.querySelector("#monthlyTotal"),
    candidateCount: document.querySelector("#candidateCount"),
    cancelCount: document.querySelector("#cancelCount"),
    cardSummary: document.querySelector("#cardSummary"),
    cancelSummary: document.querySelector("#cancelSummary"),
    subscriptionList: document.querySelector("#subscriptionList"),
    transactionList: document.querySelector("#transactionList"),
    transactionCount: document.querySelector("#transactionCount"),
    feedbackForm: document.querySelector("#feedbackForm"),
    feedbackType: document.querySelector("#feedbackType"),
    feedbackName: document.querySelector("#feedbackName"),
    feedbackContact: document.querySelector("#feedbackContact"),
    feedbackMessage: document.querySelector("#feedbackMessage"),
    feedbackList: document.querySelector("#feedbackList"),
    feedbackCount: document.querySelector("#feedbackCount"),
    clearFeedbackButton: document.querySelector("#clearFeedbackButton"),
    exportDataButton: document.querySelector("#exportDataButton"),
    clearAllDataButton: document.querySelector("#clearAllDataButton"),
    saveState: document.querySelector("#saveState"),
    emptyTemplate: document.querySelector("#emptyTemplate"),
  };

  elements.input.value = state.inputText;
  elements.manualDate.valueAsDate = today;
  applyTheme(loadTheme());

  elements.analyzeButton.addEventListener("click", analyzeInput);
  elements.sampleButton.addEventListener("click", fillSample);
  elements.installButton.addEventListener("click", installApp);
  elements.themeButton.addEventListener("click", toggleTheme);
  elements.resetButton.addEventListener("click", resetAll);
  elements.manualToggleButton.addEventListener("click", toggleManualForm);
  elements.manualForm.addEventListener("submit", addManualTransaction);
  elements.goalForm.addEventListener("submit", saveSavingGoal);
  elements.cancelFocusButton.addEventListener("click", toggleCancelFocus);
  elements.feedbackForm.addEventListener("submit", addFeedback);
  elements.feedbackList.addEventListener("click", handleFeedbackClick);
  elements.clearFeedbackButton.addEventListener("click", clearFeedback);
  elements.exportDataButton.addEventListener("click", exportLocalData);
  elements.clearAllDataButton.addEventListener("click", clearAllLocalData);
  document.querySelectorAll(".segment").forEach((button) => {
    button.addEventListener("click", () => setFilter(button.dataset.filter));
  });

  render();
  bindInstallPrompt();
  registerServiceWorker();

  function loadTheme() {
    return localStorage.getItem(THEME_KEY) === "dark" ? "dark" : "light";
  }

  function toggleTheme() {
    const nextTheme = loadTheme() === "dark" ? "light" : "dark";
    localStorage.setItem(THEME_KEY, nextTheme);
    applyTheme(nextTheme);
  }

  function applyTheme(theme) {
    if (theme === "dark") {
      document.documentElement.dataset.theme = "dark";
    } else {
      document.documentElement.removeAttribute("data-theme");
    }

    const darkMode = theme === "dark";
    const nextLabel = darkMode ? "라이트모드" : "다크모드";
    elements.themeButton.textContent = darkMode ? "☀" : "☾";
    elements.themeButton.title = nextLabel;
    elements.themeButton.setAttribute("aria-label", nextLabel);
    elements.themeButton.setAttribute("aria-pressed", String(darkMode));

    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", darkMode ? "#0c1110" : "#f4f6f1");
    }
  }

  function bindInstallPrompt() {
    if (isStandaloneApp()) {
      elements.installButton.hidden = true;
      return;
    }

    window.addEventListener("beforeinstallprompt", (event) => {
      event.preventDefault();
      deferredInstallPrompt = event;
      elements.installButton.hidden = false;
    });

    window.addEventListener("appinstalled", () => {
      deferredInstallPrompt = null;
      elements.installButton.hidden = true;
    });
  }

  async function installApp() {
    if (!deferredInstallPrompt) {
      window.alert(getInstallHelpText());
      return;
    }

    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice.catch(() => null);
    deferredInstallPrompt = null;
    elements.installButton.hidden = true;
  }

  function isStandaloneApp() {
    return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  }

  function getInstallHelpText() {
    const userAgent = window.navigator.userAgent || "";
    if (/iphone|ipad|ipod/i.test(userAgent)) {
      return "iPhone에서는 Safari 공유 버튼을 누른 뒤 '홈 화면에 추가'를 선택하면 됩니다.";
    }
    if (/android/i.test(userAgent)) {
      return "Chrome 메뉴에서 '앱 설치' 또는 '홈 화면에 추가'를 선택하면 됩니다.";
    }
    return "브라우저 주소창 또는 메뉴에서 '앱 설치'를 선택하면 됩니다. 설치 버튼이 안 보이면 로컬 서버나 HTTPS 주소에서 다시 열어주세요.";
  }

  function loadState() {
    const fallback = {
      inputText: "",
      transactions: [],
      subscriptions: [],
      statusByKey: {},
      filter: "all",
      savingGoal: 0,
    };

    try {
      return { ...fallback, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") };
    } catch (error) {
      return fallback;
    }
  }

  function loadFeedback() {
    try {
      const entries = JSON.parse(localStorage.getItem(FEEDBACK_KEY) || "[]");
      return Array.isArray(entries) ? entries : [];
    } catch (error) {
      return [];
    }
  }

  function saveFeedback() {
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify(feedbackState.entries));
  }

  function saveState() {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        inputText: state.inputText,
        transactions: state.transactions,
        subscriptions: state.subscriptions,
        statusByKey: state.statusByKey,
        filter: state.filter,
        savingGoal: state.savingGoal,
      }),
    );
    elements.saveState.textContent = "저장됨";
    window.setTimeout(() => {
      elements.saveState.textContent = "로컬 저장";
    }, 1200);
  }

  function analyzeInput() {
    const parsed = parseTransactions(elements.input.value);
    const manual = state.transactions.filter((transaction) => transaction.source === "manual");

    state.inputText = elements.input.value;
    state.transactions = dedupeTransactions([...parsed, ...manual]);
    state.subscriptions = buildCandidates(state.transactions).map((candidate) => ({
      ...candidate,
      status: state.statusByKey[candidate.key] || "unknown",
    }));

    saveState();
    render();
  }

  function saveSavingGoal(event) {
    event.preventDefault();

    state.savingGoal = Math.max(0, parseGoalAmount(elements.goalInput.value));
    saveState();
    renderGoal();
  }

  function toggleCancelFocus() {
    const nextFilter = state.filter === "cancel" ? "all" : "cancel";
    setFilter(nextFilter);
    if (nextFilter === "cancel") {
      scrollToReport();
    }
  }

  function scrollToReport() {
    if (!elements.reportArea || typeof elements.reportArea.scrollIntoView !== "function") return;
    elements.reportArea.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function fillSample() {
    elements.input.value = [
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
      "날짜,결제처,금액,카드사",
      "04/09,APPLE.COM/BILL,14900",
      "05/09,APPLE.COM/BILL,14900",
      "06/09,APPLE.COM/BILL,14900",
      '06/10,"ADOBE, CREATIVE CLOUD","24,000",삼성카드',
      "05/15 OPENAI *CHATGPT $20",
      "06/15 OPENAI *CHATGPT $20",
      "06/18 동네마트 43,200원 승인",
      "06/22 카페 5,500원 승인",
    ].join("\n");
    analyzeInput();
  }

  function resetAll() {
    const confirmed = window.confirm("저장된 분석 결과를 초기화할까요?");
    if (!confirmed) return;

    state.inputText = "";
    state.transactions = [];
    state.subscriptions = [];
    state.statusByKey = {};
    state.filter = "all";
    elements.input.value = "";
    saveState();
    render();
  }

  function toggleManualForm() {
    elements.manualForm.hidden = !elements.manualForm.hidden;
    if (!elements.manualForm.hidden) {
      elements.manualMerchant.focus();
    }
  }

  function addManualTransaction(event) {
    event.preventDefault();

    const merchant = elements.manualMerchant.value.trim();
    const amount = Number(elements.manualAmount.value);
    const date = elements.manualDate.value;
    const currency = elements.manualCurrency.value;

    if (!merchant || !amount || !date) return;

    const transaction = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      date,
      merchant,
      amount,
      currency,
      cardProvider: "수동",
      raw: `${date} ${merchant} ${formatAmount(amount, currency)}`,
      source: "manual",
    };

    state.transactions = dedupeTransactions([...state.transactions, transaction]);
    state.subscriptions = buildCandidates(state.transactions).map((candidate) => ({
      ...candidate,
      status: state.statusByKey[candidate.key] || "unknown",
    }));

    elements.manualMerchant.value = "";
    elements.manualAmount.value = "";
    saveState();
    render();
  }

  function addFeedback(event) {
    event.preventDefault();

    const message = elements.feedbackMessage.value.trim();
    if (!message) {
      elements.feedbackMessage.focus();
      return;
    }

    if (hasSensitiveFeedback(message)) {
      window.alert("민감정보처럼 보이는 내용이 있어 저장하지 않았습니다. 카드번호/주민번호/비밀번호/인증서/계좌번호 전체를 지우고 다시 남겨주세요.");
      return;
    }

    const entry = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      type: elements.feedbackType.value,
      name: elements.feedbackName.value.trim().slice(0, 30),
      contact: elements.feedbackContact.value.trim().slice(0, 80),
      message: message.slice(0, 800),
      createdAt: new Date().toISOString(),
    };

    feedbackState.entries = [entry, ...feedbackState.entries].slice(0, 80);
    elements.feedbackMessage.value = "";
    saveFeedback();
    renderFeedback();
  }

  function handleFeedbackClick(event) {
    const button = event.target.closest("[data-feedback-id]");
    if (!button) return;

    feedbackState.entries = feedbackState.entries.filter((entry) => entry.id !== button.dataset.feedbackId);
    saveFeedback();
    renderFeedback();
  }

  function clearFeedback() {
    if (!feedbackState.entries.length) return;
    const confirmed = window.confirm("저장된 고객문의 방명록을 모두 삭제할까요?");
    if (!confirmed) return;

    feedbackState.entries = [];
    saveFeedback();
    renderFeedback();
  }

  function exportLocalData() {
    const payload = {
      product: "구독청소",
      version: 1,
      exportedAt: new Date().toISOString(),
      analysis: {
        inputText: state.inputText,
        transactions: state.transactions,
        subscriptions: state.subscriptions,
        statusByKey: state.statusByKey,
        filter: state.filter,
        savingGoal: state.savingGoal,
      },
      feedback: feedbackState.entries,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `subscription-cleaning-backup-${formatBackupDate(new Date())}.json`;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function clearAllLocalData() {
    const confirmed = window.confirm("분석 결과, 목표, 고객 요청 방명록을 모두 삭제할까요?");
    if (!confirmed) return;

    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(FEEDBACK_KEY);
    localStorage.removeItem(THEME_KEY);

    state.inputText = "";
    state.transactions = [];
    state.subscriptions = [];
    state.statusByKey = {};
    state.filter = "all";
    state.savingGoal = 0;
    feedbackState.entries = [];
    elements.input.value = "";
    applyTheme("light");
    render();
  }

  function hasSensitiveFeedback(value) {
    const normalized = value.replace(/[\s-]/g, "");
    return (
      /\d{6}[1-4]\d{6}/.test(normalized) ||
      /\d{13,19}/.test(normalized) ||
      /(비밀번호|패스워드|공인인증서|공동인증서|인증서비번|인증서비밀번호|계좌비밀번호)/i.test(value)
    );
  }

  function parseTransactions(text) {
    return splitPaymentRecords(text).map(parseRecord).filter(Boolean);
  }

  function splitPaymentRecords(text) {
    const normalized = String(text || "")
      .replace(/\r/g, "")
      .replace(/\u00a0/g, " ")
      .trim();

    if (!normalized) return [];

    const records = [];
    const blocks = normalized
      .split(/\n\s*\n/)
      .map((block) =>
        block
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean)
          .join("\n"),
      )
      .filter(Boolean);

    blocks.forEach((block) => {
      if (block.includes("\n") && countMoneyHints(block) === 1 && countDateHints(block) >= 1) {
        records.push(block);
      }
    });

    normalized
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .forEach((line) => records.push(line));

    return [...new Map(records.map((record) => [record.replace(/\s+/g, " "), record])).values()];
  }

  function parseRecord(raw, index) {
    if (ignoredRecordPattern.test(raw)) return null;

    const delimited = parseDelimitedRecord(raw, index);
    if (delimited) return delimited;

    const date = parseDate(raw);
    const money = parseMoney(raw);
    if (!date || !money) return null;

    const merchant = parseMerchant(raw);
    if (!merchant) return null;
    const cardProvider = parseCardProvider(raw);

    return {
      id: `${date}-${normalizeMerchant(merchant)}-${money.amount}-${index}`,
      date,
      merchant,
      amount: money.amount,
      currency: money.currency,
      cardProvider,
      raw,
      source: "text",
    };
  }

  function parseDelimitedRecord(raw, index) {
    const delimiter = raw.includes("\t") ? "\t" : raw.includes(",") ? "," : null;
    if (!delimiter) return null;

    const columns = parseDelimitedColumns(raw, delimiter)
      .map(cleanDelimitedColumn)
      .filter(Boolean);

    if (columns.length < 3) return null;

    const dateColumn = columns.find((column) => parseDate(column));
    const moneyColumn = columns.find((column) => parseMoney(column) || parseBareMoney(column));
    const merchantColumn = columns
      .filter((column) => column !== dateColumn && column !== moneyColumn)
      .map((column) => parseMerchant(column))
      .filter(Boolean)
      .sort((a, b) => scoreMerchantCandidate(b) - scoreMerchantCandidate(a))[0];

    const money = moneyColumn ? parseMoney(moneyColumn) || parseBareMoney(moneyColumn) : null;
    const date = dateColumn ? parseDate(dateColumn) : null;
    if (!date || !money || !merchantColumn) return null;
    const cardProvider = columns.map(parseCardProvider).find(Boolean) || parseCardProvider(raw);

    return {
      id: `${date}-${normalizeMerchant(merchantColumn)}-${money.amount}-${index}`,
      date,
      merchant: merchantColumn,
      amount: money.amount,
      currency: money.currency,
      cardProvider,
      raw,
      source: "text",
    };
  }

  function parseDelimitedColumns(raw, delimiter) {
    if (delimiter === "\t") return raw.split(delimiter);

    const columns = [];
    let current = "";
    let quoted = false;

    for (let index = 0; index < raw.length; index += 1) {
      const char = raw[index];
      const next = raw[index + 1];

      if (char === '"' && next === '"') {
        current += '"';
        index += 1;
        continue;
      }

      if (char === '"') {
        quoted = !quoted;
        continue;
      }

      if (char === delimiter && !quoted) {
        columns.push(current);
        current = "";
        continue;
      }

      current += char;
    }

    columns.push(current);
    return columns;
  }

  function parseDate(raw) {
    const full = raw.match(/(20\d{2})[.\-/년\s]+(\d{1,2})[.\-/월\s]+(\d{1,2})/);
    if (full) {
      return toISO(Number(full[1]), Number(full[2]), Number(full[3]));
    }

    const shortYear = raw.match(/(?:^|[^\d])(\d{2})[.\-/](\d{1,2})[.\-/](\d{1,2})(?:[^\d]|$)/);
    if (shortYear) {
      return toISO(2000 + Number(shortYear[1]), Number(shortYear[2]), Number(shortYear[3]));
    }

    const slash = raw.match(/(?:^|[^\d])(\d{1,2})[.\-/](\d{1,2})(?:\s|$|\(|\)|,)/);
    if (slash) {
      return toISO(today.getFullYear(), Number(slash[1]), Number(slash[2]));
    }

    const korean = raw.match(/(\d{1,2})월\s*(\d{1,2})일/);
    if (korean) {
      return toISO(today.getFullYear(), Number(korean[1]), Number(korean[2]));
    }

    return null;
  }

  function toISO(year, month, day) {
    const date = new Date(year, month - 1, day);
    if (
      Number.isNaN(date.getTime()) ||
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return null;
    }
    return `${year}-${pad(month)}-${pad(day)}`;
  }

  function parseMoney(raw) {
    const krwMatches = [...raw.matchAll(/(?:₩\s*)?(\d[\d,]*)\s*원/g)];
    const krw = pickMoneyMatch(raw, krwMatches);
    if (krw) {
      return {
        amount: Number(krw[1].replace(/,/g, "")),
        currency: "KRW",
      };
    }

    const usdPrefix = raw.match(/(?:\$|USD\s*)(\d+(?:\.\d+)?)/i);
    const usdSuffix = raw.match(/(\d+(?:\.\d+)?)\s*(?:USD|달러)/i);
    const usd = usdPrefix || usdSuffix;
    if (usd) {
      return {
        amount: Number(usd[1]),
        currency: "USD",
      };
    }

    return null;
  }

  function parseBareMoney(raw) {
    const normalized = String(raw || "").replace(/[,\s]/g, "");
    if (!/^\d{3,9}$/.test(normalized)) return null;
    if (Number(normalized) < 100) return null;
    return {
      amount: Number(normalized),
      currency: "KRW",
    };
  }

  function pickMoneyMatch(raw, matches) {
    if (!matches.length) return null;

    return matches
      .map((match) => {
        const before = raw.slice(Math.max(0, match.index - 14), match.index);
        const after = raw.slice(match.index + match[0].length, match.index + match[0].length + 14);
        const context = `${before} ${after}`;
        let score = 0;
        if (/승인|결제|이용|사용|출금|청구/.test(context)) score += 30;
        if (/금액|가맹점/.test(context)) score += 12;
        if (/잔액|누적|한도|포인트|적립|캐시백/.test(context)) score -= 80;
        return { match, score };
      })
      .sort((a, b) => b.score - a.score)[0].match;
  }

  function parseMerchant(raw) {
    const candidates = raw
      .split(/\n|\t| {2,}/)
      .map(cleanMerchantText)
      .filter(isMerchantCandidate)
      .sort((a, b) => scoreMerchantCandidate(b) - scoreMerchantCandidate(a));

    if (candidates[0]) return candidates[0].slice(0, 60);

    return cleanMerchantText(raw)
      .slice(0, 60);
  }

  function parseCardProvider(raw) {
    const match = String(raw || "").match(cardProviderPattern);
    if (!match) return "";
    return canonicalCardProvider(match[0]);
  }

  function canonicalCardProvider(value) {
    const normalized = String(value || "").toUpperCase().replace(/\s+/g, "");
    const matched = cardProviderWords.find((word) => normalized.includes(word.toUpperCase()));
    return matched || value;
  }

  function cleanMerchantText(raw) {
    return String(raw || "")
      .replace(/\[[^\]]*(카드|은행|페이|PAY|알림)[^\]]*\]/gi, " ")
      .replace(/카드번호\s*[:：]?\s*[\d* \-]+/gi, " ")
      .replace(/승인번호\s*[:：]?\s*[\d\-]+/gi, " ")
      .replace(/20\d{2}[.\-/년\s]+\d{1,2}[.\-/월\s]+\d{1,2}일?/g, " ")
      .replace(/(?:^|[^\d])\d{2}[.\-/]\d{1,2}[.\-/]\d{1,2}(?:[^\d]|$)/g, " ")
      .replace(/(^|\s)\d{1,2}[.\-/]\d{1,2}(\s|$)/g, " ")
      .replace(/\d{1,2}월\s*\d{1,2}일/g, " ")
      .replace(/\b\d{1,2}:\d{2}(?::\d{2})?\b/g, " ")
      .replace(/(?:₩\s*)?\d[\d,]*\s*원/g, " ")
      .replace(/(?:\$|USD\s*)\d+(?:\.\d+)?/gi, " ")
      .replace(/\d+(?:\.\d+)?\s*(?:USD|달러)/gi, " ")
      .replace(cardProviderPattern, " ")
      .replace(noiseWordPattern, " ")
      .replace(/\[[^\]]*\]|\([^)]+\)/g, " ")
      .replace(/[^\p{L}\p{N}.*&/\- ]/gu, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/^[-*/\s]+|[-*/\s]+$/g, "");
  }

  function isMerchantCandidate(value) {
    const normalized = normalizeMerchant(value);
    if (normalized.length < 2) return false;
    if (/^\d+$/.test(normalized)) return false;
    if (!/[A-Z가-힣]/i.test(value)) return false;
    if (/^(KRW|USD|원|달러)$/i.test(value)) return false;
    return scoreMerchantCandidate(value) > -10;
  }

  function scoreMerchantCandidate(value) {
    const upper = value.toUpperCase();
    let score = 0;
    if (hasSubscriptionKeyword(value)) score += 40;
    if (/[가-힣]/.test(value)) score += 10;
    if (/[A-Z]{2,}/.test(upper)) score += 10;
    if (value.length >= 3 && value.length <= 32) score += 12;
    if (/[.*&/\-]/.test(value)) score += 4;
    if (cardProviderWords.some((word) => upper.includes(word.toUpperCase()))) score -= 30;
    if (noiseWords.some((word) => upper === word.toUpperCase())) score -= 40;
    if (/\d{5,}/.test(value)) score -= 12;
    return score;
  }

  function countMoneyHints(raw) {
    return (raw.match(/(?:₩\s*)?\d[\d,]*\s*원|(?:\$|USD\s*)\d+(?:\.\d+)?|\d+(?:\.\d+)?\s*(?:USD|달러)/gi) || []).length;
  }

  function countDateHints(raw) {
    return (raw.match(/20\d{2}[.\-/년\s]+\d{1,2}[.\-/월\s]+\d{1,2}|\d{1,2}[.\-/]\d{1,2}|\d{1,2}월\s*\d{1,2}일/g) || []).length;
  }

  function cleanDelimitedColumn(value) {
    return String(value || "")
      .trim()
      .replace(/^["']|["']$/g, "")
      .trim();
  }

  function escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function buildCandidates(transactions) {
    const groups = new Map();

    transactions.forEach((transaction) => {
      const key = normalizeMerchant(transaction.merchant);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(transaction);
    });

    return [...groups.entries()]
      .map(([key, items]) => createCandidate(key, items))
      .filter(Boolean)
      .sort((a, b) => b.monthlyKrw - a.monthlyKrw || b.confidence - a.confidence);
  }

  function createCandidate(key, items) {
    const sorted = [...items].sort((a, b) => a.date.localeCompare(b.date));
    const occurrences = sorted.length;
    const representative = pickRepresentative(sorted);
    const category = detectCategory(representative);
    const currency = sorted[0].currency;
    const averageAmount = average(sorted.map((item) => item.amount));
    const intervals = getIntervals(sorted);
    const averageInterval = intervals.length ? average(intervals) : null;
    const cadence = detectCadence(averageInterval, occurrences);
    const amountStable = isAmountStable(sorted);
    const keywordHit = hasSubscriptionKeyword(representative);

    let confidence = 0;
    if (occurrences >= 2) confidence += 54;
    if (occurrences >= 3) confidence += 12;
    if (occurrences === 1 && keywordHit) confidence += 30;
    if (cadence !== "단발성") confidence += 18;
    if (amountStable) confidence += 10;
    if (keywordHit) confidence += 12;

    if (occurrences < 2 && !keywordHit) return null;
    if (confidence < 38) return null;

    const nextDate = estimateNextDate(sorted.at(-1).date, cadence, averageInterval);

    return {
      key,
      merchant: representative,
      category,
      cardProviders: summarizeProviders(sorted),
      occurrences,
      averageAmount,
      currency,
      cadence,
      nextDate,
      confidence: Math.min(confidence, 96),
      monthlyKrw: currency === "KRW" ? monthlyEquivalent(averageAmount, cadence) : 0,
      sampleRaw: sorted.at(-1).raw,
      detectedDates: sorted.map((item) => item.date),
      status: "unknown",
    };
  }

  function normalizeMerchant(merchant) {
    return merchant
      .toUpperCase()
      .replace(/주식회사|유한회사|\(주\)|CO\.?\,? LTD\.?/gi, "")
      .replace(/[^A-Z0-9가-힣]/g, "");
  }

  function detectCategory(merchant) {
    const upper = merchant.toUpperCase();
    const matched = categoryRules.find((rule) =>
      rule.words.some((word) => upper.includes(word.toUpperCase())),
    );
    return matched || { id: "etc", label: "기타" };
  }

  function hasSubscriptionKeyword(merchant) {
    const upper = merchant.toUpperCase();
    return subscriptionKeywords.some((word) => upper.includes(word));
  }

  function pickRepresentative(items) {
    const names = items.map((item) => item.merchant).sort((a, b) => b.length - a.length);
    return names[0] || "알 수 없음";
  }

  function getIntervals(items) {
    if (items.length < 2) return [];

    return items.slice(1).map((item, index) => {
      const before = parseISODate(items[index].date);
      const current = parseISODate(item.date);
      return Math.round((current - before) / 86400000);
    });
  }

  function detectCadence(averageInterval, occurrences) {
    if (!averageInterval || occurrences < 2) return "단발성";
    if (averageInterval >= 5 && averageInterval <= 9) return "주간";
    if (averageInterval >= 13 && averageInterval <= 17) return "격주";
    if (averageInterval >= 25 && averageInterval <= 35) return "월간";
    if (averageInterval >= 80 && averageInterval <= 100) return "분기";
    if (averageInterval >= 355 && averageInterval <= 375) return "연간";
    return `${Math.round(averageInterval)}일`;
  }

  function estimateNextDate(lastDate, cadence, averageInterval) {
    const date = parseISODate(lastDate);
    const daysByCadence = {
      주간: 7,
      격주: 14,
      월간: 30,
      분기: 91,
      연간: 365,
      단발성: 30,
    };
    const days = daysByCadence[cadence] || Math.round(averageInterval || 30);
    date.setDate(date.getDate() + days);
    return toISO(date.getFullYear(), date.getMonth() + 1, date.getDate());
  }

  function monthlyEquivalent(amount, cadence) {
    if (cadence === "주간") return amount * 4.33;
    if (cadence === "격주") return amount * 2.16;
    if (cadence === "분기") return amount / 3;
    if (cadence === "연간") return amount / 12;
    return amount;
  }

  function isAmountStable(items) {
    if (items.length < 2) return false;
    const amounts = items.map((item) => item.amount);
    const min = Math.min(...amounts);
    const max = Math.max(...amounts);
    return min > 0 && max / min <= 1.12;
  }

  function average(numbers) {
    return numbers.reduce((sum, number) => sum + number, 0) / numbers.length;
  }

  function dedupeTransactions(transactions) {
    const map = new Map();
    transactions.forEach((transaction) => {
      map.set(
        `${transaction.date}|${normalizeMerchant(transaction.merchant)}|${transaction.amount}|${transaction.currency}|${transaction.cardProvider || ""}`,
        transaction,
      );
    });
    return [...map.values()].sort((a, b) => b.date.localeCompare(a.date));
  }

  function setFilter(filter) {
    state.filter = filter;
    saveState();
    renderFilterCounts();
    renderGoal();
    renderCancelSummary();
    renderSubscriptions();
  }

  function render() {
    renderFilterCounts();
    renderSummary();
    renderGoal();
    renderCardSummary();
    renderCancelSummary();
    renderSubscriptions();
    renderTransactions();
    renderFeedback();
  }

  function renderSummary() {
    const monthlyTotal = state.subscriptions.reduce((sum, item) => sum + item.monthlyKrw, 0);
    const cancelCount = state.subscriptions.filter((item) => item.status === "cancel").length;

    elements.monthlyTotal.textContent = formatAmount(Math.round(monthlyTotal), "KRW");
    elements.candidateCount.textContent = `${state.subscriptions.length}개`;
    elements.cancelCount.textContent = `${cancelCount}개`;
  }

  function renderGoal() {
    const cancelSavings = getCancelSavings();
    const goal = Number(state.savingGoal) || 0;
    const progress = goal > 0 ? Math.min(100, Math.round((cancelSavings / goal) * 100)) : 0;
    const remaining = Math.max(0, goal - cancelSavings);

    elements.goalInput.value = goal ? Math.round(goal).toLocaleString("ko-KR") : "";
    elements.goalSavedAmount.textContent = formatAmount(Math.round(cancelSavings), "KRW");
    elements.goalProgressBar.style.width = `${progress}%`;
    elements.cancelFocusButton.textContent =
      cancelSavings > 0 && state.filter !== "cancel"
        ? `해지예정 ${formatAmount(Math.round(cancelSavings), "KRW")} 보기`
        : state.filter === "cancel"
          ? "전체 보기"
          : "해지예정 보기";
    elements.cancelFocusButton.classList.toggle("active", state.filter === "cancel");

    if (!goal) {
      elements.goalStatusText.textContent = "목표금액을 정하면 절약 진행률이 보입니다.";
      return;
    }

    elements.goalStatusText.textContent =
      remaining > 0
        ? `${formatAmount(remaining, "KRW")} 더 줄이면 목표 달성`
        : `목표 달성 ${progress}%`;
  }

  function getCancelSavings() {
    return state.subscriptions
      .filter((item) => item.status === "cancel")
      .reduce((sum, item) => sum + item.monthlyKrw, 0);
  }

  function renderFilterCounts() {
    const counts = getStatusCounts();
    document.querySelectorAll(".segment").forEach((button) => {
      const filter = button.dataset.filter;
      button.classList.toggle("active", filter === state.filter);
      button.textContent = `${filterLabels[filter] || filter} · ${counts[filter] || 0}`;
    });
  }

  function getStatusCounts() {
    const counts = {
      all: state.subscriptions.length,
      keep: 0,
      cancel: 0,
      unknown: 0,
    };
    state.subscriptions.forEach((item) => {
      const status = item.status || "unknown";
      counts[status] = (counts[status] || 0) + 1;
    });
    return counts;
  }

  function renderCancelSummary() {
    const cancelItems = state.subscriptions.filter((item) => item.status === "cancel");
    const cancelSavings = cancelItems.reduce((sum, item) => sum + item.monthlyKrw, 0);
    const shouldShow = state.filter === "cancel" || cancelItems.length > 0;

    elements.cancelSummary.hidden = !shouldShow;
    elements.cancelSummary.replaceChildren();
    if (!shouldShow) return;

    const title = document.createElement("strong");
    const description = document.createElement("span");

    if (!cancelItems.length) {
      title.textContent = "해지예정으로 표시한 항목이 없습니다.";
      description.textContent = "정리할 구독을 해지예정으로 바꾸면 예상 절약액이 표시됩니다.";
    } else {
      title.textContent = `해지예정 ${cancelItems.length}개 · 예상 절약액 ${formatAmount(Math.round(cancelSavings), "KRW")}`;
      const visible = cancelItems
        .filter((item) => item.monthlyKrw > 0)
        .slice(0, 3)
        .map((item) => `${item.merchant} ${formatAmount(Math.round(item.monthlyKrw), "KRW")}`);
      const extra = cancelItems.length > visible.length ? ` 외 ${cancelItems.length - visible.length}개` : "";
      description.textContent = visible.length ? `${visible.join(" + ")}${extra}` : "원화 환산이 필요한 항목은 절약 목표에 따로 반영되지 않습니다.";
    }

    elements.cancelSummary.append(title, description);
  }

  function parseGoalAmount(value) {
    const normalized = String(value || "").replace(/[^\d]/g, "");
    return normalized ? Number(normalized) : 0;
  }

  function renderCardSummary() {
    elements.cardSummary.replaceChildren();

    const groups = summarizeCardGroups(state.transactions);
    if (!groups.length) return;

    groups.forEach((group) => {
      const item = document.createElement("div");
      item.className = `card-summary-item ${group.provider === UNKNOWN_PROVIDER ? "unknown-provider" : ""}`;
      item.innerHTML = `
        <span></span>
        <strong>${formatAmount(group.totalKrw, "KRW")}</strong>
        <small>${group.count}건</small>
      `;
      item.querySelector("span").textContent = group.provider;
      elements.cardSummary.append(item);
    });
  }

  function renderSubscriptions() {
    elements.subscriptionList.replaceChildren();

    const filtered = state.subscriptions.filter((item) => {
      if (state.filter === "all") return true;
      return item.status === state.filter;
    });

    if (!filtered.length) {
      elements.subscriptionList.append(emptySubscriptionNode());
      return;
    }

    filtered.forEach((item) => {
      const card = document.createElement("article");
      card.className = `subscription-card ${item.status}`;
      card.innerHTML = `
        <div class="subscription-top">
          <h3 class="merchant-name"></h3>
          <span class="category-pill ${item.category.id}"></span>
        </div>
        <div class="subscription-meta">
          <div class="meta-box"><span>금액</span><strong>${formatAmount(item.averageAmount, item.currency)}</strong></div>
          <div class="meta-box"><span>주기</span><strong>${item.cadence}</strong></div>
          <div class="meta-box"><span>다음 예상</span><strong>${formatDate(item.nextDate)}</strong></div>
          <div class="meta-box"><span>반복</span><strong>${item.occurrences}회</strong></div>
        </div>
        <div class="status-row">
          <div class="status-copy">
            <span class="confidence">신뢰도 ${item.confidence}% · ${formatProviders(item.cardProviders)}</span>
            <span class="detection-reason"></span>
          </div>
          <select class="status-select" aria-label="상태 선택">
            <option value="unknown">모름</option>
            <option value="keep">유지</option>
            <option value="cancel">해지예정</option>
          </select>
        </div>
      `;

      card.querySelector(".merchant-name").textContent = item.merchant;
      card.querySelector(".category-pill").textContent = item.category.label;
      card.querySelector(".detection-reason").textContent = getDetectionReason(item);
      const select = card.querySelector(".status-select");
      select.value = item.status;
      select.addEventListener("change", () => updateStatus(item.key, select.value));
      elements.subscriptionList.append(card);
    });
  }

  function updateStatus(key, status) {
    state.statusByKey[key] = status;
    state.subscriptions = state.subscriptions.map((item) =>
      item.key === key ? { ...item, status } : item,
    );
    saveState();
    renderSummary();
    renderGoal();
    renderFilterCounts();
    renderCancelSummary();
    renderSubscriptions();
  }

  function renderTransactions() {
    elements.transactionList.replaceChildren();
    elements.transactionCount.textContent = `${state.transactions.length}건`;

    if (!state.transactions.length) {
      elements.transactionList.append(emptyNode());
      return;
    }

    state.transactions.forEach((transaction) => {
      const row = document.createElement("div");
      row.className = "transaction-row";
      row.innerHTML = `
        <span class="transaction-date">${formatDate(transaction.date)}</span>
        <span class="transaction-merchant"></span>
        <span class="transaction-amount">${formatAmount(transaction.amount, transaction.currency)}</span>
        <span class="transaction-provider"></span>
      `;
      row.querySelector(".transaction-merchant").textContent = transaction.merchant;
      row.querySelector(".transaction-provider").textContent = transaction.cardProvider || transaction.currency;
      elements.transactionList.append(row);
    });
  }

  function renderFeedback() {
    elements.feedbackList.replaceChildren();
    elements.feedbackCount.textContent = `${feedbackState.entries.length}건`;

    if (!feedbackState.entries.length) {
      const empty = emptyNode();
      empty.querySelector("strong").textContent = "남겨진 요청이 없습니다.";
      empty.querySelector("span").textContent = "분석 오류, 결제처 추가, 연동 요청을 가볍게 모아둘 수 있습니다.";
      elements.feedbackList.append(empty);
      return;
    }

    feedbackState.entries.forEach((entry) => {
      const card = document.createElement("article");
      card.className = "feedback-card";
      card.innerHTML = `
        <div class="feedback-card-top">
          <div>
            <span class="feedback-kind"></span>
            <div class="feedback-meta"></div>
          </div>
          <button class="tiny-button" type="button" data-feedback-id="${entry.id}">삭제</button>
        </div>
        <p class="feedback-body"></p>
      `;

      card.querySelector(".feedback-kind").textContent = entry.type || "기타";
      card.querySelector(".feedback-meta").textContent = [entry.name || "익명", entry.contact, formatDateTime(entry.createdAt)]
        .filter(Boolean)
        .join(" · ");
      card.querySelector(".feedback-body").textContent = entry.message;
      elements.feedbackList.append(card);
    });
  }

  function emptyNode() {
    return elements.emptyTemplate.content.firstElementChild.cloneNode(true);
  }

  function emptySubscriptionNode() {
    const empty = emptyNode();
    const messages = {
      cancel: ["해지예정 항목이 없습니다.", "줄이고 싶은 결제를 해지예정으로 바꾸면 여기만 모아볼 수 있습니다."],
      keep: ["유지 항목이 없습니다.", "계속 쓸 결제를 유지로 바꾸면 따로 모아볼 수 있습니다."],
      unknown: ["모름 항목이 없습니다.", "확인이 필요한 결제를 모름으로 두면 여기에서 다시 볼 수 있습니다."],
      all: ["자동결제 후보가 아직 없습니다.", "결제내역을 붙여넣으면 목록이 채워집니다."],
    };
    const [title, description] = messages[state.filter] || messages.all;
    empty.querySelector("strong").textContent = title;
    empty.querySelector("span").textContent = description;
    return empty;
  }

  function getDetectionReason(candidate) {
    const dates = getCandidateDates(candidate);
    const visibleDates = dates.slice(0, 4).map(formatDate);
    const extraCount = Math.max(0, dates.length - visibleDates.length);
    const dateText = visibleDates.length
      ? `${visibleDates.join(" / ")}${extraCount ? ` 외 ${extraCount}건` : ""}`
      : "날짜 정보 없음";

    if (dates.length >= 3) {
      return `최근 ${dates.length}개월 반복 결제 감지 · ${dateText}`;
    }
    if (dates.length === 2) {
      return `반복 결제 가능성 감지 · ${dateText}`;
    }
    return `반복 내역이 부족해 확인이 필요합니다. · ${dateText}`;
  }

  function getCandidateDates(candidate) {
    const savedDates = Array.isArray(candidate.detectedDates) ? candidate.detectedDates : [];
    const fallbackDates = state.transactions
      .filter((transaction) => normalizeMerchant(transaction.merchant) === candidate.key)
      .map((transaction) => transaction.date);

    return [...new Set([...savedDates, ...fallbackDates])]
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));
  }

  function formatAmount(amount, currency) {
    if (currency === "KRW") {
      return `${Math.round(amount).toLocaleString("ko-KR")}원`;
    }
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency,
      maximumFractionDigits: currency === "JPY" ? 0 : 2,
    }).format(amount);
  }

  function formatDate(dateString) {
    if (!dateString) return "-";
    const parts = dateString.split("-");
    if (parts.length !== 3) return dateString;
    return `${parts[1]}.${parts[2]}`;
  }

  function formatDateTime(dateString) {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat("ko-KR", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  }

  function formatBackupDate(date) {
    return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}`;
  }

  function parseISODate(dateString) {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  function pad(value) {
    return String(value).padStart(2, "0");
  }

  function summarizeProviders(transactions) {
    const counts = new Map();
    transactions.forEach((transaction) => {
      const provider = transaction.cardProvider || UNKNOWN_PROVIDER;
      counts.set(provider, (counts.get(provider) || 0) + 1);
    });
    return [...counts.entries()]
      .map(([provider, count]) => ({ provider, count }))
      .sort((a, b) => b.count - a.count || a.provider.localeCompare(b.provider, "ko"));
  }

  function formatProviders(providers) {
    if (!providers || !providers.length) return UNKNOWN_PROVIDER;
    const visible = providers.slice(0, 2).map((item) => item.provider).join(", ");
    return providers.length > 2 ? `${visible} 외 ${providers.length - 2}` : visible;
  }

  function summarizeCardGroups(transactions) {
    const groups = new Map();
    transactions.forEach((transaction) => {
      const provider = transaction.cardProvider || UNKNOWN_PROVIDER;
      if (!groups.has(provider)) {
        groups.set(provider, { provider, count: 0, totalKrw: 0 });
      }
      const group = groups.get(provider);
      group.count += 1;
      if (transaction.currency === "KRW") {
        group.totalKrw += transaction.amount;
      }
    });

    return [...groups.values()]
      .filter((group) => group.count > 0)
      .sort(compareCardGroups);
  }

  function compareCardGroups(a, b) {
    if (a.provider === UNKNOWN_PROVIDER && b.provider !== UNKNOWN_PROVIDER) return 1;
    if (b.provider === UNKNOWN_PROVIDER && a.provider !== UNKNOWN_PROVIDER) return -1;
    return b.totalKrw - a.totalKrw || b.count - a.count || a.provider.localeCompare(b.provider, "ko");
  }

  function registerServiceWorker() {
    if (!("serviceWorker" in navigator) || location.protocol === "file:") return;
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => registration.unregister());
    }).catch(() => {});
  }

  window.SubscriptionCleaningParser = {
    parseTransactions,
    buildCandidates,
    summarizeCardGroups,
  };
})();
