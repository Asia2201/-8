/* =========================================================
   Логіка інтерактивної вебсторінки з інформатики (8 клас)
   Тема: «Написи в Python» (бібліотека tkinter, клас Label)
   Версія 3: Виправлено запуск та обробку подій для всіх кнопок і вкладок
   ========================================================= */

(function () {
  "use strict";

  var STORAGE_KEY = "python8_labels_sim_practice_v3";

  var PAGES = [
    "start",
    "theory",
    "simulators",
    "practice",
    "test",
    "report"
  ];

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
      student: {
        pib: "",
        className: ""
      },
      currentPage: "start",
      simulators: {
        sim1: {
          text: "Вітаю!",
          fg: "black",
          bg: "white",
          submitted: false
        },
        sim2: {
          family: "Arial",
          size: "12",
          weight: "normal",
          submitted: false
        },
        sim3: {
          x: 20,
          y: 20,
          submitted: false
        }
      },
      practice: {
        p1: "",
        p2: "",
        p3: ""
      },
      testAnswers: {}
    };
  }

  function mergeSim(defObj, srcObj) {
    var out = {
      text: defObj.text,
      fg: defObj.fg,
      bg: defObj.bg,
      family: defObj.family,
      size: defObj.size,
      weight: defObj.weight,
      x: defObj.x,
      y: defObj.y,
      submitted: Boolean(defObj.submitted)
    };
    if (!srcObj || typeof srcObj !== "object") return out;
    if (typeof srcObj.text === "string") out.text = srcObj.text;
    if (typeof srcObj.fg === "string") out.fg = srcObj.fg;
    if (typeof srcObj.bg === "string") out.bg = srcObj.bg;
    if (typeof srcObj.family === "string") out.family = srcObj.family;
    if (typeof srcObj.size === "string" || typeof srcObj.size === "number") out.size = String(srcObj.size);
    if (typeof srcObj.weight === "string") out.weight = srcObj.weight;
    if (typeof srcObj.x === "number" || typeof srcObj.x === "string") out.x = Number(srcObj.x) || 0;
    if (typeof srcObj.y === "number" || typeof srcObj.y === "string") out.y = Number(srcObj.y) || 0;
    if (typeof srcObj.submitted === "boolean") out.submitted = srcObj.submitted;
    return out;
  }

  function safeStorageGet() {
    try {
      return window.localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function safeStorageSet(val) {
    try {
      window.localStorage.setItem(STORAGE_KEY, val);
    } catch (e) {
      // Ігноруємо обмеження локального сховища у деяких браузерах/режимах
    }
  }

  function safeStorageRemove() {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      // Ігноруємо
    }
  }

  function loadState() {
    var def = createDefaultState();
    try {
      var raw = safeStorageGet();
      if (!raw) return def;
      var parsed = JSON.parse(raw);
      return {
        student: {
          pib: parsed && parsed.student && typeof parsed.student.pib === "string" ? parsed.student.pib : "",
          className: parsed && parsed.student && typeof parsed.student.className === "string" ? parsed.student.className : ""
        },
        currentPage: parsed && PAGES.indexOf(parsed.currentPage) !== -1 ? parsed.currentPage : "start",
        simulators: {
          sim1: mergeSim(def.simulators.sim1, parsed && parsed.simulators ? parsed.simulators.sim1 : null),
          sim2: mergeSim(def.simulators.sim2, parsed && parsed.simulators ? parsed.simulators.sim2 : null),
          sim3: mergeSim(def.simulators.sim3, parsed && parsed.simulators ? parsed.simulators.sim3 : null)
        },
        practice: {
          p1: parsed && parsed.practice && typeof parsed.practice.p1 === "string" ? parsed.practice.p1 : "",
          p2: parsed && parsed.practice && typeof parsed.practice.p2 === "string" ? parsed.practice.p2 : "",
          p3: parsed && parsed.practice && typeof parsed.practice.p3 === "string" ? parsed.practice.p3 : ""
        },
        testAnswers: parsed && parsed.testAnswers && typeof parsed.testAnswers === "object" ? parsed.testAnswers : {}
      };
    } catch (e) {
      return def;
    }
  }

  var state = loadState();

  function saveState() {
    try {
      safeStorageSet(JSON.stringify(state));
    } catch (e) {
      // Ігноруємо
    }
    refreshHeaderAndProgress();
  }

  function normalizeQuotes(str) {
    return (str || "").replace(/['’`]/g, '"');
  }

  /* Симулятор 1 (2 бали): text="Ліцей Інтелект", fg="blue", bg="yellow" */
  function scoreSim1() {
    var s = state.simulators.sim1;
    if (!s.submitted) return 0;
    var txtNorm = (s.text || "").trim().replace(/\s+/g, " ");
    var textOk = txtNorm.toLowerCase() === "ліцей інтелект";
    var colorsOk = s.fg === "blue" && s.bg === "yellow";
    var pts = 0;
    if (textOk) pts += 1;
    if (colorsOk) pts += 1;
    return Math.min(2, pts);
  }

  /* Симулятор 2 (2 бали): font=("Times New Roman", 18, "bold") */
  function scoreSim2() {
    var s = state.simulators.sim2;
    if (!s.submitted) return 0;
    var familyAndSizeOk = s.family === "Times New Roman" && String(s.size) === "18";
    var weightOk = s.weight === "bold";
    var pts = 0;
    if (familyAndSizeOk) pts += 1;
    if (weightOk) pts += 1;
    return Math.min(2, pts);
  }

  /* Симулятор 3 (2 бали): place(x=80, y=100) */
  function scoreSim3() {
    var s = state.simulators.sim3;
    if (!s.submitted) return 0;
    var pts = 0;
    if (Number(s.x) === 80) pts += 1;
    if (Number(s.y) === 100) pts += 1;
    return Math.min(2, pts);
  }

  /* Практичне завдання 1 (3 бали) */
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

  /* Практичне завдання 2 (3 бали) */
  function scorePractice2(rawCode) {
    var norm = normalizeQuotes(rawCode).trim();
    if (!norm) return 0;
    var compact = norm.replace(/\s+/g, "");
    var hasBase =
      /(?:tk\.|tkinter\.)?Label\(root,/.test(compact) &&
      /text="Успіхівунавчанні!"/i.test(compact);
    var hasColors =
      /(?:fg|foreground)="white"/i.test(compact) &&
      /(?:bg|background)="purple"/i.test(compact);
    var hasFont = /font=\("Arial",16,"bold"\)/i.test(compact);
    var pts = 0;
    if (hasBase) pts += 1;
    if (hasColors) pts += 1;
    if (hasFont) pts += 1;
    return Math.min(3, pts);
  }

  /* Практичне завдання 3 (4 бали) */
  function scorePractice3(rawCode) {
    var norm = normalizeQuotes(rawCode).trim();
    if (!norm) return 0;
    var compact = norm.replace(/\s+/g, "");
    var hasConfig =
      /msg_lbl\.config(?:ure)?\(/.test(compact) &&
      /text="Роботувиконано!"/i.test(compact) &&
      /(?:fg|foreground)="green"/i.test(compact);
    var hasPlace =
      /msg_lbl\.place\(x=50,y=90\)/.test(compact) ||
      /msg_lbl\.place\(y=90,x=50\)/.test(compact);
    var pts = 0;
    if (hasConfig) pts += 2;
    if (hasPlace) pts += 2;
    return Math.min(4, pts);
  }

  function computeScores() {
    var simScore = Math.min(6, scoreSim1() + scoreSim2() + scoreSim3());
    var practiceScore = Math.min(
      10,
      scorePractice1(state.practice.p1) +
        scorePractice2(state.practice.p2) +
        scorePractice3(state.practice.p3)
    );

    var testScore = 0;
    Object.keys(TEST_ANSWERS).forEach(function (qKey) {
      if (state.testAnswers[qKey] === TEST_ANSWERS[qKey]) {
        testScore += 1;
      }
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
      roundedTotal: roundedTotal,
      percent: percent,
      grade12: grade12
    };
  }

  function formatPointsUk(val) {
    var rounded = Number(val.toFixed(2));
    return String(rounded).replace(".", ",");
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
    var pibDisplay = state.student.pib.trim() || "Не вказано";
    var classDisplay = state.student.className.trim() || "Не вказано";

    var elPib = document.getElementById("banner-pib");
    var elClass = document.getElementById("banner-class");
    if (elPib) elPib.textContent = pibDisplay;
    if (elClass) elClass.textContent = classDisplay;

    var totalTasks = 14;
    var doneTasks = getCompletedTasksCount();
    var pctProgress = Math.round((doneTasks / totalTasks) * 100);

    var pText = document.getElementById("progress-percent-text");
    var pBar = document.getElementById("progress-bar-fill");
    var livePts = document.getElementById("live-points-text");
    var scores = computeScores();

    if (pText) pText.textContent = pctProgress + "% (" + doneTasks + "/" + totalTasks + ")";
    if (pBar) pBar.style.width = pctProgress + "%";
    if (livePts) livePts.textContent = formatPointsUk(scores.totalScore) + " / 24";

    var tabs = document.querySelectorAll(".tab-btn");
    for (var i = 0; i < tabs.length; i++) {
      var pageAttr = tabs[i].getAttribute("data-goto");
      if (pageAttr === state.currentPage) {
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

  function showPage(pageId) {
    if (PAGES.indexOf(pageId) === -1) {
      pageId = "start";
    }

    var pibInput = document.getElementById("input-pib");
    var classInput = document.getElementById("input-class");
    if (pibInput && typeof pibInput.value === "string") {
      state.student.pib = pibInput.value;
    }
    if (classInput && typeof classInput.value === "string") {
      state.student.className = classInput.value;
    }

    if (pageId !== "start") {
      if (!state.student.pib.trim() || !state.student.className.trim()) {
        showStartError("Спочатку заповніть ПІБ учня та клас на стартовій сторінці!");
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
    try {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      window.scrollTo(0, 0);
    }
  }

  function updateSim1Preview() {
    var s = state.simulators.sim1;
    var preview = document.getElementById("sim1-preview");
    var codeEl = document.getElementById("sim1-code");
    if (!preview || !codeEl) return;

    preview.textContent = s.text.trim() || "(порожній напис)";
    preview.style.color = s.fg;
    preview.style.backgroundColor = s.bg;
    preview.style.fontWeight = "700";
    preview.style.fontSize = "18px";

    codeEl.textContent =
      'lbl = Label(root, text="' +
      s.text.replace(/"/g, '\"') +
      '", fg="' +
      s.fg +
      '", bg="' +
      s.bg +
      '")';
  }

  function updateSim2Preview() {
    var s = state.simulators.sim2;
    var preview = document.getElementById("sim2-preview");
    var codeEl = document.getElementById("sim2-code");
    if (!preview || !codeEl) return;

    preview.style.fontFamily = '"' + s.family + '", serif, sans-serif';
    preview.style.fontSize = s.size + "px";
    preview.style.fontWeight = s.weight === "bold" ? "bold" : "normal";
    preview.style.fontStyle = s.weight === "italic" ? "italic" : "normal";

    var fontTuple =
      s.weight === "normal"
        ? '("' + s.family + '", ' + s.size + ")"
        : '("' + s.family + '", ' + s.size + ', "' + s.weight + '")';
    codeEl.textContent = 'lbl = Label(root, text="Програмування на Python", font=' + fontTuple + ")";
  }

  function updateSim3Preview() {
    var s = state.simulators.sim3;
    var preview = document.getElementById("sim3-preview");
    var codeEl = document.getElementById("sim3-code");
    var valX = document.getElementById("sim3-x-val");
    var valY = document.getElementById("sim3-y-val");
    if (!preview || !codeEl) return;

    var xNum = Math.max(0, Math.min(240, Number(s.x) || 0));
    var yNum = Math.max(0, Math.min(150, Number(s.y) || 0));
    preview.style.left = xNum + "px";
    preview.style.top = yNum + "px";

    if (valX) valX.textContent = String(xNum);
    if (valY) valY.textContent = String(yNum);
    codeEl.textContent = "lbl.place(x=" + xNum + ", y=" + yNum + ")";
  }

  function syncSimulatorsUI() {
    var s1Text = document.getElementById("sim1-text");
    var s1Fg = document.getElementById("sim1-fg");
    var s1Bg = document.getElementById("sim1-bg");
    var s1Status = document.getElementById("status-sim1");
    if (s1Text) s1Text.value = state.simulators.sim1.text;
    if (s1Fg) s1Fg.value = state.simulators.sim1.fg;
    if (s1Bg) s1Bg.value = state.simulators.sim1.bg;
    if (s1Status) {
      if (state.simulators.sim1.submitted) {
        s1Status.textContent = "Стан симулятора 1 зафіксовано.";
        s1Status.className = "status-note status-note--saved";
      } else {
        s1Status.textContent = "";
        s1Status.className = "status-note";
      }
    }
    updateSim1Preview();

    var s2Fam = document.getElementById("sim2-family");
    var s2Size = document.getElementById("sim2-size");
    var s2Weight = document.getElementById("sim2-weight");
    var s2Status = document.getElementById("status-sim2");
    if (s2Fam) s2Fam.value = state.simulators.sim2.family;
    if (s2Size) s2Size.value = String(state.simulators.sim2.size);
    if (s2Weight) s2Weight.value = state.simulators.sim2.weight;
    if (s2Status) {
      if (state.simulators.sim2.submitted) {
        s2Status.textContent = "Стан симулятора 2 зафіксовано.";
        s2Status.className = "status-note status-note--saved";
      } else {
        s2Status.textContent = "";
        s2Status.className = "status-note";
      }
    }
    updateSim2Preview();

    var s3X = document.getElementById("sim3-x");
    var s3Y = document.getElementById("sim3-y");
    var s3Status = document.getElementById("status-sim3");
    if (s3X) s3X.value = String(state.simulators.sim3.x);
    if (s3Y) s3Y.value = String(state.simulators.sim3.y);
    if (s3Status) {
      if (state.simulators.sim3.submitted) {
        s3Status.textContent = "Координати в симуляторі 3 зафіксовано.";
        s3Status.className = "status-note status-note--saved";
      } else {
        s3Status.textContent = "";
        s3Status.className = "status-note";
      }
    }
    updateSim3Preview();
  }

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

    var lblText = textMatch ? textMatch[1] : "Напис Label";
    var fgVal = fgMatch ? fgMatch[1] : "#0f172a";
    var bgVal = bgMatch ? bgMatch[1] : "#e2e8f0";
    var fontFam = fontMatch ? fontMatch[1] : "Arial";
    var fontSize = fontMatch ? fontMatch[2] + "px" : "15px";
    var fontStyleStr = fontMatch && fontMatch[3] ? fontMatch[3].toLowerCase() : "normal";

    var widget = document.createElement("div");
    widget.className = "sim-label-preview";
    widget.textContent = lblText;
    widget.style.color = fgVal;
    widget.style.backgroundColor = bgVal;
    widget.style.fontFamily = fontFam;
    widget.style.fontSize = fontSize;
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

  function syncPracticeUI() {
    ["p1", "p2", "p3"].forEach(function (pKey) {
      var editor = document.getElementById("editor-" + pKey);
      var statusEl = document.getElementById("status-" + pKey);
      var val = state.practice[pKey] || "";
      if (editor) editor.value = val;
      if (val.trim() !== "") {
        renderPracticeStage(pKey, val);
        if (statusEl) {
          statusEl.textContent = "Код збережено.";
          statusEl.className = "status-note status-note--saved";
        }
      } else {
        renderPracticeStage(pKey, "");
        if (statusEl) {
          statusEl.textContent = "";
          statusEl.className = "status-note";
        }
      }
    });
  }

  function syncTestsUI() {
    Object.keys(TEST_ANSWERS).forEach(function (qKey) {
      var chosen = state.testAnswers[qKey];
      var noteEl = document.getElementById("status-" + qKey);
      var radios = document.querySelectorAll('input[name="' + qKey + '"]');
      for (var i = 0; i < radios.length; i++) {
        radios[i].checked = Boolean(chosen && radios[i].value === chosen);
      }
      if (noteEl) {
        if (chosen) {
          noteEl.textContent = "Відповідь зафіксовано.";
          noteEl.className = "status-note status-note--saved";
        } else {
          noteEl.textContent = "";
          noteEl.className = "status-note";
        }
      }
    });
  }

  function getCommentByPercent(pct) {
    if (pct >= 90) {
      return "Чудовий результат! Ти добре засвоїв/засвоїла тему.";
    }
    if (pct >= 70) {
      return "Гарна робота! Варто повторити окремі правила.";
    }
    if (pct >= 50) {
      return "Непогано! Потрібно ще попрацювати над темою.";
    }
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

  /* Делегування кліків та змін на рівні документа — гарантує роботу всіх кнопок */
  function bindDelegatedEvents() {
    document.addEventListener("click", function (ev) {
      var target = ev.target;
      if (!target || !target.closest) return;

      var gotoBtn = target.closest("[data-goto]");
      if (gotoBtn) {
        ev.preventDefault();
        var targetPage = gotoBtn.getAttribute("data-goto");
        showPage(targetPage);
        return;
      }

      if (target.closest("#btn-start-work")) {
        ev.preventDefault();
        var pibInput = document.getElementById("input-pib");
        var classInput = document.getElementById("input-class");
        var pibVal = pibInput ? pibInput.value.trim() : "";
        var clsVal = classInput ? classInput.value.trim() : "";
        if (!pibVal || !clsVal) {
          showStartError("Будь ласка, введіть Прізвище, ім'я та по батькові учня, а також клас (наприклад, 8-А).");
          return;
        }
        state.student.pib = pibVal;
        state.student.className = clsVal;
        clearStartError();
        saveState();
        showPage("theory");
        return;
      }

      if (target.closest("#btn-submit-sim1")) {
        ev.preventDefault();
        var s1T = document.getElementById("sim1-text");
        var s1F = document.getElementById("sim1-fg");
        var s1B = document.getElementById("sim1-bg");
        if (s1T) state.simulators.sim1.text = s1T.value;
        if (s1F) state.simulators.sim1.fg = s1F.value;
        if (s1B) state.simulators.sim1.bg = s1B.value;
        state.simulators.sim1.submitted = true;
        saveState();
        syncSimulatorsUI();
        return;
      }

      if (target.closest("#btn-submit-sim2")) {
        ev.preventDefault();
        var s2F = document.getElementById("sim2-family");
        var s2S = document.getElementById("sim2-size");
        var s2W = document.getElementById("sim2-weight");
        if (s2F) state.simulators.sim2.family = s2F.value;
        if (s2S) state.simulators.sim2.size = s2S.value;
        if (s2W) state.simulators.sim2.weight = s2W.value;
        state.simulators.sim2.submitted = true;
        saveState();
        syncSimulatorsUI();
        return;
      }

      if (target.closest("#btn-submit-sim3")) {
        ev.preventDefault();
        var s3X = document.getElementById("sim3-x");
        var s3Y = document.getElementById("sim3-y");
        if (s3X) state.simulators.sim3.x = Number(s3X.value);
        if (s3Y) state.simulators.sim3.y = Number(s3Y.value);
        state.simulators.sim3.submitted = true;
        saveState();
        syncSimulatorsUI();
        return;
      }

      var runBtn = target.closest("[id^='btn-run-']");
      if (runBtn) {
        ev.preventDefault();
        var pKey = runBtn.id.replace("btn-run-", "");
        var editor = document.getElementById("editor-" + pKey);
        var statusEl = document.getElementById("status-" + pKey);
        var codeVal = editor ? editor.value : "";
        state.practice[pKey] = codeVal;
        saveState();
        renderPracticeStage(pKey, codeVal.trim());
        if (statusEl) {
          if (codeVal.trim()) {
            statusEl.textContent = "Програму виконано, відповідь збережено.";
            statusEl.className = "status-note status-note--saved";
          } else {
            statusEl.textContent = "Поле коду порожнє — введіть команди Python.";
            statusEl.className = "status-note status-note--warn";
          }
        }
        return;
      }

      if (target.closest("#btn-print-report")) {
        ev.preventDefault();
        renderReport();
        window.print();
        return;
      }

      if (target.closest("#btn-reset-work")) {
        ev.preventDefault();
        var confirmed = window.confirm(
          "Ви впевнені, що хочете скинути всі попередні відповіді, налаштування симуляторів та бали і розпочати роботу заново?"
        );
        if (confirmed) {
          safeStorageRemove();
          state = createDefaultState();
          var pibInp = document.getElementById("input-pib");
          var clsInp = document.getElementById("input-class");
          if (pibInp) pibInp.value = "";
          if (clsInp) clsInp.value = "";
          syncSimulatorsUI();
          syncPracticeUI();
          syncTestsUI();
          refreshHeaderAndProgress();
          showPage("start");
        }
      }
    });

    document.addEventListener("input", function (ev) {
      var target = ev.target;
      if (!target || !target.id) return;

      if (target.id === "input-pib") {
        state.student.pib = target.value;
        saveState();
      } else if (target.id === "input-class") {
        state.student.className = target.value;
        saveState();
      } else if (target.id === "sim1-text") {
        state.simulators.sim1.text = target.value;
        updateSim1Preview();
        saveState();
      } else if (target.id === "sim3-x") {
        state.simulators.sim3.x = Number(target.value);
        updateSim3Preview();
        saveState();
      } else if (target.id === "sim3-y") {
        state.simulators.sim3.y = Number(target.value);
        updateSim3Preview();
        saveState();
      } else if (target.id === "editor-p1") {
        state.practice.p1 = target.value;
        saveState();
      } else if (target.id === "editor-p2") {
        state.practice.p2 = target.value;
        saveState();
      } else if (target.id === "editor-p3") {
        state.practice.p3 = target.value;
        saveState();
      }
    });

    document.addEventListener("change", function (ev) {
      var target = ev.target;
      if (!target) return;

      if (target.id === "sim1-fg") {
        state.simulators.sim1.fg = target.value;
        updateSim1Preview();
        saveState();
      } else if (target.id === "sim1-bg") {
        state.simulators.sim1.bg = target.value;
        updateSim1Preview();
        saveState();
      } else if (target.id === "sim2-family") {
        state.simulators.sim2.family = target.value;
        updateSim2Preview();
        saveState();
      } else if (target.id === "sim2-size") {
        state.simulators.sim2.size = target.value;
        updateSim2Preview();
        saveState();
      } else if (target.id === "sim2-weight") {
        state.simulators.sim2.weight = target.value;
        updateSim2Preview();
        saveState();
      } else if (target.type === "radio" && target.name && /^q[1-8]$/.test(target.name)) {
        state.testAnswers[target.name] = target.value;
        var noteEl = document.getElementById("status-" + target.name);
        if (noteEl) {
          noteEl.textContent = "Відповідь зафіксовано.";
          noteEl.className = "status-note status-note--saved";
        }
        saveState();
      }
    });
  }

  function init() {
    var pibInput = document.getElementById("input-pib");
    var classInput = document.getElementById("input-class");
    if (pibInput) pibInput.value = state.student.pib;
    if (classInput) classInput.value = state.student.className;

    syncSimulatorsUI();
    syncPracticeUI();
    syncTestsUI();
    bindDelegatedEvents();
    refreshHeaderAndProgress();

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
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
