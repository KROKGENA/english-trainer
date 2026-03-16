const appData = {
  words: [
    {
      type: "Words",
      skill: "Meaning",
      title: "river",
      text: "The river is calm. The morning is bright and fresh.",
      context: "A river is a natural flow of water. You can see it, hear it, and follow it.",
      example: "The boat is on the river.",
      grammar: "Use the with specific things: the river, the boat, the morning.",
      meaning: "a long natural stream of water",
      story: "J., George, Harris, and Montmorency travel on the river.",
      emoji: "🌊",
      answer: "river",
      hint: "It is water, but not the sea.",
      listenText: "river"
    },
    {
      type: "Words",
      skill: "Meaning",
      title: "boat",
      text: "The boat is small, light, and ready for the trip.",
      context: "A boat moves on water. It can carry people and bags.",
      example: "The men sit in the boat.",
      grammar: "Use a for one thing in general: a boat. Use the for a known one: the boat.",
      meaning: "a small vehicle for traveling on water",
      story: "The three men travel in a boat with Montmorency.",
      emoji: "🚣",
      answer: "boat",
      hint: "It moves on a river.",
      listenText: "boat"
    },
    {
      type: "Words",
      skill: "Meaning",
      title: "driver",
      text: "A driver works early and moves goods from place to place.",
      context: "A driver drives a car, van, truck, or bus.",
      example: "The driver is late today.",
      grammar: "Use a before jobs in general: a driver, a teacher, a pilot.",
      meaning: "a person who drives a vehicle",
      story: "In work scenes, the driver brings the goods to the warehouse.",
      emoji: "🚚",
      answer: "driver",
      hint: "This person drives.",
      listenText: "driver"
    },
    {
      type: "Words",
      skill: "Meaning",
      title: "warehouse",
      text: "The warehouse is big, bright, and full of boxes.",
      context: "A warehouse is a place where goods are stored.",
      example: "The driver is at the warehouse.",
      grammar: "Use the when the place is already clear in the story: the warehouse.",
      meaning: "a building where goods are stored",
      story: "The work team checks goods in the warehouse.",
      emoji: "🏬",
      answer: "warehouse",
      hint: "It is a building for goods.",
      listenText: "warehouse"
    },
    {
      type: "Grammar",
      skill: "Articles",
      title: "the river",
      text: "Use the when both people know the thing.",
      context: "The river, the boat, the dog — these are clear in the story.",
      example: "The boat is on the river.",
      grammar: "the = a specific thing",
      meaning: "specific article",
      story: "J. talks about the river because everyone knows which river he means.",
      emoji: "📘",
      answer: "the",
      hint: "This article points to a specific thing.",
      listenText: "the river"
    },
    {
      type: "Grammar",
      skill: "Pronouns",
      title: "he",
      text: "Use he for one male person.",
      context: "J. is a man. George is a man. Harris is a man.",
      example: "He is tired.",
      grammar: "he = one male person",
      meaning: "male singular pronoun",
      story: "George is late. He is still packing.",
      emoji: "👤",
      answer: "he",
      hint: "Male singular pronoun.",
      listenText: "he"
    },
    {
      type: "Listening",
      skill: "Sound",
      title: "Listen and type",
      text: "Tap Listen. Hear the word. Type what you hear.",
      context: "Start with short clear words.",
      example: "river",
      grammar: "Listening comes before fast speaking.",
      meaning: "hear and recognize",
      story: "You hear the word from the story world.",
      emoji: "🎧",
      answer: "river",
      hint: "It is water in nature.",
      listenText: "river"
    },
    {
      type: "Speaking",
      skill: "Say it",
      title: "Speak clearly",
      text: "Tap the microphone and say the word.",
      context: "Short words first. Clear rhythm. Calm voice.",
      example: "boat",
      grammar: "Speaking grows through repetition.",
      meaning: "say the word out loud",
      story: "Say the word as if you are inside the story.",
      emoji: "🎤",
      answer: "boat",
      hint: "A small thing on water.",
      listenText: "boat"
    },
    {
      type: "Story Mode",
      skill: "Story",
      title: "Montmorency",
      text: "Montmorency is small, lively, and full of character.",
      context: "He is the dog in the boat story.",
      example: "Montmorency jumps into the boat.",
      grammar: "Names do not need an article.",
      meaning: "the dog in the story",
      story: "Montmorency is never quiet for long.",
      emoji: "🐶",
      answer: "montmorency",
      hint: "The dog in Three Men in a Boat.",
      listenText: "Montmorency"
    }
  ]
};

const state = {
  currentScreen: "words",
  currentMode: "typing",
  currentIndexByScreen: {
    words: 0,
    grammar: 0,
    listening: 0,
    speaking: 0,
    story: 0
  },
  progressByScreen: {
    words: { done: 0, total: 12 },
    grammar: { done: 0, total: 12 },
    listening: { done: 0, total: 12 },
    speaking: { done: 0, total: 12 },
    story: { done: 0, total: 12 }
  },
  savedItems: new Set(),
  drawerOpen: false,
  lastVoiceText: "",
  currentFiltered: []
};

const els = {
  menuBtn: document.getElementById("menuBtn"),
  profileBtn: document.getElementById("profileBtn"),
  mobileDrawer: document.getElementById("mobileDrawer"),
  drawerLinks: document.querySelectorAll(".drawer-link"),

  currentModePill: document.getElementById("currentModePill"),
  currentLevelPill: document.getElementById("currentLevelPill"),
  todayTitle: document.getElementById("todayTitle"),
  todaySubtitle: document.getElementById("todaySubtitle"),
  progressText: document.getElementById("progressText"),
  progressFill: document.getElementById("progressFill"),

  lessonTypeBadge: document.getElementById("lessonTypeBadge"),
  lessonSkillBadge: document.getElementById("lessonSkillBadge"),
  playBtn: document.getElementById("playBtn"),
  hintBtn: document.getElementById("hintBtn"),
  saveBtn: document.getElementById("saveBtn"),

  sceneEmoji: document.getElementById("sceneEmoji"),
  sceneLabel: document.getElementById("sceneLabel"),
  mainPrompt: document.getElementById("mainPrompt"),
  mainPromptText: document.getElementById("mainPromptText"),
  contextText: document.getElementById("contextText"),
  exampleText: document.getElementById("exampleText"),
  miniGrammarText: document.getElementById("miniGrammarText"),

  typingMode: document.getElementById("typingMode"),
  selfMode: document.getElementById("selfMode"),
  voiceMode: document.getElementById("voiceMode"),
  modeTabs: document.querySelectorAll(".mode-tab"),

  answerInput: document.getElementById("answerInput"),
  checkBtn: document.getElementById("checkBtn"),
  showHintBtn: document.getElementById("showHintBtn"),
  showAnswerBtn: document.getElementById("showAnswerBtn"),
  listenBtn: document.getElementById("listenBtn"),

  knowBtn: document.getElementById("knowBtn"),
  dontKnowBtn: document.getElementById("dontKnowBtn"),

  voiceBtn: document.getElementById("voiceBtn"),
  voiceStatus: document.getElementById("voiceStatus"),
  voiceResult: document.getElementById("voiceResult"),

  feedbackBox: document.getElementById("feedbackBox"),
  feedbackIcon: document.getElementById("feedbackIcon"),
  feedbackTitle: document.getElementById("feedbackTitle"),
  feedbackText: document.getElementById("feedbackText"),

  solutionBox: document.getElementById("solutionBox"),
  solutionMain: document.getElementById("solutionMain"),
  solutionWord: document.getElementById("solutionWord"),
  solutionMeaning: document.getElementById("solutionMeaning"),
  solutionStory: document.getElementById("solutionStory"),
  playAnswerBtn: document.getElementById("playAnswerBtn"),

  prevBtn: document.getElementById("prevBtn"),
  skipBtn: document.getElementById("skipBtn"),
  nextBtn: document.getElementById("nextBtn")
};

const SpeechRecognitionCtor =
  window.SpeechRecognition || window.webkitSpeechRecognition || null;

let recognition = null;

function normalize(text) {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/ё/g, "e")
    .replace(/[.,!?;:"]/g, "")
    .replace(/\s+/g, " ");
}

function mapScreenToType(screen) {
  if (screen === "words") return "Words";
  if (screen === "grammar") return "Grammar";
  if (screen === "listening") return "Listening";
  if (screen === "speaking") return "Speaking";
  return "Story Mode";
}

function getItemsForCurrentScreen() {
  const type = mapScreenToType(state.currentScreen);
  return appData.words.filter((item) => item.type === type);
}

function getCurrentItem() {
  state.currentFiltered = getItemsForCurrentScreen();
  const list = state.currentFiltered;

  if (!list.length) return null;

  let index = state.currentIndexByScreen[state.currentScreen] || 0;
  if (index >= list.length) {
    index = 0;
    state.currentIndexByScreen[state.currentScreen] = 0;
  }

  return list[index];
}

function updateProgress() {
  const list = getItemsForCurrentScreen();
  const current = (state.currentIndexByScreen[state.currentScreen] || 0) + 1;
  const total = list.length || 1;
  const percent = Math.round((current / total) * 100);

  els.progressText.textContent = `${current} / ${total}`;
  els.progressFill.style.width = `${percent}%`;
}

function updateHeader() {
  const labels = {
    words: { title: "Simple Living English", subtitle: "Learn through scenes, actions, and easy meaning." },
    grammar: { title: "Small Grammar Steps", subtitle: "Build articles, pronouns, questions, and tense patterns." },
    listening: { title: "Listening Ears", subtitle: "Hear short words and sentences clearly." },
    speaking: { title: "Speaking Practice", subtitle: "Say words and short lines with confidence." },
    story: { title: "Story World", subtitle: "Meet J., George, Harris, and Montmorency." }
  };

  els.currentModePill.textContent = mapScreenToType(state.currentScreen);
  els.currentLevelPill.textContent =
    state.currentScreen === "words" ? "Starter" :
    state.currentScreen === "grammar" ? "Core" :
    state.currentScreen === "listening" ? "Audio" :
    state.currentScreen === "speaking" ? "Voice" : "Book";

  els.todayTitle.textContent = labels[state.currentScreen].title;
  els.todaySubtitle.textContent = labels[state.currentScreen].subtitle;
}

function renderItem() {
  const item = getCurrentItem();
  if (!item) return;

  updateHeader();
  updateProgress();

  els.lessonTypeBadge.textContent = item.type;
  els.lessonSkillBadge.textContent = item.skill;

  els.sceneEmoji.textContent = item.emoji;
  els.sceneLabel.textContent = item.type;
  els.mainPrompt.textContent = item.title;
  els.mainPromptText.textContent = item.text;
  els.contextText.textContent = item.context;
  els.exampleText.textContent = item.example;
  els.miniGrammarText.innerHTML = item.grammar;

  els.answerInput.value = "";
  els.voiceStatus.textContent = "Ready";
  els.voiceResult.textContent = "Your speech will appear here.";

  hideFeedback();
  hideSolution();
  updateSaveButton();
  applyScreenDefaults();
}

function applyScreenDefaults() {
  if (state.currentScreen === "speaking") {
    setMode("voice");
  } else if (state.currentScreen === "listening") {
    setMode("typing");
  }
}

function setMode(mode) {
  state.currentMode = mode;

  els.modeTabs.forEach((tab) => {
    tab.classList.toggle("mode-tab--active", tab.dataset.mode === mode);
  });

  els.typingMode.classList.toggle("hidden", mode !== "typing");
  els.selfMode.classList.toggle("hidden", mode !== "self");
  els.voiceMode.classList.toggle("hidden", mode !== "voice");
}

function setScreen(screen) {
  state.currentScreen = screen;

  els.drawerLinks.forEach((link) => {
    link.classList.toggle("drawer-link--active", link.dataset.screen === screen);
  });

  closeDrawer();
  renderItem();
}

function nextItem() {
  const list = getItemsForCurrentScreen();
  if (!list.length) return;

  state.currentIndexByScreen[state.currentScreen] =
    (state.currentIndexByScreen[state.currentScreen] + 1) % list.length;

  renderItem();
}

function prevItem() {
  const list = getItemsForCurrentScreen();
  if (!list.length) return;

  let nextIndex = state.currentIndexByScreen[state.currentScreen] - 1;
  if (nextIndex < 0) nextIndex = list.length - 1;
  state.currentIndexByScreen[state.currentScreen] = nextIndex;

  renderItem();
}

function skipItem() {
  showFeedback("•", "Skipped", "Move on. You can return to it later.");
  setTimeout(() => {
    nextItem();
  }, 250);
}

function showFeedback(icon, title, text) {
  els.feedbackIcon.textContent = icon;
  els.feedbackTitle.textContent = title;
  els.feedbackText.textContent = text;
  els.feedbackBox.classList.remove("hidden");
}

function hideFeedback() {
  els.feedbackBox.classList.add("hidden");
}

function showSolution() {
  const item = getCurrentItem();
  if (!item) return;

  els.solutionMain.textContent = item.answer;
  els.solutionWord.textContent = item.title;
  els.solutionMeaning.textContent = item.meaning;
  els.solutionStory.textContent = item.story;
  els.solutionBox.classList.remove("hidden");
}

function hideSolution() {
  els.solutionBox.classList.add("hidden");
}

function checkTypingAnswer() {
  const item = getCurrentItem();
  if (!item) return;

  const user = normalize(els.answerInput.value);
  const correct = normalize(item.answer);

  if (!user) {
    showFeedback("?", "Type something", "Please enter an answer first.");
    return;
  }

  if (user === correct) {
    showFeedback("✔", "Correct", "Good. Your answer matches.");
    hideSolution();
  } else {
    showFeedback("✘", "Not quite", "Look at the answer and try again.");
    showSolution();
  }
}

function markKnow() {
  showFeedback("✔", "Good", "Nice. This card looks familiar to you.");
  hideSolution();
}

function markDontKnow() {
  showFeedback("✘", "Keep it", "This card should come back again later.");
  showSolution();
}

function showHint() {
  const item = getCurrentItem();
  if (!item) return;

  showFeedback("?", "Hint", item.hint);
}

function showAnswer() {
  showSolution();
  showFeedback("•", "Answer shown", "Look at it, say it, and move on.");
}

function speakText(text, lang = "en-US") {
  if (!("speechSynthesis" in window)) {
    showFeedback("✘", "No audio", "This browser does not support speech playback.");
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.92;
  utterance.pitch = 1;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

function playPromptAudio() {
  const item = getCurrentItem();
  if (!item) return;
  speakText(item.listenText || item.title, "en-US");
}

function playAnswerAudio() {
  const item = getCurrentItem();
  if (!item) return;
  speakText(item.answer, "en-US");
}

function toggleSave() {
  const item = getCurrentItem();
  if (!item) return;

  const key = `${item.type}:${item.title}`;

  if (state.savedItems.has(key)) {
    state.savedItems.delete(key);
    showFeedback("☆", "Removed", "This item is no longer saved.");
  } else {
    state.savedItems.add(key);
    showFeedback("★", "Saved", "This item is now in your saved list.");
  }

  updateSaveButton();
}

function updateSaveButton() {
  const item = getCurrentItem();
  if (!item) return;

  const key = `${item.type}:${item.title}`;
  els.saveBtn.textContent = state.savedItems.has(key) ? "★" : "☆";
}

function startVoiceRecognition() {
  if (!SpeechRecognitionCtor) {
    els.voiceStatus.textContent = "Not supported";
    els.voiceResult.textContent = "Try Chrome on phone or desktop.";
    return;
  }

  if (recognition) {
    recognition.stop();
  }

  recognition = new SpeechRecognitionCtor();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  els.voiceStatus.textContent = "Listening...";
  els.voiceResult.textContent = "Speak now.";

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    state.lastVoiceText = transcript;
    els.voiceStatus.textContent = "Received";
    els.voiceResult.textContent = transcript;

    const item = getCurrentItem();
    const spoken = normalize(transcript);
    const correct = normalize(item.answer);

    if (spoken === correct) {
      showFeedback("✔", "Correct", "Your spoken answer matches.");
      hideSolution();
    } else {
      showFeedback("✘", "Not quite", "Your spoken answer is different.");
      showSolution();
    }
  };

  recognition.onerror = () => {
    els.voiceStatus.textContent = "Error";
    els.voiceResult.textContent = "Please try again.";
  };

  recognition.start();
}

function toggleDrawer() {
  state.drawerOpen = !state.drawerOpen;
  els.mobileDrawer.classList.toggle("hidden", !state.drawerOpen);
}

function closeDrawer() {
  state.drawerOpen = false;
  els.mobileDrawer.classList.add("hidden");
}

function bindEvents() {
  els.menuBtn.addEventListener("click", toggleDrawer);

  document.addEventListener("click", (event) => {
    const clickInsideDrawer = els.mobileDrawer.contains(event.target);
    const clickOnMenu = els.menuBtn.contains(event.target);

    if (state.drawerOpen && !clickInsideDrawer && !clickOnMenu) {
      closeDrawer();
    }
  });

  els.drawerLinks.forEach((link) => {
    link.addEventListener("click", () => {
      setScreen(link.dataset.screen);
    });
  });

  els.modeTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      setMode(tab.dataset.mode);
    });
  });

  els.checkBtn.addEventListener("click", checkTypingAnswer);
  els.showHintBtn.addEventListener("click", showHint);
  els.hintBtn.addEventListener("click", showHint);
  els.showAnswerBtn.addEventListener("click", showAnswer);

  els.playBtn.addEventListener("click", playPromptAudio);
  els.listenBtn.addEventListener("click", playPromptAudio);
  els.playAnswerBtn.addEventListener("click", playAnswerAudio);

  els.saveBtn.addEventListener("click", toggleSave);

  els.knowBtn.addEventListener("click", markKnow);
  els.dontKnowBtn.addEventListener("click", markDontKnow);

  els.voiceBtn.addEventListener("click", startVoiceRecognition);

  els.nextBtn.addEventListener("click", nextItem);
  els.prevBtn.addEventListener("click", prevItem);
  els.skipBtn.addEventListener("click", skipItem);

  els.answerInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      checkTypingAnswer();
    }
  });
}

bindEvents();
setScreen("words");
setMode("typing");
