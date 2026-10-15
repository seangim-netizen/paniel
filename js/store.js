// Store: 예수동행일기 데이터 모델 및 로컬 스토리지 관리

const GUIDE_QUESTIONS_17 = [
  { id: 1, text: "아침에 일어났을 때 주님 생각하셨습니까?", category: "기상/시작" },
  { id: 2, text: "아침식사 때에 주님 생각하셨습니까?", category: "식사" },
  { id: 3, text: "하루 일을 시작하기 전에 주님 생각하셨습니까?", category: "기상/시작" },
  { id: 4, text: "오늘 말씀 묵상 하셨습니까?", category: "말씀/묵상" },
  { id: 5, text: "묵상한 말씀이 하루중에 생각나거나 순종한 적은 있습니까?", category: "말씀/순종" },
  { id: 6, text: "예수님께 ‘어떻게 해야할까요? 물어 본적이 있나요?", category: "기도/교제" },
  { id: 7, text: "예수님의 이름을 불러본 적이 있나요?", category: "기도/교제" },
  { id: 8, text: "사람을 만날 때 예수님 생각하셨나요?", category: "대인관계" },
  { id: 9, text: "일할 때 예수님 생각하셨나요?", category: "직장/일상" },
  { id: 10, text: "집에서 예수님 생각하셨나요?", category: "가정/일상" },
  { id: 11, text: "이동하는 차안에서나 지하철에서 예수님 생각하셨나요?", category: "이동/여정" },
  { id: 12, text: "예수님이 싫어하실 행동을 하신 적이 있나요?", category: "성결/성찰", reversePositive: true },
  { id: 13, text: "예수님이 기뻐하실 행동을 하신 적이 있나요?", category: "선행/기쁨" },
  { id: 14, text: "예수님이 말씀하신 것에 순종해 보신적이 있나요?", category: "순종" }
];

const FIVE_CORE_QUESTIONS = [
  { id: 'fq1', title: '1. 일상 속 주님 생각', q: '아침에 일어났을 때, 식사 할 때, 일 할 때, 사람 만날 때 예수님을 생각하였습니까?' },
  { id: 'fq2', title: '2. 통독과 큐티의 말씀', q: '성경 통독과 큐티를 통해 주님이 하신 말씀은 무엇이었습니까?' },
  { id: 'fq3', title: '3. 오늘의 메시지와 순종', q: '오늘 하루 중에서 주님이 내게 주신 메시지는 무엇이 있습니까? 예수님이 하라고 지시하시는 것 같아 순종한 일은 무엇입니까?' },
  { id: 'fq4', title: '4. 마음에 걸리는 불순종', q: '말씀을 주신 것들 중에 불순종 했던 것은 무엇입니까?' },
  { id: 'fq5', title: '5. 감사 기도 3가지', q: '감사 기도 3가지를 적어 보십시오.' }
];

const DEFAULT_GROUPS = [
  'Login 온라인',
  'Login 주일나눔 온라인1조',
  'Login 형제방'
];

class JournalStore {
  constructor() {
    this.storageKey = 'jesus_walk_journals_v2';
    this.settingsKey = 'jesus_walk_settings_v2';
    this.journals = this.loadJournals();
    this.settings = this.loadSettings();

    // 위드지저스 가져온 데이터(일기 및 댓글) 자동 동기화 & 병합
    if (window.INITIAL_IMPORTED_DATA && window.INITIAL_IMPORTED_DATA.journals) {
      this.syncWithImportedData(false);
    }

    // 초기 실행 시 데이터가 전혀 없으면 샘플 데이터 추가
    if (Object.keys(this.journals).length === 0) {
      this.seedInitialData();
    }
  }

  loadJournals() {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) return JSON.parse(data);
      if (window.INITIAL_IMPORTED_DATA && window.INITIAL_IMPORTED_DATA.journals) {
        return window.INITIAL_IMPORTED_DATA.journals;
      }
      return {};
    } catch (e) {
      console.error('Failed to load journals', e);
      return {};
    }
  }

  saveJournals() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.journals));
    } catch (e) {
      console.error('Failed to save journals', e);
    }
  }

  loadSettings() {
    try {
      const data = localStorage.getItem(this.settingsKey);
      if (data) return JSON.parse(data);
      if (window.INITIAL_IMPORTED_DATA && window.INITIAL_IMPORTED_DATA.settings) {
        return {
          customGroups: window.INITIAL_IMPORTED_DATA.settings.customGroups || DEFAULT_GROUPS,
          authorName: window.INITIAL_IMPORTED_DATA.settings.authorName || '김시웅',
          reminderTime: '21:00'
        };
      }
      return { customGroups: DEFAULT_GROUPS, reminderTime: '21:00', authorName: '김시웅' };
    } catch (e) {
      return { customGroups: DEFAULT_GROUPS, reminderTime: '21:00', authorName: '김시웅' };
    }
  }

  saveSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    localStorage.setItem(this.settingsKey, JSON.stringify(this.settings));
  }

  getJournal(dateStr) {
    return this.journals[dateStr] || this.createEmptyJournal(dateStr);
  }

  createEmptyJournal(dateStr) {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    // 1~14번 답변 기본값 null
    const answers14 = {};
    for (let i = 1; i <= 14; i++) {
      answers14[i] = null; // 'yes', 'no', null
    }

    return {
      date: dateStr,
      time: timeStr,
      title: '나의 일기',
      tags: ['#예수동행'],
      visibility: [...DEFAULT_GROUPS],
      // 신앙 지표
      faith: {
        bibleChapters: 0,
        lookJesusPercent: 0,
        obeyPercent: 0,
        prayerMinutes: 0,
        isQtDone: false
      },
      // 17문항 가이드 답변
      guide17: {
        answers14: answers14,
        thinkMinutes: 0, // 15번 생각한 시간
        gratitudeList: ['', '', ''], // 16번 감사제목 3가지
        freeContent: '' // 17번 자유 일기
      },
      // 5대 핵심 묵상 답변
      core5: {
        fq1: '',
        fq2: '',
        fq3: '',
        fq4: '',
        fq5_1: '',
        fq5_2: '',
        fq5_3: ''
      },
      comments: [],
      updatedAt: new Date().toISOString()
    };
  }

  addComment(dateStr, comment) {
    const j = this.getJournal(dateStr);
    if (!j.comments) j.comments = [];
    const newComment = {
      id: comment.id || 'c_' + Date.now(),
      author: comment.author || this.settings.authorName || '김시웅',
      content: (comment.content || '').trim(),
      date: comment.date || this.getTodayDateString(),
      room: comment.room || (j.visibility && j.visibility[0]) || 'Login 온라인'
    };
    j.comments.push(newComment);
    this.saveJournal(j);
    return newComment;
  }

  deleteComment(dateStr, commentId) {
    const j = this.getJournal(dateStr);
    if (j.comments) {
      j.comments = j.comments.filter(c => c.id !== commentId);
      this.saveJournal(j);
    }
  }

  syncWithImportedData(force = false) {
    if (!window.INITIAL_IMPORTED_DATA || !window.INITIAL_IMPORTED_DATA.journals) return 0;
    const imported = window.INITIAL_IMPORTED_DATA.journals;
    for (const [date, item] of Object.entries(imported)) {
      if (!this.journals[date] || force) {
        this.journals[date] = item;
      } else {
        // 기존 일기가 있을 경우 댓글 및 누락 필드 병합
        if (item.comments && item.comments.length > 0) {
          const existingComments = this.journals[date].comments || [];
          const existingKeys = new Set(existingComments.map(c => c.id || `${c.author}_${(c.content || '').slice(0, 20)}`));
          item.comments.forEach(c => {
            const key = c.id || `${c.author}_${(c.content || '').slice(0, 20)}`;
            if (!existingKeys.has(key)) {
              existingComments.push(c);
              existingKeys.add(key);
            }
          });
          this.journals[date].comments = existingComments;
        }
        if (!this.journals[date].faith && item.faith) {
          this.journals[date].faith = item.faith;
        }
      }
    }
    this.saveJournals();
    return Object.keys(this.journals).length;
  }

  saveJournal(journalData) {
    this.journals[journalData.date] = {
      ...journalData,
      updatedAt: new Date().toISOString()
    };
    this.saveJournals();
  }

  deleteJournal(dateStr) {
    if (this.journals[dateStr]) {
      delete this.journals[dateStr];
      this.saveJournals();
      return true;
    }
    return false;
  }

  getAllJournalsList() {
    return Object.values(this.journals).sort((a, b) => b.date.localeCompare(a.date));
  }

  // 예수동행일기 및 나눔 댓글 통합 검색 엔진
  searchJournals(query = '', options = {}) {
    const q = (query || '').trim().toLowerCase();
    const scope = options.scope || 'all'; // 'all', 'content', 'comments', 'gratitude', 'meditation'
    const year = options.year || 'all'; // 'all', '2026', '2025', '2024'

    const results = [];
    const list = this.getAllJournalsList();

    for (const journal of list) {
      if (year !== 'all') {
        if (!journal.date.startsWith(year)) continue;
      }

      // 검색어가 비어있을 때는 전체 일기 반환
      if (!q) {
        results.push({
          journal,
          matches: []
        });
        continue;
      }

      const matches = [];

      // 1. 제목 및 태그
      if (scope === 'all' || scope === 'content') {
        if (journal.title && journal.title.toLowerCase().includes(q)) {
          matches.push({ type: 'title', label: '제목', text: journal.title });
        }
        if (journal.tags && journal.tags.some(t => t.toLowerCase().includes(q))) {
          matches.push({ type: 'tags', label: '태그', text: journal.tags.join(' ') });
        }
      }

      // 2. 자유 일기 본문 (17번 문항)
      if (scope === 'all' || scope === 'content') {
        const free = journal.guide17?.freeContent || '';
        if (free && free.toLowerCase().includes(q)) {
          matches.push({ type: 'content', label: '일기 본문', text: free });
        }
      }

      // 3. 감사제목 (16번 문항 및 5대 묵상 감사기도)
      if (scope === 'all' || scope === 'gratitude') {
        const gratList = journal.guide17?.gratitudeList || [];
        gratList.forEach((g, idx) => {
          if (g && g.toLowerCase().includes(q)) {
            matches.push({ type: 'gratitude', label: `감사제목 #${idx + 1}`, text: g });
          }
        });
        if (journal.core5) {
          ['fq5_1', 'fq5_2', 'fq5_3'].forEach((k, idx) => {
            const val = journal.core5[k];
            if (val && val.toLowerCase().includes(q)) {
              if (!matches.some(m => m.text === val)) {
                matches.push({ type: 'gratitude', label: `감사 기도 #${idx + 1}`, text: val });
              }
            }
          });
        }
      }

      // 4. 5대 핵심 묵상 답변
      if (scope === 'all' || scope === 'meditation') {
        if (journal.core5) {
          const coreLabels = {
            fq1: '1. 일상 속 주님 생각',
            fq2: '2. 통독과 큐티의 말씀',
            fq3: '3. 오늘의 메시지와 순종',
            fq4: '4. 마음에 걸리는 불순종'
          };
          for (const [key, label] of Object.entries(coreLabels)) {
            const val = journal.core5[key];
            if (val && val.toLowerCase().includes(q)) {
              matches.push({ type: 'meditation', label, text: val });
            }
          }
        }
      }

      // 5. 나눔 댓글 (댓글 작성자 이름 & 댓글 내용)
      if (scope === 'all' || scope === 'comments') {
        const comments = journal.comments || [];
        comments.forEach(c => {
          const authorMatch = c.author && c.author.toLowerCase().includes(q);
          const contentMatch = c.content && c.content.toLowerCase().includes(q);
          if (authorMatch || contentMatch) {
            matches.push({
              type: 'comment',
              label: `댓글 [${c.author || '동행자'}]`,
              text: c.content || '',
              author: c.author,
              date: c.date,
              room: c.room
            });
          }
        });
      }

      if (matches.length > 0) {
        results.push({
          journal,
          matches
        });
      }
    }

    return results;
  }

  // 스트릭(연속 기록 일수) 계산
  calculateStreak() {
    const dates = Object.keys(this.journals).sort().reverse();
    if (dates.length === 0) return 0;

    const todayStr = this.getTodayDateString();
    let streak = 0;
    let curr = new Date(todayStr);

    // 오늘 작성 안 했으면 어제부터 확인
    if (!this.journals[todayStr]) {
      curr.setDate(curr.getDate() - 1);
    }

    while (true) {
      const checkStr = curr.toISOString().split('T')[0];
      if (this.journals[checkStr]) {
        streak++;
        curr.setDate(curr.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  }

  getTodayDateString() {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // 14문항 기반 자동 바라보기 % 추천 계산기
  calculateRecommendedLookPercent(answers14, thinkMinutes = 0) {
    let yesCount = 0;
    let totalAnswered = 0;
    for (let i = 1; i <= 14; i++) {
      if (answers14[i] !== null && answers14[i] !== undefined) {
        totalAnswered++;
        // 12번(싫어하실 행동)은 'no'가 긍정적 지표
        if (i === 12) {
          if (answers14[i] === 'no') yesCount++;
        } else {
          if (answers14[i] === 'yes') yesCount++;
        }
      }
    }

    if (totalAnswered === 0 && thinkMinutes === 0) return 0;
    let base = totalAnswered > 0 ? (yesCount / totalAnswered) * 85 : 0;
    
    // 생각한 시간 가산 (최대 15%)
    let timeBonus = Math.min(15, Math.floor(thinkMinutes / 8));
    return Math.min(100, Math.round(base + timeBonus));
  }

  // 감사제목 전체 스트림 모아보기 (16번 + 5번 감사)
  getAllGratitudeItems() {
    const items = [];
    const list = this.getAllJournalsList();
    list.forEach(entry => {
      // 17문항 16번 감사
      if (entry.guide17 && entry.guide17.gratitudeList) {
        entry.guide17.gratitudeList.forEach((g, idx) => {
          if (g && g.trim()) {
            items.push({ date: entry.date, text: g.trim(), source: '점검가이드 16번' });
          }
        });
      }
      // 5문항 감사 1, 2, 3
      if (entry.core5) {
        ['fq5_1', 'fq5_2', 'fq5_3'].forEach(k => {
          if (entry.core5[k] && entry.core5[k].trim()) {
            // 중복 방지 (동일 내용이면 하나만)
            if (!items.some(it => it.date === entry.date && it.text === entry.core5[k].trim())) {
              items.push({ date: entry.date, text: entry.core5[k].trim(), source: '5대 묵상 감사' });
            }
          }
        });
      }
    });
    return items;
  }

  // 데이터 내보내기 / 가져오기
  exportToJSON() {
    return JSON.stringify({
      version: '2.0',
      exportedAt: new Date().toISOString(),
      settings: this.settings,
      journals: this.journals
    }, null, 2);
  }

  importFromJSON(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (data.journals) {
        this.journals = { ...this.journals, ...data.journals };
        this.saveJournals();
        if (data.settings) {
          this.settings = { ...this.settings, ...data.settings };
          this.saveSettings(this.settings);
        }
        return { success: true, count: Object.keys(data.journals).length };
      }
      return { success: false, error: '유효한 예수동행일기 데이터 형식이 아닙니다.' };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  // 초기 사용자를 위한 샘플 일기 3일치 생성
  seedInitialData() {
    const today = new Date();
    
    // 어제
    const yDay = new Date(today);
    yDay.setDate(yDay.getDate() - 1);
    const yStr = yDay.toISOString().split('T')[0];

    // 그저께
    const dDay = new Date(today);
    dDay.setDate(dDay.getDate() - 2);
    const dStr = dDay.toISOString().split('T')[0];

    this.journals[dStr] = {
      date: dStr,
      time: '21:15',
      title: '주님과 동행을 시작하며',
      tags: ['#시작', '#은혜', '#순종'],
      visibility: [...DEFAULT_GROUPS],
      faith: {
        bibleChapters: 3,
        lookJesusPercent: 65,
        obeyPercent: 70,
        prayerMinutes: 30,
        isQtDone: true
      },
      guide17: {
        answers14: { 1: 'yes', 2: 'yes', 3: 'yes', 4: 'yes', 5: 'yes', 6: 'yes', 7: 'yes', 8: 'no', 9: 'yes', 10: 'yes', 11: 'no', 12: 'no', 13: 'yes', 14: 'yes' },
        thinkMinutes: 75,
        gratitudeList: [
          '새벽에 맑은 공기와 주님의 평안을 허락하심 감사',
          '직장 회의 중 순간 욱하는 마음이 들었으나 주님 바라보며 온유하게 넘어가게 하심 감사',
          '가족과 함께 저녁식사하며 웃을 수 있는 건강 주심 감사'
        ],
        freeContent: '하루를 예수님과 함께 시작하니 마음의 조급함이 사라졌습니다. 순간순간 주님의 이름을 부르며 걸어가는 기쁨을 누립니다.'
      },
      core5: {
        fq1: '아침 기상 때와 출근길에 주님 이름을 부르며 기도했습니다.',
        fq2: '시편 23편: 여호와는 나의 목자시니 내게 부족함이 없으리로다.',
        fq3: '동료에게 먼저 따뜻한 커피를 건네며 위로하라는 감동에 순종했습니다.',
        fq4: '퇴근 후 유튜브를 보며 시간을 낭비할 뻔했던 순간 주님의 부르심을 외면했습니다.',
        fq5_1: '맑은 하루와 건강한 호흡을 주셔서 감사',
        fq5_2: '묵상 속에서 내 마음을 지켜주셔서 감사',
        fq5_3: '부족한 나를 여전히 품어주시는 예수님의 사랑에 감사'
      },
      updatedAt: new Date().toISOString()
    };

    this.journals[yStr] = {
      date: yStr,
      time: '22:00',
      title: '순종의 걸음에서 만난 평안',
      tags: ['#순종', '#감사', '#QT'],
      visibility: [...DEFAULT_GROUPS],
      faith: {
        bibleChapters: 4,
        lookJesusPercent: 80,
        obeyPercent: 85,
        prayerMinutes: 45,
        isQtDone: true
      },
      guide17: {
        answers14: { 1: 'yes', 2: 'yes', 3: 'yes', 4: 'yes', 5: 'yes', 6: 'yes', 7: 'yes', 8: 'yes', 9: 'yes', 10: 'yes', 11: 'yes', 12: 'no', 13: 'yes', 14: 'yes' },
        thinkMinutes: 110,
        gratitudeList: [
          '말씀 묵상 중 깊은 위로와 확신을 주셔서 감사',
          '어려운 문제를 만났을 때 예수님께 "어떻게 할까요?" 먼저 물어보게 하심 감사',
          '일과를 마치고 고요히 주님 앞에 엎드릴 수 있는 시간 감사'
        ],
        freeContent: '예수님이 내 안에 계시고 내가 주님 안에 있음을 실감하는 하루였습니다. 불평 대신 감사를 선택했을 때 마음에 천국이 임했습니다.'
      },
      core5: {
        fq1: '일할 때와 식사 때도 마음으로 "주님 고맙습니다" 고백했습니다.',
        fq2: '요한복음 15장: 포도나무와 가지의 비유, 주 안에 머무는 삶.',
        fq3: '판단하지 말고 축복하라는 마음에 순종하여 용서의 기도를 드렸습니다.',
        fq4: '운전 중 양보하지 않고 조급하게 굴었던 점 회개합니다.',
        fq5_1: '주님의 살아계심을 경험하게 해주심 감사',
        fq5_2: '오늘 만난 사람들에게 친절을 베풀게 하심 감사',
        fq5_3: '밤에 평안한 쉼을 허락하심 감사'
      },
      updatedAt: new Date().toISOString()
    };

    this.saveJournals();
  }
}

window.JournalStore = JournalStore;
window.GUIDE_QUESTIONS_17 = GUIDE_QUESTIONS_17;
window.FIVE_CORE_QUESTIONS = FIVE_CORE_QUESTIONS;
window.DEFAULT_GROUPS = DEFAULT_GROUPS;
