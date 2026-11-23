/* =========================================================
   Логіка інтерактивної вебсторінки з інформатики (8 клас)
   Тема: «Написи в Python» (бібліотека tkinter, клас Label)
   Блоки:
   - Сторінка 1: Теоретичний конспект
   - Сторінка 2: Інтерактивні симулятори з завданнями (3 симулятори = 6 балів)
   - Сторінка 3: Практичні завдання з кодом Python (3 завдання = 10 балів)
   - Сторінка 4: Тестові завдання (8 тестів = 8 балів)
   - Сторінка 5: Підсумковий звіт (усього 24 бали, 12-бальна шкала)
   ========================================================= */

(function () {
  "use strict";

  var STORAGE_KEY = "python8_labels_sim_practice_v2";

  var PAGES = [
    "start",
    "theory",
    "simulators",
    "practice",
    "test",
    "report"
  ];

  /* Правильні відповіді на 8 тестових завдань (по 1 балу = 8 балів) */
  var TEST_ANSWERS = {
    q1: "В", // Label
    q2: "Б", // text
    q3: "А", // fg
    q4: "Б", // bg
    q5: "В", // font=("Arial", 16, "bold")
    q6: "Г", // lbl.pack()
    q7: "Б", // config()
    q8: "А"  // У символах (ширина) та рядках (висота)
  };

  /* Шкала переведення балів (0..24) у 12-бальну систему */
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

  function loadState() {
    var def = createDefaultState();
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return def;
      var parsed = JSON.parse(raw);
      return {
        student: {
          pib: parsed && parsed.student && typeof parsed.student.pib === "string" ? parsed.student.pib : "",
          className: parsed && parsed.student && typeof parsed.student.className === "string" ? parsed.student.className : ""
        },
        currentPage: parsed && PAGES.indexOf(parsed.currentPage) !== -1 ? parsed.currentPage : "start",
        simulators: {
          sim1: Object.assign({}, def.simulators.sim1, parsed && parsed.simulators && parsed.simulators.sim1 ? parsed.simulators.sim1 : {}),
          sim2: Object.assign({}, def.simulators.sim2, parsed && parsed.simulators && parsed.simulators.sim2 : {}),
          sim3: Object.assign({}, def.simulators.sim3, parsed && parsed.simulators && parsed.simulators.sim3 : {})
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      // Ігноруємо помилку сховища
    }
    refreshHeaderAndProgress();
  }

  /* ==================== ОЦІНЮВАННЯ СИМУЛЯТОРІВ (3 симулятори * 2 бали = 6 балів) ==================== */

  /* Симулятор 1 (2 бали):
     Завдання: Налаштувати напис так, щоб:
     - text = "Ліцей Інтелект"
     - fg = "blue"
     - bg = "yellow" */
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

  /* Симулятор 2 (2 бали):
     Завдання: Налаштувати шрифт напису так, щоб:
     - гарнітура: "Times New Roman"
     - розмір: 18
     - накреслення: "bold" */
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

  /* Симулятор 3 (2 бали):
     Завдання: Розмістити напис у вікні за точними координатами x = 80, y = 100. */
  function scoreSim3() {
    var s = state.simulators.sim3;
    if (!s.submitted) return 0;
    var pts = 0;
    if (Number(s.x) === 80) pts += 1;
    if (Number(s.y) === 100) pts += 1;
    return Math.min(2, pts);
  }

  /* ==================== ОЦІНЮВАННЯ ПРАКТИЧНИХ ЗАВДАНЬ (3 завдання = 10 балів) ==================== */

  function normalizeQuotes(str) {
    return (str || "").replace(/['’`]/g, '"');
  }

  /* Практичне завдання 1 (3 бали):
     Створити напис lbl у вікні root з текстом "Інформатика 8 клас" та розмістити його методом pack().
     - 1.5 бала за Label(root, text="Інформатика 8 клас")
     - 1.5 бала за lbl.pack() */
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

  /* Практичне завдання 2 (3 бали):
     Створити кольоровий напис title_lbl у вікні root:
     text="Успіхів у навчанні!", fg="white", bg="purple", font=("Arial", 16, "bold")
     - 1 бал за Label з потрібним текстом
     - 1 бал за кольори fg="white" та bg="purple"
     - 1 бал за шрифт font=("Arial", 16, "bold") */
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
    var hasFont =
      /font=\("Arial",16,"bold"\)/i.test(compact);

    var pts = 0;
    if (hasBase) pts += 1;
    if (hasColors) pts += 1;
    if (hasFont) pts += 1;
    return Math.min(3, pts);
  }

  /* Практичне завдання 3 (4 бали):
     Змінити властивості напису msg_lbl методом config() на text="Роботу виконано!" та fg="green",
     і розмістити його за координатами place(x=50, y=90).
     - 2 бали за msg_lbl.config(text="Роботу виконано!", fg="green")
     - 2 бали за msg_lbl.place(x=50, y=90) */
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

    var totalTasks = 14; // 3 симулятори + 3 практичні + 8 тестових
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
      tabs[i].classList.toggle("is-active", pageAttr === state.currentPage);
    }
  }

  function showPage(pageId) {
    if (PAGES.indexOf(pageId) === -1) {
      pageId = "start";
    }

    if (pageId !== "start") {
      if (!state.student.pib.trim() || !state.student.className.trim()) {
        showStartError("Спочатку заповніть ПІБ учня та клас на стартовій сторінці!");
        pageId = "start";
      }
    }

    state.currentPage = pageId;
    var screens = document.querySelectorAll(".page-screen");
    for (var i = 0; i < screens.length; i++) {
      screens[i].classList.toggle("is-active", screens[i].id === "page-" + pageId);
    }

    if (pageId === "report") {
      renderReport();
    }

    saveState();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function showStartError(msg) {
    var errBox = document.getElementById("start-validation-msg");
    if (!errBox) return;
    errBox.textContent = msg;
    errBox.className = "status-note status-note--warn";
    errBox.style.display = "block";
  }

  /* ==================== ІНТЕРАКТИВНІ СИМУЛЯТОРИ ==================== */
  function updateSim1Preview() {
    var s = state.simulators.sim1;
    var preview = document.getElementById("sim1-preview");
    var codeEl = document.getElementById("sim1-code");
    if (!preview || !codeEl) return;

    var displayTxt = s.text.trim() || "(порожній напис)";
    preview.textContent = displayTxt;
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

  function initSimulators() {
    // Симулятор 1
    var s1Text = document.getElementById("sim1-text");
    var s1Fg = document.getElementById("sim1-fg");
    var s1Bg = document.getElementById("sim1-bg");
    var s1Btn = document.getElementById("btn-submit-sim1");
    var s1Status = document.getElementById("status-sim1");

    if (s1Text && s1Fg && s1Bg) {
      s1Text.value = state.simulators.sim1.text;
      s1Fg.value = state.simulators.sim1.fg;
      s1Bg.value = state.simulators.sim1.bg;
      updateSim1Preview();

      s1Text.addEventListener("input", function () {
        state.simulators.sim1.text = s1Text.value;
        updateSim1Preview();
        saveState();
      });
      s1Fg.addEventListener("change", function () {
        state.simulators.sim1.fg = s1Fg.value;
        updateSim1Preview();
        saveState();
      });
      s1Bg.addEventListener("change", function () {
        state.simulators.sim1.bg = s1Bg.value;
        updateSim1Preview();
        saveState();
      });
    }

    if (s1Btn) {
      if (state.simulators.sim1.submitted && s1Status) {
        s1Status.textContent = "Стан симулятора 1 зафіксовано.";
        s1Status.className = "status-note status-note--saved";
      }
      s1Btn.addEventListener("click", function () {
        state.simulators.sim1.submitted = true;
        saveState();
        if (s1Status) {
          s1Status.textContent = "Стан симулятора 1 зафіксовано.";
          s1Status.className = "status-note status-note--saved";
        }
      });
    }

    // Симулятор 2
    var s2Fam = document.getElementById("sim2-family");
    var s2Size = document.getElementById("sim2-size");
    var s2Weight = document.getElementById("sim2-weight");
    var s2Btn = document.getElementById("btn-submit-sim2");
    var s2Status = document.getElementById("status-sim2");

    if (s2Fam && s2Size && s2Weight) {
      s2Fam.value = state.simulators.sim2.family;
      s2Size.value = String(state.simulators.sim2.size);
      s2Weight.value = state.simulators.sim2.weight;
      updateSim2Preview();

      s2Fam.addEventListener("change", function () {
        state.simulators.sim2.family = s2Fam.value;
        updateSim2Preview();
        saveState();
      });
      s2Size.addEventListener("change", function () {
        state.simulators.sim2.size = s2Size.value;
        updateSim2Preview();
        saveState();
      });
      s2Weight.addEventListener("change", function () {
        state.simulators.sim2.weight = s2Weight.value;
        updateSim2Preview();
        saveState();
      });
    }

    if (s2Btn) {
      if (state.simulators.sim2.submitted && s2Status) {
        s2Status.textContent = "Стан симулятора 2 зафіксовано.";
        s2Status.className = "status-note status-note--saved";
      }
      s2Btn.addEventListener("click", function () {
        state.simulators.sim2.submitted = true;
        saveState();
        if (s2Status) {
          s2Status.textContent = "Стан симулятора 2 зафіксовано.";
          s2Status.className = "status-note status-note--saved";
        }
      });
    }

    // Симулятор 3
    var s3X = document.getElementById("sim3-x");
    var s3Y = document.getElementById("sim3-y");
    var s3Btn = document.getElementById("btn-submit-sim3");
    var s3Status = document.getElementById("status-sim3");

    if (s3X && s3Y) {
      s3X.value = String(state.simulators.sim3.x);
      s3Y.value = String(state.simulators.sim3.y);
      updateSim3Preview();

      s3X.addEventListener("input", function () {
        state.simulators.sim3.x = Number(s3X.value);
        updateSim3Preview();
        saveState();
      });
      s3Y.addEventListener("input", function () {
        state.simulators.sim3.y = Number(s3Y.value);
        updateSim3Preview();
        saveState();
      });
    }

    if (s3Btn) {
      if (state.simulators.sim3.submitted && s3Status) {
        s3Status.textContent = "Координати в симуляторі 3 зафіксовано.";
        s3Status.className = "status-note status-note--saved";
      }
      s3Btn.addEventListener("click", function () {
        state.simulators.sim3.submitted = true;
        saveState();
        if (s3Status) {
          s3Status.textContent = "Координати в симуляторі 3 зафіксовано.";
          s3Status.className = "status-note status-note--saved";
        }
      });
    }
  }

  /* ==================== ВІЗУАЛЬНИЙ ЗАПУСК КОДУ В ПРАКТИЧНИХ ЗАВДАННЯХ ==================== */
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

  function initPracticeTasks() {
    ["p1", "p2", "p3"].forEach(function (pKey) {
      var editor = document.getElementById("editor-" + pKey);
      var runBtn = document.getElementById("btn-run-" + pKey);
      var statusEl = document.getElementById("status-" + pKey);

      if (editor) {
        editor.value = state.practice[pKey] || "";
        if (editor.value.trim() !== "") {
          renderPracticeStage(pKey, editor.value);
          if (statusEl) {
            statusEl.textContent = "Код збережено.";
            statusEl.className = "status-note status-note--saved";
          }
        }

        editor.addEventListener("input", function () {
          state.practice[pKey] = editor.value;
          saveState();
        });
      }

      if (runBtn && editor) {
        runBtn.addEventListener("click", function () {
          var codeVal = editor.value.trim();
          state.practice[pKey] = editor.value;
          saveState();
          renderPracticeStage(pKey, codeVal);
          if (statusEl) {
            if (codeVal) {
              statusEl.textContent = "Програму виконано, відповідь збережено.";
              statusEl.className = "status-note status-note--saved";
            } else {
              statusEl.textContent = "Поле коду порожнє — введіть команди Python.";
              statusEl.className = "status-note status-note--warn";
            }
          }
        });
      }
    });
  }

  /* ==================== ЗВІТ ТА ВІДНОВЛЕННЯ ДАНИХ ==================== */
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

    var summaryText =
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
      " за 12-бальною шкалою.";
    setText("rep-general-summary", summaryText);
  }

  function restoreInputsFromState() {
    var pibInput = document.getElementById("input-pib");
    var classInput = document.getElementById("input-class");
    if (pibInput) pibInput.value = state.student.pib;
    if (classInput) classInput.value = state.student.className;

    Object.keys(TEST_ANSWERS).forEach(function (qKey) {
      var chosen = state.testAnswers[qKey];
      var noteEl = document.getElementById("status-" + qKey);
      if (chosen) {
        var radio = document.querySelector('input[name="' + qKey + '"][value="' + chosen + '"]');
        if (radio) radio.checked = true;
        if (noteEl) {
          noteEl.textContent = "Відповідь зафіксовано.";
          noteEl.className = "status-note status-note--saved";
        }
      }
    });
  }

  function bindEvents() {
    var pibInput = document.getElementById("input-pib");
    var classInput = document.getElementById("input-class");

    if (pibInput) {
      pibInput.addEventListener("input", function () {
        state.student.pib = pibInput.value;
        saveState();
      });
    }

    if (classInput) {
      classInput.addEventListener("input", function () {
        state.student.className = classInput.value;
        saveState();
      });
    }

    var startBtn = document.getElementById("btn-start-work");
    if (startBtn) {
      startBtn.addEventListener("click", function () {
        var pibVal = pibInput ? pibInput.value.trim() : "";
        var clsVal = classInput ? classInput.value.trim() : "";
        if (!pibVal || !clsVal) {
          showStartError("Будь ласка, введіть Прізвище, ім'я та по батькові учня, а також клас (наприклад, 8-А).");
          return;
        }
        state.student.pib = pibVal;
        state.student.className = clsVal;
        var errBox = document.getElementById("start-validation-msg");
        if (errBox) errBox.style.display = "none";
        saveState();
        showPage("theory");
      });
    }

    var navTriggers = document.querySelectorAll("[data-goto]");
    for (var i = 0; i < navTriggers.length; i++) {
      navTriggers[i].addEventListener("click", function () {
        var targetPage = this.getAttribute("data-goto");
        showPage(targetPage);
      });
    }

    var radios = document.querySelectorAll('.options-list input[type="radio"]');
    for (var r = 0; r < radios.length; r++) {
      radios[r].addEventListener("change", function () {
        var qName = this.name;
        state.testAnswers[qName] = this.value;
        var noteEl = document.getElementById("status-" + qName);
        if (noteEl) {
          noteEl.textContent = "Відповідь зафіксовано.";
          noteEl.className = "status-note status-note--saved";
        }
        saveState();
      });
    }

    var printBtn = document.getElementById("btn-print-report");
    if (printBtn) {
      printBtn.addEventListener("click", function () {
        renderReport();
        window.print();
      });
    }

    var resetBtn = document.getElementById("btn-reset-work");
    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        var confirmed = window.confirm(
          "Ви впевнені, що хочете скинути всі попередні відповіді, налаштування симуляторів та бали і розпочати роботу заново?"
        );
        if (confirmed) {
          localStorage.removeItem(STORAGE_KEY);
          state = createDefaultState();
          restoreInputsFromState();
          initSimulators();
          initPracticeTasks();
          refreshHeaderAndProgress();
          showPage("start");
        }
      });
    }
  }

  function init() {
    restoreInputsFromState();
    initSimulators();
    initPracticeTasks();
    bindEvents();
    refreshHeaderAndProgress();

    var screens = document.querySelectorAll(".page-screen");
    for (var i = 0; i < screens.length; i++) {
      screens[i].classList.toggle("is-active", screens[i].id === "page-" + state.currentPage);
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
