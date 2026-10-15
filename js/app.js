// App: 메인 UI 인터랙션 및 상태 제어

document.addEventListener('DOMContentLoaded', () => {
  const store = new JournalStore();
  const stats = new JournalStats(store);

  // HTML 이스케이프 유틸리티
  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // 현재 편집 중인 일기 객체
  let currentJournal = null;
  let currentDateStr = store.getTodayDateString();

  // 캘린더 기준 월 상태
  let calendarYear = new Date().getFullYear();
  let calendarMonth = new Date().getMonth(); // 0-indexed

  // UI 요소 캐싱
  const tabButtons = document.querySelectorAll('.nav-tab');
  const viewSections = document.querySelectorAll('.view-section');

  // --- 탭 전환 로직 ---
  function switchTab(tabName) {
    tabButtons.forEach(btn => {
      const isActive = (btn.dataset.tab === tabName);
      btn.classList.toggle('active', isActive);
      if (isActive) {
        try {
          btn.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' });
        } catch (e) {}
      }
    });

    viewSections.forEach(sec => {
      if (sec.id === `view-${tabName}`) {
        sec.classList.remove('hidden');
      } else {
        sec.classList.add('hidden');
      }
    });

    if (tabName === 'bible') {
      window.scrollTo({ top: 0 });
      document.body.classList.add('bible-view-active');
    } else {
      document.body.classList.remove('bible-view-active');
    }

    // 탭별 특화 렌더링
    if (tabName === 'search') {
      executeDiarySearch();
      setTimeout(() => {
        const inp = document.getElementById('diary-search-input');
        if (inp) inp.focus();
      }, 100);
    } else if (tabName === 'stats') {
      stats.renderAllStats();
    } else if (tabName === 'calendar') {
      renderCalendar();
      renderRecentJournalList();
    } else if (tabName === 'gratitude') {
      renderGratitudeStream();
    } else if (tabName === 'bible') {
      syncThemeToBible(currentTheme);
      syncFontSizeToBible(currentFontSize);
    } else if (tabName === 'settings') {
      renderSettings();
    }
  }

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      switchTab(btn.dataset.tab);
    });
  });

  // --- 오늘 일기 로드 및 폼 바인딩 ---
  function loadJournalForDate(dateStr) {
    currentDateStr = dateStr;
    currentJournal = store.getJournal(dateStr);

    // 기본 메타 필드
    const elDate = document.getElementById('input-date');
    const elTime = document.getElementById('input-time');
    const elTitle = document.getElementById('input-title');
    const elTags = document.getElementById('input-tags');

    if (elDate) elDate.value = currentJournal.date;
    if (elTime) elTime.value = currentJournal.time || '08:30';
    if (elTitle) elTitle.value = currentJournal.title || '나의 일기';
    if (elTags) elTags.value = (currentJournal.tags || []).join(' ');

    const elCommentAuthor = document.getElementById('input-comment-author');
    if (elCommentAuthor) {
      elCommentAuthor.value = store.settings.authorName || '최현경';
    }

    // 상단 스트릭 및 배지 표시
    updateHeaderStreak();

    // 신앙 지표
    updateFaithInputs();

    // 공개 그룹 칩
    renderGroupChips();

    // 17문항 가이드 바인딩
    renderGuide17Questions();

    // 5대 핵심 질문 바인딩
    bindCore5Questions();

    // 미리보기 갱신
    updatePreviewText();

    // 나눔 댓글 렌더링
    renderComments();
  }

  // --- 나눔 댓글 렌더링 및 등록 ---
  function renderComments() {
    const listContainer = document.getElementById('write-comments-list');
    const countEl = document.getElementById('write-comment-count');
    if (!listContainer) return;
    listContainer.innerHTML = '';

    const comments = currentJournal.comments || [];
    if (countEl) countEl.textContent = `${comments.length}`;

    if (comments.length === 0) {
      listContainer.innerHTML = `
        <div class="py-5 px-4 text-center bg-gray-50/70 rounded-xl border border-dashed border-gray-200 text-gray-400">
          <p class="text-xs">이 일기에는 아직 등록된 나눔 댓글이 없습니다.</p>
          <p class="text-[11px] mt-0.5 text-gray-400">아래에서 첫 번째 따뜻한 격려와 축복의 댓글을 남겨보세요.</p>
        </div>
      `;
      return;
    }

    comments.forEach(c => {
      const cDiv = document.createElement('div');
      cDiv.className = 'p-3 sm:p-3.5 bg-white border border-gray-100 rounded-xl shadow-2xs space-y-1.5';

      const authorName = c.author || '나눔 성도';
      const initial = authorName.charAt(0);
      const isMyName = authorName === (store.settings.authorName || '최현경');

      cDiv.innerHTML = `
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 sm:w-7 sm:h-7 rounded-full ${isMyName ? 'bg-emerald-700 text-white' : 'bg-emerald-100 text-emerald-900'} flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
              ${escapeHtml(initial)}
            </div>
            <div class="flex items-center gap-1.5">
              <span class="text-xs font-bold text-gray-800">${escapeHtml(authorName)}</span>
              ${c.room ? `<span class="text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-100 px-1.5 py-0.2 rounded">${escapeHtml(c.room)}</span>` : ''}
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-[10px] text-gray-400">${escapeHtml(c.date || '')}</span>
            <button type="button" class="btn-del-comment text-gray-300 hover:text-red-500 text-xs px-1" title="댓글 삭제" data-id="${c.id || ''}">✕</button>
          </div>
        </div>
        <p class="text-xs sm:text-sm text-gray-700 leading-relaxed pl-8 whitespace-pre-wrap">${escapeHtml(c.content || '')}</p>
      `;

      cDiv.querySelector('.btn-del-comment')?.addEventListener('click', () => {
        if (confirm(`'${authorName}' 님의 댓글을 삭제하시겠습니까?`)) {
          store.deleteComment(currentJournal.date, c.id);
          currentJournal = store.getJournal(currentJournal.date);
          renderComments();
          showToast('댓글이 삭제되었습니다.');
        }
      });

      listContainer.appendChild(cDiv);
    });
  }

  document.getElementById('btn-add-comment')?.addEventListener('click', () => {
    const authorInput = document.getElementById('input-comment-author');
    const contentInput = document.getElementById('input-comment-content');
    const roomSelect = document.getElementById('select-comment-room');

    const author = (authorInput?.value || store.settings.authorName || '최현경').trim();
    const content = (contentInput?.value || '').trim();
    const room = roomSelect?.value || 'Login 온라인';

    if (!content) {
      alert('댓글 내용을 입력해주세요.');
      contentInput?.focus();
      return;
    }

    store.addComment(currentJournal.date, {
      author,
      content,
      room,
      date: store.getTodayDateString()
    });

    currentJournal = store.getJournal(currentJournal.date);
    if (contentInput) contentInput.value = '';
    renderComments();
    showToast('💬 나눔 댓글이 등록되었습니다.');
  });


  function updateHeaderStreak() {
    const streak = store.calculateStreak();
    const totalCount = Object.keys(store.journals || {}).length;
    const streakEl = document.getElementById('header-streak-badge');
    if (streakEl) {
      streakEl.title = `현재 연속 일기 작성: ${streak}일 / 전체 동행 일기: ${totalCount}편`;
      if (streak > 0) {
        streakEl.innerHTML = `🔥 <strong>연속 ${streak}일</strong><span class="text-xs font-normal opacity-85"> (총 ${totalCount}편)</span>`;
      } else {
        streakEl.innerHTML = `🔥 <strong>연속 0일</strong><span class="text-xs font-normal opacity-85"> (총 ${totalCount}편)</span>`;
      }
    }
  }

  function updateFaithInputs() {
    const f = currentJournal.faith;
    // 말씀 읽기
    const elBible = document.getElementById('input-bible');
    if (elBible) elBible.value = f.bibleChapters || 0;

    // 예수님 바라보기 %
    const elLook = document.getElementById('input-look');
    const elLookVal = document.getElementById('val-look');
    if (elLook) elLook.value = f.lookJesusPercent || 0;
    if (elLookVal) elLookVal.textContent = `${f.lookJesusPercent || 0}%`;

    // 순종하기 %
    const elObey = document.getElementById('input-obey');
    const elObeyVal = document.getElementById('val-obey');
    if (elObey) elObey.value = f.obeyPercent || 0;
    if (elObeyVal) elObeyVal.textContent = `${f.obeyPercent || 0}%`;

    // 기도 시간
    const elPrayer = document.getElementById('input-prayer');
    if (elPrayer) elPrayer.value = f.prayerMinutes || 0;

    // QT 토글
    const elQt = document.getElementById('toggle-qt');
    if (elQt) {
      if (f.isQtDone) {
        elQt.classList.add('bg-emerald-800', 'text-white');
        elQt.classList.remove('bg-gray-100', 'text-gray-600');
        elQt.textContent = '✓ QT 완료';
      } else {
        elQt.classList.remove('bg-emerald-800', 'text-white');
        elQt.classList.add('bg-gray-100', 'text-gray-600');
        elQt.textContent = 'QT 미체크';
      }
    }
  }

  // 공개 그룹 칩
  function renderGroupChips() {
    const container = document.getElementById('group-chips-container');
    if (!container) return;
    container.innerHTML = '';

    const availableGroups = store.settings.customGroups || DEFAULT_GROUPS;
    const selected = currentJournal.visibility || [];

    availableGroups.forEach(grp => {
      const isSelected = selected.includes(grp);
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = `px-2.5 py-1 text-xs rounded-full border transition-all ${
        isSelected
          ? 'bg-emerald-50 border-emerald-600 text-emerald-800 font-medium'
          : 'bg-white border-gray-300 text-gray-500 hover:border-gray-400'
      }`;
      chip.innerHTML = `${isSelected ? '✓ ' : ''}${grp}`;
      chip.addEventListener('click', () => {
        if (isSelected) {
          currentJournal.visibility = currentJournal.visibility.filter(g => g !== grp);
        } else {
          currentJournal.visibility.push(grp);
        }
        renderGroupChips();
      });
      container.appendChild(chip);
    });
  }

  // --- 17문항 가이드 동적 렌더링 ---
  function renderGuide17Questions() {
    const listContainer = document.getElementById('guide14-list');
    if (!listContainer) return;
    listContainer.innerHTML = '';

    const answers = currentJournal.guide17.answers14 || {};

    GUIDE_QUESTIONS_17.forEach(q => {
      const val = answers[q.id]; // 'yes', 'no', or null
      const row = document.createElement('div');
      row.className = 'py-3 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5';

      const isReverse = q.reversePositive; // 12번 (싫어하실 행동)
      
      row.innerHTML = `
        <div class="flex items-start gap-2 text-sm text-gray-800">
          <span class="font-bold text-emerald-900 w-6 shrink-0">${q.id}.</span>
          <span>${q.text}</span>
          ${isReverse ? '<span class="text-[11px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded ml-1 shrink-0">절제</span>' : ''}
        </div>
        <div class="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
          <button type="button" data-qid="${q.id}" data-val="yes" class="btn-yn px-3.5 py-1 text-xs font-medium rounded-lg border ${
            val === 'yes' ? 'active-yes' : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
          }">예</button>
          <button type="button" data-qid="${q.id}" data-val="no" class="btn-yn px-3.5 py-1 text-xs font-medium rounded-lg border ${
            val === 'no' ? 'active-no' : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
          }">아니오</button>
        </div>
      `;

      // 버튼 클릭 이벤트
      const btnYes = row.querySelector('[data-val="yes"]');
      const btnNo = row.querySelector('[data-val="no"]');

      btnYes.addEventListener('click', () => {
        answers[q.id] = (answers[q.id] === 'yes') ? null : 'yes';
        renderGuide17Questions();
        updatePreviewText();
      });

      btnNo.addEventListener('click', () => {
        answers[q.id] = (answers[q.id] === 'no') ? null : 'no';
        renderGuide17Questions();
        updatePreviewText();
      });

      listContainer.appendChild(row);
    });

    // 15번 생각한 시간
    const elMinutes = document.getElementById('input-think-minutes');
    if (elMinutes) {
      elMinutes.value = currentJournal.guide17.thinkMinutes || 0;
    }

    // 16번 감사제목 3가지 이상
    renderGratitudeInputs();

    // 17번 자유 일기
    const elFree = document.getElementById('input-free-content');
    if (elFree) {
      elFree.value = currentJournal.guide17.freeContent || '';
    }
  }

  // 16번 감사제목 동적 입력필드
  function renderGratitudeInputs() {
    const container = document.getElementById('gratitude-list-container');
    if (!container) return;
    container.innerHTML = '';

    const list = currentJournal.guide17.gratitudeList || ['', '', ''];
    while (list.length < 3) list.push('');

    list.forEach((item, idx) => {
      const wrap = document.createElement('div');
      wrap.className = 'flex items-center gap-2 mb-2';
      wrap.innerHTML = `
        <span class="text-xs font-bold text-amber-700 w-5">${idx + 1}.</span>
        <input type="text" class="gratitude-item-input flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700" placeholder="하나님이 하신 감사제목을 기록하세요" value="${escapeHtml(item)}" data-index="${idx}" />
        ${idx >= 3 ? `<button type="button" class="btn-remove-gratitude text-gray-400 hover:text-red-500 text-xs px-1.5" data-index="${idx}">✕</button>` : ''}
      `;
      container.appendChild(wrap);
    });

    // 입력 이벤트 리스너 바인딩
    container.querySelectorAll('.gratitude-item-input').forEach(input => {
      input.addEventListener('input', (e) => {
        const idx = parseInt(e.target.dataset.index);
        currentJournal.guide17.gratitudeList[idx] = e.target.value;
        // 5대 핵심 질문 fq5_1, fq5_2, fq5_3와도 자동 동기화
        if (idx === 0) currentJournal.core5.fq5_1 = e.target.value;
        if (idx === 1) currentJournal.core5.fq5_2 = e.target.value;
        if (idx === 2) currentJournal.core5.fq5_3 = e.target.value;
        syncCore5Inputs();
        updatePreviewText();
      });
    });

    // 삭제 버튼
    container.querySelectorAll('.btn-remove-gratitude').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.target.dataset.index);
        currentJournal.guide17.gratitudeList.splice(idx, 1);
        renderGratitudeInputs();
        updatePreviewText();
      });
    });
  }

  // 5대 핵심 묵상 질문 바인딩
  function bindCore5Questions() {
    const c = currentJournal.core5 || {};
    const fq1 = document.getElementById('core-fq1');
    const fq2 = document.getElementById('core-fq2');
    const fq3 = document.getElementById('core-fq3');
    const fq4 = document.getElementById('core-fq4');
    const fq5_1 = document.getElementById('core-fq5-1');
    const fq5_2 = document.getElementById('core-fq5-2');
    const fq5_3 = document.getElementById('core-fq5-3');

    if (fq1) fq1.value = c.fq1 || '';
    if (fq2) fq2.value = c.fq2 || '';
    if (fq3) fq3.value = c.fq3 || '';
    if (fq4) fq4.value = c.fq4 || '';
    if (fq5_1) fq5_1.value = c.fq5_1 || currentJournal.guide17.gratitudeList?.[0] || '';
    if (fq5_2) fq5_2.value = c.fq5_2 || currentJournal.guide17.gratitudeList?.[1] || '';
    if (fq5_3) fq5_3.value = c.fq5_3 || currentJournal.guide17.gratitudeList?.[2] || '';
  }

  function syncCore5Inputs() {
    const fq5_1 = document.getElementById('core-fq5-1');
    const fq5_2 = document.getElementById('core-fq5-2');
    const fq5_3 = document.getElementById('core-fq5-3');
    if (fq5_1 && currentJournal.guide17.gratitudeList[0] !== undefined) fq5_1.value = currentJournal.guide17.gratitudeList[0];
    if (fq5_2 && currentJournal.guide17.gratitudeList[1] !== undefined) fq5_2.value = currentJournal.guide17.gratitudeList[1];
    if (fq5_3 && currentJournal.guide17.gratitudeList[2] !== undefined) fq5_3.value = currentJournal.guide17.gratitudeList[2];
  }

  // --- 이벤트 리스너 등록 ---
  
  // 날짜 변경 시 해당 날짜의 일기 자동 로드
  const inputDate = document.getElementById('input-date');
  if (inputDate) {
    inputDate.addEventListener('change', (e) => {
      loadJournalForDate(e.target.value);
    });
  }

  // 오늘 날짜로 즉시 이동
  const btnToday = document.getElementById('btn-go-today');
  if (btnToday) {
    btnToday.addEventListener('click', () => {
      loadJournalForDate(store.getTodayDateString());
    });
  }

  // 상단 신앙 지표 슬라이더 / 증감 제어
  const inputLook = document.getElementById('input-look');
  if (inputLook) {
    inputLook.addEventListener('input', (e) => {
      currentJournal.faith.lookJesusPercent = parseInt(e.target.value);
      document.getElementById('val-look').textContent = `${e.target.value}%`;
      updatePreviewText();
    });
  }

  const inputObey = document.getElementById('input-obey');
  if (inputObey) {
    inputObey.addEventListener('input', (e) => {
      currentJournal.faith.obeyPercent = parseInt(e.target.value);
      document.getElementById('val-obey').textContent = `${e.target.value}%`;
      updatePreviewText();
    });
  }

  // 14문항 기반 바라보기 % 자동 계산 버튼
  const btnAutoLook = document.getElementById('btn-auto-look-calc');
  if (btnAutoLook) {
    btnAutoLook.addEventListener('click', () => {
      const rec = store.calculateRecommendedLookPercent(
        currentJournal.guide17.answers14,
        currentJournal.guide17.thinkMinutes
      );
      currentJournal.faith.lookJesusPercent = rec;
      inputLook.value = rec;
      document.getElementById('val-look').textContent = `${rec}%`;
      showToast(`점검 답변을 바탕으로 바라보기 ${rec}%로 자동 계산되었습니다!`);
      updatePreviewText();
    });
  }

  // 말씀 장수 증감
  document.getElementById('btn-bible-minus')?.addEventListener('click', () => {
    const el = document.getElementById('input-bible');
    let v = Math.max(0, parseInt(el.value || 0) - 1);
    el.value = v;
    currentJournal.faith.bibleChapters = v;
    updatePreviewText();
  });
  document.getElementById('btn-bible-plus')?.addEventListener('click', () => {
    const el = document.getElementById('input-bible');
    let v = parseInt(el.value || 0) + 1;
    el.value = v;
    currentJournal.faith.bibleChapters = v;
    updatePreviewText();
  });
  document.getElementById('input-bible')?.addEventListener('input', (e) => {
    currentJournal.faith.bibleChapters = Math.max(0, parseInt(e.target.value || 0));
    updatePreviewText();
  });

  // 기도 시간 증감
  document.getElementById('btn-prayer-minus')?.addEventListener('click', () => {
    const el = document.getElementById('input-prayer');
    let v = Math.max(0, parseInt(el.value || 0) - 10);
    el.value = v;
    currentJournal.faith.prayerMinutes = v;
    updatePreviewText();
  });
  document.getElementById('btn-prayer-plus')?.addEventListener('click', () => {
    const el = document.getElementById('input-prayer');
    let v = parseInt(el.value || 0) + 10;
    el.value = v;
    currentJournal.faith.prayerMinutes = v;
    updatePreviewText();
  });
  document.getElementById('input-prayer')?.addEventListener('input', (e) => {
    currentJournal.faith.prayerMinutes = Math.max(0, parseInt(e.target.value || 0));
    updatePreviewText();
  });

  // QT 토글
  document.getElementById('toggle-qt')?.addEventListener('click', () => {
    currentJournal.faith.isQtDone = !currentJournal.faith.isQtDone;
    updateFaithInputs();
    updatePreviewText();
  });

  // 14문항 일괄 선택 도우미 (모두 예 / 초기화)
  document.getElementById('btn-guide-all-yes')?.addEventListener('click', () => {
    for (let i = 1; i <= 14; i++) {
      currentJournal.guide17.answers14[i] = (i === 12) ? 'no' : 'yes'; // 12번은 아니오가 긍정
    }
    renderGuide17Questions();
    showToast('모든 점검 항목이 은혜로운 기본값으로 설정되었습니다.');
    updatePreviewText();
  });

  document.getElementById('btn-guide-reset')?.addEventListener('click', () => {
    for (let i = 1; i <= 14; i++) {
      currentJournal.guide17.answers14[i] = null;
    }
    renderGuide17Questions();
    updatePreviewText();
  });

  // 15번 생각 시간 입력 및 퀵 버튼
  const elThinkMinutes = document.getElementById('input-think-minutes');
  if (elThinkMinutes) {
    elThinkMinutes.addEventListener('input', (e) => {
      currentJournal.guide17.thinkMinutes = Math.max(0, parseInt(e.target.value || 0));
      updatePreviewText();
    });
  }

  document.querySelectorAll('.btn-add-minutes').forEach(btn => {
    btn.addEventListener('click', () => {
      const add = parseInt(btn.dataset.min);
      const curr = currentJournal.guide17.thinkMinutes || 0;
      currentJournal.guide17.thinkMinutes = curr + add;
      if (elThinkMinutes) elThinkMinutes.value = currentJournal.guide17.thinkMinutes;
      updatePreviewText();
    });
  });

  // 16번 감사제목 추가 버튼
  document.getElementById('btn-add-gratitude')?.addEventListener('click', () => {
    currentJournal.guide17.gratitudeList.push('');
    renderGratitudeInputs();
  });

  // 17번 자유일기
  document.getElementById('input-free-content')?.addEventListener('input', (e) => {
    currentJournal.guide17.freeContent = e.target.value;
    updatePreviewText();
  });

  // 5대 핵심 질문 입력 리스너
  ['fq1', 'fq2', 'fq3', 'fq4'].forEach(k => {
    document.getElementById(`core-${k}`)?.addEventListener('input', (e) => {
      currentJournal.core5[k] = e.target.value;
      updatePreviewText();
    });
  });

  ['fq5-1', 'fq5-2', 'fq5-3'].forEach((id, idx) => {
    document.getElementById(`core-${id}`)?.addEventListener('input', (e) => {
      const k = `fq5_${idx + 1}`;
      currentJournal.core5[k] = e.target.value;
      // 16번 감사제목 1, 2, 3과 동기화
      currentJournal.guide17.gratitudeList[idx] = e.target.value;
      renderGratitudeInputs();
      updatePreviewText();
    });
  });

  // 제목 및 태그 입력
  document.getElementById('input-title')?.addEventListener('input', (e) => {
    currentJournal.title = e.target.value;
    updatePreviewText();
  });

  document.getElementById('input-time')?.addEventListener('change', (e) => {
    currentJournal.time = e.target.value;
    updatePreviewText();
  });

  document.getElementById('input-tags')?.addEventListener('input', (e) => {
    currentJournal.tags = e.target.value.split(/\s+/).filter(t => t.trim().length > 0);
    updatePreviewText();
  });

  // --- 저장 로직 ---
  function saveCurrentJournal() {
    currentJournal.date = document.getElementById('input-date').value;
    currentJournal.time = document.getElementById('input-time').value;
    currentJournal.title = document.getElementById('input-title').value.trim() || '나의 일기';
    
    store.saveJournal(currentJournal);
    updateHeaderStreak();
    showToast('🌱 예수동행일기가 은혜 가운데 저장되었습니다.');
  }

  document.getElementById('btn-save-journal')?.addEventListener('click', saveCurrentJournal);
  document.getElementById('btn-save-journal-top')?.addEventListener('click', saveCurrentJournal);

  // --- 나눔 양식 텍스트 생성 및 클립보드 복사 ---
  function generateShareableText() {
    const f = currentJournal.faith;
    const g17 = currentJournal.guide17;
    const c5 = currentJournal.core5;

    let text = `[예수동행일기 - ${currentJournal.date}]\n`;
    text += `제목: ${currentJournal.title}\n`;
    text += `신앙: 말씀읽기 ${f.bibleChapters}장, 예수님바라보기 ${f.lookJesusPercent}%, 순종하기 ${f.obeyPercent}%, 기도 ${f.prayerMinutes}분, QT ${f.isQtDone ? '완료' : '미체크'}\n`;
    if (currentJournal.visibility && currentJournal.visibility.length > 0) {
      text += `공개: ${currentJournal.visibility.join(', ')}\n`;
    }
    text += `------------------------------------\n`;

    // 15번 생각한 시간
    if (g17.thinkMinutes > 0) {
      text += `⏱️ 주님을 생각한 시간: 약 ${g17.thinkMinutes}분\n\n`;
    }

    // 감사제목 3가지
    const validGratitudes = (g17.gratitudeList || []).filter(item => item && item.trim().length > 0);
    if (validGratitudes.length > 0) {
      text += `🙏 하나님이 하셨다고 고백할 감사제목:\n`;
      validGratitudes.forEach((g, i) => {
        text += `  ${i + 1}. ${g.trim()}\n`;
      });
      text += `\n`;
    }

    // 5대 핵심 질문 내용이 있으면 삽입
    let hasCore = false;
    if (c5.fq1 || c5.fq2 || c5.fq3 || c5.fq4) {
      hasCore = true;
      text += `🌿 [5대 묵상 나눔]\n`;
      if (c5.fq1) text += `1. 일상 속 주님 생각: ${c5.fq1}\n`;
      if (c5.fq2) text += `2. 통독과 큐티 말씀: ${c5.fq2}\n`;
      if (c5.fq3) text += `3. 오늘의 메시지와 순종: ${c5.fq3}\n`;
      if (c5.fq4) text += `4. 마음에 걸리는 불순종: ${c5.fq4}\n`;
      text += `\n`;
    }

    // 17번 자유 일기
    if (g17.freeContent && g17.freeContent.trim()) {
      text += `🕊️ [동행 일기]\n${g17.freeContent.trim()}\n\n`;
    }

    // 태그
    if (currentJournal.tags && currentJournal.tags.length > 0) {
      text += `태그: ${currentJournal.tags.join(' ')}\n`;
    }

    text += `\n위드지저스미니스트리 (Journal with Jesus)`;
    return text;
  }

  function updatePreviewText() {
    const previewBox = document.getElementById('preview-formatted-content');
    if (previewBox) {
      previewBox.textContent = generateShareableText();
    }
  }

  document.getElementById('btn-copy-share')?.addEventListener('click', () => {
    const text = generateShareableText();
    navigator.clipboard.writeText(text).then(() => {
      showToast('📋 나눔 양식이 클립보드에 복사되었습니다! 카톡이나 나눔방에 붙여넣으세요.');
    }).catch(() => {
      // 폴백 복사
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showToast('📋 나눔 양식이 복사되었습니다!');
    });
  });

  // --- 서브탭 제어 (17문항 / 5대 묵상 / 예수동행일기) ---
  const subTabButtons = document.querySelectorAll('.guide-subtab-btn');
  const subTabPanels = document.querySelectorAll('.guide-subtab-panel');

  function switchGuideSubtab(targetSub) {
    subTabButtons.forEach(b => {
      if (b.dataset.subtab === targetSub) {
        b.classList.add('bg-white', 'text-emerald-900', 'shadow-sm', 'font-bold');
        b.classList.remove('text-gray-500');
      } else {
        b.classList.remove('bg-white', 'text-emerald-900', 'shadow-sm', 'font-bold');
        b.classList.add('text-gray-500');
      }
    });

    subTabPanels.forEach(p => {
      if (p.id === `panel-${targetSub}`) {
        p.classList.remove('hidden');
      } else {
        p.classList.add('hidden');
      }
    });

    if (targetSub === 'preview') {
      updatePreviewText();
    }
  }

  subTabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      switchGuideSubtab(btn.dataset.subtab);
    });
  });

  // --- 캘린더 렌더링 ---
  function renderCalendar() {
    const grid = document.getElementById('calendar-grid');
    const titleEl = document.getElementById('calendar-month-title');
    if (!grid || !titleEl) return;

    titleEl.textContent = `${calendarYear}년 ${calendarMonth + 1}월`;
    grid.innerHTML = '';

    const firstDay = new Date(calendarYear, calendarMonth, 1).getDay(); // 0(Sun) ~ 6(Sat)
    const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();

    // 빈 날짜 채우기
    for (let i = 0; i < firstDay; i++) {
      const emptyCell = document.createElement('div');
      emptyCell.className = 'h-14 sm:h-20 bg-gray-50/50 rounded-lg';
      grid.appendChild(emptyCell);
    }

    const todayStr = store.getTodayDateString();

    for (let day = 1; day <= daysInMonth; day++) {
      const monthStr = String(calendarMonth + 1).padStart(2, '0');
      const dayStr = String(day).padStart(2, '0');
      const cellDateStr = `${calendarYear}-${monthStr}-${dayStr}`;

      const journal = store.journals[cellDateStr];
      const isToday = (cellDateStr === todayStr);
      const isSelected = (cellDateStr === currentDateStr);

      const cell = document.createElement('div');
      cell.className = `h-14 sm:h-20 p-1.5 sm:p-2 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
        isSelected
          ? 'border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-600/30'
          : journal
          ? 'border-emerald-200 bg-white hover:border-emerald-400 shadow-xs'
          : 'border-gray-100 bg-white hover:bg-gray-50'
      }`;

      let dotHtml = '';
      if (journal) {
        const look = journal.faith?.lookJesusPercent || 0;
        const commentsCount = (journal.comments || []).length;
        dotHtml = `
          <div class="flex items-center justify-between mt-auto">
            <div class="flex items-center gap-1">
              <span class="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span class="text-[10px] text-emerald-800 font-semibold hidden sm:inline">${look}%</span>
            </div>
            ${commentsCount > 0 ? `<span class="text-[9px] bg-emerald-100 text-emerald-900 px-1 rounded font-bold hidden sm:inline">💬${commentsCount}</span>` : ''}
          </div>
        `;
      }

      cell.innerHTML = `
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold ${isToday ? 'bg-emerald-800 text-white rounded-full w-5 h-5 flex items-center justify-center' : 'text-gray-700'}">${day}</span>
          ${journal ? '<span class="text-[10px] text-emerald-700 hidden sm:inline">✍️</span>' : ''}
        </div>
        ${dotHtml}
      `;

      cell.addEventListener('click', () => {
        loadJournalForDate(cellDateStr);
        switchTab('write');
        switchGuideSubtab('preview');
      });

      grid.appendChild(cell);
    }
  }

  document.getElementById('btn-cal-prev')?.addEventListener('click', () => {
    calendarMonth--;
    if (calendarMonth < 0) {
      calendarMonth = 11;
      calendarYear--;
    }
    renderCalendar();
  });

  document.getElementById('btn-cal-next')?.addEventListener('click', () => {
    calendarMonth++;
    if (calendarMonth > 11) {
      calendarMonth = 0;
      calendarYear++;
    }
    renderCalendar();
  });

  // 최근 일기 리스트 렌더링
  function renderRecentJournalList() {
    const container = document.getElementById('calendar-journal-list');
    if (!container) return;
    container.innerHTML = '';

    const list = store.getAllJournalsList();
    if (list.length === 0) {
      container.innerHTML = `<p class="text-sm text-gray-500 py-6 text-center">아직 작성된 일기가 없습니다. 오늘 첫 일기를 기록해보세요!</p>`;
      return;
    }

    list.slice(0, 10).forEach(item => {
      const card = document.createElement('div');
      card.className = 'p-3.5 bg-white border border-gray-100 rounded-xl hover:border-emerald-300 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2';
      
      const f = item.faith || {};
      const commentsCount = (item.comments || []).length;
      card.innerHTML = `
        <div>
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">${item.date}</span>
            <h4 class="text-sm font-bold text-gray-800">${escapeHtml(item.title || '나의 일기')}</h4>
            ${commentsCount > 0 ? `<span class="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded-full font-semibold">💬 ${commentsCount}</span>` : ''}
          </div>
          <p class="text-xs text-gray-500 mt-1 line-clamp-1">
            ${escapeHtml(item.guide17?.freeContent || item.core5?.fq3 || item.core5?.fq1 || '동행 점검 완료')}
          </p>
        </div>
        <div class="flex items-center gap-3 text-xs text-gray-600 shrink-0">
          <span>바라보기 <strong class="text-emerald-700">${f.lookJesusPercent || 0}%</strong></span>
          <span>순종 <strong class="text-amber-700">${f.obeyPercent || 0}%</strong></span>
          <span>말씀 ${f.bibleChapters || 0}장</span>
        </div>
      `;

      card.addEventListener('click', () => {
        loadJournalForDate(item.date);
        switchTab('write');
        switchGuideSubtab('preview');
      });

      container.appendChild(card);
    });
  }

  // --- 은혜의 감사함 모아보기 (Gratitude Stream) ---
  function renderGratitudeStream() {
    const container = document.getElementById('gratitude-stream-container');
    const countEl = document.getElementById('gratitude-total-count');
    if (!container) return;
    container.innerHTML = '';

    const items = store.getAllGratitudeItems();
    if (countEl) countEl.textContent = `${items.length}개의 감사`;

    if (items.length === 0) {
      container.innerHTML = `
        <div class="col-span-full py-12 text-center text-gray-400">
          <p class="text-base font-medium">아직 등록된 감사제목이 없습니다.</p>
          <p class="text-xs mt-1">일기 점검 가이드 16번이나 5대 묵상에 하나님이 행하신 감사를 기록해보세요.</p>
        </div>
      `;
      return;
    }

    items.forEach((it, idx) => {
      const card = document.createElement('div');
      card.className = 'p-4 bg-white border border-amber-100 rounded-2xl shadow-xs hover:shadow-md transition-all flex flex-col justify-between';
      card.innerHTML = `
        <div>
          <div class="flex items-center justify-between text-xs text-amber-800 mb-2">
            <span class="font-bold flex items-center gap-1">🙏 감사 #${items.length - idx}</span>
            <span class="text-gray-400">${it.date}</span>
          </div>
          <p class="text-sm text-gray-800 leading-relaxed font-medium">"${escapeHtml(it.text)}"</p>
        </div>
        <div class="mt-3 pt-2 border-t border-amber-50 text-[11px] text-gray-400 flex items-center justify-between">
          <span>${it.source}</span>
          <button type="button" class="btn-goto-journal text-emerald-700 hover:underline font-semibold" data-date="${it.date}">일기 보기 →</button>
        </div>
      `;

      card.querySelector('.btn-goto-journal')?.addEventListener('click', () => {
        loadJournalForDate(it.date);
        switchTab('write');
      });

      container.appendChild(card);
    });
  }

  // --- 설정 화면 관리 ---
  function renderSettings() {
    const nameInput = document.getElementById('settings-author-name');
    if (nameInput) nameInput.value = store.settings.authorName || '최현경';

    const groupListContainer = document.getElementById('settings-groups-list');
    if (groupListContainer) {
      groupListContainer.innerHTML = '';
      (store.settings.customGroups || DEFAULT_GROUPS).forEach((grp, idx) => {
        const item = document.createElement('div');
        item.className = 'flex items-center justify-between py-1.5 px-3 bg-gray-50 rounded-lg text-sm';
        item.innerHTML = `
          <span class="text-gray-700">${escapeHtml(grp)}</span>
          <button type="button" class="btn-del-grp text-gray-400 hover:text-red-500 text-xs" data-idx="${idx}">✕ 삭제</button>
        `;
        item.querySelector('.btn-del-grp')?.addEventListener('click', () => {
          store.settings.customGroups.splice(idx, 1);
          store.saveSettings(store.settings);
          renderSettings();
          renderGroupChips();
        });
        groupListContainer.appendChild(item);
      });
    }

    // 동기화 배지 갱신
    const importedCount = Object.keys(store.journals).length;
    const totalComments = Object.values(store.journals).reduce((acc, j) => acc + (j.comments ? j.comments.length : 0), 0);
    const impEl = document.getElementById('jwj-imported-badge');
    const comEl = document.getElementById('jwj-comments-badge');
    if (impEl) impEl.textContent = `${importedCount}편`;
    if (comEl) comEl.textContent = `${totalComments}개`;
  }

  document.getElementById('btn-add-custom-group')?.addEventListener('click', () => {
    const input = document.getElementById('input-new-group-name');
    const val = input.value.trim();
    if (val) {
      if (!store.settings.customGroups) store.settings.customGroups = [...DEFAULT_GROUPS];
      if (!store.settings.customGroups.includes(val)) {
        store.settings.customGroups.push(val);
        store.saveSettings(store.settings);
        input.value = '';
        renderSettings();
        renderGroupChips();
        showToast(`'${val}' 그룹이 추가되었습니다.`);
      }
    }
  });

  document.getElementById('btn-save-settings')?.addEventListener('click', () => {
    const nameInput = document.getElementById('settings-author-name');
    if (nameInput) {
      store.saveSettings({ authorName: nameInput.value.trim() });
      showToast('설정이 저장되었습니다.');
    }
  });

  // 데이터 백업 (JSON 다운로드)
  document.getElementById('btn-export-json')?.addEventListener('click', () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(store.exportToJSON());
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `예수동행일기_백업_${store.getTodayDateString()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('💾 일기 데이터 백업 파일이 다운로드되었습니다.');
  });

  // 데이터 복원 (JSON 파일 불러오기)
  const fileInput = document.getElementById('input-import-file');
  document.getElementById('btn-trigger-import')?.addEventListener('click', () => {
    if (fileInput) fileInput.click();
  });

  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const res = store.importFromJSON(event.target.result);
        if (res.success) {
          showToast(`✓ 총 ${res.count}개의 일기 데이터를 성공적으로 복원했습니다.`);
          loadJournalForDate(currentDateStr);
          stats.renderAllStats();
        } else {
          alert('복원 실패: ' + res.error);
        }
      };
      reader.readAsText(file);
    });
  }

  // --- 위드지저스 실시간 동기화 (One-Click Real-time Sync) ---
  async function triggerRealtimeSync() {
    const syncIcons = document.querySelectorAll('.sync-icon');
    syncIcons.forEach(icon => icon.classList.add('spinning'));
    const statusIndicator = document.getElementById('sync-status-indicator');
    if (statusIndicator) {
      statusIndicator.textContent = '동기화 진행 중...';
      statusIndicator.className = 'text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-semibold animate-pulse';
    }
    showToast('🌿 위드지저스(jwj.kr) 실시간 동기화를 시작합니다...');

    try {
      const response = await fetch('/api/sync', { method: 'POST' });
      if (!response.ok) {
        throw new Error(`서버 응답 오류 (${response.status})`);
      }
      const result = await response.json();
      if (result.status === 'success') {
        const jsonRes = await fetch('./jwj_imported_diaries.json?t=' + Date.now());
        if (jsonRes.ok) {
          const freshData = await jsonRes.json();
          window.INITIAL_IMPORTED_DATA = freshData;
          store.syncWithImportedData(true);
        }
        loadJournalForDate(currentDateStr);
        renderSettings();
        if (stats) stats.renderAllStats();
        showToast(`🎉 ${result.message || '동기화 완료!'}`);
        if (statusIndicator) {
          statusIndicator.textContent = '방금 동기화됨';
          statusIndicator.className = 'text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold';
        }
      } else {
        throw new Error(result.message || '동기화 실패');
      }
    } catch (err) {
      console.warn('API sync failed or running statically, syncing with local cache:', err);
      if (window.INITIAL_IMPORTED_DATA && window.INITIAL_IMPORTED_DATA.journals) {
        store.syncWithImportedData(false);
        loadJournalForDate(currentDateStr);
        renderSettings();
        if (stats) stats.renderAllStats();
        showToast(`✓ 위드지저스 일기 ${Object.keys(store.journals).length}편이 동기화되었습니다.`);
      } else {
        showToast(`동기화 안내: ${err.message}. run_app.bat 또는 python server.py로 실행해주세요.`);
      }
      if (statusIndicator) {
        statusIndicator.textContent = '동기화 완료';
        statusIndicator.className = 'text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full font-semibold';
      }
    } finally {
      syncIcons.forEach(icon => icon.classList.remove('spinning'));
    }
  }

  document.getElementById('btn-header-sync')?.addEventListener('click', triggerRealtimeSync);
  document.getElementById('btn-api-sync')?.addEventListener('click', triggerRealtimeSync);

  // 위드지저스 데이터 다시 적용 버튼
  document.getElementById('btn-reload-jwj-data')?.addEventListener('click', () => {
    if (window.INITIAL_IMPORTED_DATA && window.INITIAL_IMPORTED_DATA.journals) {
      store.syncWithImportedData(true);
      if (window.INITIAL_IMPORTED_DATA.settings) {
        store.saveSettings(window.INITIAL_IMPORTED_DATA.settings);
      }
      loadJournalForDate(currentDateStr);
      stats.renderAllStats();
      renderSettings();
      const count = Object.keys(window.INITIAL_IMPORTED_DATA.journals).length;
      showToast(`✓ 위드지저스 공식 일기 ${count}편이 성공적으로 동기화되었습니다!`);
    } else {
      showToast('불러올 위드지저스 데이터가 없습니다. sync_jwj_diaries.py를 실행해주세요.');
    }
  });

  // --- 토스트 알림 함수 ---
  function showToast(msg) {
    const toast = document.getElementById('toast-notification');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-2');
    toast.classList.add('opacity-100', 'translate-y-0');

    setTimeout(() => {
      toast.classList.remove('opacity-100', 'translate-y-0');
      toast.classList.add('opacity-0', 'pointer-events-none', 'translate-y-2');
    }, 2800);
  }

  // --- 테마 관리 (밝게 / 어둡게 & 성경앱 100% 동기화) ---
  let currentTheme = localStorage.getItem('jesus_walk_theme') || 'LIGHT';

  function applyGlobalTheme(themeMode) {
    currentTheme = themeMode;
    const isDark = themeMode === 'DARK';
    document.body.classList.toggle('theme-dark', isDark);
    
    // 버튼 UI 갱신
    const iconEl = document.getElementById('theme-toggle-icon');
    const textEl = document.getElementById('theme-toggle-text');
    if (iconEl) iconEl.textContent = isDark ? '☀️' : '🌙';
    if (textEl) textEl.textContent = isDark ? '밝게' : '어둡게';

    localStorage.setItem('jesus_walk_theme', themeMode);

    // 성경앱 iframe에 동기화 전달
    syncThemeToBible(themeMode);
  }

  function toggleGlobalTheme() {
    const nextTheme = currentTheme === 'DARK' ? 'LIGHT' : 'DARK';
    applyGlobalTheme(nextTheme);
    showToast(nextTheme === 'DARK' ? '🌙 어두운 테마(다크 모드)가 적용되었습니다.' : '☀️ 밝은 테마(라이트 모드)가 적용되었습니다.');
  }

  function syncThemeToBible(themeMode) {
    const bibleIframe = document.getElementById('bible-iframe');
    if (bibleIframe && bibleIframe.contentWindow) {
      try {
        bibleIframe.contentWindow.postMessage({ type: 'SET_THEME', theme: themeMode }, '*');
        if (bibleIframe.contentDocument && bibleIframe.contentDocument.body) {
          bibleIframe.contentDocument.body.className = themeMode === 'DARK' ? 'theme-dark' : 'theme-light';
        }
      } catch (e) {}
    }
  }

  // 성경앱 내부에서 테마 변경 시 수신 리스너
  window.addEventListener('message', (e) => {
    if (e.data && e.data.type === 'THEME_CHANGED') {
      const isDark = !!e.data.isDark;
      const targetTheme = isDark ? 'DARK' : 'LIGHT';
      if (currentTheme !== targetTheme) {
        applyGlobalTheme(targetTheme);
      }
    }
  });

  document.getElementById('btn-theme-toggle')?.addEventListener('click', toggleGlobalTheme);

  // 성경 iframe 로드 완료 시 즉시 테마 및 글씨 크기 전달
  const bibleIframeEl = document.getElementById('bible-iframe');
  if (bibleIframeEl) {
    bibleIframeEl.addEventListener('load', () => {
      syncThemeToBible(currentTheme);
      syncFontSizeToBible(currentFontSize);
    });
  }

  // --- 화면 글씨 크기 조절 관리 ---
  const FONT_SIZES = {
    small: { name: '작게', percent: '90%', htmlClass: 'font-size-small', biblePercent: 90 },
    normal: { name: '보통', percent: '100%', htmlClass: 'font-size-normal', biblePercent: 100 },
    large: { name: '크게', percent: '115%', htmlClass: 'font-size-large', biblePercent: 115 },
    xlarge: { name: '아주 크게', percent: '130%', htmlClass: 'font-size-xlarge', biblePercent: 130 }
  };
  let currentFontSize = 'normal';
  try {
    currentFontSize = localStorage.getItem('jwj_font_size') || 'normal';
    if (!FONT_SIZES[currentFontSize]) currentFontSize = 'normal';
  } catch (e) {
    currentFontSize = 'normal';
  }

  function applyFontSize(sizeKey, showNotice = false) {
    if (!FONT_SIZES[sizeKey]) sizeKey = 'normal';
    currentFontSize = sizeKey;

    const htmlEl = document.documentElement;
    Object.keys(FONT_SIZES).forEach(k => {
      htmlEl.classList.remove(FONT_SIZES[k].htmlClass);
    });
    htmlEl.classList.add(FONT_SIZES[sizeKey].htmlClass);

    try {
      localStorage.setItem('jwj_font_size', sizeKey);
    } catch (e) {}

    const label = document.getElementById('font-size-label');
    if (label) {
      label.textContent = `${FONT_SIZES[sizeKey].name} (${FONT_SIZES[sizeKey].percent})`;
    }

    document.querySelectorAll('.font-size-btn').forEach(btn => {
      const isActive = (btn.dataset.fontSize === sizeKey);
      btn.classList.toggle('active', isActive);
    });

    syncFontSizeToBible(sizeKey);

    if (showNotice) {
      showToast(`글씨 크기가 '${FONT_SIZES[sizeKey].name}'(${FONT_SIZES[sizeKey].percent})로 변경되었습니다.`);
    }
  }

  function syncFontSizeToBible(sizeKey) {
    const bibleIframe = document.getElementById('bible-iframe');
    if (bibleIframe && bibleIframe.contentWindow) {
      try {
        bibleIframe.contentWindow.postMessage({
          type: 'SET_FONT_SIZE',
          size: sizeKey,
          percent: FONT_SIZES[sizeKey]?.biblePercent || 100
        }, '*');
      } catch (err) {}
    }
  }

  function initFontSize() {
    applyFontSize(currentFontSize, false);

    document.querySelectorAll('.font-size-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const size = btn.dataset.fontSize;
        if (size) applyFontSize(size, true);
      });
    });
  }

  // 헤더 검색 버튼 연동
  document.getElementById('btn-header-search')?.addEventListener('click', () => {
    switchTab('search');
  });

  // --- 예수동행일기 및 나눔 댓글 통합 검색 엔진 ---
  let searchDebounceTimer = null;
  let currentSearchScope = 'all';

  function initDiarySearch() {
    const searchInput = document.getElementById('diary-search-input');
    const clearBtn = document.getElementById('btn-diary-search-clear');
    const execBtn = document.getElementById('btn-diary-search-exec');
    const yearFilter = document.getElementById('diary-search-year-filter');
    const scopeChips = document.querySelectorAll('#search-scope-filters .scope-chip');
    const quickTags = document.querySelectorAll('.quick-search-tag');

    if (searchInput) {
      searchInput.addEventListener('input', () => {
        const val = searchInput.value;
        if (clearBtn) clearBtn.classList.toggle('hidden', !val);
        clearTimeout(searchDebounceTimer);
        searchDebounceTimer = setTimeout(() => {
          executeDiarySearch();
        }, 250);
      });

      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          executeDiarySearch();
        }
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (searchInput) {
          searchInput.value = '';
          searchInput.focus();
        }
        clearBtn.classList.add('hidden');
        executeDiarySearch();
      });
    }

    if (execBtn) {
      execBtn.addEventListener('click', executeDiarySearch);
    }

    if (yearFilter) {
      yearFilter.addEventListener('change', executeDiarySearch);
    }

    scopeChips.forEach(chip => {
      chip.addEventListener('click', () => {
        scopeChips.forEach(c => {
          c.classList.remove('active', 'border-[#375a43]', 'bg-[#375a43]', 'text-white');
          c.classList.add('border-gray-200', 'bg-white', 'text-gray-600');
        });
        chip.classList.add('active', 'border-[#375a43]', 'bg-[#375a43]', 'text-white');
        chip.classList.remove('border-gray-200', 'bg-white', 'text-gray-600');
        currentSearchScope = chip.dataset.scope || 'all';
        executeDiarySearch();
      });
    });

    quickTags.forEach(tag => {
      tag.addEventListener('click', () => {
        if (searchInput) {
          searchInput.value = tag.textContent.trim();
          if (clearBtn) clearBtn.classList.remove('hidden');
          executeDiarySearch();
        }
      });
    });
  }

  function executeDiarySearch() {
    const searchInput = document.getElementById('diary-search-input');
    const yearFilter = document.getElementById('diary-search-year-filter');
    const metaContainer = document.getElementById('diary-search-meta');
    const listContainer = document.getElementById('diary-search-results-list');
    const totalBadge = document.getElementById('search-total-count-badge');

    if (!listContainer) return;

    const query = searchInput ? searchInput.value.trim() : '';
    const year = yearFilter ? yearFilter.value : 'all';

    const results = store.searchJournals(query, {
      scope: currentSearchScope,
      year: year
    });

    const totalJournals = Object.keys(store.journals).length;
    let totalComments = 0;
    Object.values(store.journals).forEach(j => {
      totalComments += (j.comments || []).length;
    });

    if (totalBadge) {
      totalBadge.textContent = `${totalJournals}편 일기 · ${totalComments}개 댓글`;
    }

    if (metaContainer) {
      if (query) {
        metaContainer.innerHTML = `
          <span>검색어: <strong class="text-emerald-800">"${escapeHtml(query)}"</strong> (총 <strong>${results.length}</strong>건 발견)</span>
          <span>범위: ${getScopeLabel(currentSearchScope)} · ${year === 'all' ? '전체 기간' : year + '년'}</span>
        `;
      } else {
        metaContainer.innerHTML = `
          <span>전체 일기 목록 (총 <strong>${results.length}</strong>편)</span>
          <span>최신순 정렬</span>
        `;
      }
    }

    if (results.length === 0) {
      listContainer.innerHTML = `
        <div class="app-card p-8 text-center bg-white border border-gray-100 rounded-xl space-y-3">
          <span class="text-4xl block">🔍</span>
          <h4 class="text-base font-bold text-gray-700">검색 결과가 없습니다</h4>
          <p class="text-xs text-gray-500">다른 키워드로 검색하시거나 상단의 추천 키워드를 클릭해 보세요.</p>
        </div>
      `;
      return;
    }

    listContainer.innerHTML = '';
    const maxRender = Math.min(results.length, 100);

    for (let i = 0; i < maxRender; i++) {
      const item = results[i];
      const j = item.journal;
      const f = j.faith || {};
      const card = document.createElement('div');
      card.className = 'diary-search-card app-card p-4 sm:p-5 bg-white border border-gray-100 rounded-2xl hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer space-y-3';

      const commentsCount = (j.comments || []).length;
      const dateFormatted = formatDisplayDate(j.date);

      // 매칭된 스니펫 영역 생성
      let matchSnippetsHtml = '';
      if (item.matches && item.matches.length > 0) {
        matchSnippetsHtml = `
          <div class="mt-2.5 pt-2.5 border-t border-gray-100 space-y-1.5 text-xs">
            ${item.matches.slice(0, 3).map(m => {
              const snippet = extractSnippet(m.text, query);
              const highlighted = highlightSearchKeyword(snippet, query);
              return `
                <div class="flex items-start gap-1.5 text-gray-700 leading-relaxed">
                  <span class="shrink-0 px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold text-[10px] border border-emerald-200">${escapeHtml(m.label)}</span>
                  <div class="flex-1">${highlighted}</div>
                </div>
              `;
            }).join('')}
            ${item.matches.length > 3 ? `<p class="text-[10px] text-gray-400">+ 외 ${item.matches.length - 3}개 매칭 내용 더보기</p>` : ''}
          </div>
        `;
      } else {
        const summaryText = j.guide17?.freeContent || j.core5?.fq3 || j.core5?.fq1 || '동행일기 기록';
        matchSnippetsHtml = `
          <p class="text-xs text-gray-600 line-clamp-2 leading-relaxed">
            ${escapeHtml(summaryText)}
          </p>
        `;
      }

      card.innerHTML = `
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">${dateFormatted}</span>
            <h4 class="text-sm sm:text-base font-bold text-gray-900">${highlightSearchKeyword(j.title || '나의 일기', query)}</h4>
            ${commentsCount > 0 ? `<span class="text-xs font-semibold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-full flex items-center gap-0.5">💬 ${commentsCount}</span>` : ''}
          </div>
          <div class="flex items-center gap-2 text-xs text-gray-500">
            <span class="px-2 py-0.5 bg-gray-50 rounded text-gray-600">${escapeHtml((j.visibility && j.visibility[0]) || 'Login 온라인')}</span>
          </div>
        </div>

        ${matchSnippetsHtml}

        <div class="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs text-gray-500 border-t border-gray-50">
          <div class="flex items-center gap-3">
            <span>바라보기 <strong class="text-emerald-700 font-bold">${f.lookJesusPercent || 0}%</strong></span>
            <span>순종 <strong class="text-amber-700 font-bold">${f.obeyPercent || 0}%</strong></span>
            <span>말씀 <strong>${f.bibleChapters || 0}장</strong></span>
            <span>기도 <strong>${f.prayerMinutes || 0}분</strong></span>
          </div>
          <span class="text-emerald-700 font-semibold flex items-center gap-1 hover:underline">
            <span>👉 일기 본문 열람하기</span>
          </span>
        </div>
      `;

      card.addEventListener('click', () => {
        openJournalFromSearch(j.date);
      });

      listContainer.appendChild(card);
    }
  }

  function getScopeLabel(scope) {
    switch (scope) {
      case 'content': return '일기 본문/제목';
      case 'comments': return '💬 나눔 댓글';
      case 'gratitude': return '🙏 감사제목';
      case 'meditation': return '🕊️ 5대 묵상/점검';
      default: return '전체';
    }
  }

  function highlightSearchKeyword(text, query) {
    if (!text || !query) return escapeHtml(text);
    const escapedText = escapeHtml(text);
    const escapedQuery = escapeHtml(query).replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`(${escapedQuery})`, 'gi');
    return escapedText.replace(regex, '<mark class="bg-amber-200 text-amber-900 font-bold px-1 py-0.5 rounded">$1</mark>');
  }

  function extractSnippet(text, query, maxLength = 140) {
    if (!text) return '';
    if (!query) return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
    
    const start = Math.max(0, idx - 30);
    const end = Math.min(text.length, idx + query.length + 80);
    let snippet = text.slice(start, end);
    if (start > 0) snippet = '...' + snippet;
    if (end < text.length) snippet = snippet + '...';
    return snippet;
  }

  function formatDisplayDate(dateStr) {
    if (!dateStr) return '';
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const d = new Date(dateStr);
    const dayName = isNaN(d.getDay()) ? '' : ` (${days[d.getDay()]})`;
    return `${dateStr}${dayName}`;
  }

  function openJournalFromSearch(dateStr) {
    loadJournalForDate(dateStr);
    switchTab('write');
    switchGuideSubtab('preview');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`📖 ${dateStr} 일기를 불러왔습니다.`);
  }

  // 검색, 글씨 크기 초기화 및 테마 초기 적용
  initDiarySearch();
  initFontSize();
  applyGlobalTheme(currentTheme);

  // 초기 실행: 오늘 일기가 작성되어 있으면 오늘 일기 로드, 없으면 가장 최근 작성된 일기 로드
  const allList = store.getAllJournalsList();
  const todayJournal = store.journals[currentDateStr];
  if ((!todayJournal || !todayJournal.title || todayJournal.title === '나의 일기') && allList.length > 0) {
    currentDateStr = allList[0].date;
    loadJournalForDate(currentDateStr);
    switchGuideSubtab('preview');
  } else {
    loadJournalForDate(currentDateStr);
  }
});
