const words = [
  {
    english: "driver",
    russian: "водитель",
    definition: "a person who drives a car, truck, or another vehicle",
    example: "The driver arrived at the warehouse at 9 a.m.",
    icon: "🚚"
  },
  {
    english: "warehouse",
    russian: "склад",
    definition: "a building where goods are stored",
    example: "The goods are waiting in the warehouse.",
    icon: "🏭"
  },
  {
    english: "delivery",
    russian: "доставка",
    definition: "the act of taking goods to a customer or another place",
    example: "The delivery will arrive tomorrow.",
    icon: "📦"
  },
  {
    english: "order",
    russian: "заказ",
    definition: "a request from a customer to buy goods or services",
    example: "We received a large order today.",
    icon: "📋"
  },
  {
    english: "client",
    russian: "клиент",
    definition: "a person or company that buys goods or services",
    example: "The client is waiting for the documents.",
    icon: "🤝"
  },
  {
    english: "loading",
    russian: "погрузка",
    definition: "the process of putting goods into a vehicle",
    example: "Loading starts at 8 a.m.",
    icon: "🏗️"
  }
];

const state = {
  index: 0,
  direction: "en_ru",
  mode: "typing",
  correct: 0,
  wrong: 0,
  repeat: 0,
  settingsOpen: false,
  answered: false,
  voiceText: ""
};

const el = {
  heroPanel: document.getElementById("heroPanel"),
  sidebarPanel: document.getElementById("sidebarPanel"),
  settingsToggleBtn: document.getElementById("settingsToggleBtn"),
  startBtn: document.getElementById("startBtn"),

  chipMode: document.getElementById("chipMode"),
  chipToday: document.getElementById("chipToday"),
  progressValue: document.getElementById("progressValue"),
  progressPercent: document.getElementById("progressPercent"),
  progressFill: document.getElementById("progressFill"),
  statCorrect: document.getElementById("statCorrect"),
  statWrong: document.getElementById("statWrong"),
  statRepeat: document.getElementById("statRepeat"),

  badgeDirection: document.getElementById("badgeDirection"),
  badgeMode: document.getElementById("badgeMode"),
  wordIcon: document.getElementById("wordIcon"),
  wordTaskLabel: document.getElementById("wordTaskLabel"),
  wordMain: document.getElementById("wordMain"),
  wordSub: document.getElementById("wordSub"),
  meaningText: document.getElementById("meaningText"),
  exampleText: document.getElementById("exampleText"),
  meaningCard: document.getElementById("meaningCard"),
  exampleCard: document.getElementById("exampleCard"),

  answerInput: document.getElementById("answerInput"),
  checkBtn: document.getElementById("checkBtn"),
  showAnswerBtn: document.getElementById("showAnswerBtn"),
  listenBtn: document.getElementById("listenBtn"),
  smallHintBtn: document.getElementById("smallHintBtn"),
  playWordBtn: document.getElementById("playWordBtn"),
  playAnswerBtn: document.getElementById("playAnswerBtn"),
  favoriteBtn: document.getElementById("favoriteBtn"),
  hintBtn: document.getElementById("hintBtn"),
  skipBtn: document.getElementById("skipBtn"),
  nextBtn: document.getElementById("nextBtn"),

  knowBtn: document.getElementById("knowBtn"),
  dontKnowBtn: document.getElementById("dontKnowBtn"),

  voiceBtn: document.getElementById("voiceBtn"),
  voiceStatus: document.getElementById("voiceStatus"),
  voiceResult: document.getElementById("voiceResult"),

  feedbackPanel: document.getElementById("feedbackPanel"),
  feedbackIcon: document.getElementById("feedbackIcon"),
  feedbackTitle: document.getElementById("feedbackTitle"),
  feedbackText: document.getElementById("feedbackText"),

  solutionPanel: document.getElementById("solutionPanel"),
  solutionMain: document.getElementById("solutionMain"),
  solutionEnglish: document.getElementById("solutionEnglish"),
  solutionRussian: document.getElementById("solutionRussian"),
  solutionMeaning: document.getElementById("solutionMeaning"),

  keyboardTip: document.getElementById("keyboardTip"),

  typingMode: document.getElementById("typingMode"),
  selfMode: document.getElementById("selfMode"),
  voiceMode: document.getElementById("voiceMode"),
  modeTabs: document.querySelectorAll("[data-mode-tab]"),
  directionInputs: document.querySelectorAll('input[name="direction"]'),
  modeInputs: document.querySelectorAll('input[name="answerMode"]')
};

const SpeechRecognitionCtor =
  window.SpeechRecognition || window.webkitSpeechRecognition || null;

let recognition = null;

function normalize(text) {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/ё/g, "е")
    .replace(/[.,!?;:"]/g, "")
    .replace(/\s+/g, " ");
}

function currentWord() {
  return words[state.index];
}

function getDirectionLabel(direction) {
  if (direction === "en_ru") return "EN → RU";
  if (direction === "ru_en") return "RU → EN";
  return "EN → EN";
}

function getModeLabel(mode) {
  if (mode === "typing") return "Typing";
  if (mode === "self") return "Know / Don't know";
  return "Voice";
}

function getCorrectAnswer(word) {
  if (state.direction === "en_ru") return word.russian;
  if (state.direction === "ru_en") return word.english;
  return word.english;
}

function getPromptData(word) {
  if (state.direction === "en_ru") {
    return {
      label: "Переведи слово",
      main: word.english,
      sub: "Представь образ, произнеси слово про себя и только потом отвечай"
    };
  }

  if (state.direction === "ru_en") {
    return {
      label: "Переведи на английский",
      main: word.russian,
      sub: "Вспомни английское слово и введи его без подсказки"
    };
  }

  return {
    label: "Пойми значение на английском",
    main: word.english,
    sub: "Опирайся на смысл, а не только на перевод"
  };
}

function updateProgress() {
  const done = state.index + 1;
  const total = words.length;
  const percent = Math.round((done / total) * 100);

  el.progressValue.textContent = `${done} / ${total}`;
  el.progressPercent.textContent = `${percent}%`;
  el.progressFill.style.width = `${percent}%`;

  el.statCorrect.textContent = state.correct;
  el.statWrong.textContent = state.wrong;
  el.statRepeat.textContent = state.repeat;
  el.chipToday.textContent = `${total} заданий`;
  el.chipMode.textContent = `${getDirectionLabel(state.direction)} · ${getModeLabel(state.mode)}`;
}

function showFeedback(type, title, text) {
  el.feedbackPanel.classList.remove("hidden");
  el.feedbackTitle.textContent = title;
  el.feedbackText.textContent = text;

  if (type === "success") {
    el.feedbackIcon.textContent = "✔";
  } else if (type === "error") {
    el.feedbackIcon.textContent = "✘";
  } else {
    el.feedbackIcon.textContent = "•";
  }
}

function hideFeedback() {
  el.feedbackPanel.classList.add("hidden");
}

function showSolution() {
  const word = currentWord();

  el.solutionPanel.classList.remove("hidden");
  el.solutionMain.textContent = getCorrectAnswer(word);
  el.solutionEnglish.textContent = word.english;
  el.solutionRussian.textContent = word.russian;
  el.solutionMeaning.textContent = word.definition;
}

function hideSolution() {
  el.solutionPanel.classList.add("hidden");
}

function setMode(mode) {
  state.mode = mode;

  el.modeTabs.forEach((tab) => {
    tab.classList.toggle("answer-tab--active", tab.dataset.modeTab === mode);
  });

  el.modeInputs.forEach((input) => {
    input.checked = input.value === mode;
  });

  el.typingMode.classList.toggle("hidden", mode !== "typing");
  el.selfMode.classList.toggle("hidden", mode !== "self");
  el.voiceMode.classList.toggle("hidden", mode !== "voice");

  if (mode === "typing") {
    el.keyboardTip.textContent = "Enter — проверить · Space — следующее";
  } else if (mode === "self") {
    el.keyboardTip.textContent = "Отметь, знаешь слово или нет";
  } else {
    el.keyboardTip.textContent = "Нажми на микрофон и произнеси ответ";
  }

  el.badgeMode.textContent = getModeLabel(mode);
  updateProgress();
}

function setDirection(direction) {
  state.direction = direction;

  el.directionInputs.forEach((input) => {
    input.checked = input.value === direction;
  });

  el.badgeDirection.textContent = getDirectionLabel(direction);
  renderCard();
}

function renderCard() {
  const word = currentWord();
  const prompt = getPromptData(word);

  state.answered = false;
  state.voiceText = "";

  el.wordIcon.textContent = word.icon;
  el.wordTaskLabel.textContent = prompt.label;
  el.wordMain.textContent = prompt.main;
  el.wordSub.textContent = prompt.sub;
  el.meaningText.textContent = word.definition;
  el.exampleText.textContent = word.example;

  el.answerInput.value = "";
  el.voiceResult.textContent = "Здесь будет распознанный текст ответа";
  el.voiceStatus.textContent = "Микрофон готов";

  hideFeedback();
  hideSolution();
  updateProgress();

  if (state.direction === "en_en") {
    el.meaningCard.classList.remove("hidden");
  } else {
    el.meaningCard.classList.remove("hidden");
  }

  if (window.innerWidth <= 680) {
    el.exampleCard.classList.add("hidden");
  } else {
    el.exampleCard.classList.remove("hidden");
  }
}

function checkTypingAnswer() {
  const word = currentWord();
  const user = normalize(el.answerInput.value);
  const correct = normalize(getCorrectAnswer(word));

  if (!user) {
    showFeedback("error", "Пустой ответ", "Сначала введи ответ.");
    return;
  }

  if (user === correct) {
    state.correct += 1;
    state.answered = true;
    showFeedback("success", "Правильно", "Отлично. Ответ верный.");
    hideSolution();
  } else {
    state.wrong += 1;
    state.repeat += 1;
    state.answered = true;
    showFeedback("error", "Неправильно", "Посмотри правильный ответ ниже.");
    showSolution();
  }

  updateProgress();
}

function markKnow() {
  state.correct += 1;
  state.answered = true;
  showFeedback("success", "Отмечено", "Хорошо. Слово засчитано как знакомое.");
  hideSolution();
  updateProgress();
}

function markDontKnow() {
  state.wrong += 1;
  state.repeat += 1;
  state.answered = true;
  showFeedback("error", "Отмечено", "Это слово добавлено на повтор.");
  showSolution();
  updateProgress();
}

function nextWord() {
  state.index += 1;
  if (state.index >= words.length) {
    state.index = 0;
  }
  renderCard();
}

function skipWord() {
  showFeedback("error", "Пропущено", "Переходим к следующему слову.");
  setTimeout(() => {
    nextWord();
  }, 250);
}

function toggleSettings() {
  state.settingsOpen = !state.settingsOpen;
  el.heroPanel.classList.toggle("panel-collapsed", !state.settingsOpen);
  el.sidebarPanel.classList.toggle("panel-collapsed", !state.settingsOpen);
}

function showHint() {
  const word = currentWord();

  if (state.direction === "en_ru") {
    showFeedback("success", "Подсказка", `Первая буква ответа: ${word.russian[0].toUpperCase()}`);
  } else {
    showFeedback("success", "Подсказка", `Первая буква ответа: ${word.english[0].toUpperCase()}`);
  }
}

function speakText(text, lang = "en-US") {
  if (!("speechSynthesis" in window)) {
    showFeedback("error", "Нет озвучки", "Браузер не поддерживает озвучку.");
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.92;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

function speakWord() {
  const word = currentWord();

  if (state.direction === "en_ru" || state.direction === "en_en") {
    speakText(word.english, "en-US");
  } else {
    speakText(word.english, "en-US");
  }
}

function speakAnswer() {
  const word = currentWord();

  if (state.direction === "en_ru") {
    speakText(word.russian, "ru-RU");
  } else {
    speakText(word.english, "en-US");
  }
}

function toggleFavorite() {
  const active = el.favoriteBtn.textContent === "★";
  el.favoriteBtn.textContent = active ? "☆" : "★";
  showFeedback("success", active ? "Убрано" : "Сохранено", active ? "Слово убрано из избранного." : "Слово добавлено в избранное.");
}

function startVoice() {
  if (!SpeechRecognitionCtor) {
    el.voiceStatus.textContent = "Браузер не поддерживает голосовой ввод";
    el.voiceResult.textContent = "Попробуй Chrome на телефоне или ПК";
    return;
  }

  if (recognition) {
    recognition.stop();
  }

  recognition = new SpeechRecognitionCtor();
  recognition.lang = state.direction === "en_ru" ? "ru-RU" : "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  el.voiceStatus.textContent = "Слушаю...";
  el.voiceResult.textContent = "Говори сейчас";

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    state.voiceText = transcript;
    el.voiceStatus.textContent = "Ответ получен";
    el.voiceResult.textContent = transcript;

    const correct = normalize(getCorrectAnswer(currentWord()));
    const spoken = normalize(transcript);

    if (spoken === correct) {
      state.correct += 1;
      state.answered = true;
      showFeedback("success", "Правильно", "Голосовой ответ совпал.");
      hideSolution();
    } else {
      state.wrong += 1;
      state.repeat += 1;
      state.answered = true;
      showFeedback("error", "Неправильно", "Голосовой ответ не совпал.");
      showSolution();
    }

    updateProgress();
  };

  recognition.onerror = () => {
    el.voiceStatus.textContent = "Ошибка распознавания";
    el.voiceResult.textContent = "Попробуй ещё раз";
  };

  recognition.start();
}

function bindEvents() {
  el.settingsToggleBtn.addEventListener("click", toggleSettings);
  el.startBtn.addEventListener("click", () => {
    state.index = 0;
    state.correct = 0;
    state.wrong = 0;
    state.repeat = 0;
    renderCard();
    showFeedback("success", "Тренировка начата", "Можно отвечать.");
  });

  el.checkBtn.addEventListener("click", checkTypingAnswer);
  el.showAnswerBtn.addEventListener("click", () => {
    showSolution();
    showFeedback("success", "Ответ открыт", "Посмотри правильный вариант.");
  });

  el.smallHintBtn.addEventListener("click", showHint);
  el.hintBtn.addEventListener("click", showHint);
  el.listenBtn.addEventListener("click", speakWord);
  el.playWordBtn.addEventListener("click", speakWord);
  el.playAnswerBtn.addEventListener("click", speakAnswer);
  el.favoriteBtn.addEventListener("click", toggleFavorite);

  el.knowBtn.addEventListener("click", markKnow);
  el.dontKnowBtn.addEventListener("click", markDontKnow);

  el.nextBtn.addEventListener("click", nextWord);
  el.skipBtn.addEventListener("click", skipWord);

  el.voiceBtn.addEventListener("click", startVoice);

  el.answerInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      checkTypingAnswer();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.code === "Space" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
      event.preventDefault();
      nextWord();
    }
  });

  el.modeTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      setMode(tab.dataset.modeTab);
    });
  });

  el.directionInputs.forEach((input) => {
    input.addEventListener("change", () => {
      setDirection(input.value);
    });
  });

  el.modeInputs.forEach((input) => {
    input.addEventListener("change", () => {
      setMode(input.value);
    });
  });

  window.addEventListener("resize", () => {
    renderCard();
  });
}

bindEvents();
setMode("typing");
setDirection("en_ru");
renderCard();
