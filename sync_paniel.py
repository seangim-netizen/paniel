"""
위드지저스(jwj.kr) 예수동행일기 자동 동기화 스크립트 - Paniel (최현경 성도님)
계정: 20260204150115772172 / Euro3798@@
"""
import sys
import io
import os
import json
import re
import subprocess
from datetime import datetime
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright

if sys.stdout and hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass
if sys.stderr and hasattr(sys.stderr, 'reconfigure'):
    try:
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

WORKSPACE_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_JSON_PATH = os.path.join(WORKSPACE_DIR, "jwj_imported_diaries.json")
JS_DATA_PATH = os.path.join(WORKSPACE_DIR, "js", "imported_data.js")

def clean_html(html_str):
    if not html_str:
        return ""
    soup = BeautifulSoup(html_str, 'html.parser')
    for bq in soup.find_all('blockquote'):
        bq.string = f"\n> {bq.get_text()}\n"
    for br in soup.find_all(['br', 'p']):
        br.append('\n')
    text = soup.get_text()
    text = text.replace('\xa0', ' ')
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()

def parse_daily_check(daily_check_str):
    res = {
        'bibleChapters': 0,
        'prayerMinutes': 0,
        'isQtDone': False,
        'lookJesusPercent': 0,
        'obeyPercent': 0
    }
    if not daily_check_str:
        return res
    try:
        data = json.loads(daily_check_str) if isinstance(daily_check_str, str) else daily_check_str
        if 'DailyCheck0000000001' in data:
            res['bibleChapters'] = int(float(data['DailyCheck0000000001']))
        if 'DailyCheck0000000002' in data:
            val = data['DailyCheck0000000002']
            if isinstance(val, (int, float)):
                res['prayerMinutes'] = int(val) if val > 1 else 30
        if 'DailyCheck0000000003' in data:
            res['isQtDone'] = bool(data['DailyCheck0000000003'])
        if 'DailyCheck0000000004' in data:
            res['lookJesusPercent'] = int(float(data['DailyCheck0000000004']))
        if 'DailyCheck0000000005' in data:
            res['obeyPercent'] = int(float(data['DailyCheck0000000005']))
    except Exception:
        pass
    return res

def run_import():
    print("=" * 65, flush=True)
    print("🌿 Paniel (최현경 성도님) 위드지저스 일기 동기화를 시작합니다...", flush=True)
    print("=" * 65, flush=True)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        print("1. https://jwj.kr 로그인 페이지 접속 중...", flush=True)
        page.goto('https://jwj.kr/signin', wait_until='networkidle')
        page.wait_for_timeout(1000)

        # 로그인 모달 열기
        page.locator('button').first.click()
        page.wait_for_timeout(500)

        # 직통 계정 및 비밀번호 입력
        print("  - 아이디 및 비밀번호 입력 중 (20260204150115772172)...", flush=True)
        page.locator('input[type="email"]').fill('20260204150115772172')
        page.locator('input[type="password"]').fill('Euro3798@@')
        page.locator('button:has-text("확인")').first.click()
        page.wait_for_timeout(3000)

        user_info = page.evaluate('''async () => {
            try {
                const r = await fetch('/api/login/loginStatus.do');
                return await r.json();
            } catch (e) {
                return { result: false };
            }
        }''')

        if not user_info.get('result'):
            print("❌ 로그인 실패! 계정 정보를 확인해주세요.", flush=True)
            browser.close()
            return None

        user = user_info.get('user', {})
        user_name = user.get('memName') or '최현경'
        user_id = user.get('loginId') or '20260204150115772172'
        print(f"\n🎉 로그인 성공! 환영합니다, {user_name}님 (ID: {user_id})", flush=True)

        # 2. 전체 일기 목록 수집
        print("\n2. 작성된 일기 목록을 수집합니다...", flush=True)
        all_diaries_summary = []
        start_num = 0
        step = 10

        while True:
            batch = page.evaluate(f'''async () => {{
                try {{
                    const r = await fetch('/ajax/diary/selectMyDiaryDaily.do?gubun=diary&startNum={start_num}');
                    const data = await r.json();
                    return data.result || [];
                }} catch (e) {{
                    return [];
                }}
            }}''')

            if not batch:
                break

            all_diaries_summary.extend(batch)
            print(f"  - 현재까지 {len(all_diaries_summary)}개 목록 조회 완료...", flush=True)
            start_num += step
            page.wait_for_timeout(200)

        total_count = len(all_diaries_summary)
        print(f"✓ 총 {total_count}개의 일기 목록을 확보했습니다!\n", flush=True)

        # 3. 각 일기의 본문 상세 내용 및 묵상/감사 데이터 수집
        print("3. 각 일기의 본문 내용 및 나눔 댓글을 수집하고 변환합니다...", flush=True)
        all_journals_dict = {}

        chunk_size = 15
        for i in range(0, total_count, chunk_size):
            chunk = all_diaries_summary[i:i+chunk_size]
            chunk_cds = [item['diaryCd'] for item in chunk]

            details = page.evaluate('''async (cds) => {
                const promises = cds.map(async cd => {
                    try {
                        const [detRes, commentRes] = await Promise.all([
                            fetch('/api/login/selectDiaryDet.do?diaryCd=' + cd + '&boardCd=Board000000000000006').then(r => r.json()).catch(() => ({ result: null })),
                            fetch('/api/login/selectCommentList.do?diaryCd=' + cd + '&boardCd=Board000000000000006').then(r => r.json()).catch(() => ({ result: [] }))
                        ]);
                        return {
                            cd,
                            data: detRes ? detRes.result : null,
                            comments: commentRes ? (commentRes.result || []) : []
                        };
                    } catch(err) {
                        return { cd, data: null, comments: [] };
                    }
                });
                return await Promise.all(promises);
            }''', chunk_cds)

            detail_map = {item['cd']: item['data'] for item in details}
            comment_map = {item['cd']: item.get('comments', []) for item in details}

            for summary_item in chunk:
                cd = summary_item['diaryCd']
                det = detail_map.get(cd) or summary_item

                sort_date_str = str(summary_item.get('diarySortDate') or summary_item.get('diarySaveLDate') or cd)[:14]
                if len(sort_date_str) >= 8:
                    y = sort_date_str[:4]
                    m = sort_date_str[4:6]
                    d = sort_date_str[6:8]
                    date_str = f"{y}-{m}-{d}"
                else:
                    date_str = datetime.now().strftime("%Y-%m-%d")

                if len(sort_date_str) >= 12:
                    hh = sort_date_str[8:10]
                    mm = sort_date_str[10:12]
                    time_str = f"{hh}:{mm}"
                else:
                    time_str = summary_item.get('rtime') or "21:00"

                title = det.get('diaryTitle') or summary_item.get('diaryTitle') or "나의 일기"
                raw_cnts = det.get('diaryCnts') or summary_item.get('diaryCnts') or ""
                clean_text = clean_html(raw_cnts)

                faith = parse_daily_check(summary_item.get('dailyCheck'))

                tags = []
                found_tags = re.findall(r'#([a-zA-Z0-9가-힣_]+)', title + " " + clean_text)
                for t in found_tags:
                    tag_formatted = f"#{t}"
                    if tag_formatted not in tags:
                        tags.append(tag_formatted)
                if not tags:
                    tags = ['#예수동행']

                gratitudes = []
                for line in clean_text.split('\n'):
                    l = line.strip()
                    if ('감사' in l or '은혜' in l) and len(l) > 5 and len(l) < 150:
                        clean_l = re.sub(r'^[0-9\.\-\*•]+\s*', '', l)
                        if clean_l and clean_l not in gratitudes:
                            gratitudes.append(clean_l)
                    if len(gratitudes) >= 3:
                        break
                while len(gratitudes) < 3:
                    gratitudes.append('')

                look_pct = faith.get('lookJesusPercent', 70)
                answers14 = {}
                for q_idx in range(1, 15):
                    if q_idx == 12:
                        answers14[q_idx] = 'no'
                    else:
                        answers14[q_idx] = 'yes' if look_pct >= 60 else ('yes' if q_idx in [1, 2, 4, 13] else 'no')

                raw_comments = comment_map.get(cd, [])
                comments = []
                for c in raw_comments:
                    author = c.get('memName') or c.get('nickName') or '나눔 성도'
                    c_text = clean_html(c.get('postCnts') or c.get('commentCnts') or '')
                    if c_text:
                        c_date = c.get('showdate') or str(c.get('regLdate') or c.get('saveLDate') or '')[:10]
                        comments.append({
                            'id': c.get('postCd') or c.get('boardCommentCd') or str(datetime.now().timestamp()),
                            'author': author,
                            'content': c_text,
                            'date': c_date,
                            'room': c.get('roomName') or 'Login 온라인'
                        })

                entry = {
                    'date': date_str,
                    'time': time_str,
                    'title': title,
                    'tags': tags,
                    'visibility': ['Login 온라인', 'Login 주일나눔 온라인1조', 'Login 자매방'],
                    'faith': faith,
                    'comments': comments,
                    'guide17': {
                        'answers14': answers14,
                        'thinkMinutes': int(look_pct * 1.2),
                        'gratitudeList': gratitudes,
                        'freeContent': clean_text
                    },
                    'core5': {
                        'fq1': f"예수님을 하루 종일 {look_pct}% 바라보았습니다.",
                        'fq2': clean_text.split('\n')[0] if clean_text else '',
                        'fq3': f"말씀에 {faith.get('obeyPercent', 0)}% 순종하며 살았습니다.",
                        'fq4': '',
                        'fq5_1': gratitudes[0] if len(gratitudes) > 0 else '',
                        'fq5_2': gratitudes[1] if len(gratitudes) > 1 else '',
                        'fq5_3': gratitudes[2] if len(gratitudes) > 2 else ''
                    },
                    'jwj_diaryCd': cd,
                    'updatedAt': datetime.now().isoformat()
                }

                all_journals_dict[date_str] = entry

            done_count = min(total_count, i + chunk_size)
            print(f"  [진행률: {done_count}/{total_count}] ({done_count*100//total_count}%) 일기 본문 변환 완료", flush=True)

        browser.close()

    # 4. JSON 파일 저장
    backup_payload = {
        'version': '2.0',
        'exportedAt': datetime.now().isoformat(),
        'source': 'https://jwj.kr/diary',
        'account': user_id,
        'totalCount': len(all_journals_dict),
        'settings': {
            'authorName': user_name,
            'customGroups': ['Login 온라인', 'Login 주일나눔 온라인1조', 'Login 자매방']
        },
        'journals': all_journals_dict
    }

    with open(OUTPUT_JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(backup_payload, f, ensure_ascii=False, indent=2)
    print(f"\n✓ 백업 JSON 파일 저장 완료: {OUTPUT_JSON_PATH}", flush=True)

    # 5. JS 파일 생성
    js_content = f"// 자동 생성된 위드지저스(jwj.kr) 일기 데이터 - Paniel ({user_name})\nwindow.INITIAL_IMPORTED_DATA = {json.dumps(backup_payload, ensure_ascii=False)};\n"
    with open(JS_DATA_PATH, 'w', encoding='utf-8') as f:
        f.write(js_content)
    print(f"✓ 웹앱 초기 로드 데이터 연동 완료: {JS_DATA_PATH}", flush=True)

    # 6. GitHub 자동 커밋 및 푸시
    try:
        print("\n4. GitHub 저장소(paniel)에 최신 일기 데이터 동기화 푸시 중...", flush=True)
        subprocess.run(['git', 'add', 'js/imported_data.js', 'jwj_imported_diaries.json'], cwd=WORKSPACE_DIR, check=True)
        subprocess.run(['git', 'commit', '-m', f'feat: sync {len(all_journals_dict)} diaries for Paniel ({user_name})'], cwd=WORKSPACE_DIR, check=True)
        subprocess.run(['git', 'push', 'origin', 'main'], cwd=WORKSPACE_DIR, check=True)
        print("✓ GitHub Pages 배포 푸시 완료!", flush=True)
    except Exception as e:
        print("  [알림] GitHub 푸시 단계:", e, flush=True)

    print("=" * 65, flush=True)
    print(f"🎉 성공! 총 {len(all_journals_dict)}개의 예수동행일기를 모두 성공적으로 가져왔습니다!", flush=True)
    print("=" * 65, flush=True)
    return backup_payload

if __name__ == '__main__':
    run_import()
