// Charts: 예수동행 통계 및 시각화 분석 엔진 (Chart.js 연동)

class JournalStats {
  constructor(store) {
    this.store = store;
    this.trendChart = null;
    this.situationChart = null;
    this.readingPrayerChart = null;
  }

  // 통계 화면 전체 갱신
  renderAllStats() {
    this.renderSummaryCards();
    this.renderTrendChart();
    this.renderSituationChart();
    this.renderReadingPrayerChart();
    this.renderSpiritualInsight();
  }

  // 상단 요약 카드 데이터 계산 및 렌더링
  renderSummaryCards() {
    const list = this.store.getAllJournalsList();
    const streak = this.store.calculateStreak();
    
    // 이번 달 기준 필터
    const now = new Date();
    const currentYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const thisMonthEntries = list.filter(e => e.date.startsWith(currentYearMonth));

    let totalLook = 0;
    let totalObey = 0;
    let totalBible = 0;
    let totalPrayer = 0;
    let qtCount = 0;

    const targetList = thisMonthEntries.length > 0 ? thisMonthEntries : list;
    const count = targetList.length;

    if (count > 0) {
      targetList.forEach(item => {
        totalLook += Number(item.faith?.lookJesusPercent || 0);
        totalObey += Number(item.faith?.obeyPercent || 0);
        totalBible += Number(item.faith?.bibleChapters || 0);
        totalPrayer += Number(item.faith?.prayerMinutes || 0);
        if (item.faith?.isQtDone) qtCount++;
      });
    }

    const avgLook = count > 0 ? Math.round(totalLook / count) : 0;
    const avgObey = count > 0 ? Math.round(totalObey / count) : 0;

    // DOM 업데이트
    const elStreak = document.getElementById('stat-streak');
    const elAvgLook = document.getElementById('stat-avg-look');
    const elAvgObey = document.getElementById('stat-avg-obey');
    const elTotalBible = document.getElementById('stat-total-bible');
    const elTotalPrayer = document.getElementById('stat-total-prayer');
    const elQtRate = document.getElementById('stat-qt-count');

    if (elStreak) elStreak.textContent = `${streak}일`;
    if (elAvgLook) elAvgLook.textContent = `${avgLook}%`;
    if (elAvgObey) elAvgObey.textContent = `${avgObey}%`;
    if (elTotalBible) elTotalBible.textContent = `${totalBible}장`;
    if (elTotalPrayer) {
      const h = Math.floor(totalPrayer / 60);
      const m = totalPrayer % 60;
      elTotalPrayer.textContent = h > 0 ? `${h}시간 ${m}분` : `${m}분`;
    }
    if (elQtRate) elQtRate.textContent = `${qtCount}회 / ${count}일`;
  }

  // 1. 예수님 바라보기 & 순종하기 추이 차트 (최근 14일)
  renderTrendChart() {
    const ctx = document.getElementById('chart-trend')?.getContext('2d');
    if (!ctx) return;

    const list = this.store.getAllJournalsList().slice(0, 14).reverse();
    const labels = list.map(e => {
      const parts = e.date.split('-');
      return `${parseInt(parts[1])}/${parseInt(parts[2])}`;
    });
    const lookData = list.map(e => e.faith?.lookJesusPercent || 0);
    const obeyData = list.map(e => e.faith?.obeyPercent || 0);

    if (this.trendChart) {
      this.trendChart.destroy();
    }

    this.trendChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: '예수님 바라보기 (%)',
            data: lookData,
            borderColor: '#375a43',
            backgroundColor: 'rgba(55, 90, 67, 0.1)',
            tension: 0.35,
            fill: true,
            pointBackgroundColor: '#375a43',
            pointRadius: 4
          },
          {
            label: '순종하기 (%)',
            data: obeyData,
            borderColor: '#c4824d',
            backgroundColor: 'transparent',
            borderDash: [4, 4],
            tension: 0.35,
            fill: false,
            pointBackgroundColor: '#c4824d',
            pointRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            min: 0,
            max: 100,
            ticks: {
              callback: value => `${value}%`
            },
            grid: { color: 'rgba(0,0,0,0.04)' }
          },
          x: {
            grid: { display: false }
          }
        },
        plugins: {
          legend: {
            position: 'top',
            labels: { font: { family: 'Pretendard', size: 12 } }
          },
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.dataset.label}: ${ctx.raw}%`
            }
          }
        }
      }
    });
  }

  // 2. 일상 속 주님 생각 상황별 체크 분석 (14개 점검 문항)
  renderSituationChart() {
    const ctx = document.getElementById('chart-situation')?.getContext('2d');
    if (!ctx) return;

    const list = this.store.getAllJournalsList();
    const shortLabels = [
      '1. 아침 기상',
      '2. 식사 때',
      '3. 일 시작 전',
      '4. 말씀 묵상',
      '5. 묵상 순종',
      '6. 주님께 질문',
      '7. 이름 부름',
      '8. 사람 만날 때',
      '9. 일할 때',
      '10. 가정/집에서',
      '11. 이동 중',
      '12. 싫은일 절제',
      '13. 기뻐할 일',
      '14. 말씀 순종'
    ];

    const yesRates = [];
    for (let qId = 1; qId <= 14; qId++) {
      let count = 0;
      let yes = 0;
      list.forEach(item => {
        const val = item.guide17?.answers14?.[qId];
        if (val) {
          count++;
          if (qId === 12) {
            // 12번: 싫어할 행동 피함 (아니오가 긍정)
            if (val === 'no') yes++;
          } else {
            if (val === 'yes') yes++;
          }
        }
      });
      const rate = count > 0 ? Math.round((yes / count) * 100) : 0;
      yesRates.push(rate);
    }

    if (this.situationChart) {
      this.situationChart.destroy();
    }

    this.situationChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: shortLabels,
        datasets: [{
          label: '주님 동행 비율 (%)',
          data: yesRates,
          backgroundColor: yesRates.map(v => v >= 70 ? '#406d4a' : v >= 40 ? '#7aa080' : '#d4a373'),
          borderRadius: 6
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            min: 0,
            max: 100,
            ticks: { callback: v => `${v}%` },
            grid: { color: 'rgba(0,0,0,0.04)' }
          },
          y: {
            grid: { display: false },
            ticks: { font: { family: 'Pretendard', size: 11 } }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => `동행 성공률: ${ctx.raw}%`
            }
          }
        }
      }
    });
  }

  // 3. 말씀 통독 및 기도 시간 차트
  renderReadingPrayerChart() {
    const ctx = document.getElementById('chart-reading-prayer')?.getContext('2d');
    if (!ctx) return;

    const list = this.store.getAllJournalsList().slice(0, 7).reverse();
    const labels = list.map(e => {
      const parts = e.date.split('-');
      return `${parseInt(parts[1])}/${parseInt(parts[2])}`;
    });
    const bibleData = list.map(e => e.faith?.bibleChapters || 0);
    const prayerData = list.map(e => e.faith?.prayerMinutes || 0);

    if (this.readingPrayerChart) {
      this.readingPrayerChart.destroy();
    }

    this.readingPrayerChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            type: 'bar',
            label: '말씀 읽기 (장)',
            data: bibleData,
            backgroundColor: '#375a43',
            yAxisID: 'y',
            borderRadius: 6
          },
          {
            type: 'line',
            label: '기도 시간 (분)',
            data: prayerData,
            borderColor: '#c4824d',
            backgroundColor: 'rgba(196, 130, 77, 0.1)',
            tension: 0.3,
            fill: true,
            yAxisID: 'y1',
            pointRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            type: 'linear',
            position: 'left',
            title: { display: true, text: '말씀(장)', font: { size: 11 } },
            min: 0,
            grid: { color: 'rgba(0,0,0,0.04)' }
          },
          y1: {
            type: 'linear',
            position: 'right',
            title: { display: true, text: '기도(분)', font: { size: 11 } },
            min: 0,
            grid: { display: false }
          },
          x: {
            grid: { display: false }
          }
        },
        plugins: {
          legend: {
            position: 'top',
            labels: { font: { family: 'Pretendard', size: 11 } }
          }
        }
      }
    });
  }

  // 4. 영적 동행 분석 인사이트 메시지 도출
  renderSpiritualInsight() {
    const insightBox = document.getElementById('stat-insight-text');
    if (!insightBox) return;

    const list = this.store.getAllJournalsList();
    if (list.length === 0) {
      insightBox.textContent = '일기를 작성하시면 주님과의 동행 패턴을 분석하여 맞춤 인사이트를 드립니다.';
      return;
    }

    const shortLabels = [
      '아침 기상할 때',
      '식사할 때',
      '일 시작하기 전',
      '말씀 묵상',
      '묵상 순종',
      '예수님께 물어보기',
      '이름 부르기',
      '사람을 만날 때',
      '일할 때',
      '집에 있을 때',
      '이동할 때(차/지하철)',
      '싫어할 행동 피하기',
      '기뻐할 행동하기',
      '말씀 순종'
    ];

    let scores = [];
    for (let qId = 1; qId <= 14; qId++) {
      let count = 0;
      let yes = 0;
      list.forEach(item => {
        const val = item.guide17?.answers14?.[qId];
        if (val) {
          count++;
          if (qId === 12) {
            if (val === 'no') yes++;
          } else {
            if (val === 'yes') yes++;
          }
        }
      });
      const rate = count > 0 ? (yes / count) * 100 : 0;
      scores.push({ id: qId, label: shortLabels[qId - 1], rate: Math.round(rate), count });
    }

    scores.sort((a, b) => b.rate - a.rate);
    const best = scores[0];
    const worst = [...scores].reverse().find(s => s.count > 0) || scores[scores.length - 1];

    let message = `🌱 **가장 주님과 친밀한 순간**: **${best.label}** (${best.rate}%)\n`;
    message += `💡 **조금 더 주님을 기억하면 좋은 순간**: **${worst.label}** (${worst.rate}%)\n\n`;
    message += `"${worst.label} 때 주님의 이름을 가만히 세 번 불러보세요. 순간순간 주님을 바라보는 눈이 열립니다."`;

    insightBox.innerHTML = message.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong class="text-emerald-800">$1</strong>');
  }
}

window.JournalStats = JournalStats;
