// 성경 66권 메타데이터 (이름, 분류, 총 장수)
const BIBLE_METADATA = [
  // 구약성경 (1~39)
  { id: 1, name: "창세기", type: "OT", chapters: 50 },
  { id: 2, name: "출애굽기", type: "OT", chapters: 40 },
  { id: 3, name: "레위기", type: "OT", chapters: 27 },
  { id: 4, name: "민수기", type: "OT", chapters: 36 },
  { id: 5, name: "신명기", type: "OT", chapters: 34 },
  { id: 6, name: "여호수아", type: "OT", chapters: 24 },
  { id: 7, name: "사사기", type: "OT", chapters: 21 },
  { id: 8, name: "룻기", type: "OT", chapters: 4 },
  { id: 9, name: "사무엘상", type: "OT", chapters: 31 },
  { id: 10, name: "사무엘하", type: "OT", chapters: 24 },
  { id: 11, name: "열왕기상", type: "OT", chapters: 22 },
  { id: 12, name: "열왕기하", type: "OT", chapters: 25 },
  { id: 13, name: "역대상", type: "OT", chapters: 29 },
  { id: 14, name: "역대하", type: "OT", chapters: 36 },
  { id: 15, name: "에스라", type: "OT", chapters: 10 },
  { id: 16, name: "느헤미야", type: "OT", chapters: 13 },
  { id: 17, name: "에스더", type: "OT", chapters: 10 },
  { id: 18, name: "욥기", type: "OT", chapters: 42 },
  { id: 19, name: "시편", type: "OT", chapters: 150 },
  { id: 20, name: "잠언", type: "OT", chapters: 31 },
  { id: 21, name: "전도서", type: "OT", chapters: 12 },
  { id: 22, name: "아가", type: "OT", chapters: 8 },
  { id: 23, name: "이사야", type: "OT", chapters: 66 },
  { id: 24, name: "예레미야", type: "OT", chapters: 52 },
  { id: 25, name: "예레미야애가", type: "OT", chapters: 5 },
  { id: 26, name: "에스겔", type: "OT", chapters: 48 },
  { id: 27, name: "다니엘", type: "OT", chapters: 12 },
  { id: 28, name: "호세아", type: "OT", chapters: 14 },
  { id: 29, name: "요엘", type: "OT", chapters: 3 },
  { id: 30, name: "아모스", type: "OT", chapters: 9 },
  { id: 31, name: "오바디야", type: "OT", chapters: 1 },
  { id: 32, name: "요나", type: "OT", chapters: 4 },
  { id: 33, name: "미가", type: "OT", chapters: 7 },
  { id: 34, name: "나훔", type: "OT", chapters: 3 },
  { id: 35, name: "하박국", type: "OT", chapters: 3 },
  { id: 36, name: "스바냐", type: "OT", chapters: 3 },
  { id: 37, name: "학개", type: "OT", chapters: 2 },
  { id: 38, name: "스가랴", type: "OT", chapters: 14 },
  { id: 39, name: "말라기", type: "OT", chapters: 4 },
  
  // 신약성경 (40~66)
  { id: 40, name: "마태복음", type: "NT", chapters: 28 },
  { id: 41, name: "마가복음", type: "NT", chapters: 16 },
  { id: 42, name: "누가복음", type: "NT", chapters: 24 },
  { id: 43, name: "요한복음", type: "NT", chapters: 21 },
  { id: 44, name: "사도행전", type: "NT", chapters: 28 },
  { id: 45, name: "로마서", type: "NT", chapters: 16 },
  { id: 46, name: "고린도전서", type: "NT", chapters: 16 },
  { id: 47, name: "고린도후서", type: "NT", chapters: 13 },
  { id: 48, name: "갈라디아서", type: "NT", chapters: 6 },
  { id: 49, name: "에베소서", type: "NT", chapters: 6 },
  { id: 50, name: "빌립보서", type: "NT", chapters: 4 },
  { id: 51, name: "골로새서", type: "NT", chapters: 4 },
  { id: 52, name: "데살로니가전서", type: "NT", chapters: 5 },
  { id: 53, name: "데살로니가후서", type: "NT", chapters: 3 },
  { id: 54, name: "디모데전서", type: "NT", chapters: 6 },
  { id: 55, name: "디모데후서", type: "NT", chapters: 4 },
  { id: 56, name: "디도서", type: "NT", chapters: 3 },
  { id: 57, name: "빌레몬서", type: "NT", chapters: 1 },
  { id: 58, name: "히브리서", type: "NT", chapters: 13 },
  { id: 59, name: "야고보서", type: "NT", chapters: 5 },
  { id: 60, name: "베드로전서", type: "NT", chapters: 5 },
  { id: 61, name: "베드로후서", type: "NT", chapters: 3 },
  { id: 62, name: "요한1서", type: "NT", chapters: 5 },
  { id: 63, name: "요한2서", type: "NT", chapters: 1 },
  { id: 64, name: "요한3서", type: "NT", chapters: 1 },
  { id: 65, name: "유다서", type: "NT", chapters: 1 },
  { id: 66, name: "요한계시록", type: "NT", chapters: 22 }
];

// 역본 매핑 및 로드 상태 추적
const TRANSLATION_MAP = {
  KG: { name: "개역개정", isLoaded: true, varName: "BIBLE_66_DB_KG" },
  SB: { name: "새번역", isLoaded: true, varName: "BIBLE_66_DB_SB" },
  KH: { name: "개역한글", isLoaded: true, varName: "BIBLE_66_DB_KH" },
  
  HYUNDAI: { name: "현대인의 성경", isLoaded: false, varName: "BIBLE_DB_HYUNDAI", path: "bible_data/bible_db_hyundai.js" },
  EASY: { name: "쉬운성경", isLoaded: false, varName: "BIBLE_DB_EASY", path: "bible_data/bible_db_easy.js" },
  NIV: { name: "NIV (영어)", isLoaded: false, varName: "BIBLE_DB_NIV", path: "bible_data/bible_db_niv.js" },
  NLT: { name: "NLT (영어)", isLoaded: false, varName: "BIBLE_DB_NLT", path: "bible_data/bible_db_nlt.js" },
  NKJV: { name: "NKJV (영어)", isLoaded: false, varName: "BIBLE_DB_NKJV", path: "bible_data/bible_db_nkjv.js" },
  RSV: { name: "RSV (영어)", isLoaded: false, varName: "BIBLE_DB_RSV", path: "bible_data/bible_db_rsv.js" }
};

// 앱 상태 정의 (LocalStorage 연동)
let state = {
  currentBook: "창세기",
  currentChapter: 1,
  primaryTranslation: "KG",
  secondaryTranslation: "NONE",
  fontSize: 100,
  theme: "theme-sepia",
  activePlan: null,
  planActiveDay: {},
  repeatMode: "NONE"
};

// 통독 완료 장 기록 (LocalStorage: 'my_bible_read_history')
let readHistory = {}; 

// 메모 데이터 (LocalStorage: 'my_bible_notes')
let notes = {};

// TTS 재생기 내부 상태
let isTTSSpeaking = false;
let isTTSPaused = false;
let currentTTSIndex = 0;
let ttsSpeechItems = []; 
const TTS_SPEEDS = [0.8, 1.0, 1.2, 1.5];
let currentTTSSpeedIndex = 1; 

// 전역 변수: 최근 통합 검색 결과 보관함 (실시간 역본 필터링용)
let lastSearchResults = [];

// 전역 변수: 재생 중 역본 변경 시 이어 재생할 구절 저장용 (요구사항)
let resumeTTSVerse = null;

// 전역 변수: 현재 낭독 동작 중인 SpeechSynthesisUtterance 객체 참조 (비동기 꼬임 방지용)
let activeUtterance = null;

// 전역 변수: 클릭으로 선택된 구절 번호 (하이라이트 유지용)
let selectedVerseNum = null;

// 전역 변수: 클릭/더블클릭 구분용 타이머
let clickTimer = null;
const DBLCLICK_DELAY = 280; // ms

// 합쳐진 절 표기 (예: 18절 데이터가 "-19 본문" → 18~19절)
const MERGED_VERSE_PREFIX = /^-(\d+)\s+/;

// 📋 꾸욱 눌러 복사 상태
const LONG_PRESS_MS = 500;
const LONG_PRESS_MOVE_TOLERANCE = 10; // px
let longPress = null; // { card, x, y, timer, armed, copied }
let suppressVerseClickUntil = 0;

// 🎯 구간 반복 상태 (예: 12~20절)
const BG_RANGE_PRELOAD_LOOPS = 5; // 화면 꺼짐 시 미리 큐에 넣을 반복 횟수
let repeatRange = null; // { book, chapter, start, end, maxLoops(0=무한), loopCount }
let rangeModalCount = 0;
const rangeModal = document.getElementById("rangeModal");

// DOM 요소 참조
const quickBookSelect = document.getElementById("quickBookSelect");
const quickChapterSelect = document.getElementById("quickChapterSelect");
const btnBookSelectorModal = document.getElementById("btnBookSelectorModal");
const btnSettings = document.getElementById("btnSettings");
const btnSearch = document.getElementById("btnSearch");
const btnProgress = document.getElementById("btnProgress");
const bibleViewerEl = document.getElementById("bibleViewer");

const btnPrevChapter = document.getElementById("btnPrevChapter");
const btnNextChapter = document.getElementById("btnNextChapter");
const primaryTransSelect = document.getElementById("primaryTranslation");
const secondaryTransSelect = document.getElementById("secondaryTranslation");
const translationCompareBar = document.getElementById("translationCompareBar");

// 현재 장 완료 버튼
const btnMarkChapterRead = document.getElementById("btnMarkChapterRead");

// 헤더 TTS 컨트롤러 엘리먼트
const btnAudioTTSPlay = document.getElementById("btnAudioTTSPlay");
const btnAudioTTSPrev = document.getElementById("btnAudioTTSPrev");
const btnAudioTTSNext = document.getElementById("btnAudioTTSNext");
const btnAudioTTSSpeed = document.getElementById("btnAudioTTSSpeed");
const btnAudioTTSRepeat = document.getElementById("btnAudioTTSRepeat");

// 모달 참조
const bookModal = document.getElementById("bookModal");
const btnCloseBookModal = document.getElementById("btnCloseBookModal");
const tabOT = document.getElementById("tabOT");
const tabNT = document.getElementById("tabNT");
const booksGrid = document.getElementById("booksGrid");
const chaptersView = document.getElementById("chaptersView");
const btnBackToBooks = document.getElementById("btnBackToBooks");
const selectedBookTitle = document.getElementById("selectedBookTitle");
const chaptersGrid = document.getElementById("chaptersGrid");

const settingsModal = document.getElementById("settingsModal");
const btnCloseSettingsModal = document.getElementById("btnCloseSettingsModal");
const btnFontSizeDecrease = document.getElementById("btnFontSizeDecrease");
const btnFontSizeIncrease = document.getElementById("btnFontSizeIncrease");
const fontSizeDisplay = document.getElementById("fontSizeDisplay");
const themeBtns = document.querySelectorAll(".theme-btn");
const btnExportNotes = document.getElementById("btnExportNotes");

const noteModal = document.getElementById("noteModal");
const btnCloseNoteModal = document.getElementById("btnCloseNoteModal");
const noteModalTitle = document.getElementById("noteModalTitle");
const selectedVerseText = document.getElementById("selectedVerseText");
const noteTextarea = document.getElementById("noteTextarea");
const btnDeleteNote = document.getElementById("btnDeleteNote");
const btnSaveNote = document.getElementById("btnSaveNote");

// 검색 모달 참조
const searchModal = document.getElementById("searchModal");
const btnCloseSearchModal = document.getElementById("btnCloseSearchModal");
const searchInput = document.getElementById("searchInput");
const btnExecuteSearch = document.getElementById("btnExecuteSearch");
const searchTranslationFilter = document.getElementById("searchTranslationFilter"); 
const searchResults = document.getElementById("searchResults");
const searchResultMeta = document.getElementById("searchResultMeta");

// 통독표 모달 참조
const progressModal = document.getElementById("progressModal");
const btnCloseProgressModal = document.getElementById("btnCloseProgressModal");
const progressPercentage = document.getElementById("progressPercentage");
const completedChaptersCount = document.getElementById("completedChaptersCount");
const progressBarFill = document.getElementById("progressBarFill");
const progressBooksContainer = document.getElementById("progressBooksContainer");
const btnResetHistory = document.getElementById("btnResetHistory");

// 통독 계획 관련 DOM 참조
const tabProgressBoard = document.getElementById("tabProgressBoard");
const tabReadingPlan = document.getElementById("tabReadingPlan");
const pageProgressBoard = document.getElementById("pageProgressBoard");
const pageReadingPlan = document.getElementById("pageReadingPlan");
const planCardsGrid = document.getElementById("planCardsGrid");
const activePlanContainer = document.getElementById("activePlanContainer");
const planSelectionContainer = document.getElementById("planSelectionContainer");
const activePlanTitle = document.getElementById("activePlanTitle");
const activePlanDesc = document.getElementById("activePlanDesc");
const activePlanProgressText = document.getElementById("activePlanProgressText");
const activePlanBarFill = document.getElementById("activePlanBarFill");
const activePlanDaysList = document.getElementById("activePlanDaysList");
const btnQuitPlan = document.getElementById("btnQuitPlan");

// 오늘의 통독 위젯 DOM 참조
const dailyPlanWidget = document.getElementById("dailyPlanWidget");
const widgetDayNum = document.getElementById("widgetDayNum");
const widgetProgressText = document.getElementById("widgetProgressText");
const widgetPassageList = document.getElementById("widgetPassageList");
const widgetActionArea = document.getElementById("widgetActionArea");
const btnNextPlanDay = document.getElementById("btnNextPlanDay");

// 현재 선택된 메모 타겟 구절 정보
let currentNoteTarget = { book: "", chapter: 0, verse: 0 };

// 백업/조회 모달 참조
const backupModal = document.getElementById("backupModal");
const btnCloseBackupModal = document.getElementById("btnCloseBackupModal");
const backupTextarea = document.getElementById("backupTextarea");
const btnCopyBackupText = document.getElementById("btnCopyBackupText");

// 시편 전용 단위 표기 교정 헬퍼 (요구사항 1)
function getChapterLabel(bookName) {
  return bookName === "시편" ? "편" : "장";
}

// 성경 DB 책 이름 표준화 (요한일서<->요한1서, 요한이서<->요한2서, 요한삼서<->요한3서, 오바댜<->오바디야 양방향 호환 보장)
const BOOK_NAME_ALIASES = [
  ["요한1서", "요한일서"],
  ["요한2서", "요한이서"],
  ["요한3서", "요한삼서"],
  ["오바디야", "오바댜"]
];

function normalizeBibleDb(db) {
  if (!db || typeof db !== "object") return;
  BOOK_NAME_ALIASES.forEach(([canonical, alias]) => {
    if (!db[canonical] && db[alias]) {
      db[canonical] = db[alias];
    } else if (db[canonical] && !db[alias]) {
      db[alias] = db[canonical];
    }
  });
}

function normalizeAllLoadedBibleDbs() {
  Object.keys(TRANSLATION_MAP).forEach(code => {
    const varName = TRANSLATION_MAP[code].varName;
    if (window[varName]) {
      normalizeBibleDb(window[varName]);
    }
  });
}

// 앱 로드 시 초기화
function init() {
  normalizeAllLoadedBibleDbs();
  loadSettings();
  loadNotes();
  loadReadHistory();
  applySettings();
  initQuickSelectors(); 
  setupEventListeners();
  
  // 서비스 워커 등록 (비행기모드 오프라인 기능 작동 지원)
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js')
        .then(reg => console.log('ServiceWorker registered successfully:', reg))
        .catch(err => console.log('ServiceWorker registration failed:', err));
    });
  }

  // 통독 계획 상태 초기 설정
  if (state.activePlan === undefined) state.activePlan = null;
  if (state.planActiveDay === undefined) state.planActiveDay = {};
  
  // 오늘의 통독 위젯 렌더링
  renderDailyPlanWidget();
  
  // 미디어 세션(잠금화면 컨트롤) 핸들러 초기화
  setupMediaSessionHandlers();
  
  // 초기 렌더링
  renderBible();
}

// 설정 로드
function loadSettings() {
  const savedSettings = localStorage.getItem("my_bible_settings");
  if (savedSettings) {
    try {
      state = { ...state, ...JSON.parse(savedSettings) };
    } catch (e) {
      console.error("Error loading settings:", e);
    }
  }
  // 구간 반복은 앱을 다시 열면 구간 정보가 없으므로 연속 모드로 복귀
  if (state.repeatMode === "RANGE") state.repeatMode = "NONE";
}

// 설정 저장
function saveSettings() {
  localStorage.setItem("my_bible_settings", JSON.stringify(state));
}

// 메모 로드
function loadNotes() {
  const savedNotes = localStorage.getItem("my_bible_notes");
  if (savedNotes) {
    try {
      notes = JSON.parse(savedNotes);
    } catch (e) {
      console.error("Error loading notes:", e);
    }
  }
}

// 메모 저장
function saveNotes() {
  localStorage.setItem("my_bible_notes", JSON.stringify(notes));
}

// 통독 완료 기록 로드
function loadReadHistory() {
  const savedHistory = localStorage.getItem("my_bible_read_history");
  if (savedHistory) {
    try {
      readHistory = JSON.parse(savedHistory);
    } catch (e) {
      console.error("Error loading read history:", e);
    }
  }
  BIBLE_METADATA.forEach(b => {
    if (!readHistory[b.name]) {
      readHistory[b.name] = [];
    }
  });
}

// 통독 완료 기록 저장
function saveReadHistory() {
  localStorage.setItem("my_bible_read_history", JSON.stringify(readHistory));
}

// 설정 화면 적용
function applySettings() {
  document.body.className = state.theme;
  themeBtns.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.theme === state.theme);
  });
  
  document.documentElement.style.setProperty("--verse-font-size", `${state.fontSize / 100}rem`);
  fontSizeDisplay.textContent = `${state.fontSize}%`;
  
  primaryTransSelect.value = state.primaryTranslation;
  secondaryTransSelect.value = state.secondaryTranslation;
}

// 퀵 풀다운 셀렉터 세팅
function initQuickSelectors() {
  quickBookSelect.innerHTML = "";
  
  const otGroup = document.createElement("optgroup");
  otGroup.label = "구약성경";
  const ntGroup = document.createElement("optgroup");
  ntGroup.label = "신약성경";
  
  BIBLE_METADATA.forEach(book => {
    const opt = document.createElement("option");
    opt.value = book.name;
    opt.textContent = book.name;
    
    if (book.type === "OT") {
      otGroup.appendChild(opt);
    } else {
      ntGroup.appendChild(opt);
    }
  });
  
  quickBookSelect.appendChild(otGroup);
  quickBookSelect.appendChild(ntGroup);
  
  quickBookSelect.value = state.currentBook;
  updateQuickChapterSelector();
}

function updateQuickChapterSelector() {
  const book = BIBLE_METADATA.find(b => b.name === state.currentBook);
  if (!book) return;
  
  quickChapterSelect.innerHTML = "";
  const unit = getChapterLabel(state.currentBook); // 장/편 구분
  for (let i = 1; i <= book.chapters; i++) {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = `${i}${unit}`;
    quickChapterSelect.appendChild(opt);
  }
  
  quickChapterSelect.value = state.currentChapter;
}

// 이벤트 리스너 세팅
function setupEventListeners() {
  // 퀵 드롭다운 체인지 이벤트
  quickBookSelect.addEventListener("change", (e) => {
    stopTTS();
    selectedVerseNum = null;
    state.currentBook = e.target.value;
    state.currentChapter = 1; 
    updateQuickChapterSelector();
    saveSettings();
    renderBible();
  });

  quickChapterSelect.addEventListener("change", (e) => {
    stopTTS();
    selectedVerseNum = null;
    state.currentChapter = parseInt(e.target.value);
    saveSettings();
    renderBible();
  });

  // 네비게이션
  btnPrevChapter.addEventListener("click", () => {
    stopTTS();
    selectedVerseNum = null;
    navigateChapter(-1);
  });
  btnNextChapter.addEventListener("click", () => {
    stopTTS();
    selectedVerseNum = null;
    navigateChapter(1);
  });
  
  // 역본/대조역본 선택 변경 → 항상 재생 중지, 자동재생 없음
  // (사용자 요구: 역본변경 시 재생 중이어도 멈춰야 함)
  primaryTransSelect.addEventListener("change", (e) => {
    resumeTTSVerse = null;
    // selectedVerseNum 유지 — 역본 변경 후에도 하이라이트 복원됨
    stopTTS();
    state.primaryTranslation = e.target.value;
    saveSettings();
    renderBible();
  });
  
  secondaryTransSelect.addEventListener("change", (e) => {
    resumeTTSVerse = null;
    // selectedVerseNum 유지 — 대조역본 변경 후에도 하이라이트 복원됨
    stopTTS();
    state.secondaryTranslation = e.target.value;
    saveSettings();
    renderBible();
  });
  
  // 모달 열기/닫기
  btnBookSelectorModal.addEventListener("click", () => { stopTTS(); openBookModal(); });
  btnCloseBookModal.addEventListener("click", () => closeModal(bookModal));
  btnSettings.addEventListener("click", () => { stopTTS(); openSettingsModal(); });
  btnCloseSettingsModal.addEventListener("click", () => closeModal(settingsModal));
  btnCloseNoteModal.addEventListener("click", () => closeModal(noteModal));
  btnCloseBackupModal.addEventListener("click", () => closeModal(backupModal)); // 백업 모달 닫기
  
  // 검색 모달 제어
  btnSearch.addEventListener("click", () => { stopTTS(); openSearchModal(); });
  btnCloseSearchModal.addEventListener("click", () => closeModal(searchModal));
  btnExecuteSearch.addEventListener("click", executeSearch);
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") executeSearch();
  });
  
  // 검색된 결과 역본 필터 변경 이벤트 연동
  searchTranslationFilter.addEventListener("change", () => {
    renderSearchResultsList();
  });

  // 통독 현황 모달 제어
  btnProgress.addEventListener("click", () => { stopTTS(); openProgressModal(); });
  btnCloseProgressModal.addEventListener("click", () => closeModal(progressModal));
  btnResetHistory.addEventListener("click", resetHistoryAction);
  
  // 책 선택 모달 관련 탭
  tabOT.addEventListener("click", () => toggleOTNT("OT"));
  tabNT.addEventListener("click", () => toggleOTNT("NT"));
  btnBackToBooks.addEventListener("click", showBooksListInModal);
  
  // 설정 모달 기능
  btnFontSizeDecrease.addEventListener("click", () => adjustFontSize(-10));
  btnFontSizeIncrease.addEventListener("click", () => adjustFontSize(10));
  themeBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      state.theme = e.target.dataset.theme;
      saveSettings();
      applySettings();
      try {
        const isDark = state.theme === "theme-dark";
        window.parent.postMessage({ type: "THEME_CHANGED", isDark }, "*");
      } catch (err) {}
    });
  });

  // 부모 창(예수동행앱 메인)으로부터 테마 및 글씨 크기 동기화 메시지 수신
  window.addEventListener("message", (e) => {
    if (e.data && e.data.type === "SET_THEME") {
      state.theme = e.data.theme === "DARK" ? "theme-dark" : "theme-light";
      saveSettings();
      applySettings();
    } else if (e.data && e.data.type === "SET_FONT_SIZE") {
      const percent = e.data.percent || 100;
      state.fontSize = percent;
      saveSettings();
      applySettings();
    }
  });

  // 초기 로드 시 부모 글씨 크기 및 테마 확인 및 적용
  try {
    const savedFontSizeKey = localStorage.getItem("jwj_font_size");
    const fontPercentMap = { small: 90, normal: 100, large: 115, xlarge: 130 };
    if (savedFontSizeKey && fontPercentMap[savedFontSizeKey]) {
      state.fontSize = fontPercentMap[savedFontSizeKey];
      applySettings();
    }
  } catch (err) {}

  try {
    const savedTheme = localStorage.getItem("jesus_walk_theme");
    if (savedTheme) {
      state.theme = savedTheme === "DARK" ? "theme-dark" : "theme-light";
      applySettings();
    }
  } catch (err) {}
  btnExportNotes.addEventListener("click", exportNotesToClipboard);
  btnCopyBackupText.addEventListener("click", copyBackupTextAction); // 백업 텍스트 복사 버튼 연동
  
  // 메모 모달 기능
  btnSaveNote.addEventListener("click", saveNoteAction);
  btnDeleteNote.addEventListener("click", deleteNoteAction);
  
  // 현재 장 통독 완료 클릭
  btnMarkChapterRead.addEventListener("click", toggleCurrentChapterRead);

  // 음성 재생(TTS) 관련 클릭
  btnAudioTTSPlay.addEventListener("click", togglePlayTTS);
  btnAudioTTSPrev.addEventListener("click", playPrevTTS);
  btnAudioTTSNext.addEventListener("click", playNextTTS);
  btnAudioTTSSpeed.addEventListener("click", toggleTTSSpeed);
  if (btnAudioTTSRepeat) {
    btnAudioTTSRepeat.addEventListener("click", toggleRepeatMode);
  }
  const btnAudioTTSPlayBottom = document.getElementById("btnAudioTTSPlayBottom");
  if (btnAudioTTSPlayBottom) {
    btnAudioTTSPlayBottom.addEventListener("click", togglePlayTTS);
  }
  const btnAudioTTSStop = document.getElementById("btnAudioTTSStop");
  if (btnAudioTTSStop) {
    btnAudioTTSStop.addEventListener("click", stopTTS);
  }

  // 바깥 영역 터치 시 모달 닫기
  window.addEventListener("click", (e) => {
    if (e.target === bookModal) closeModal(bookModal);
    if (e.target === settingsModal) closeModal(settingsModal);
    if (e.target === noteModal) closeModal(noteModal);
    if (e.target === searchModal) closeModal(searchModal);
    if (e.target === progressModal) closeModal(progressModal);
    if (e.target === backupModal) closeModal(backupModal);
    if (e.target === rangeModal) closeModal(rangeModal);
  });

  // 📋 구절 꾸욱 눌러 복사 + 🎯 구간 반복 듣기
  setupVerseLongPress();
  setupRangeRepeatControls();

  // 통독 계획 서브 탭 전환
  if (tabProgressBoard && tabReadingPlan) {
    tabProgressBoard.addEventListener("click", () => {
      tabProgressBoard.classList.add("active");
      tabReadingPlan.classList.remove("active");
      pageProgressBoard.classList.remove("hidden");
      pageReadingPlan.classList.add("hidden");
    });
    
    tabReadingPlan.addEventListener("click", () => {
      tabReadingPlan.classList.add("active");
      tabProgressBoard.classList.remove("active");
      pageReadingPlan.classList.remove("hidden");
      pageProgressBoard.classList.add("hidden");
      renderReadingPlanTab();
    });
  }

  // 계획 중단 버튼 클릭
  if (btnQuitPlan) {
    btnQuitPlan.addEventListener("click", quitActivePlan);
  }

  // 오늘의 통독 위젯 - 다음 일차 버튼 클릭
  if (btnNextPlanDay) {
    btnNextPlanDay.addEventListener("click", advancePlanDay);
  }
}

// 토스트 메시지
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.remove("hidden");
  setTimeout(() => {
    toast.classList.add("hidden");
  }, 2000);
}

// 폰트 크기 변경
function adjustFontSize(delta) {
  state.fontSize = Math.max(80, Math.min(200, state.fontSize + delta));
  saveSettings();
  applySettings();
}

// 모달 닫기 공통
function closeModal(modalEl) {
  modalEl.classList.remove("active");
}

// 설정 모달 열기
function openSettingsModal() {
  settingsModal.classList.add("active");
}

// 책 모달 열기
function openBookModal() {
  bookModal.classList.add("active");
  showBooksListInModal();
}

// 구약/신약 전환
function toggleOTNT(type) {
  tabOT.classList.toggle("active", type === "OT");
  tabNT.classList.toggle("active", type === "NT");
  renderBooksGrid(type);
}

// 모달 내 책 격자 그리기
function showBooksListInModal() {
  booksGrid.classList.remove("hidden");
  chaptersView.classList.add("hidden");
  const activeType = tabOT.classList.contains("active") ? "OT" : "NT";
  renderBooksGrid(activeType);
}

function renderBooksGrid(type) {
  booksGrid.innerHTML = "";
  const filtered = BIBLE_METADATA.filter(b => b.type === type);
  filtered.forEach(book => {
    const btn = document.createElement("button");
    btn.className = "btn-book";
    btn.textContent = book.name;
    btn.addEventListener("click", () => showChaptersListInModal(book));
    booksGrid.appendChild(btn);
  });
}

// 책의 장 격자 리스트 노출
function showChaptersListInModal(book) {
  booksGrid.classList.add("hidden");
  chaptersView.classList.remove("hidden");
  selectedBookTitle.textContent = book.name;
  
  chaptersGrid.innerHTML = "";
  for (let i = 1; i <= book.chapters; i++) {
    const btn = document.createElement("button");
    btn.className = "btn-chapter";
    const isRead = readHistory[book.name] && readHistory[book.name].includes(i);
    btn.textContent = isRead ? `${i} ✓` : `${i}`;
    if (isRead) btn.style.color = "var(--accent-green)";
    
    btn.addEventListener("click", () => {
      state.currentBook = book.name;
      state.currentChapter = i;
      saveSettings();
      closeModal(bookModal);
      renderBible();
    });
    chaptersGrid.appendChild(btn);
  }
}

// 장 네비게이션
function navigateChapter(direction) {
  const currentBookIndex = BIBLE_METADATA.findIndex(b => b.name === state.currentBook);
  if (currentBookIndex === -1) return;
  
  const book = BIBLE_METADATA[currentBookIndex];
  let targetChapter = state.currentChapter + direction;
  
  if (targetChapter < 1) {
    if (currentBookIndex > 0) {
      const prevBook = BIBLE_METADATA[currentBookIndex - 1];
      state.currentBook = prevBook.name;
      state.currentChapter = prevBook.chapters;
    } else {
      showToast("성경의 첫 시작(창세기 1장)입니다.");
      return;
    }
  } else if (targetChapter > book.chapters) {
    if (currentBookIndex < BIBLE_METADATA.length - 1) {
      const nextBook = BIBLE_METADATA[currentBookIndex + 1];
      state.currentBook = nextBook.name;
      state.currentChapter = 1;
    } else {
      showToast("성경의 마지막(요한계시록 22장)입니다.");
      return;
    }
  } else {
    state.currentChapter = targetChapter;
  }
  
  saveSettings();
  renderBible();
  document.querySelector(".app-content").scrollTop = 0;
}

// 현재 장 통독 완료 체크 토글
function toggleCurrentChapterRead() {
  const book = state.currentBook;
  const chapter = state.currentChapter;
  const unit = getChapterLabel(book);
  
  if (!readHistory[book]) {
    readHistory[book] = [];
  }
  
  const idx = readHistory[book].indexOf(chapter);
  if (idx === -1) {
    readHistory[book].push(chapter);
    showToast(`${book} ${chapter}${unit} 통독 체크 완료!`);
  } else {
    readHistory[book].splice(idx, 1);
    showToast(`${book} ${chapter}${unit} 통독 체크 해제.`);
  }
  
  saveReadHistory();
  updateReadCheckButtonState();
  
  // 오늘의 통독 위젯 및 계획 탭 연동 업데이트
  if (typeof renderDailyPlanWidget === "function") renderDailyPlanWidget();
  if (typeof renderReadingPlanTab === "function" && progressModal.classList.contains("active")) renderReadingPlanTab();
}

// 읽기 완료 버튼 디자인 상태 동기화
function updateReadCheckButtonState() {
  const book = state.currentBook;
  const chapter = state.currentChapter;
  const unit = getChapterLabel(book);
  const isRead = readHistory[book] && readHistory[book].includes(chapter);
  
  if (isRead) {
    btnMarkChapterRead.textContent = `현재 ${unit} 읽기 완료 상태 ✓ (누르면 취소)`;
    btnMarkChapterRead.classList.add("completed");
  } else {
    btnMarkChapterRead.textContent = `현재 ${unit} 읽기 완료 체크 ✓`;
    btnMarkChapterRead.classList.remove("completed");
  }
}

// 역본 데이터 동적 로드 헬퍼
function ensureTranslationLoaded(translationCode, callback) {
  const t = TRANSLATION_MAP[translationCode];
  if (!t) {
    callback(false);
    return;
  }
  
  if (t.isLoaded || window[t.varName]) {
    t.isLoaded = true;
    normalizeBibleDb(window[t.varName]);
    callback(true);
    return;
  }
  
  showToast(`${t.name} 데이터를 불러오는 중...`);
  const script = document.createElement("script");
  script.src = t.path;
  script.onload = () => {
    t.isLoaded = true;
    normalizeBibleDb(window[t.varName]);
    callback(true);
  };
  script.onerror = () => {
    showToast(`${t.name} 로드 실패. 경로를 확인하세요.`);
    callback(false);
  };
  document.body.appendChild(script);
}

// 전체 역본 백그라운드 병렬 로드 헬퍼
function ensureAllTranslationsLoaded(callback) {
  const codes = Object.keys(TRANSLATION_MAP);
  const promises = codes.map(code => {
    return new Promise((resolve) => {
      ensureTranslationLoaded(code, (success) => {
        resolve(success);
      });
    });
  });
  
  Promise.all(promises).then((results) => {
    const successCount = results.filter(Boolean).length;
    console.log(`Translations loaded: ${successCount} / ${codes.length}`);
    callback();
  });
}

// 성경 렌더링 메인 로직
function renderBible() {
  quickBookSelect.value = state.currentBook;
  updateQuickChapterSelector();
  
  const pCode = state.primaryTranslation;
  const sCode = state.secondaryTranslation;
  
  ensureTranslationLoaded(pCode, (pSuccess) => {
    if (!pSuccess) return;
    
    if (sCode !== "NONE") {
      ensureTranslationLoaded(sCode, (sSuccess) => {
        if (sSuccess) {
          executeRender();
        } else {
          state.secondaryTranslation = "NONE";
          saveSettings();
          applySettings();
          executeRender();
        }
      });
    } else {
      executeRender();
    }
  });
  
  updateReadCheckButtonState();
}

// 실제 화면에 렌더링 실행
function executeRender() {
  bibleViewerEl.innerHTML = "";
  
  const book = state.currentBook;
  const chapter = state.currentChapter;
  const chStr = String(chapter);

  // 다른 장으로 이동하면 구간 반복 자동 해제
  if (repeatRange && (repeatRange.book !== book || Number(repeatRange.chapter) !== Number(chapter))) {
    clearRepeatRange();
  }
  
  const pCode = state.primaryTranslation;
  const sCode = state.secondaryTranslation;
  
  const unit = getChapterLabel(book); // 장/편 구분 표기 (요구사항 1)
  
  // 1. 본문 영역 상단에 큼직한 장 이름 타이틀 표기
  const titleEl = document.createElement("div");
  titleEl.className = "viewer-chapter-title";
  titleEl.textContent = `${book} ${chapter}${unit}`;
  bibleViewerEl.appendChild(titleEl);

  // 2. 상단 대조 역본 고정 바 표시 여부 조율
  if (sCode !== "NONE") {
    translationCompareBar.classList.remove("hidden");
    const pTag = translationCompareBar.querySelector(".primary-tag");
    const sTag = translationCompareBar.querySelector(".secondary-tag");
    pTag.textContent = TRANSLATION_MAP[pCode].name;
    sTag.textContent = TRANSLATION_MAP[sCode].name;
  } else {
    translationCompareBar.classList.add("hidden");
  }

  // 주역본
  const pVarName = TRANSLATION_MAP[pCode].varName;
  const pDb = window[pVarName];
  
  if (!pDb || !pDb[book] || !pDb[book][chStr]) {
    const errorEl = document.createElement("div");
    errorEl.className = "error-msg";
    errorEl.textContent = `해당 장의 데이터를 찾을 수 없습니다. (${TRANSLATION_MAP[pCode].name})`;
    bibleViewerEl.appendChild(errorEl);
    return;
  }
  
  const primaryVerses = pDb[book][chStr];
  const totalVerses = primaryVerses.length;
  
  // 대조역본
  let secondaryVerses = null;
  if (sCode !== "NONE") {
    const sVarName = TRANSLATION_MAP[sCode].varName;
    const sDb = window[sVarName];
    if (sDb && sDb[book] && sDb[book][chStr]) {
      secondaryVerses = sDb[book][chStr];
    }
  }
  
  // 구절별 루프
  let coveredUntil = 0; // 합쳐진 절(예: 18-19)이 이미 포함한 마지막 절 번호
  for (let i = 0; i < totalVerses; i++) {
    const verseNum = i + 1;
    // 앞 카드(18-19절)에 이미 포함된 절은 중복 조각이므로 건너뜀
    if (verseNum <= coveredUntil) continue;
    let primaryText = (primaryVerses[i] || "").replace(/○/g, pCode === "SB" ? "○" : "").trim();

    // 합쳐진 절 표기 분리: "-19 본문" → 18~19절 (본문 앞의 "-19" 숫자 노출 방지)
    let verseEndNum = verseNum;
    const mergedMatch = primaryText.match(MERGED_VERSE_PREFIX);
    if (mergedMatch) {
      verseEndNum = Math.min(totalVerses, Math.max(verseNum, parseInt(mergedMatch[1], 10) || verseNum));
      primaryText = primaryText.slice(mergedMatch[0].length);
    }
    coveredUntil = verseEndNum;
    const verseLabel = verseEndNum > verseNum ? `${verseNum}-${verseEndNum}` : `${verseNum}`;
    
    if (!primaryText && (!secondaryVerses || !secondaryVerses[i])) {
      continue;
    }
    
    const card = document.createElement("div");
    card.setAttribute("data-verse", verseNum);
    card.setAttribute("data-verse-end", verseEndNum);
    
    // 메모 존재 여부
    const noteKey = `${book}_${chapter}_${verseNum}`;
    const hasNote = notes[noteKey] ? true : false;
    
    // 카드 헤더 (메모 뱃지만 우측 구석에 작게 배치하며 1절 2절 텍스트는 영구 삭제)
    const headerHtml = hasNote ? `
      <div class="verse-header">
        <span class="note-indicator-dot">● 묵상메모</span>
      </div>
    ` : '';
    
    // 절 번호 인라인화 렌더링 (요구사항 2)
    const numBadgeHtml = `<span class="verse-num">${verseLabel}</span>`;
    let copySecondaryText = "";
    
    if (sCode !== "NONE" && secondaryVerses) {
      const secondaryParts = [];
      for (let k = i; k < verseEndNum; k++) {
        let part = (secondaryVerses[k] || "").replace(/○/g, sCode === "SB" ? "○" : "").trim();
        part = part.replace(MERGED_VERSE_PREFIX, "");
        if (k > i && /^\(\d*절에 포함되어 있음\)$/.test(part)) continue;
        if (part) secondaryParts.push(part);
      }
      let secondaryText = secondaryParts.join(" ");
      copySecondaryText = secondaryText;
      card.className = `verse-card compare-mode ${hasNote ? 'has-note' : ''}`;
      
      card.innerHTML = `
        ${headerHtml}
        <div class="verse-text-group">
          <div class="verse-translation-item primary">
            <span class="verse-text-container">${numBadgeHtml}${primaryText || "(해당 구절 없음)"}</span>
          </div>
          <div class="verse-translation-item secondary">
            <span class="verse-text-container">${secondaryText || "(해당 구절 없음)"}</span>
          </div>
        </div>
        ${hasNote ? `<div class="verse-note-display">${escapeHtml(notes[noteKey])}</div>` : ''}
      `;
    } else {
      card.className = `verse-card ${hasNote ? 'has-note' : ''}`;
      card.innerHTML = `
        ${headerHtml}
        <div class="verse-text-container">${numBadgeHtml}${primaryText}</div>
        ${hasNote ? `<div class="verse-note-display">${escapeHtml(notes[noteKey])}</div>` : ''}
      `;
    }
    
    // 꾸욱 눌러 복사용 본문 데이터
    card._verseCopy = {
      label: verseLabel,
      primary: primaryText,
      secondary: copySecondaryText,
      pCode,
      sCode: copySecondaryText ? sCode : "NONE"
    };
    
    // ── 클릭/더블클릭 분기 ─────────────────────────────────────────────
    card.addEventListener("click", (e) => {
      // 꾸욱 눌러 복사 직후의 클릭은 무시 (선택/메모/점프 동작 겹침 방지)
      if (Date.now() < suppressVerseClickUntil) {
        e.stopPropagation();
        return;
      }
      if (isTTSSpeaking) {
        // 재생 중: 클릭하면 해당 구절로 점프 (재생 계속)
        jumpToTTSVerse(verseNum);
        e.stopPropagation();
        return;
      }

      // 비재생: 싱글/더블 클릭 구분
      if (clickTimer) {
        // 더블클릭 → 메모 모달
        clearTimeout(clickTimer);
        clickTimer = null;
        openNoteModal(book, chapter, verseNum, primaryText);
      } else {
        // 싱글클릭 타이머 시작
        clickTimer = setTimeout(() => {
          clickTimer = null;
          // 싱글클릭 → 선택 하이라이트 토글
          if (selectedVerseNum === verseNum) {
            selectedVerseNum = null; // 같은 구절 재클릭 → 해제
          } else {
            selectedVerseNum = verseNum;
          }
          applySelectedVerseHighlight();
        }, DBLCLICK_DELAY);
      }
    });

    bibleViewerEl.appendChild(card);
  }
  
  if (bibleViewerEl.children.length <= 1) { 
    const infoEl = document.createElement("div");
    infoEl.className = "info-msg";
    infoEl.textContent = "해당 장에 렌더링할 구절이 없습니다.";
    bibleViewerEl.appendChild(infoEl);
  }

  // 선택 구절 하이라이트 복원 (역본/장 변경 후에도 유지)
  applySelectedVerseHighlight();
  // 구간 반복 표시 복원
  applyRepeatRangeHighlight();
  updateRangeBadge();

  // 스크롤 위치 결정:
  //   선택 구절 있음 → 그 구절 위치로 스크롤
  //   선택 구절 없음 → 장 처음으로 스크롤
  const appContent = document.querySelector(".app-content");
  if (appContent) {
    if (selectedVerseNum !== null) {
      const targetCard = bibleViewerEl.querySelector(`.verse-card[data-verse="${selectedVerseNum}"]`);
      if (targetCard) {
        setTimeout(() => {
          targetCard.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 80);
      } else {
        appContent.scrollTop = 0;
      }
    } else {
      appContent.scrollTop = 0;
    }
  }
}

// ── 선택 구절 하이라이트 적용 헬퍼 ──────────────────────────────────
function applySelectedVerseHighlight() {
  bibleViewerEl.querySelectorAll(".is-selected").forEach(el => {
    el.classList.remove("is-selected");
  });
  if (selectedVerseNum !== null) {
    const targetCard = bibleViewerEl.querySelector(`.verse-card[data-verse="${selectedVerseNum}"]`);
    if (targetCard) {
      targetCard.classList.add("is-selected");
    } else {
      selectedVerseNum = null;
    }
  }
}

// HTML 이스케이프 헬퍼
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// 메모 모달 열기
function openNoteModal(book, chapter, verse, primaryText) {
  currentNoteTarget = { book, chapter, verse };
  const unit = getChapterLabel(book);
  noteModalTitle.textContent = `${book} ${chapter}${unit} ${verse}절 메모`;
  selectedVerseText.textContent = primaryText || "(본문 없음)";
  
  const noteKey = `${book}_${chapter}_${verse}`;
  noteTextarea.value = notes[noteKey] || "";
  
  btnDeleteNote.style.display = notes[noteKey] ? "block" : "none";
  noteModal.classList.add("active");
  
  setTimeout(() => {
    noteTextarea.focus();
  }, 100);
}

// 메모 저장 액션
function saveNoteAction() {
  const { book, chapter, verse } = currentNoteTarget;
  const text = noteTextarea.value.trim();
  const noteKey = `${book}_${chapter}_${verse}`;
  
  if (text) {
    notes[noteKey] = text;
    showToast("메모가 저장되었습니다.");
  } else {
    delete notes[noteKey];
    showToast("메모가 삭제되었습니다.");
  }
  
  saveNotes();
  closeModal(noteModal);
  renderBible();
}

// 메모 삭제 액션
function deleteNoteAction() {
  if (confirm("정말로 이 메모를 삭제하시겠습니까?")) {
    const { book, chapter, verse } = currentNoteTarget;
    const noteKey = `${book}_${chapter}_${verse}`;
    delete notes[noteKey];
    saveNotes();
    closeModal(noteModal);
    renderBible();
    showToast("메모가 삭제되었습니다.");
  }
}

// 전체 메모 복사/백업
// 전체 메모 복사/백업 (구절 본문 자동 병합 및 조회 창 팝업 기능 추가 - 요구사항)
function exportNotesToClipboard() {
  const keys = Object.keys(notes);
  if (keys.length === 0) {
    showToast("저장된 메모가 없습니다.");
    return;
  }
  
  let exportStr = "[개인 성경앱 묵상메모 백업]\n\n";
  const db = window.BIBLE_66_DB_KG; // 본문 추출용 개역개정 성경 DB 참조
  
  keys.sort().forEach(key => {
    const parts = key.split("_");
    const book = parts[0];
    const chapter = parts[1];
    const verse = parseInt(parts[2]);
    const unit = getChapterLabel(book);
    
    // 개역개정 DB에서 본문 구절 말씀 추출
    let verseText = "";
    if (db && db[book] && db[book][String(chapter)]) {
      verseText = db[book][String(chapter)][verse - 1] || "";
    }
    
    exportStr += `▶ ${book} ${chapter}${unit} ${verse}절\n`;
    if (verseText) {
      exportStr += `본문: ${verseText.trim()}\n`;
    }
    exportStr += `메모: ${notes[key].trim()}\n`;
    exportStr += `----------------------------------------\n\n`;
  });
  
  const finalBackupText = exportStr.trim();
  
  // 백업/조회 창 텍스트 주입 및 활성화 (요구사항 2)
  backupTextarea.value = finalBackupText;
  backupModal.classList.add("active");
  
  // 동시에 클립보드 일괄 복사 병행 처리
  navigator.clipboard.writeText(finalBackupText).then(() => {
    showToast("전체 메모가 클립보드에 복사되었으며 조회창이 열렸습니다.");
  }).catch(err => {
    showToast("조회창이 열렸으나 자동 클립보드 복사는 실패했습니다.");
  });
}

// 백업 모달 내 수동 클립보드 복사 버튼 액션
function copyBackupTextAction() {
  const text = backupTextarea.value.trim();
  if (!text) {
    showToast("복사할 백업 데이터가 없습니다.");
    return;
  }
  navigator.clipboard.writeText(text).then(() => {
    showToast("백업 데이터가 클립보드에 복사되었습니다!");
  }).catch(err => {
    showToast("클립보드 복사 실패.");
  });
}


/* ==========================================================================
   🔊 낭독 (TTS) 엔진 및 자연어 음성 설정 구현
   - iOS 27 무음 모드 스피커 출력 및 화면 잠금(백그라운드) 연속 재생 지원 (<audio id="ttsMainAudio">)
   - 구절 단위 MP3 Blob 사전 프리패칭(Prefetch)으로 끊김 없는 구절/장 자동 전환
   - 일시정지 후 이어듣기 시 음절 잘림 현상 완벽 해결 (mainAudio.pause() / mainAudio.play())
   - 오프라인 환경 시 Web Speech API 자동 폴백 지원
   ========================================================================== */

let speechVoices = [];
window.ttsCurrentPlayToken = 0;
window.ttsUsingWebSpeechFallback = false;
window.ttsLoadedVerseIndex = -1;
window.ttsLoadedBook = "";
window.ttsLoadedChapter = 0;
window.ttsLoadedTranslation = "";
window.ttsVerseRetryCount = 0;
window.ttsAudioStallTimer = null;
window.ttsSpeakTimer = null;
window.ttsAudioBlobCache = window.ttsAudioBlobCache || {};
window.ttsPrefetchingMap = window.ttsPrefetchingMap || {};

// 시스템 음성 목록 비동기 캐싱 및 갱신 (오프라인 폴백용)
function loadVoices() {
  if ('speechSynthesis' in window) {
    speechVoices = window.speechSynthesis.getVoices();
  }
}

if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = loadVoices;
  loadVoices();
}

// iOS 17+ / iOS 27: 무음 스위치(벨소리 꺼짐) 상태에서도 미디어 스피커로 소리가 출력되도록 playback 세션 강제 지정
function configurePlaybackAudioSession() {
  try {
    if ('audioSession' in navigator && navigator.audioSession) {
      navigator.audioSession.type = 'playback';
    }
  } catch (e) {}
}

// 메인 HTML5 오디오 엘리먼트 반환 (단일 <audio> 인스턴스 재사용으로 iOS/Android 백그라운드 세션 유지)
function getTtsMainAudioElement() {
  let mainAudio = document.getElementById('ttsMainAudio');
  if (!mainAudio) {
    mainAudio = document.createElement('audio');
    mainAudio.id = 'ttsMainAudio';
    mainAudio.preload = 'auto';
    mainAudio.setAttribute('playsinline', '');
    mainAudio.setAttribute('webkit-playsinline', '');
    mainAudio.style.display = 'none';
    document.body.appendChild(mainAudio);
  }
  return mainAudio;
}

function clearTtsAudioStallTimer() {
  if (window.ttsAudioStallTimer) {
    clearTimeout(window.ttsAudioStallTimer);
    window.ttsAudioStallTimer = null;
  }
}

function updateTTSPlayButtons(text) {
  if (btnAudioTTSPlay) btnAudioTTSPlay.textContent = text;
  const btnBottom = document.getElementById("btnAudioTTSPlayBottom");
  if (btnBottom) {
    btnBottom.textContent = text;
  }
}

// iOS 및 모바일 TTS 음성 엔진의 한국어 성경 고질적 오발음 사전 교정 및 특수기호(○ 등) 제거 엔진
function preprocessKoreanTTS(text) {
  if (!text) return "";
  let s = String(text);

  // 0. 절 구분 기호(○, ◯ 등) 및 괄호/각주 표기 완전 제거 ("빈 동그라미"로 읽는 현상 원천 차단)
  s = s.replace(/\[[^\]]*\]/g, " ");
  s = s.replace(/<[^>]*>/g, " ");
  s = s.replace(/\([^)]*\)/g, " ");
  s = s.replace(/[○◯●◎◇◆□■△▲▽▼☆★<>「」『』]/g, " ");
  s = s.replace(/\b\d+\)/g, " ");

  // 1. 숫양, 숫염소 발음 교정 (연음 오류 방지 -> 표준 발음)
  s = s.replace(/숫양/g, "순냥");
  s = s.replace(/숫염소/g, "순념소");

  // 2. '갓' (야곱의 7남 갓 지파 / 갓씨 / 선지자 갓 등) 영어 외래어 오발음 교정
  s = s.replace(/갓이/g, "가시");
  s = s.replace(/갓은/g, "가슨");
  s = s.replace(/갓을/g, "가슬");
  s = s.replace(/갓에/g, "가세");
  s = s.replace(/갓에게/g, "가세게");
  s = s.replace(/갓이라/g, "가시라");
  s = s.replace(/갓씨/g, "갇씨");
  s = s.replace(/갓디/g, "갇디");
  s = s.replace(/갓미/g, "갇미");
  s = s.replace(/갓몬/g, "갇몬");
  s = s.replace(/갓삼/g, "갇삼");
  s = s.replace(/갓닷/g, "갇닫");
  s = s.replace(/느부갓네살/g, "느부간네살");

  // 3. 자음 조사 및 단독 '갓' (예: "갓과", "갓도", "갓 지파", "갓 자손", "선지자 갓", "(갓)", "갓.")
  s = s.replace(/갓(?=[과도으로며의자지선])/g, "갇");
  s = s.replace(/(^|[^가-힣])갓(?=[^가-힣]|$)/g, "$1갇");

  return s.replace(/\s+/g, " ").trim();
}

function preprocessSpeechText(rawText) {
  if (!rawText) return "";
  const isEnglish = !/[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(rawText);
  if (isEnglish) {
    return String(rawText)
      .replace(/\[[^\]]*\]/g, " ")
      .replace(/<[^>]*>/g, " ")
      .replace(/[○◯●◎◇◆□■△▲▽▼☆★]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }
  return preprocessKoreanTTS(rawText);
}

function getTtsCacheKey(rawText) {
  const processed = preprocessSpeechText(rawText);
  const isEnglish = !/[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(processed);
  return (isEnglish ? "en|" : "ko|") + processed;
}

function getTtsApiUrl(rawText, useBackupEndpoint) {
  const processed = preprocessSpeechText(rawText);
  const isEnglish = !/[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(processed);
  const tl = isEnglish ? "en" : "ko";
  const safeText = processed.substring(0, 200);
  const baseUrl = useBackupEndpoint
    ? "https://login-church-test.vercel.app/api/tts"
    : "https://login-church.vercel.app/api/tts";
  return `${baseUrl}?tl=${tl}&q=${encodeURIComponent(safeText)}`;
}

function prefetchRawSpeechText(rawText) {
  const processed = preprocessSpeechText(rawText);
  if (!processed) return Promise.resolve();
  const cacheKey = getTtsCacheKey(processed);
  if (window.ttsAudioBlobCache[cacheKey] || window.ttsPrefetchingMap[cacheKey]) {
    return Promise.resolve();
  }
  window.ttsPrefetchingMap[cacheKey] = true;
  return fetch(getTtsApiUrl(processed, false))
    .then(res => {
      if (!res.ok) throw new Error("TTS HTTP " + res.status);
      return res.blob();
    })
    .then(blob => {
      if (blob && blob.size > 64) {
        window.ttsAudioBlobCache[cacheKey] = URL.createObjectURL(blob);
      }
      delete window.ttsPrefetchingMap[cacheKey];
    })
    .catch(() => {
      delete window.ttsPrefetchingMap[cacheKey];
    });
}

// 백그라운드 구절 전환 시 네트워크 지연이 없도록 다음 구절들의 MP3 Blob을 순차적으로 미리 캐싱
function prefetchUpcomingVerses(startIdx, count) {
  const indices = [];
  const activeRange = getActiveRepeatRange();

  if (state.repeatMode === "VERSE") {
    if (currentTTSIndex >= 0 && currentTTSIndex < ttsSpeechItems.length) {
      indices.push(currentTTSIndex);
    }
  } else if (activeRange) {
    const { startIdx: rStart, endIdx: rEnd } = getRepeatRangeIndices(activeRange);
    if (rStart !== -1 && rEnd !== -1) {
      let idx = startIdx;
      for (let i = 0; i < count; i++) {
        if (idx > rEnd) idx = rStart;
        if (idx >= 0 && idx < ttsSpeechItems.length) indices.push(idx);
        idx++;
      }
    }
  } else {
    for (let i = 0; i < count; i++) {
      const idx = startIdx + i;
      if (idx >= 0 && idx < ttsSpeechItems.length) {
        indices.push(idx);
      } else if (state.repeatMode === "CHAPTER" && ttsSpeechItems.length > 0) {
        indices.push(idx % ttsSpeechItems.length);
      }
    }
  }

  let chain = Promise.resolve();
  indices.forEach(idx => {
    const item = ttsSpeechItems[idx];
    if (item && item.speakText) {
      chain = chain.then(() => prefetchRawSpeechText(item.speakText));
    }
  });

  // 연속 모드(NONE)에서 현재 장 마지막 부분(끝에서 2절 이내)을 읽고 있다면 다음 장 1~2절도 미리 프리패칭
  if (state.repeatMode === "NONE" && startIdx >= ttsSpeechItems.length - 2) {
    chain.then(() => prefetchNextChapterFirstVerses());
  }
}

function prefetchNextChapterFirstVerses() {
  try {
    const currentBookIndex = BIBLE_METADATA.findIndex(b => b.name === state.currentBook);
    if (currentBookIndex === -1) return;
    const book = BIBLE_METADATA[currentBookIndex];
    let nextBook = state.currentBook;
    let nextChapter = state.currentChapter + 1;
    if (nextChapter > book.chapters) {
      if (currentBookIndex < BIBLE_METADATA.length - 1) {
        nextBook = BIBLE_METADATA[currentBookIndex + 1].name;
        nextChapter = 1;
      } else {
        return;
      }
    }
    const pCode = state.primaryTranslation;
    const pVarName = TRANSLATION_MAP[pCode] && TRANSLATION_MAP[pCode].varName;
    const pDb = pVarName ? window[pVarName] : null;
    if (!pDb || !pDb[nextBook] || !pDb[nextBook][String(nextChapter)]) return;
    const verses = pDb[nextBook][String(nextChapter)];
    const unit = getChapterLabel(nextBook);
    let pChain = Promise.resolve();
    for (let i = 0; i < Math.min(2, verses.length); i++) {
      let vText = String(verses[i] || "").replace(MERGED_VERSE_PREFIX, "").trim();
      if (!vText) continue;
      const isEng = !/[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(vText);
      const speakStr = (i === 0)
        ? (isEng ? `${nextBook} ${nextChapter}. ${vText}` : `${nextBook} ${nextChapter}${unit}. ${vText}`)
        : vText;
      pChain = pChain.then(() => prefetchRawSpeechText(speakStr));
    }
  } catch (e) {}
}

function togglePlayTTS() {
  configurePlaybackAudioSession();

  if (isTTSSpeaking) {
    if (isTTSPaused) {
      resumePausedTTS();
    } else {
      pauseActiveTTS();
    }
  } else {
    const activeRange = getActiveRepeatRange();
    if (activeRange) {
      activeRange.loopCount = 0;
      startTTS(activeRange.start);
    } else {
      startTTS(selectedVerseNum);
    }
  }
}

function pauseActiveTTS() {
  isTTSPaused = true;
  window.ttsCurrentPlayToken = (window.ttsCurrentPlayToken || 0) + 1;
  clearTtsAudioStallTimer();
  if (window.ttsSpeakTimer) {
    clearTimeout(window.ttsSpeakTimer);
    window.ttsSpeakTimer = null;
  }

  const mainAudio = document.getElementById('ttsMainAudio');
  if (mainAudio) {
    try {
      mainAudio.onended = null;
      mainAudio.onerror = null;
      mainAudio.onplaying = null;
      mainAudio.onwaiting = null;
      mainAudio.onstalled = null;
      mainAudio.pause();
    } catch (e) {}
  }

  if ('speechSynthesis' in window) {
    try {
      if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause();
      }
    } catch (e) {}
  }

  stopSilentAudio();
  releaseScreenWakeLock();
  updateTTSPlayButtons("▶ 이어듣기");
  if ('mediaSession' in navigator) {
    try { navigator.mediaSession.playbackState = "paused"; } catch (e) {}
  }
  showToast("낭독을 일시정지했습니다.");
}

function resumePausedTTS() {
  configurePlaybackAudioSession();
  isTTSPaused = false;
  isTTSSpeaking = true;
  updateTTSPlayButtons("❚❚ 일시정지");
  requestScreenWakeLock();

  const rate = TTS_SPEEDS[currentTTSSpeedIndex] || 1.0;
  const mainAudio = getTtsMainAudioElement();

  // 1) 메인 MP3 오디오에서 일시정지된 동일 구절이면 끊김 없이 즉시 이어서 재생 (음절 잘림 0%)
  if (
    !window.ttsUsingWebSpeechFallback &&
    mainAudio &&
    mainAudio.src &&
    window.ttsLoadedVerseIndex === currentTTSIndex &&
    window.ttsLoadedBook === state.currentBook &&
    window.ttsLoadedChapter === state.currentChapter &&
    window.ttsLoadedTranslation === state.primaryTranslation &&
    !mainAudio.ended &&
    (mainAudio.currentTime > 0 || mainAudio.readyState >= 2)
  ) {
    window.ttsCurrentPlayToken = (window.ttsCurrentPlayToken || 0) + 1;
    const resumeToken = window.ttsCurrentPlayToken;
    const resumeItem = ttsSpeechItems[currentTTSIndex];
    const fallbackFn = attachMainAudioHandlers(mainAudio, resumeToken, resumeItem);

    try {
      mainAudio.defaultPlaybackRate = rate;
      mainAudio.playbackRate = rate;
    } catch (e) {}

    updateMediaSession();
    if ('mediaSession' in navigator) {
      try { navigator.mediaSession.playbackState = "playing"; } catch (e) {}
    }
    prefetchUpcomingVerses(currentTTSIndex + 1, 4);
    showToast(`낭독을 이어서 재생합니다 (${rate.toFixed(1)}x)`);

    const resumePromise = mainAudio.play();
    if (resumePromise && typeof resumePromise.catch === "function") {
      resumePromise.catch(err => {
        if (!isTTSSpeaking || isTTSPaused || resumeToken !== window.ttsCurrentPlayToken) return;
        if (err && err.name === "AbortError") return;
        fallbackFn();
      });
    }
    return;
  }

  // 2) 오프라인 Web Speech 폴백 모드에서 일시정지된 경우
  if (
    window.ttsUsingWebSpeechFallback &&
    'speechSynthesis' in window &&
    window.speechSynthesis.paused &&
    window.speechSynthesis.speaking &&
    window.ttsLoadedVerseIndex === currentTTSIndex
  ) {
    startSilentAudio();
    updateMediaSession();
    try { window.speechSynthesis.resume(); } catch (e) {}
    showToast(`낭독을 이어서 재생합니다 (${rate.toFixed(1)}x)`);
    return;
  }

  // 3) 그 외의 경우 현재 구절 처음부터 안전하게 재시작
  speakNextTTS(false);
}

function startTTS(startVerse) {
  configurePlaybackAudioSession();
  if (!speechVoices || speechVoices.length === 0) {
    loadVoices();
  }
  executeStartTTS(startVerse);
}

function executeStartTTS(startVerse) {
  const cards = bibleViewerEl.querySelectorAll(".verse-card");
  if (cards.length === 0) return;

  const book = state.currentBook;
  const chapter = state.currentChapter;
  const unit = getChapterLabel(book);

  ttsSpeechItems = [];
  cards.forEach(card => {
    const verseNum = parseInt(card.getAttribute("data-verse"), 10);
    const verseEndNum = parseInt(card.getAttribute("data-verse-end"), 10) || verseNum;

    let textToSpeak = "";
    const primaryTextEl = card.querySelector(".verse-translation-item.primary .verse-text-container");
    if (primaryTextEl) {
      textToSpeak = primaryTextEl.textContent;
    } else {
      const singleTextEl = card.querySelector(".verse-text-container");
      textToSpeak = singleTextEl ? singleTextEl.textContent : "";
    }

    // 대괄호 [], 꺾쇠 <>, 소괄호 (), 절 구분 기호(○) 및 앞부분 절 번호 숫자 제거
    textToSpeak = textToSpeak.replace(/\[[^\]]*\]/g, " ");
    textToSpeak = textToSpeak.replace(/<[^>]*>/g, " ");
    textToSpeak = textToSpeak.replace(/\([^)]*\)/g, " ");
    textToSpeak = textToSpeak.replace(/[○◯●◎◇◆□■△▲▽▼☆★]/g, " ");
    textToSpeak = textToSpeak.replace(/^\d+(?:-\d+)?\s*/, "").trim();

    if (textToSpeak) {
      const isEnglish = !/[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(textToSpeak);
      const speakText = (verseNum === 1)
        ? (isEnglish ? `${book} ${chapter}. ${textToSpeak}` : `${book} ${chapter}${unit}. ${textToSpeak}`)
        : textToSpeak;

      ttsSpeechItems.push({
        element: card,
        verse: verseNum,
        verseEnd: verseEndNum,
        text: textToSpeak,
        speakText: speakText
      });
    }
  });

  if (ttsSpeechItems.length === 0) return;

  isTTSSpeaking = true;
  isTTSPaused = false;
  window.ttsVerseRetryCount = 0;

  if (startVerse != null) {
    let startIdx = ttsSpeechItems.findIndex(item => item.verse <= startVerse && startVerse <= item.verseEnd);
    if (startIdx === -1) startIdx = ttsSpeechItems.findIndex(item => item.verse >= startVerse);
    currentTTSIndex = startIdx !== -1 ? startIdx : 0;
  } else {
    currentTTSIndex = 0;
  }

  selectedVerseNum = null;
  applySelectedVerseHighlight();

  const ttsBox = document.getElementById("ttsControlBox");
  if (ttsBox) ttsBox.classList.remove("hidden");
  document.body.classList.add("tts-active");
  if (btnAudioTTSRepeat) updateRepeatModeButton();
  updateTTSPlayButtons("❚❚ 일시정지");
  updateRangeBadge();

  initTTSHeartbeat();
  requestScreenWakeLock();
  speakNextTTS(false);
}

function createConfiguredUtterance(item) {
  const rawText = (item && (item.speakText || item.text)) || "";
  const isEnglish = !/[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(rawText);
  const speechText = preprocessSpeechText(rawText);
  const utterance = new SpeechSynthesisUtterance(speechText);
  utterance.rate = TTS_SPEEDS[currentTTSSpeedIndex] || 1.0;

  if (isEnglish) {
    utterance.lang = "en-US";
    if (speechVoices.length > 0) {
      const preferredEnVoices = ["Google US English", "Microsoft David", "Microsoft Zira", "en-US", "en"];
      for (const pref of preferredEnVoices) {
        const selectedVoice = speechVoices.find(v => v.name.includes(pref) || v.lang.includes(pref));
        if (selectedVoice) {
          utterance.voice = selectedVoice;
          break;
        }
      }
    }
  } else {
    utterance.lang = "ko-KR";
    if (speechVoices.length > 0) {
      const preferredKoVoices = ["Google 한국어", "Microsoft Heami", "Yuna", "Sora", "ko-KR", "ko"];
      for (const pref of preferredKoVoices) {
        const selectedVoice = speechVoices.find(v => v.name.includes(pref) || v.lang.includes(pref));
        if (selectedVoice) {
          utterance.voice = selectedVoice;
          break;
        }
      }
    }
  }
  return utterance;
}

function advanceToNextTTSVerse() {
  if (!isTTSSpeaking || isTTSPaused) return;
  window.ttsVerseRetryCount = 0;
  if ( state.repeatMode !== "VERSE") {
    currentTTSIndex++;
  }
  speakNextTTS(true);
}

function attemptAudioRetryOrFallback(playToken, item) {
  if (!isTTSSpeaking || isTTSPaused || playToken !== window.ttsCurrentPlayToken) return;
  clearTtsAudioStallTimer();

  window.ttsVerseRetryCount = (window.ttsVerseRetryCount || 0) + 1;
  if (window.ttsVerseRetryCount <= 2) {
    const mainAudio = getTtsMainAudioElement();
    const rate = TTS_SPEEDS[currentTTSSpeedIndex] || 1.0;
    const rawText = (item && (item.speakText || item.text)) || "";
    const useBackup = window.ttsVerseRetryCount === 2;
    const retryUrl = getTtsApiUrl(rawText, useBackup) + "&retry=" + window.ttsVerseRetryCount + "_" + Date.now();

    setTimeout(() => {
      if (!isTTSSpeaking || isTTSPaused || playToken !== window.ttsCurrentPlayToken) return;
      try {
        attachMainAudioHandlers(mainAudio, playToken, item);
        mainAudio.src = retryUrl;
        mainAudio.defaultPlaybackRate = rate;
        mainAudio.playbackRate = rate;
        const p = mainAudio.play();
        if (p && typeof p.catch === "function") {
          p.catch(err => {
            if (!isTTSSpeaking || isTTSPaused || playToken !== window.ttsCurrentPlayToken) return;
            if (err && err.name === "AbortError") return;
            attemptAudioRetryOrFallback(playToken, item);
          });
        }
      } catch (e) {
        speakWithWebSpeechFallback(playToken, item);
      }
    }, 300);
    return;
  }

  window.ttsVerseRetryCount = 0;
  speakWithWebSpeechFallback(playToken, item);
}

function attachMainAudioHandlers(mainAudio, playToken, item) {
  let hasEndedOrErrored = false;

  const armStallWatchdog = (timeoutMs) => {
    clearTtsAudioStallTimer();
    window.ttsAudioStallTimer = setTimeout(() => {
      if (!isTTSSpeaking || isTTSPaused || hasEndedOrErrored || playToken !== window.ttsCurrentPlayToken) return;
      if (mainAudio.paused || mainAudio.readyState < 2) {
        hasEndedOrErrored = true;
        attemptAudioRetryOrFallback(playToken, item);
      }
    }, timeoutMs || 7500);
  };

  const triggerRetryOrFallback = () => {
    if (!isTTSSpeaking || isTTSPaused || hasEndedOrErrored || playToken !== window.ttsCurrentPlayToken) return;
    hasEndedOrErrored = true;
    clearTtsAudioStallTimer();
    attemptAudioRetryOrFallback(playToken, item);
  };

  armStallWatchdog(7500);

  mainAudio.onplaying = () => {
    if (playToken !== window.ttsCurrentPlayToken) return;
    window.ttsVerseRetryCount = 0;
    clearTtsAudioStallTimer();
  };

  mainAudio.onwaiting = () => {
    if (playToken !== window.ttsCurrentPlayToken) return;
    armStallWatchdog(7500);
  };

  mainAudio.onstalled = () => {
    if (playToken !== window.ttsCurrentPlayToken) return;
    armStallWatchdog(6000);
  };

  mainAudio.onended = () => {
    if (!isTTSSpeaking || isTTSPaused || hasEndedOrErrored || playToken !== window.ttsCurrentPlayToken) return;
    hasEndedOrErrored = true;
    clearTtsAudioStallTimer();
    advanceToNextTTSVerse();
  };

  mainAudio.onerror = () => {
    triggerRetryOrFallback();
  };

  return triggerRetryOrFallback;
}

function speakWithWebSpeechFallback(playToken, item) {
  if (!isTTSSpeaking || isTTSPaused || playToken !== window.ttsCurrentPlayToken) return;
  if (!('speechSynthesis' in window)) {
    stopTTS();
    showToast("음성 재생을 사용할 수 없습니다.");
    return;
  }

  window.ttsUsingWebSpeechFallback = true;
  startSilentAudio();

  try {
    window.speechSynthesis.cancel();
  } catch (e) {}

  const utterance = createConfiguredUtterance(item);
  activeUtterance = utterance;
  let hasStepEnded = false;

  utterance.onend = () => {
    if (!isTTSSpeaking || isTTSPaused || hasStepEnded || playToken !== window.ttsCurrentPlayToken || utterance !== activeUtterance) return;
    hasStepEnded = true;
    advanceToNextTTSVerse();
  };

  utterance.onerror = (e) => {
    if (!isTTSSpeaking || isTTSPaused || hasStepEnded || playToken !== window.ttsCurrentPlayToken || utterance !== activeUtterance) return;
    if (e && (e.error === "interrupted" || e.error === "canceled")) return;
    hasStepEnded = true;
    advanceToNextTTSVerse();
  };

  try {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  } catch (e) {}
  window.speechSynthesis.speak(utterance);
}

function speakNextTTS(fromAutoEnd = false) {
  if (!isTTSSpeaking || isTTSPaused) return;

  if (window.ttsSpeakTimer) {
    clearTimeout(window.ttsSpeakTimer);
    window.ttsSpeakTimer = null;
  }

  // 🎯 구간 반복: 끝 절을 지나면 시작 절로 되돌아가기 (횟수 제한 시 완료 후 정지)
  const activeRange = getActiveRepeatRange();
  if (activeRange) {
    const { startIdx, endIdx } = getRepeatRangeIndices(activeRange);
    if (startIdx !== -1 && endIdx !== -1 && currentTTSIndex > endIdx) {
      activeRange.loopCount++;
      if (activeRange.maxLoops > 0 && activeRange.loopCount >= activeRange.maxLoops) {
        stopTTS();
        showToast(`🎯 ${formatRangeLabel(activeRange)} 구간 ${activeRange.maxLoops}회 반복 완료`);
        updateRangeBadge();
        return;
      }
      currentTTSIndex = startIdx;
      updateRangeBadge();
    }
  }

  // 장 끝에 도달했을 때 처리
  if (currentTTSIndex >= ttsSpeechItems.length) {
    if (state.repeatMode === "CHAPTER") {
      showToast("현재 장을 반복 낭독합니다.");
      currentTTSIndex = 0;
      speakNextTTS(true);
      return;
    }

    // 현재 장을 통독 완료로 자동 체크 처리
    const completedBook = state.currentBook;
    const completedChapter = state.currentChapter;
    if (!readHistory[completedBook]) {
      readHistory[completedBook] = [];
    }
    if (!readHistory[completedBook].includes(completedChapter)) {
      readHistory[completedBook].push(completedChapter);
      saveReadHistory();
      updateReadCheckButtonState();
      if (typeof renderDailyPlanWidget === "function") renderDailyPlanWidget();
      if (typeof renderReadingPlanTab === "function" && progressModal.classList.contains("active")) renderReadingPlanTab();
    }

    const currentBookIndex = BIBLE_METADATA.findIndex(b => b.name === state.currentBook);
    const bookMetadata = BIBLE_METADATA[currentBookIndex];
    if (currentBookIndex === BIBLE_METADATA.length - 1 && state.currentChapter === bookMetadata.chapters) {
      stopTTS();
      showToast("성경의 마지막 장까지 모두 낭독하였습니다! 🎉");
      return;
    }

    showToast("다음 장을 이어서 낭독합니다.");
    navigateChapter(1);

    // 백그라운드/잠금화면에서도 오디오 세션이 끊기지 않도록 즉시 다음 장 1절부터 이어서 재생
    const tryStartNextChapter = (attempt = 0) => {
      if (!isTTSSpeaking) return;
      const cards = bibleViewerEl.querySelectorAll(".verse-card");
      if (cards.length > 0) {
        executeStartTTS(1);
      } else if (attempt < 10) {
        setTimeout(() => tryStartNextChapter(attempt + 1), 100);
      }
    };
    tryStartNextChapter(0);
    return;
  }

  window.ttsCurrentPlayToken = (window.ttsCurrentPlayToken || 0) + 1;
  const myPlayToken = window.ttsCurrentPlayToken;

  bibleViewerEl.querySelectorAll(".is-reading-speaking").forEach(el => {
    el.classList.remove("is-reading-speaking");
  });

  const item = ttsSpeechItems[currentTTSIndex];
  if (item && item.element) {
    item.element.classList.add("is-reading-speaking");
    if (!document.hidden) {
      item.element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  updateMediaSession();
  if ('mediaSession' in navigator) {
    try { navigator.mediaSession.playbackState = "playing"; } catch (e) {}
  }

  // 이전 Web Speech 콜백 차단
  if (activeUtterance) {
    activeUtterance.onend = null;
    activeUtterance.onerror = null;
    activeUtterance = null;
  }
  if (!fromAutoEnd && 'speechSynthesis' in window) {
    try { window.speechSynthesis.cancel(); } catch (e) {}
  }

  // 다음 구절들을 미리 메모리에 프리패칭 (백그라운드 연속 재생 보장)
  prefetchUpcomingVerses(currentTTSIndex + 1, 3);

  const mainAudio = getTtsMainAudioElement();
  window.ttsUsingWebSpeechFallback = false;
  window.ttsLoadedVerseIndex = currentTTSIndex;
  window.ttsLoadedBook = state.currentBook;
  window.ttsLoadedChapter = state.currentChapter;
  window.ttsLoadedTranslation = state.primaryTranslation;

  // MP3 스트리밍 재생 중에는 무음 오디오 루프(bgSilentAudio)를 꺼서 iOS 오디오 세션 충돌 방지
  const bgAudio = document.getElementById('bgSilentAudio');
  if (bgAudio && !bgAudio.paused) {
    try { bgAudio.pause(); } catch (e) {}
  }

  const rawSpeechText = (item && (item.speakText || item.text)) || "";
  const cacheKey = getTtsCacheKey(rawSpeechText);
  const audioSrc = window.ttsAudioBlobCache[cacheKey] || getTtsApiUrl(rawSpeechText, false);
  const rate = TTS_SPEEDS[currentTTSSpeedIndex] || 1.0;
  const fallbackFn = attachMainAudioHandlers(mainAudio, myPlayToken, item);

  try {
    mainAudio.muted = false;
    mainAudio.volume = 1.0;
    if ('preservesPitch' in mainAudio) mainAudio.preservesPitch = true;
    if ('webkitPreservesPitch' in mainAudio) mainAudio.webkitPreservesPitch = true;
    mainAudio.src = audioSrc;
    mainAudio.defaultPlaybackRate = rate;
    mainAudio.playbackRate = rate;

    const playPromise = mainAudio.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(err => {
        if (!isTTSSpeaking || isTTSPaused || myPlayToken !== window.ttsCurrentPlayToken) return;
        if (err && err.name === "AbortError") return;
        fallbackFn();
      });
    }
  } catch (e) {
    fallbackFn();
  }
}

function enqueueRemainingVersesForBackground() {
  // MP3 스트리밍 모드에서는 prefetchUpcomingVerses가 구절을 사전 로드하여 onended로 연속 재생함
  if (isTTSSpeaking && !isTTSPaused && !window.ttsUsingWebSpeechFallback) {
    prefetchUpcomingVerses(currentTTSIndex + 1, 4);
  }
}

function jumpToTTSVerse(verseNum) {
  let targetIdx = ttsSpeechItems.findIndex(item => item.verse === verseNum);
  if (targetIdx === -1) targetIdx = ttsSpeechItems.findIndex(item => item.verse <= verseNum && verseNum <= (item.verseEnd || item.verse));
  if (targetIdx !== -1) {
    currentTTSIndex = targetIdx;
    isTTSPaused = false;
    window.ttsVerseRetryCount = 0;
    updateTTSPlayButtons("❚❚ 일시정지");
    speakNextTTS(false);
  }
}

// 낭독 완전 정지
function stopTTS() {
  isTTSSpeaking = false;
  isTTSPaused = false;
  window.ttsCurrentPlayToken = (window.ttsCurrentPlayToken || 0) + 1;
  window.ttsLoadedVerseIndex = -1;
  window.ttsVerseRetryCount = 0;

  clearTtsAudioStallTimer();
  if (window.ttsSpeakTimer) {
    clearTimeout(window.ttsSpeakTimer);
    window.ttsSpeakTimer = null;
  }

  const mainAudio = document.getElementById('ttsMainAudio');
  if (mainAudio) {
    try {
      mainAudio.onended = null;
      mainAudio.onerror = null;
      mainAudio.onplaying = null;
      mainAudio.onwaiting = null;
      mainAudio.onstalled = null;
      mainAudio.pause();
      mainAudio.removeAttribute('src');
      mainAudio.load();
    } catch (e) {}
  }

  stopSilentAudio();
  releaseScreenWakeLock();
  if ('mediaSession' in navigator) {
    try { navigator.mediaSession.playbackState = "none"; } catch (e) {}
  }

  if (activeUtterance) {
    activeUtterance.onend = null;
    activeUtterance.onerror = null;
    activeUtterance = null;
  }

  if ('speechSynthesis' in window) {
    try { window.speechSynthesis.cancel(); } catch (e) {}
  }

  if (window.ttsHeartbeatInterval) {
    clearInterval(window.ttsHeartbeatInterval);
    window.ttsHeartbeatInterval = null;
  }

  const ttsBox2 = document.getElementById("ttsControlBox");
  if (ttsBox2) ttsBox2.classList.add("hidden");
  document.body.classList.remove("tts-active");
  updateTTSPlayButtons("▶ 재생");

  bibleViewerEl.querySelectorAll(".is-reading-speaking").forEach(el => {
    el.classList.remove("is-reading-speaking");
  });
  updateRangeBadge();
}

function playPrevTTS() {
  if (currentTTSIndex > 0) {
    currentTTSIndex--;
    isTTSPaused = false;
    window.ttsVerseRetryCount = 0;
    updateTTSPlayButtons("❚❚ 일시정지");
    speakNextTTS(false);
  }
}

function playNextTTS() {
  if (currentTTSIndex < ttsSpeechItems.length - 1) {
    currentTTSIndex++;
    isTTSPaused = false;
    window.ttsVerseRetryCount = 0;
    updateTTSPlayButtons("❚❚ 일시정지");
    speakNextTTS(false);
  }
}

function toggleTTSSpeed() {
  currentTTSSpeedIndex = (currentTTSSpeedIndex + 1) % TTS_SPEEDS.length;
  const speed = TTS_SPEEDS[currentTTSSpeedIndex];
  btnAudioTTSSpeed.textContent = `${speed.toFixed(1)}x`;

  if (isTTSSpeaking && !isTTSPaused) {
    if (!window.ttsUsingWebSpeechFallback) {
      const mainAudio = document.getElementById('ttsMainAudio');
      if (mainAudio && !mainAudio.paused) {
        try {
          mainAudio.defaultPlaybackRate = speed;
          mainAudio.playbackRate = speed;
          showToast(`낭독 배속: ${speed.toFixed(1)}x`);
          return;
        } catch (e) {}
      }
    }
    speakNextTTS(false);
  }
}

function initTTSHeartbeat() {
  if (window.ttsHeartbeatInterval) clearInterval(window.ttsHeartbeatInterval);
  window.ttsHeartbeatInterval = setInterval(() => {
    if (isTTSSpeaking && !isTTSPaused) {
      if (window.ttsUsingWebSpeechFallback) {
        if ('speechSynthesis' in window && window.speechSynthesis.paused) {
          try { window.speechSynthesis.resume(); } catch (e) {}
        }
        startSilentAudio();
      } else {
        prefetchUpcomingVerses(currentTTSIndex + 1, 3);
      }
    }
  }, 5000);
}


/* ==========================================================================
   🔍 실시간 다중 역본 통합 검색 엔진
   ========================================================================== */

function openSearchModal() {
  searchModal.classList.add("active");
  
  // 모달 내용 영역 및 바디를 맨 위로 스크롤하여 오버플로우 방지
  const modalContent = searchModal.querySelector(".modal-content");
  if (modalContent) modalContent.scrollTop = 0;
  if (searchResults) searchResults.scrollTop = 0;
  
  setTimeout(() => {
    searchInput.focus();
    searchInput.scrollIntoView({ block: "center" });
  }, 100);
}

function executeSearch() {
  const query = searchInput.value.trim();
  if (!query) {
    showToast("검색어를 입력해 주세요.");
    return;
  }
  
  searchResults.innerHTML = '<p class="search-placeholder">모든 역본 데이터를 로드하고 있습니다...</p>';
  searchResultMeta.textContent = "";

  ensureAllTranslationsLoaded(() => {
    searchResults.innerHTML = '<p class="search-placeholder">모든 역본에서 키워드를 고속 스캔하고 있습니다...</p>';
    
    setTimeout(() => {
      const startTime = performance.now();
      lastSearchResults = []; 
      const queryRegex = new RegExp(escapeRegex(query), "gi");
      
      Object.keys(TRANSLATION_MAP).forEach(code => {
        const t = TRANSLATION_MAP[code];
        const db = window[t.varName];
        if (!db) return; 
        
        BIBLE_METADATA.forEach(book => {
          const bookName = book.name;
          const chaptersData = db[bookName];
          if (!chaptersData) return;
          
          Object.keys(chaptersData).forEach(chStr => {
            const chapter = parseInt(chStr);
            const verses = chaptersData[chStr];
            if (!verses) return;
            
            verses.forEach((verseText, idx) => {
              if (!verseText) return;
              
              const cleanedText = verseText.replace(/○/g, "").trim();
              if (cleanedText.includes(query)) {
                const verseNum = idx + 1;
                const highlightedText = cleanedText.replace(queryRegex, match => `<mark>${match}</mark>`);
                lastSearchResults.push({
                  book: bookName,
                  chapter: chapter,
                  verse: verseNum,
                  translationCode: code,
                  translationName: t.name,
                  text: highlightedText
                });
              }
            });
          });
        });
      });
      
      const endTime = performance.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);
      
      renderSearchResultsList(duration);
    }, 50);
  });
}

// 검색 리스트 결과 렌더링 및 역본 필터링 적용
function renderSearchResultsList(durationTimeStr) {
  const selectedFilter = searchTranslationFilter.value; 
  
  const filtered = selectedFilter === "ALL" 
    ? lastSearchResults 
    : lastSearchResults.filter(item => item.translationCode === selectedFilter);
    
  if (durationTimeStr !== undefined) {
    searchResultMeta.setAttribute("data-duration", durationTimeStr);
  }
  const duration = searchResultMeta.getAttribute("data-duration") || "0.0";
  searchResultMeta.textContent = `검색 결과: 총 ${filtered.length}건 / 전체 ${lastSearchResults.length}건 (${duration}초 소요)`;

  if (filtered.length === 0) {
    searchResults.innerHTML = '<p class="search-placeholder">검색 결과가 없습니다.</p>';
    return;
  }

  searchResults.innerHTML = "";
  
  const maxRender = Math.min(filtered.length, 300);
  for (let i = 0; i < maxRender; i++) {
    const item = filtered[i];
    const div = document.createElement("div");
    div.className = "search-item";
    
    let badgeClass = "badge-eng";
    const code = item.translationCode;
    if (code === "KG") badgeClass = "badge-kg";
    else if (code === "SB") badgeClass = "badge-sb";
    else if (code === "KH") badgeClass = "badge-kh";
    else if (code === "HYUNDAI") badgeClass = "badge-hyundai";
    else if (code === "EASY") badgeClass = "badge-easy";
    
    const unit = getChapterLabel(item.book); // 장/편 구분
    
    div.innerHTML = `
      <div class="search-item-header">
        <span class="search-item-title">${item.book} ${item.chapter}${unit} ${item.verse}절</span>
        <span class="search-translation-badge ${badgeClass}">${item.translationName}</span>
      </div>
      <div class="search-item-text">${item.text}</div>
    `;
    
    div.addEventListener("click", () => {
      state.currentBook = item.book;
      state.currentChapter = item.chapter;
      saveSettings();
      closeModal(searchModal);
      
      renderBible();
      
      setTimeout(() => {
        const card = bibleViewerEl.querySelector(`.verse-card[data-verse="${item.verse}"]`);
        if (card) {
          card.scrollIntoView({ behavior: "smooth", block: "center" });
          card.classList.add("is-reading-speaking");
          setTimeout(() => {
            if (!isTTSSpeaking || currentTTSIndex !== (item.verse - 1)) {
              card.classList.remove("is-reading-speaking");
            }
          }, 2000);
        }
      }, 300);
    });
    
    searchResults.appendChild(div);
  }

  if (filtered.length > 300) {
    const info = document.createElement("p");
    info.className = "search-placeholder";
    info.style.padding = "20px 0";
    info.textContent = "결과가 너무 많아 상위 300건만 표시됩니다. 더 상세한 검색어를 입력해 보세요.";
    searchResults.appendChild(info);
  }
}

function escapeRegex(string) {
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
}


/* ==========================================================================
   📊 통독 현황표 대시보드
   ========================================================================== */

function openProgressModal() {
  progressModal.classList.add("active");
  renderProgressBoard();
}

function renderProgressBoard() {
  progressBooksContainer.innerHTML = "";
  
  let totalChapters = 1189;
  let readChapters = 0;
  
  BIBLE_METADATA.forEach(book => {
    const bookRow = document.createElement("div");
    bookRow.className = "progress-book-row";
    
    const title = document.createElement("div");
    title.className = "progress-book-name";
    
    const readList = readHistory[book.name] || [];
    const readCount = readList.length;
    readChapters += readCount;
    
    const unit = getChapterLabel(book.name); // 장/편 구분
    title.textContent = `${book.name} (${readCount} / ${book.chapters}${unit})`;
    
    const flex = document.createElement("div");
    flex.className = "progress-chapters-flex";
    
    for (let i = 1; i <= book.chapters; i++) {
      const dot = document.createElement("div");
      const isRead = readList.includes(i);
      dot.className = `progress-chapter-dot ${isRead ? 'checked' : ''}`;
      dot.textContent = `${i}`;
      
      dot.addEventListener("click", () => {
        toggleProgressChapter(book.name, i);
        renderProgressBoard();
      });
      
      flex.appendChild(dot);
    }
    
    bookRow.appendChild(title);
    bookRow.appendChild(flex);
    progressBooksContainer.appendChild(bookRow);
  });
  
  completedChaptersCount.textContent = readChapters;
  const ratio = ((readChapters / totalChapters) * 100).toFixed(1);
  progressPercentage.textContent = `${ratio}%`;
  progressBarFill.style.width = `${ratio}%`;
}

function toggleProgressChapter(bookName, chapterNum) {
  if (!readHistory[bookName]) {
    readHistory[bookName] = [];
  }
  const idx = readHistory[bookName].indexOf(chapterNum);
  if (idx === -1) {
    readHistory[bookName].push(chapterNum);
  } else {
    readHistory[bookName].splice(idx, 1);
  }
  saveReadHistory();
  
  if (state.currentBook === bookName && state.currentChapter === chapterNum) {
    updateReadCheckButtonState();
  }
  
  // 오늘의 통독 위젯 및 계획 탭 연동 업데이트
  if (typeof renderDailyPlanWidget === "function") renderDailyPlanWidget();
  if (typeof renderReadingPlanTab === "function" && progressModal.classList.contains("active")) renderReadingPlanTab();
}

function resetHistoryAction() {
  if (confirm("정말로 모든 성경 통독 기록을 초기화하시겠습니까? (복구할 수 없습니다.)")) {
    readHistory = {};
    BIBLE_METADATA.forEach(b => {
      readHistory[b.name] = [];
    });
    saveReadHistory();
    
    // 계획 진행 상태도 초기화
    state.activePlan = null;
    state.planActiveDay = {};
    saveSettings();
    
    renderProgressBoard();
    updateReadCheckButtonState();
    if (typeof renderDailyPlanWidget === "function") renderDailyPlanWidget();
    if (typeof renderReadingPlanTab === "function") renderReadingPlanTab();
    showToast("모든 통독 기록이 초기화되었습니다.");
  }
}

// ==========================================
// 통독 계획 데이터 및 로직 구현
// ==========================================

const READING_PLANS = {
  YEAR_1: {
    id: "YEAR_1",
    name: "연간 1독 코스",
    desc: "성경 창세기부터 요한계시록까지 하루 약 3장씩 1년(365일) 동안 차례대로 완독하는 코스입니다.",
    days: 365,
    generate: () => {
      const all = [];
      BIBLE_METADATA.forEach(b => {
        for (let c = 1; c <= b.chapters; c++) {
          all.push({ book: b.name, chapter: c });
        }
      });
      const plan = {};
      for (let d = 1; d <= 365; d++) {
        const start = Math.floor((d - 1) * all.length / 365);
        const end = Math.floor(d * all.length / 365);
        plan[d] = all.slice(start, end);
      }
      return plan;
    }
  },
  MCHEYNE: {
    id: "MCHEYNE",
    name: "맥체인 4트랙 공동체 성경읽기",
    desc: "구약 역사, 신약, 구약 예언/시가, 시편/서신서 4개 트랙을 매일 한 장씩 교차 정독하여 지루하지 않게 1독하는 1년 코스입니다.",
    days: 365,
    generate: () => {
      const t1Books = ["창세기", "출애굽기", "레위기", "민수기", "신명기", "여호수아", "사사기", "룻기", "사무엘상", "사무엘하", "열왕기상", "열왕기하", "역대상", "역대하", "에스라", "느헤미야", "에스더"];
      const t1 = [];
      t1Books.forEach(name => {
        const b = BIBLE_METADATA.find(x => x.name === name);
        if (b) {
          for (let c = 1; c <= b.chapters; c++) t1.push({ book: b.name, chapter: c });
        }
      });

      const t2Books = ["마태복음", "마가복음", "누가복음", "요한복음", "사도행전", "로마서", "고린도전서", "고린도후서", "갈라디아서", "에베소서", "빌립보서", "골로새서", "데살로니가전서", "데살로니가후서", "디모데전서", "디모데후서", "디도서", "빌레몬서", "히브리서", "야고보서", "베드로전서", "베드로후서", "요한1서", "요한2서", "요한3서", "유다서"];
      const t2 = [];
      t2Books.forEach(name => {
        const b = BIBLE_METADATA.find(x => x.name === name);
        if (b) {
          for (let c = 1; c <= b.chapters; c++) t2.push({ book: b.name, chapter: c });
        }
      });

      const t3Books = ["욥기", "잠언", "전도서", "아가", "이사야", "예레미야", "예레미야애가", "에스겔", "다니엘", "호세아", "요엘", "아모스", "오바디야", "요나", "미가", "나훔", "하박국", "스바냐", "학개", "스가랴", "말라기"];
      const t3 = [];
      t3Books.forEach(name => {
        const b = BIBLE_METADATA.find(x => x.name === name);
        if (b) {
          for (let c = 1; c <= b.chapters; c++) t3.push({ book: b.name, chapter: c });
        }
      });

      const t4 = [];
      for (let c = 1; c <= 150; c++) t4.push({ book: "시편", chapter: c });
      for (let c = 1; c <= 22; c++) t4.push({ book: "요한계시록", chapter: c });
      for (let c = 1; c <= 150; c++) t4.push({ book: "시편", chapter: c });
      const t4Books = ["히브리서", "야고보서", "베드로전서", "베드로후서", "요한1서", "요한2서", "요한3서", "유다서", "빌레몬서", "디도서", "데살로니가후서"];
      t4Books.forEach(name => {
        const b = BIBLE_METADATA.find(x => x.name === name);
        if (b) {
          for (let c = 1; c <= b.chapters; c++) {
            if (t4.length < 365) t4.push({ book: b.name, chapter: c });
          }
        }
      });
      while (t4.length < 365) {
        t4.push({ book: "시편", chapter: 1 });
      }

      const plan = {};
      for (let d = 1; d <= 365; d++) {
        plan[d] = [];
        const s1 = Math.floor((d - 1) * t1.length / 365);
        const e1 = Math.floor(d * t1.length / 365);
        t1.slice(s1, e1).forEach(x => plan[d].push(x));

        const s2 = Math.floor((d - 1) * t2.length / 365);
        const e2 = Math.floor(d * t2.length / 365);
        t2.slice(s2, e2).forEach(x => plan[d].push(x));

        const s3 = Math.floor((d - 1) * t3.length / 365);
        const e3 = Math.floor(d * t3.length / 365);
        t3.slice(s3, e3).forEach(x => plan[d].push(x));

        if (t4[d - 1]) plan[d].push(t4[d - 1]);
      }
      return plan;
    }
  },
  HISTORICAL: {
    id: "HISTORICAL",
    name: "구약 역사서 50일 통독",
    desc: "창세기부터 에스더까지 이스라엘 역사를 다루는 17권의 성경(422장)을 50일 동안 집중 학습합니다.",
    days: 50,
    generate: () => {
      const historicalBooks = ["창세기", "출애굽기", "레위기", "민수기", "신명기", "여호수아", "사사기", "룻기", "사무엘상", "사무엘하", "열왕기상", "열왕기하", "역대상", "역대하", "에스라", "느헤미야", "에스더"];
      const all = [];
      BIBLE_METADATA.forEach(b => {
        if (historicalBooks.includes(b.name)) {
          for (let c = 1; c <= b.chapters; c++) all.push({ book: b.name, chapter: c });
        }
      });
      const plan = {};
      for (let d = 1; d <= 50; d++) {
        const start = Math.floor((d - 1) * all.length / 50);
        const end = Math.floor(d * all.length / 50);
        plan[d] = all.slice(start, end);
      }
      return plan;
    }
  },
  POETIC: {
    id: "POETIC",
    name: "시가서 30일 집중 통독",
    desc: "욥기, 시편, 잠언, 전도서, 아가 5권(243장)에 담긴 찬양과 시적 지혜를 한 달 동안 깊이 묵상합니다.",
    days: 30,
    generate: () => {
      const poeticBooks = ["욥기", "시편", "잠언", "전도서", "아가"];
      const all = [];
      BIBLE_METADATA.forEach(b => {
        if (poeticBooks.includes(b.name)) {
          for (let c = 1; c <= b.chapters; c++) all.push({ book: b.name, chapter: c });
        }
      });
      const plan = {};
      for (let d = 1; d <= 30; d++) {
        const start = Math.floor((d - 1) * all.length / 30);
        const end = Math.floor(d * all.length / 30);
        plan[d] = all.slice(start, end);
      }
      return plan;
    }
  },
  GOSPELS: {
    id: "GOSPELS",
    name: "복음서 30일 통독",
    desc: "예수님의 생애와 구원 계획을 기록한 마태, 마가, 누가, 요한복음(89장)을 30일간 매일 나누어 읽습니다.",
    days: 30,
    generate: () => {
      const gospels = ["마태복음", "마가복음", "누가복음", "요한복음"];
      const all = [];
      BIBLE_METADATA.forEach(b => {
        if (gospels.includes(b.name)) {
          for (let c = 1; c <= b.chapters; c++) all.push({ book: b.name, chapter: c });
        }
      });
      const plan = {};
      for (let d = 1; d <= 30; d++) {
        const start = Math.floor((d - 1) * all.length / 30);
        const end = Math.floor(d * all.length / 30);
        plan[d] = all.slice(start, end);
      }
      return plan;
    }
  },
  NEW_TESTAMENT: {
    id: "NEW_TESTAMENT",
    name: "신약성경 90일 정복",
    desc: "예수님의 말씀과 초대 교회 선교, 사도들의 서신 및 요한계시록까지 신약 전체(260장)를 90일 만에 완독합니다.",
    days: 90,
    generate: () => {
      const all = [];
      BIBLE_METADATA.forEach(b => {
        if (b.type === "NT") {
          for (let c = 1; c <= b.chapters; c++) all.push({ book: b.name, chapter: c });
        }
      });
      const plan = {};
      for (let d = 1; d <= 90; d++) {
        const start = Math.floor((d - 1) * all.length / 90);
        const end = Math.floor(d * all.length / 90);
        plan[d] = all.slice(start, end);
      }
      return plan;
    }
  }
};

// 통독 계획 탭 메인 렌더러
function renderReadingPlanTab() {
  if (!state.activePlan) {
    planSelectionContainer.classList.remove("hidden");
    activePlanContainer.classList.add("hidden");
    renderPlanSelection();
  } else {
    planSelectionContainer.classList.add("hidden");
    activePlanContainer.classList.remove("hidden");
    renderActivePlan();
  }
}

// 계획 선택 목록 렌더링
function renderPlanSelection() {
  planCardsGrid.innerHTML = "";
  Object.keys(READING_PLANS).forEach(key => {
    const plan = READING_PLANS[key];
    const card = document.createElement("div");
    card.className = "plan-card";
    card.innerHTML = `
      <div class="plan-card-header">
        <span class="plan-card-title">${plan.name}</span>
        <span class="plan-card-duration">${plan.days}일 코스</span>
      </div>
      <p class="plan-card-desc">${plan.desc}</p>
      <button class="btn-start-plan" data-id="${plan.id}">도전하기</button>
    `;
    
    card.querySelector(".btn-start-plan").addEventListener("click", () => {
      startPlan(plan.id);
    });
    planCardsGrid.appendChild(card);
  });
}

// 활성화된 통독 계획 렌더링
function renderActivePlan() {
  const planId = state.activePlan;
  const plan = READING_PLANS[planId];
  if (!plan) return;

  const activeDay = state.planActiveDay[planId] || 1;
  const planData = plan.generate();

  activePlanTitle.textContent = plan.name;
  activePlanDesc.textContent = plan.desc;

  // 전체 진행도 계산
  let completedDaysCount = 0;
  for (let d = 1; d <= plan.days; d++) {
    const dayPassages = planData[d] || [];
    const isDayDone = dayPassages.every(p => readHistory[p.book] && readHistory[p.book].includes(p.chapter));
    if (isDayDone) completedDaysCount++;
  }

  const progressRatio = ((completedDaysCount / plan.days) * 100).toFixed(1);
  activePlanProgressText.textContent = `진행률: ${completedDaysCount} / ${plan.days}일 완료 (${progressRatio}%) | 현재 Day ${activeDay}`;
  activePlanBarFill.style.width = `${progressRatio}%`;

  activePlanDaysList.innerHTML = "";
  
  // 일차별 리스트 생성
  for (let d = 1; d <= plan.days; d++) {
    const dayPassages = planData[d] || [];
    const isDayDone = dayPassages.every(p => readHistory[p.book] && readHistory[p.book].includes(p.chapter));
    
    const row = document.createElement("div");
    row.className = `plan-day-row ${d === activeDay ? 'active-day' : ''} ${isDayDone ? 'completed' : ''}`;
    
    const passageText = dayPassages.map(p => `${p.book} ${p.chapter}${getChapterLabel(p.book)}`).join(", ");
    
    row.innerHTML = `
      <div class="plan-day-left">
        <span class="plan-day-label">Day ${d}</span>
        <span class="plan-day-passages">${passageText}</span>
      </div>
      <span class="plan-day-status ${isDayDone ? 'completed' : 'pending'}">${isDayDone ? '완료' : '진행중'}</span>
    `;
    
    row.addEventListener("click", () => {
      state.planActiveDay[planId] = d;
      saveSettings();
      renderReadingPlanTab();
      renderDailyPlanWidget();
    });
    
    activePlanDaysList.appendChild(row);
    
    // 현재 활성화된 일차로 스크롤 이동
    if (d === activeDay) {
      setTimeout(() => {
        row.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 50);
    }
  }
}

// 오늘의 통독 위젯 렌더러
function renderDailyPlanWidget() {
  if (!dailyPlanWidget) return;
  if (!state.activePlan) {
    dailyPlanWidget.classList.add("hidden");
    return;
  }
  
  const planId = state.activePlan;
  const plan = READING_PLANS[planId];
  if (!plan) {
    dailyPlanWidget.classList.add("hidden");
    return;
  }
  
  const activeDay = state.planActiveDay[planId] || 1;
  const planData = plan.generate();
  const passages = planData[activeDay] || [];
  
  widgetDayNum.textContent = activeDay;
  widgetPassageList.innerHTML = "";
  
  let completedCount = 0;
  
  passages.forEach(passage => {
    const isCompleted = readHistory[passage.book] && readHistory[passage.book].includes(passage.chapter);
    if (isCompleted) completedCount++;
    
    const link = document.createElement("button");
    link.className = `widget-passage-link ${isCompleted ? 'completed' : ''}`;
    link.innerHTML = `${passage.book} ${passage.chapter}${getChapterLabel(passage.book)} ${isCompleted ? '✓' : ''}`;
    
    link.addEventListener("click", () => {
      state.currentBook = passage.book;
      state.currentChapter = passage.chapter;
      saveSettings();
      renderBible();
    });
    
    widgetPassageList.appendChild(link);
  });
  
  widgetProgressText.textContent = `${completedCount} / ${passages.length} 완료`;
  
  // 오늘의 분량을 모두 통독했을 때만 다음 일차로 넘어가기 버튼 활성화
  if (completedCount === passages.length && passages.length > 0) {
    widgetActionArea.classList.remove("hidden");
  } else {
    widgetActionArea.classList.add("hidden");
  }
  
  if (dailyPlanWidget) dailyPlanWidget.classList.remove("hidden");
}

// 계획 도전하기 시작
function startPlan(planId) {
  state.activePlan = planId;
  state.planActiveDay[planId] = 1;
  saveSettings();
  renderReadingPlanTab();
  renderDailyPlanWidget();
  showToast(`${READING_PLANS[planId].name} 통독을 시작합니다!`);
}

// 계획 중단
function quitActivePlan() {
  if (confirm("정말로 현재 진행 중인 통독 계획을 중단하시겠습니까?\n(읽기 기록은 보존되지만 계획 진행 단계는 초기화됩니다.)")) {
    state.activePlan = null;
    saveSettings();
    renderReadingPlanTab();
    renderDailyPlanWidget();
    showToast("통독 계획을 중단했습니다.");
  }
}

// 다음 일차로 넘어가기
function advancePlanDay() {
  const planId = state.activePlan;
  const plan = READING_PLANS[planId];
  if (!plan) return;
  
  const activeDay = state.planActiveDay[planId] || 1;
  if (activeDay < plan.days) {
    state.planActiveDay[planId] = activeDay + 1;
    saveSettings();
    renderDailyPlanWidget();
    renderReadingPlanTab();
    
    // 다음 일차의 첫 번째 성경으로 자동 화면 이동
    const planData = plan.generate();
    const nextPassages = planData[activeDay + 1] || [];
    if (nextPassages.length > 0) {
      state.currentBook = nextPassages[0].book;
      state.currentChapter = nextPassages[0].chapter;
      saveSettings();
      renderBible();
    }
    
    showToast(`Day ${activeDay + 1} 일차 통독을 시작합니다!`);
  } else {
    showToast("축하합니다! 해당 계획의 모든 성경 통독 과정을 완료하셨습니다! 🎉");
  }
}

// ==========================================
// 백그라운드 재생, 무음 오디오 루프(WAV), 화면 꺼짐 방지(WakeLock) 및 미디어 세션 지원
// ==========================================

let ttsWakeLock = null;
let silentAudioBlobUrl = null;

// iOS/Android OS가 오디오 포커스를 회수하지 않도록 1초짜리 미세 진폭(1/32767) WAV 오디오 생성
function createSilentWavUrl() {
  if (silentAudioBlobUrl) return silentAudioBlobUrl;
  try {
    const sampleRate = 8000;
    const numSamples = sampleRate * 2; // 2초 루프
    const buffer = new ArrayBuffer(44 + numSamples * 2);
    const view = new DataView(buffer);
    const writeStr = (offset, str) => {
      for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
    };
    writeStr(0, 'RIFF');
    view.setUint32(4, 36 + numSamples * 2, true);
    writeStr(8, 'WAVE');
    writeStr(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM
    view.setUint16(22, 1, true); // Mono
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeStr(36, 'data');
    view.setUint32(40, numSamples * 2, true);
    // 완전한 0(Digital Silence)이면 모바일 OS가 무음으로 감지해 세션을 끊으므로 사람이 들을 수 없는 ±1 LSB 값 기록
    for (let i = 0; i < numSamples; i++) {
      view.setInt16(44 + i * 2, (i % 2 === 0) ? 1 : -1, true);
    }
    const blob = new Blob([buffer], { type: 'audio/wav' });
    silentAudioBlobUrl = URL.createObjectURL(blob);
    return silentAudioBlobUrl;
  } catch (e) {
    return "";
  }
}

function ensureSilentAudioElement() {
  let bgAudio = document.getElementById('bgSilentAudio');
  if (!bgAudio) {
    bgAudio = document.createElement('audio');
    bgAudio.id = 'bgSilentAudio';
    bgAudio.loop = true;
    bgAudio.preload = 'auto';
    bgAudio.setAttribute('playsinline', '');
    bgAudio.setAttribute('webkit-playsinline', '');
    bgAudio.style.display = 'none';
    const wavUrl = createSilentWavUrl();
    if (wavUrl) bgAudio.src = wavUrl;
    document.body.appendChild(bgAudio);

    // 오디오가 실행되는 동안 timeupdate 틱마다 iOS/Android 백그라운드 speechSynthesis 잠금 해제
    bgAudio.addEventListener('timeupdate', function() {
      if (isTTSSpeaking && !isTTSPaused && 'speechSynthesis' in window) {
        if (window.speechSynthesis.paused) {
          try { window.speechSynthesis.resume(); } catch(e) {}
        }
      }
    });

    // OS에 의해 무음 오디오가 일시 중단되면 재생 중일 때 즉시 재개 시도 (기존처럼 stopSilentAudio를 호출하면 세션이 죽음)
    bgAudio.addEventListener('pause', function() {
      if (isTTSSpeaking && !isTTSPaused) {
        setTimeout(() => {
          if (isTTSSpeaking && !isTTSPaused && bgAudio.paused) {
            bgAudio.play().catch(() => {});
          }
        }, 150);
      }
    });
  } else if (!bgAudio.src) {
    const wavUrl = createSilentWavUrl();
    if (wavUrl) bgAudio.src = wavUrl;
  }
  return bgAudio;
}

async function requestScreenWakeLock() {
  if ('wakeLock' in navigator && isTTSSpeaking && !isTTSPaused) {
    try {
      if (!ttsWakeLock) {
        ttsWakeLock = await navigator.wakeLock.request('screen');
        ttsWakeLock.addEventListener('release', () => {
          ttsWakeLock = null;
        });
      }
    } catch (e) {
      // 배터리 절약 모드나 백그라운드 상태에서는 실패할 수 있음 (무시)
    }
  }
}

function releaseScreenWakeLock() {
  if (ttsWakeLock) {
    try { ttsWakeLock.release(); } catch (e) {}
    ttsWakeLock = null;
  }
}

function startSilentAudio() {
  const bgAudio = ensureSilentAudioElement();
  if (bgAudio) {
    bgAudio.volume = 0.01;
    if (bgAudio.paused) {
      bgAudio.play().catch(err => console.log("Silent audio play failed:", err));
    }
  }
  if ('mediaSession' in navigator) {
    navigator.mediaSession.playbackState = "playing";
  }
}

function stopSilentAudio() {
  const bgAudio = document.getElementById('bgSilentAudio');
  if (bgAudio) {
    try { bgAudio.pause(); } catch(e) {}
  }
  if ('mediaSession' in navigator) {
    navigator.mediaSession.playbackState = "paused";
  }
}

function updateMediaSession() {
  if ('mediaSession' in navigator && window.MediaMetadata) {
    const book = state.currentBook;
    const chapter = state.currentChapter;
    const currentVerse = ttsSpeechItems[currentTTSIndex] ? ttsSpeechItems[currentTTSIndex].verse : 1;
    const currentText = ttsSpeechItems[currentTTSIndex] ? ttsSpeechItems[currentTTSIndex].text : "성경 말씀";
    
    navigator.mediaSession.metadata = new MediaMetadata({
      title: `${book} ${chapter}장 ${currentVerse}절`,
      artist: currentText,
      album: '성경 통독 낭독기',
      artwork: [
        { src: 'app_logo.png?v=2', sizes: '512x512', type: 'image/png' }
      ]
    });
  }
}

function setupMediaSessionHandlers() {
  if ('mediaSession' in navigator) {
    navigator.mediaSession.setActionHandler('play', () => {
      if (isTTSSpeaking && isTTSPaused) {
        togglePlayTTS();
      } else if (!isTTSSpeaking) {
        startTTS();
      }
    });
    navigator.mediaSession.setActionHandler('pause', () => {
      if (isTTSSpeaking && !isTTSPaused) {
        togglePlayTTS();
      }
    });
    navigator.mediaSession.setActionHandler('previoustrack', () => {
      playPrevTTS();
    });
    navigator.mediaSession.setActionHandler('nexttrack', () => {
      playNextTTS();
    });
  }
}

// 백그라운드 전환 시: MP3 스트리밍 구절 사전 프리패칭 유지 (오프라인 폴백 시에만 무음 오디오 유지)
// 화면 복귀 시: WakeLock 재획득 +当前 재생 중인 구절로 스크롤 동기화
document.addEventListener('visibilitychange', function() {
  if (document.hidden) {
    if (isTTSSpeaking && !isTTSPaused) {
      if (window.ttsUsingWebSpeechFallback) {
        startSilentAudio();
        if ('speechSynthesis' in window && window.speechSynthesis.paused) {
          try { window.speechSynthesis.resume(); } catch (e) {}
        }
      } else {
        prefetchUpcomingVerses(currentTTSIndex + 1, 4);
      }
    }
  } else {
    if (isTTSSpeaking && !isTTSPaused) {
      requestScreenWakeLock();
      const item = ttsSpeechItems[currentTTSIndex];
      if (item && item.element) {
        try { item.element.scrollIntoView({ behavior: "smooth", block: "center" }); } catch (e) {}
      }
      if (window.ttsUsingWebSpeechFallback) {
        startSilentAudio();
        if ('speechSynthesis' in window && window.speechSynthesis.paused) {
          try { window.speechSynthesis.resume(); } catch (e) {}
        }
      } else {
        const mainAudio = document.getElementById('ttsMainAudio');
        if (mainAudio && mainAudio.paused && mainAudio.src && !mainAudio.ended) {
          mainAudio.play().catch(() => {});
        }
      }
    }
  }
});

window.addEventListener("DOMContentLoaded", () => {
  getTtsMainAudioElement();
});

// 반복 모드 토글: 연속 → 장반복 → 절반복 → 구간반복 → 연속
function toggleRepeatMode() {
  if (!state.repeatMode) state.repeatMode = "NONE";
  
  if (state.repeatMode === "NONE") {
    state.repeatMode = "CHAPTER";
    showToast("장 반복 낭독 모드 🔁");
  } else if (state.repeatMode === "CHAPTER") {
    state.repeatMode = "VERSE";
    showToast("절 반복 낭독 모드 🔂");
  } else if (state.repeatMode === "VERSE") {
    if (repeatRange && repeatRange.book === state.currentBook && Number(repeatRange.chapter) === Number(state.currentChapter)) {
      state.repeatMode = "RANGE";
      showToast(`구간 반복 모드 🎯 (${formatRangeLabel(repeatRange)})`);
    } else {
      state.repeatMode = "NONE";
      showToast("반복할 구간을 선택해 주세요 🎯");
      openRangeModal();
    }
  } else {
    state.repeatMode = "NONE";
    showToast("연속 낭독 모드 🔄");
  }
  updateRepeatModeButton();
  applyRepeatRangeHighlight();
  updateRangeBadge();
  saveSettings();
}

// 반복 모드 버튼 텍스트 동기화
function updateRepeatModeButton() {
  if (!btnAudioTTSRepeat) return;
  const mode = state.repeatMode || "NONE";
  if (mode === "CHAPTER") {
    btnAudioTTSRepeat.textContent = "🔁 장반복";
  } else if (mode === "VERSE") {
    btnAudioTTSRepeat.textContent = "🔂 절반복";
  } else if (mode === "RANGE") {
    btnAudioTTSRepeat.textContent = "구간반복";
  } else {
    btnAudioTTSRepeat.textContent = "🔄 연속";
  }
}

/* ==========================================================================
   📋 구절 꾸욱 눌러 복사
   - 0.5초 꾸욱 누르면 진동 + 눌림 효과 → 손을 떼는 순간 복사
     (iPhone Safari는 손을 뗄 때(사용자 제스처 안에서) 복사해야 클립보드가 허용됨)
   - 안드로이드 길게 누르기 메뉴 / PC 마우스 우클릭은 즉시 복사
   ========================================================================== */

function setupVerseLongPress() {
  if (!bibleViewerEl) return;

  bibleViewerEl.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const card = e.target.closest(".verse-card");
    if (!card) return;
    cancelLongPress();
    const lp = { card, x: e.clientX, y: e.clientY, armed: false, copied: false, timer: null };
    lp.timer = setTimeout(() => {
      if (longPress !== lp) return;
      lp.armed = true;
      card.classList.add("long-press-armed");
      if (navigator.vibrate) {
        try { navigator.vibrate(25); } catch (err) {}
      }
    }, LONG_PRESS_MS);
    longPress = lp;
  });

  bibleViewerEl.addEventListener("pointermove", (e) => {
    if (!longPress || longPress.armed) return;
    if (Math.abs(e.clientX - longPress.x) > LONG_PRESS_MOVE_TOLERANCE ||
        Math.abs(e.clientY - longPress.y) > LONG_PRESS_MOVE_TOLERANCE) {
      cancelLongPress();
    }
  });

  const finishLongPress = () => {
    if (!longPress) return;
    if (longPress.armed && !longPress.copied) {
      longPress.copied = true;
      suppressVerseClickUntil = Date.now() + 700;
      copyVerseCard(longPress.card);
    }
    endLongPress();
  };
  bibleViewerEl.addEventListener("pointerup", finishLongPress);
  bibleViewerEl.addEventListener("touchend", finishLongPress);
  bibleViewerEl.addEventListener("pointercancel", () => {
    // 이미 꾸욱 눌림이 확정된 상태면 복사 시도, 아니면 취소 (스크롤 시작 등)
    if (longPress && longPress.armed) finishLongPress();
    else cancelLongPress();
  });

  bibleViewerEl.addEventListener("contextmenu", (e) => {
    const card = e.target.closest(".verse-card");
    if (!card) return;
    e.preventDefault();
    if (longPress && longPress.card === card) {
      if (!longPress.copied) {
        longPress.armed = true;
        longPress.copied = true;
        card.classList.add("long-press-armed");
        suppressVerseClickUntil = Date.now() + 700;
        copyVerseCard(card);
      }
    } else if (!longPress) {
      // PC 마우스 우클릭
      copyVerseCard(card);
    }
  });

  // 스크롤이 시작되면 꾸욱 누르기 취소
  const appContent = document.querySelector(".app-content");
  if (appContent) {
    appContent.addEventListener("scroll", () => {
      if (longPress && !longPress.armed) cancelLongPress();
    }, { passive: true });
  }
}

function cancelLongPress() {
  if (!longPress) return;
  clearTimeout(longPress.timer);
  longPress.card.classList.remove("long-press-armed");
  longPress = null;
}

function endLongPress() {
  const lp = longPress;
  if (!lp) return;
  clearTimeout(lp.timer);
  setTimeout(() => lp.card.classList.remove("long-press-armed"), 160);
  longPress = null;
}

// 역본 이름에서 "(영어)" 같은 부가 표기 제거
function getShortTranslationName(code) {
  const t = TRANSLATION_MAP[code];
  return t ? t.name.replace(/\s*\(.*\)\s*$/, "") : "";
}

// 본문 텍스트 정리 (쉬운성경 <소제목> 등 태그 형태 제거)
function toPlainVerseText(text) {
  return String(text || "").replace(/<[^>]*>/g, "").replace(/\s{2,}/g, " ").trim();
}

function buildVerseCopyText(card) {
  const data = card && card._verseCopy;
  if (!data) return "";
  const ref = `${state.currentBook} ${state.currentChapter}:${data.label}`;
  const primary = toPlainVerseText(data.primary);
  const pName = getShortTranslationName(data.pCode);
  if (data.secondary && data.sCode && data.sCode !== "NONE") {
    const secondary = toPlainVerseText(data.secondary);
    const sName = getShortTranslationName(data.sCode);
    return `${primary}\n${secondary}\n- ${ref} (${pName} / ${sName})`;
  }
  return `${primary}\n- ${ref} (${pName})`;
}

function copyVerseCard(card) {
  const text = buildVerseCopyText(card);
  if (!text) return;
  const label = card._verseCopy ? card._verseCopy.label : card.getAttribute("data-verse");
  copyTextToClipboard(text).then((ok) => {
    if (ok) {
      card.classList.remove("verse-copied");
      void card.offsetWidth; // 애니메이션 재시작
      card.classList.add("verse-copied");
      setTimeout(() => card.classList.remove("verse-copied"), 900);
      showToast(`📋 ${state.currentBook} ${state.currentChapter}:${label} 말씀이 복사되었습니다`);
    } else {
      showToast("복사에 실패했습니다. 다시 꾸욱 눌러 주세요.");
    }
  });
}

// 클립보드 복사: iOS Safari는 사용자 제스처 안에서 동기 execCommand가 가장 확실 → 실패 시 Clipboard API
function copyTextToClipboard(text) {
  let ok = false;
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.cssText = "position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;font-size:16px;" +
      "-webkit-user-select:text;user-select:text;";
    document.body.appendChild(ta);
    try { ta.focus({ preventScroll: true }); } catch (e) { ta.focus(); }
    ta.select();
    ta.setSelectionRange(0, text.length);
    ok = document.execCommand("copy");
    document.body.removeChild(ta);
  } catch (e) {
    ok = false;
  }
  if (ok) return Promise.resolve(true);
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text).then(() => true).catch(() => false);
  }
  return Promise.resolve(false);
}


/* ==========================================================================
   🎯 구간 반복 듣기 (예: 12절 ~ 20절 선택 후 반복 청취)
   ========================================================================== */

function formatRangeLabel(range) {
  if (!range) return "";
  return range.start === range.end ? `${range.start}절` : `${range.start}~${range.end}절`;
}

// 현재 장에 해당하는 구간이 있고 구간반복 모드일 때만 활성 구간 반환
function getActiveRepeatRange() {
  if (state.repeatMode !== "RANGE" || !repeatRange) return null;
  if (repeatRange.book !== state.currentBook || Number(repeatRange.chapter) !== Number(state.currentChapter)) return null;
  return repeatRange;
}

// 낭독 목록(ttsSpeechItems)에서 구간의 시작/끝 인덱스 계산 (합쳐진 절 포함)
function getRepeatRangeIndices(range) {
  let startIdx = -1;
  let endIdx = -1;
  ttsSpeechItems.forEach((item, idx) => {
    const itemEnd = item.verseEnd || item.verse;
    if (itemEnd >= range.start && item.verse <= range.end) {
      if (startIdx === -1) startIdx = idx;
      endIdx = idx;
    }
  });
  return { startIdx, endIdx };
}

function getRenderedVerseCards() {
  return Array.from(bibleViewerEl.querySelectorAll(".verse-card")).map(card => {
    const verse = parseInt(card.getAttribute("data-verse"), 10);
    const verseEnd = parseInt(card.getAttribute("data-verse-end"), 10) || verse;
    return { card, verse, verseEnd, label: verseEnd > verse ? `${verse}-${verseEnd}` : `${verse}` };
  });
}

function applyRepeatRangeHighlight() {
  bibleViewerEl.querySelectorAll(".in-repeat-range").forEach(el => {
    el.classList.remove("in-repeat-range", "repeat-range-start", "repeat-range-end");
  });
  const range = getActiveRepeatRange();
  if (!range) return;
  const inRange = getRenderedVerseCards().filter(v => v.verseEnd >= range.start && v.verse <= range.end);
  inRange.forEach(v => v.card.classList.add("in-repeat-range"));
  if (inRange.length) {
    inRange[0].card.classList.add("repeat-range-start");
    inRange[inRange.length - 1].card.classList.add("repeat-range-end");
  }
}

function updateRangeBadge() {
  const badge = document.getElementById("rangeRepeatBadge");
  const textEl = document.getElementById("rangeBadgeText");
  if (!badge || !textEl) return;
  const range = getActiveRepeatRange();
  document.body.classList.toggle("range-badge-visible", !!range);
  if (!range) {
    badge.classList.add("hidden");
    return;
  }
  let loopText;
  if (range.maxLoops > 0) {
    loopText = `${Math.min(range.loopCount + 1, range.maxLoops)}/${range.maxLoops}회`;
  } else {
    loopText = isTTSSpeaking ? `${range.loopCount + 1}회째 · 무한` : "무한 반복";
  }
  textEl.textContent = `${formatRangeLabel(range)} 반복 · ${loopText}`;
  badge.classList.remove("hidden");
}

function clearRepeatRange() {
  repeatRange = null;
  if (state.repeatMode === "RANGE") {
    state.repeatMode = "NONE";
    saveSettings();
  }
  updateRepeatModeButton();
  applyRepeatRangeHighlight();
  updateRangeBadge();
}

// 셀렉트에서 value 이하 중 가장 가까운 옵션 선택 (없으면 첫 옵션)
function selectClosestOption(selectEl, value, preferUpper = false) {
  const opts = Array.from(selectEl.options).map(o => parseInt(o.value, 10));
  if (!opts.length) return;
  let chosen = preferUpper ? opts.find(v => v >= value) : [...opts].reverse().find(v => v <= value);
  if (chosen === undefined) chosen = preferUpper ? opts[opts.length - 1] : opts[0];
  selectEl.value = String(chosen);
}

function openRangeModal() {
  if (!rangeModal) return;
  const verses = getRenderedVerseCards();
  if (verses.length === 0) {
    showToast("본문을 불러온 뒤 다시 시도해 주세요.");
    return;
  }
  const startSel = document.getElementById("rangeStartSelect");
  const endSel = document.getElementById("rangeEndSelect");
  startSel.innerHTML = "";
  endSel.innerHTML = "";
  verses.forEach(v => {
    startSel.add(new Option(`${v.label}절`, String(v.verse)));
    endSel.add(new Option(`${v.label}절`, String(v.verseEnd)));
  });

  const sameChapter = repeatRange && repeatRange.book === state.currentBook &&
    Number(repeatRange.chapter) === Number(state.currentChapter);
  let start, end;
  if (sameChapter) {
    start = repeatRange.start;
    end = repeatRange.end;
    rangeModalCount = repeatRange.maxLoops;
  } else {
    const playingVerse = isTTSSpeaking && ttsSpeechItems[currentTTSIndex] ? ttsSpeechItems[currentTTSIndex].verse : null;
    start = selectedVerseNum || playingVerse || verses[0].verse;
    const startPos = Math.max(0, verses.findIndex(v => v.verseEnd >= start));
    end = verses[Math.min(startPos + 8, verses.length - 1)].verseEnd;
    rangeModalCount = 0;
  }
  selectClosestOption(startSel, start);
  selectClosestOption(endSel, end, true);
  if (parseInt(endSel.value, 10) < parseInt(startSel.value, 10)) selectClosestOption(endSel, parseInt(startSel.value, 10), true);

  const unit = getChapterLabel(state.currentBook);
  const chapterLabelEl = document.getElementById("rangeModalChapter");
  if (chapterLabelEl) chapterLabelEl.textContent = `${state.currentBook} ${state.currentChapter}${unit}`;

  updateRangeCountButtons();
  updateRangePreview();
  rangeModal.classList.add("active");
}

function getRangeModalSelection() {
  const start = parseInt(document.getElementById("rangeStartSelect").value, 10);
  const end = parseInt(document.getElementById("rangeEndSelect").value, 10);
  return { start: Math.min(start, end), end: Math.max(start, end) };
}

function updateRangeCountButtons() {
  document.querySelectorAll(".range-count-btn").forEach(btn => {
    const active = parseInt(btn.dataset.count, 10) === rangeModalCount;
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-pressed", active ? "true" : "false");
  });
}

function updateRangePreview() {
  const preview = document.getElementById("rangePreview");
  if (!preview) return;
  const { start, end } = getRangeModalSelection();
  const verses = getRenderedVerseCards().filter(v => v.verseEnd >= start && v.verse <= end);
  const countText = rangeModalCount > 0 ? `${rangeModalCount}회 반복` : "무한 반복";
  const first = verses[0] && verses[0].card._verseCopy ? toPlainVerseText(verses[0].card._verseCopy.primary) : "";
  const snippet = first.length > 42 ? first.slice(0, 42) + "…" : first;
  preview.innerHTML = `<strong>${formatRangeLabel({ start, end })}</strong> · ${verses.length}개 절 · ${countText}` +
    (snippet ? `<span class="range-preview-snippet">"${escapeHtml(snippet)}"</span>` : "");
}

function buildRangeCopyText(start, end) {
  const verses = getRenderedVerseCards().filter(v => v.verseEnd >= start && v.verse <= end && v.card._verseCopy);
  if (!verses.length) return "";
  const first = verses[0].card._verseCopy;
  const hasSecondary = verses.some(v => v.card._verseCopy.secondary);
  const lines = verses.map(v => {
    const d = v.card._verseCopy;
    let line = `${d.label} ${toPlainVerseText(d.primary)}`;
    if (hasSecondary && d.secondary) line += `\n   ${toPlainVerseText(d.secondary)}`;
    return line;
  });
  const refVerse = start === end ? `${start}` : `${start}-${end}`;
  const names = hasSecondary
    ? `${getShortTranslationName(first.pCode)} / ${getShortTranslationName(state.secondaryTranslation)}`
    : getShortTranslationName(first.pCode);
  return `${lines.join("\n")}\n- ${state.currentBook} ${state.currentChapter}:${refVerse} (${names})`;
}

function startRangeRepeatFromModal() {
  const { start, end } = getRangeModalSelection();
  repeatRange = {
    book: state.currentBook,
    chapter: state.currentChapter,
    start,
    end,
    maxLoops: rangeModalCount,
    loopCount: 0
  };
  state.repeatMode = "RANGE";
  saveSettings();
  updateRepeatModeButton();
  closeModal(rangeModal);
  selectedVerseNum = null;
  applySelectedVerseHighlight();
  applyRepeatRangeHighlight();

  if (isTTSSpeaking) {
    const { startIdx } = getRepeatRangeIndices(repeatRange);
    if (startIdx !== -1) {
      currentTTSIndex = startIdx;
      isTTSPaused = false;
      window.ttsVerseRetryCount = 0;
      updateTTSPlayButtons("❚❚ 일시정지");
      requestScreenWakeLock();
      if (activeUtterance) {
        activeUtterance.onend = null;
        activeUtterance.onerror = null;
      }
      speakNextTTS(false);
    }
  } else {
    startTTS(start);
  }
  updateRangeBadge();
  showToast(`🎯 ${formatRangeLabel(repeatRange)} ${rangeModalCount > 0 ? rangeModalCount + "회" : "무한"} 반복 재생`);
}

function setupRangeRepeatControls() {
  const btnOpen = document.getElementById("btnRangeRepeat");
  if (btnOpen) btnOpen.addEventListener("click", openRangeModal);

  const btnClose = document.getElementById("btnCloseRangeModal");
  if (btnClose) btnClose.addEventListener("click", () => closeModal(rangeModal));

  const startSel = document.getElementById("rangeStartSelect");
  const endSel = document.getElementById("rangeEndSelect");
  if (startSel && endSel) {
    startSel.addEventListener("change", () => {
      if (parseInt(endSel.value, 10) < parseInt(startSel.value, 10)) {
        selectClosestOption(endSel, parseInt(startSel.value, 10), true);
      }
      updateRangePreview();
    });
    endSel.addEventListener("change", () => {
      if (parseInt(endSel.value, 10) < parseInt(startSel.value, 10)) {
        selectClosestOption(startSel, parseInt(endSel.value, 10));
      }
      updateRangePreview();
    });
  }

  document.querySelectorAll(".range-count-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      rangeModalCount = parseInt(btn.dataset.count, 10) || 0;
      updateRangeCountButtons();
      updateRangePreview();
    });
  });

  const btnPlay = document.getElementById("btnRangePlay");
  if (btnPlay) btnPlay.addEventListener("click", startRangeRepeatFromModal);

  const btnCopy = document.getElementById("btnRangeCopy");
  if (btnCopy) {
    btnCopy.addEventListener("click", () => {
      const { start, end } = getRangeModalSelection();
      const text = buildRangeCopyText(start, end);
      if (!text) return;
      copyTextToClipboard(text).then(ok => {
        showToast(ok
          ? `📋 ${state.currentBook} ${state.currentChapter}:${start === end ? start : start + "-" + end} 말씀이 복사되었습니다`
          : "복사에 실패했습니다. 다시 시도해 주세요.");
      });
    });
  }

  const btnClear = document.getElementById("btnRangeClear");
  if (btnClear) {
    btnClear.addEventListener("click", () => {
      clearRepeatRange();
      closeModal(rangeModal);
      showToast("구간 반복을 해제했습니다.");
    });
  }

  const btnBadgeEdit = document.getElementById("btnRangeBadgeEdit");
  if (btnBadgeEdit) btnBadgeEdit.addEventListener("click", openRangeModal);
  const btnBadgeClear = document.getElementById("btnRangeBadgeClear");
  if (btnBadgeClear) {
    btnBadgeClear.addEventListener("click", () => {
      clearRepeatRange();
      showToast("구간 반복을 해제했습니다. (연속 낭독)");
    });
  }
}

window.addEventListener("DOMContentLoaded", init);
