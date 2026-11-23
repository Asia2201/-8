
/* =========================================================
   Інтерактивна навчальна вебсторінка (8 клас)
   Тема: «Написи в Python» (tkinter.Label)
   Максимально надійна версія з прямими глобальними обробниками
   ========================================================= */

var STORAGE_KEY = "python8_labels_v4";
var PAGES = ["start", "theory", "simulators", "practice", "test", "report"];

var TEST_ANSWERS = {
  q1: "В",
  q2: "Б",
  q3: "А",
  q4: "Б",
  q5: "В",
  q6: "Г",
  q7: "Б",
  q8: "А"
};

var GRADE_SCALE = [
  { min: 0, max: 2, grade: 1 },
  { min: 3, max: 4, grade: 2 },
  { min: 5, max: 6, grade: 3 },
  { min: 7, max: 8, grade: 4 },
  { min: 9, max: 10, grade: 5 },
  { min: 11, max: 12, grade: 6 },
  { min: 13, max: 14, grade: 7 },
  { min: 15, max: 16, grade: 8 },
  { min: 17, max: 18, grade: 9 },
  { min: 19, max: 20, grade: 10 },
  { min: 21, max: 22, grade: 11 },
  { min: 23, max: 24, grade: 12 }
];

function createDefaultState() {
  return {
    student: { pib: "", className: "" },
    currentPage: "start",
    simulators: {
      sim1: { text: "Вітаю!", fg: "black", bg: "white", submitted: false },
      sim2: { family: "Arial", size: "12", weight: "normal", submitted: false },
      sim3: { x: 20, y: 20, submitted: false }
    },
    practice: { p1: "", p2: "", p3: "" },
    testAnswers: {}
  };
}

var state = createDefaultState();

function saveState() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {}
  refreshHeaderAndProgress();
}

function loadState() {
  try {
    var raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    var parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return;
    if (parsed.student) {
      state.student.pib = parsed.student.pib || "";
      state.student.className = parsed.student.className || "";
    }
    if (parsed.currentPage && PAGES.indexOf(parsed.currentPage) !== -1) {
      state.currentPage = parsed.currentPage;
    }
    if (parsed.simulators) {
      if (parsed.simulators.sim1) Object.assign(state.simulators.sim1, parsed.simulators.sim1);
      if (parsed.simulators.sim2) Object.assign(state.simulators.sim2, parsed.simulators.sim2);
      if (parsed.simulators.sim3) Object.assign(state.simulators.sim3, parsed.simulators.sim3);
    }
    if (parsed.practice) {
      state.practice.p1 = parsed.practice.p1 || "";
      state.practice.p2 = parsed.practice.p2 || "";
      state.practice.p3 = parsed.practice.p3 || "";
    }
    if (parsed.testAnswers && typeof parsed.testAnswers === "object") {
      state.testAnswers = parsed.testAnswers;
    }
  } catch (e) {}
}

function normalizeQuotes(str) {
  return (str || "").replace(/['’`]/g, '"');
}

function scoreSim1() {
  var s = state.simulators.sim1;
  if (!s.submitted) return 0;
  var txtNorm = (s.text || "").trim().replace(/\s+/g, " ");
  var pts = 0;
  if (txtNorm.toLowerCase() === "ліцей інтелект") pts += 1;
  if (s.fg === "blue" && s.bg === "yellow") pts += 1;
  return Math.min(2, pts);
}

function scoreSim2() {
  var s = state.simulators.sim2;
  if (!s.submitted) return 0;
  var pts = 0;
  if (s.family === "Times New Roman" && String(s.size) === "18") pts += 1;
  if (s.weight === "bold") pts += 1;
  return Math.min(2, pts);
}

function scoreSim3() {
  var s = state.simulators.sim3;
  if (!s.submitted) return 0;
  var pts = 0;
  if (Number(s.x) === 80) pts += 1;
  if (Number(s.y) === 100) pts += 1;
  return Math.min(2, pts);
}

function scorePractice1(rawCode) {
  var norm = normalizeQuotes(rawCode).trim();
  if (!norm) return 0;
  var compact = norm.replace(/\s+/g, "");
  var hasLabel =
    /(?:lbl|label1)\s*=\s*(?:tk\.|tkinter\.)?Label\(root,.*text="Інформатика8клас"/i.test(compact) ||
    /(?:tk\.|tkinter\.)?Label\(root,text="Інформатика8клас"\)/i.test(compact);
  var hasPack = /(?:lbl|label1)\.pack\(\)/.test(compact);
  var pts = 0;
  if (hasLabel) pts += 1.5;
  if (hasPack) pts += 1.5;
  return Math.min(3, pts);
}

function scorePractice2(rawCode) {
  var norm = normalizeQuotes(rawCode).trim();
  if (!norm) return 0;
  var compact = norm.replace(/\s+/g, "");
  var hasBase = /(?:tk\.|tkinter\.)?Label\(root,/.test(compact) && /text="Успіхівунавчанні!"/i.test(compact);
  var hasColors = /(?:fg|foreground)="white"/i.test(compact) && /(?:bg|background)="purple"/i.test(compact);
  var hasFont = /font=\("Arial",16,"bold"\)/i.test(compact);
  var pts = 0;
  if (hasBase) pts += 1;
  if (hasColors) pts += 1;
  if (hasFont) pts += 1;
  return Math.min(3, pts);
}

function scorePractice3(rawCode) {
  var norm = normalizeQuotes(rawCode).trim();
  if (!norm) return 0;
  var compact = norm.replace(/\s+/g, "");
  var hasConfig =
    /msg_lbl\.config(?:ure)?\(/.test(compact) &&
    /text="Роботувиконано!"/i.test(compact) &&
    /(?:fg|foreground)="green"/i.test(compact);
  var hasPlace = /msg_lbl\.place\(x=50,y=90\)/.test(compact) || /msg_lbl\.place\(y=90,x=50\)/.test(compact);
  var pts = 0;
  if (hasConfig) pts += 2;
  if (hasPlace) pts += 2;
  return Math.min(4, pts);
}

function computeScores() {
  var simScore = Math.min(6, scoreSim1() + scoreSim2() + scoreSim3());
  var practiceScore = Math.min(
    10,
    scorePractice1(state.practice.p1) + scorePractice2(state.practice.p2) + scorePractice3(state.practice.p3)
  );
  var testScore = 0;
  Object.keys(TEST_ANSWERS).forEach(function (qKey) {
    if (state.testAnswers[qKey] === TEST_ANSWERS[qKey]) testScore += 1;
  });
  testScore = Math.min(8, testScore);

  var totalScore = Math.min(24, Number((simScore + practiceScore + testScore).toFixed(2)));
  var roundedTotal = Math.round(totalScore);
  var percent = Math.round((totalScore / 24) * 100);
  var grade12 = 1;
  for (var i = 0; i < GRADE_SCALE.length; i++) {
    if (roundedTotal >= GRADE_SCALE[i].min && roundedTotal <= GRADE_SCALE[i].max) {
      grade12 = GRADE_SCALE[i].grade;
      break;
    }
  }
  return {
    simScore: simScore,
    practiceScore: practiceScore,
    testScore: testScore,
    totalScore: totalScore,
    percent: percent,
    grade12: grade12
  };
}

function formatPointsUk(val) {
  return String(Number(val.toFixed(2))).replace(".", ",");
}

function getCompletedTasksCount() {
  var done = 0;
  if (state.simulators.sim1.submitted) done += 1;
  if (state.simulators.sim2.submitted) done += 1;
  if (state.simulators.sim3.submitted) done += 1;
  if (state.practice.p1.trim() !== "") done += 1;
  if (state.practice.p2.trim() !== "") done += 1;
  if (state.practice.p3.trim() !== "") done += 1;
  Object.keys(TEST_ANSWERS).forEach(function (qKey) {
    if (state.testAnswers[qKey]) done += 1;
  });
  return done;
}

function refreshHeaderAndProgress() {
  var elPib = document.getElementById("banner-pib");
  var elClass = document.getElementById("banner-class");
  if (elPib) elPib.textContent = state.student.pib.trim() || "Не вказано";
  if (elClass) elClass.textContent = state.student.className.trim() || "Не вказано";

  var doneTasks = getCompletedTasksCount();
  var pctProgress = Math.round((doneTasks / 14) * 100);
  var scores = computeScores();

  var pText = document.getElementById("progress-percent-text");
  var pBar = document.getElementById("progress-bar-fill");
  var livePts = document.getElementById("live-points-text");
  if (pText) pText.textContent = pctProgress + "% (" + doneTasks + "/14)";
  if (pBar) pBar.style.width = pctProgress + "%";
  if (livePts) livePts.textContent = formatPointsUk(scores.totalScore) + " / 24";

  var tabs = document.querySelectorAll(".tab-btn");
  for (var i = 0; i < tabs.length; i++) {
    if (tabs[i].getAttribute("data-page") === state.currentPage) {
      tabs[i].classList.add("is-active");
    } else {
      tabs[i].classList.remove("is-active");
    }
  }
}

function showStartError(msg) {
  var errBox = document.getElementById("start-validation-msg");
  if (!errBox) return;
  errBox.textContent = msg;
  errBox.className = "status-note status-note--warn";
  errBox.style.display = "block";
}

function clearStartError() {
  var errBox = document.getElementById("start-validation-msg");
  if (!errBox) return;
  errBox.textContent = "";
  errBox.style.display = "none";
}

window.handleStudentInput = function () {
  var pibInput = document.getElementById("input-pib");
  var classInput = document.getElementById("input-class");
  if (pibInput) state.student.pib = pibInput.value;
  if (classInput) state.student.className = classInput.value;
  if (state.student.pib.trim() && state.student.className.trim()) {
    clearStartError();
  }
  saveState();
};

window.startWork = function () {
  var pibInput = document.getElementById("input-pib");
  var classInput = document.getElementById("input-class");
  var pibVal = pibInput ? pibInput.value.trim() : "";
  var clsVal = classInput ? classInput.value.trim() : "";

  if (!pibVal || !clsVal) {
    showStartError("Будь ласка, введіть Прізвище, ім'я та по батькові учня, а також клас (наприклад, 8-А).");
    if (!pibVal && pibInput) pibInput.focus();
    else if (!clsVal && classInput) classInput.focus();
    return;
  }

  state.student.pib = pibVal;
  state.student.className = clsVal;
  clearStartError();
  saveState();
  window.goToPage("theory");
};

window.goToPage = function (pageId) {
  if (PAGES.indexOf(pageId) === -1) pageId = "start";

  var pibInput = document.getElementById("input-pib");
  var classInput = document.getElementById("input-class");
  if (pibInput) state.student.pib = pibInput.value;
  if (classInput) state.student.className = classInput.value;

  if (pageId !== "start") {
    if (!state.student.pib.trim() || !state.student.className.trim()) {
      showStartError("Спочатку вкажіть ПІБ учня та клас на стартовій сторінці!");
      pageId = "start";
    } else {
      clearStartError();
    }
  }

  state.currentPage = pageId;
  var screens = document.querySelectorAll(".page-screen");
  for (var i = 0; i < screens.length; i++) {
    if (screens[i].id === "page-" + pageId) {
      screens[i].classList.add("is-active");
    } else {
      screens[i].classList.remove("is-active");
    }
  }

  if (pageId === "report") {
    renderReport();
  }

  saveState();
  window.scrollTo(0, 0);
};

/* ---------- СИМУЛЯТОРИ ---------- */
window.updateSim1 = function () {
  var t = document.getElementById("sim1-text");
  var f = document.getElementById("sim1-fg");
  var b = document.getElementById("sim1-bg");
  if (t) state.simulators.sim1.text = t.value;
  if (f) state.simulators.sim1.fg = f.value;
  if (b) state.simulators.sim1.bg = b.value;

  var preview = document.getElementById("sim1-preview");
  var codeEl = document.getElementById("sim1-code");
  if (preview) {
    preview.textContent = state.simulators.sim1.text.trim() || "(порожній напис)";
    preview.style.color = state.simulators.sim1.fg;
    preview.style.backgroundColor = state.simulators.sim1.bg;
    preview.style.fontWeight = "700";
    preview.style.fontSize = "18px";
  }
  if (codeEl) {
    codeEl.textContent =
      'lbl = Label(root, text="' +
      state.simulators.sim1.text.replace(/"/g, '\"') +
      '", fg="' +
      state.simulators.sim1.fg +
      '", bg="' +
      state.simulators.sim1.bg +
      '")';
  }
  saveState();
};

window.submitSim1 = function () {
  window.updateSim1();
  state.simulators.sim1.submitted = true;
  var st = document.getElementById("status-sim1");
  if (st) {
    st.textContent = "Стан симулятора 1 зафіксовано.";
    st.className = "status-note status-note--saved";
  }
  saveState();
};

window.updateSim2 = function () {
  var fam = document.getElementById("sim2-family");
  var sz = document.getElementById("sim2-size");
  var wt = document.getElementById("sim2-weight");
  if (fam) state.simulators.sim2.family = fam.value;
  if (sz) state.simulators.sim2.size = sz.value;
  if (wt) state.simulators.sim2.weight = wt.value;

  var s = state.simulators.sim2;
  var preview = document.getElementById("sim2-preview");
  var codeEl = document.getElementById("sim2-code");
  if (preview) {
    preview.style.fontFamily = '"' + s.family + '", serif, sans-serif';
    preview.style.fontSize = s.size + "px";
    preview.style.fontWeight = s.weight === "bold" ? "bold" : "normal";
    preview.style.fontStyle = s.weight === "italic" ? "italic" : "normal";
  }
  if (codeEl) {
    var fontTuple =
      s.weight === "normal"
        ? '("' + s.family + '", ' + s.size + ")"
        : '("' + s.family + '", ' + s.size + ', "' + s.weight + '")';
    codeEl.textContent = 'lbl = Label(root, text="Програмування на Python", font=' + fontTuple + ")";
  }
  saveState();
};

window.submitSim2 = function () {
  window.updateSim2();
  state.simulators.sim2.submitted = true;
  var st = document.getElementById("status-sim2");
  if (st) {
    st.textContent = "Стан симулятора 2 зафіксовано.";
    st.className = "status-note status-note--saved";
  }
  saveState();
};

window.updateSim3 = function () {
  var sx = document.getElementById("sim3-x");
  var sy = document.getElementById("sim3-y");
  if (sx) state.simulators.sim3.x = Number(sx.value) || 0;
  if (sy) state.simulators.sim3.y = Number(sy.value) || 0;

  var xNum = Math.max(0, Math.min(240, state.simulators.sim3.x));
  var yNum = Math.max(0, Math.min(150, state.simulators.sim3.y));

  var preview = document.getElementById("sim3-preview");
  var codeEl = document.getElementById("sim3-code");
  var valX = document.getElementById("sim3-x-val");
  var valY = document.getElementById("sim3-y-val");
  if (preview) {
    preview.style.left = xNum + "px";
    preview.style.top = yNum + "px";
  }
  if (valX) valX.textContent = String(xNum);
  if (valY) valY.textContent = String(yNum);
  if (codeEl) codeEl.textContent = "lbl.place(x=" + xNum + ", y=" + yNum + ")";
  saveState();
};

window.submitSim3 = function () {
  window.updateSim3();
  state.simulators.sim3.submitted = true;
  var st = document.getElementById("status-sim3");
  if (st) {
    st.textContent = "Координати в симуляторі 3 зафіксовано.";
    st.className = "status-note status-note--saved";
  }
  saveState();
};

/* ---------- ПРАКТИЧНІ ЗАВДАННЯ ---------- */
window.handlePracticeInput = function (pKey) {
  var ed = document.getElementById("editor-" + pKey);
  if (ed) {
    state.practice[pKey] = ed.value;
    saveState();
  }
};

function renderPracticeStage(pKey, codeText) {
  var stage = document.getElementById("stage-" + pKey);
  if (!stage) return;

  var norm = normalizeQuotes(codeText || "");
  var textMatch = norm.match(/text\s*=\s*"([^"]*)"/);
  var fgMatch = norm.match(/(?:fg|foreground)\s*=\s*"([^"]*)"/);
  var bgMatch = norm.match(/(?:bg|background)\s*=\s*"([^"]*)"/);
  var fontMatch = norm.match(/font\s*=\s*\(\s*"([^"]*)"\s*,\s*(\d+)(?:\s*,\s*"([^"]*)")?\s*\)/);
  var placeXMatch = norm.match(/place\([^)]*x\s*=\s*(\d+)/);
  var placeYMatch = norm.match(/place\([^)]*y\s*=\s*(\d+)/);

  if (!textMatch && !fgMatch && !bgMatch && !fontMatch && !placeXMatch) {
    stage.style.display = "flex";
    stage.style.minHeight = "95px";
    stage.innerHTML = '<span style="color:#64748b; font-size:0.95rem;">Натисніть «Запустити та зберегти», щоб побачити результат коду у вікні.</span>';
    return;
  }

  var widget = document.createElement("div");
  widget.className = "sim-label-preview";
  widget.textContent = textMatch ? textMatch[1] : "Напис Label";
  widget.style.color = fgMatch ? fgMatch[1] : "#0f172a";
  widget.style.backgroundColor = bgMatch ? bgMatch[1] : "#e2e8f0";
  widget.style.fontFamily = fontMatch ? fontMatch[1] : "Arial";
  widget.style.fontSize = fontMatch ? fontMatch[2] + "px" : "15px";
  var fontStyleStr = fontMatch && fontMatch[3] ? fontMatch[3].toLowerCase() : "normal";
  if (fontStyleStr === "bold") widget.style.fontWeight = "bold";
  if (fontStyleStr === "italic") widget.style.fontStyle = "italic";

  stage.innerHTML = "";
  if (placeXMatch || placeYMatch) {
    stage.style.display = "block";
    stage.style.minHeight = "140px";
    widget.style.position = "absolute";
    widget.style.left = Math.min(260, Number(placeXMatch ? placeXMatch[1] : 10)) + "px";
    widget.style.top = Math.min(95, Number(placeYMatch ? placeYMatch[1] : 10)) + "px";
  } else {
    stage.style.display = "flex";
    stage.style.minHeight = "95px";
  }
  stage.appendChild(widget);
}

window.runPractice = function (pKey) {
  var ed = document.getElementById("editor-" + pKey);
  var st = document.getElementById("status-" + pKey);
  var val = ed ? ed.value : "";
  state.practice[pKey] = val;
  saveState();
  renderPracticeStage(pKey, val.trim());

  if (st) {
    if (val.trim()) {
      st.textContent = "Програму виконано, відповідь збережено.";
      st.className = "status-note status-note--saved";
    } else {
      st.textContent = "Поле коду порожнє — введіть команди Python.";
      st.className = "status-note status-note--warn";
    }
  }
};

/* ---------- ТЕСТИ ---------- */
window.selectTestAnswer = function (qKey, ansVal) {
  state.testAnswers[qKey] = ansVal;
  var noteEl = document.getElementById("status-" + qKey);
  if (noteEl) {
    noteEl.textContent = "Відповідь зафіксовано.";
    noteEl.className = "status-note status-note--saved";
  }
  saveState();
};

/* ---------- ЗВІТ ТА ДРУК ---------- */
function getCommentByPercent(pct) {
  if (pct >= 90) return "Чудовий результат! Ти добре засвоїв/засвоїла тему.";
  if (pct >= 70) return "Гарна робота! Варто повторити окремі правила.";
  if (pct >= 50) return "Непогано! Потрібно ще попрацювати над темою.";
  return "Рекомендуємо повторити теорію та виконати вправи ще раз.";
}

function setText(id, val) {
  var el = document.getElementById(id);
  if (el) el.textContent = val;
}

function renderReport() {
  var scores = computeScores();
  var pibText = state.student.pib.trim() || "Не вказано";
  var classText = state.student.className.trim() || "8";
  var nowDate = new Date().toLocaleDateString("uk-UA");

  setText("rep-pib", pibText);
  setText("rep-class", classText);
  setText("rep-date", nowDate);
  setText("rep-print-date", nowDate);
  setText("rep-sign-pib", pibText);

  setText("rep-sim-score", formatPointsUk(scores.simScore));
  setText("rep-practice-score", formatPointsUk(scores.practiceScore));
  setText("rep-test-score", formatPointsUk(scores.testScore));
  setText("rep-total-score", formatPointsUk(scores.totalScore));
  setText("rep-box-total", formatPointsUk(scores.totalScore));
  setText("rep-box-percent", scores.percent + "%");
  setText("rep-box-grade", String(scores.grade12));
  setText("rep-comment", getCommentByPercent(scores.percent));

  setText(
    "rep-general-summary",
    "Учень/учениця " +
      pibText +
      " (" +
      classText +
      ") набрав/набрала " +
      formatPointsUk(scores.totalScore) +
      " із 24 балів (" +
      scores.percent +
      "%), що відповідає оцінці " +
      scores.grade12 +
      " за 12-бальною шкалою."
  );
}

window.printReport = function () {
  renderReport();
  window.print();
};

window.resetWork = function () {
  var ok = window.confirm(
    "Ви впевнені, що хочете скинути всі попередні відповіді, налаштування симуляторів та бали і розпочати роботу заново?"
  );
  if (!ok) return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch (e) {}
  state = createDefaultState();
  syncAllUI();
  window.goToPage("start");
};

function syncAllUI() {
  var pibInput = document.getElementById("input-pib");
  var classInput = document.getElementById("input-class");
  if (pibInput) pibInput.value = state.student.pib;
  if (classInput) classInput.value = state.student.className;

  var s1T = document.getElementById("sim1-text");
  var s1F = document.getElementById("sim1-fg");
  var s1B = document.getElementById("sim1-bg");
  if (s1T) s1T.value = state.simulators.sim1.text;
  if (s1F) s1F.value = state.simulators.sim1.fg;
  if (s1B) s1B.value = state.simulators.sim1.bg;
  window.updateSim1();
  var st1 = document.getElementById("status-sim1");
  if (st1) {
    st1.textContent = state.simulators.sim1.submitted ? "Стан симулятора 1 зафіксовано." : "";
    st1.className = state.simulators.sim1.submitted ? "status-note status-note--saved" : "status-note";
  }

  var s2F = document.getElementById("sim2-family");
  var s2S = document.getElementById("sim2-size");
  var s2W = document.getElementById("sim2-weight");
  if (s2F) s2F.value = state.simulators.sim2.family;
  if (s2S) s2S.value = state.simulators.sim2.size;
  if (s2W) s2W.value = state.simulators.sim2.weight;
  window.updateSim2();
  var st2 = document.getElementById("status-sim2");
  if (st2) {
    st2.textContent = state.simulators.sim2.submitted ? "Стан симулятора 2 зафіксовано." : "";
    st2.className = state.simulators.sim2.submitted ? "status-note status-note--saved" : "status-note";
  }

  var s3X = document.getElementById("sim3-x");
  var s3Y = document.getElementById("sim3-y");
  if (s3X) s3X.value = state.simulators.sim3.x;
  if (s3Y) s3Y.value = state.simulators.sim3.y;
  window.updateSim3();
  var st3 = document.getElementById("status-sim3");
  if (st3) {
    st3.textContent = state.simulators.sim3.submitted ? "Координати в симуляторі 3 зафіксовано." : "";
    st3.className = state.simulators.sim3.submitted ? "status-note status-note--saved" : "status-note";
  }

  ["p1", "p2", "p3"].forEach(function (pKey) {
    var ed = document.getElementById("editor-" + pKey);
    var st = document.getElementById("status-" + pKey);
    var val = state.practice[pKey] || "";
    if (ed) ed.value = val;
    renderPracticeStage(pKey, val);
    if (st) {
      st.textContent = val.trim() ? "Код збережено." : "";
      st.className = val.trim() ? "status-note status-note--saved" : "status-note";
    }
  });

  Object.keys(TEST_ANSWERS).forEach(function (qKey) {
    var chosen = state.testAnswers[qKey];
    var noteEl = document.getElementById("status-" + qKey);
    var radios = document.querySelectorAll('input[name="' + qKey + '"]');
    for (var i = 0; i < radios.length; i++) {
      radios[i].checked = Boolean(chosen && radios[i].value === chosen);
    }
    if (noteEl) {
      noteEl.textContent = chosen ? "Відповідь зафіксовано." : "";
      noteEl.className = chosen ? "status-note status-note--saved" : "status-note";
    }
  });

  refreshHeaderAndProgress();
}

window.addEventListener("DOMContentLoaded", function () {
  loadState();
  syncAllUI();
  var screens = document.querySelectorAll(".page-screen");
  for (var i = 0; i < screens.length; i++) {
    if (screens[i].id === "page-" + state.currentPage) {
      screens[i].classList.add("is-active");
    } else {
      screens[i].classList.remove("is-active");
    }
  }
  if (state.currentPage === "report") {
    renderReport();
  }
});
