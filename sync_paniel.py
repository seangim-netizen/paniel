"""
위드지저스(jwj.kr) 예수동행일기 초고속 실시간 동기화 스크립트 - Paniel (최현경 성도님)
계정: 20260204150115772172 / Euro3798@@
Pure HTTP + 멀티스레드 병렬 처리로 1초 내외 실시간 동기화 지원
"""
import sys
import os
import json
import re
import time
import subprocess
import urllib.request
import http.cookiejar
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor
from bs4 import BeautifulSoup

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

USER_ID = "20260204150115772172"
USER_PW = "Euro3798@@"
DEFAULT_AUTHOR = "최현경"
DEFAULT_GROUPS = ['Login 온라인', 'Login 주일나눔 온라인1조', 'Login 자매방']


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


def create_authenticated_opener(user_id=USER_ID, user_pw=USER_PW):
    cj = http.cookiejar.CookieJar()
    opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))
    opener.addheaders = [
        ('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
        ('Referer', 'https://jwj.kr/signin/')
    ]

    with opener.open('https://jwj.kr/api/csrf/token.do', timeout=10) as r:
        r.read()
    token = next((c.value for c in cj if 'XSRF' in c.name.upper() or 'CSRF' in c.name.upper()), '')

    boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW'
    fields = {
        'loginId': user_id,
        'loginPwd': user_pw,
        'autoLoginYn': 'N',
        'lang': 'COMMONCD001000000001',
        'snsCode': '',
        'redirectUrl': ''
    }
    body = '\r\n'.join(
        [f'--{boundary}\r\nContent-Disposition: form-data; name="{k}"\r\n\r\n{v}' for k, v in fields.items()]
        + [f'--{boundary}--\r\n']
    ).encode('utf-8')

    req = urllib.request.Request(
        'https://jwj.kr/api/login/loginProc.do',
        data=body,
        headers={
            'Content-Type': f'multipart/form-data; boundary={boundary}',
            'X-XSRF-TOKEN': token
        },
        method='POST'
    )
    with opener.open(req, timeout=10) as r:
        login_res = json.loads(r.read().decode('utf-8'))

    if login_res.get('result') != 'success' and login_res.get('result') is not True:
        raise RuntimeError(f"로그인 실패: {login_res}")

    cookie_header = '; '.join([f"{c.name}={c.value}" for c in cj])
    return opener, cookie_header


def fetch_json_with_cookie(url, cookie_header):
    req = urllib.request.Request(
        url,
        headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Referer': 'https://jwj.kr/diary',
            'Cookie': cookie_header
        }
    )
    with urllib.request.urlopen(req, timeout=10) as r:
        return json.loads(r.read().decode('utf-8'))


def build_entry_from_raw(summary_item, det, raw_comments, default_groups=DEFAULT_GROUPS):
    cd = summary_item['diaryCd']
    det = det or summary_item

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
        if ('감사' in l or '은혜' in l) and 5 < len(l) < 150:
            clean_l = re.sub(r'^[0-9\.\-\*•]+\s*', '', l)
            if clean_l and clean_l not in gratitudes:
                gratitudes.append(clean_l)
        if len(gratitudes) >= 3:
            break
    while len(gratitudes) < 3:
        gratitudes.append('')

    answers14 = {}
    look_pct = faith.get('lookJesusPercent', 50)
    for q_idx in range(1, 15):
        if q_idx == 12:
            answers14[q_idx] = 'no'
        else:
            answers14[q_idx] = 'yes' if look_pct >= 60 else ('yes' if q_idx in [1, 2, 4, 13] else 'no')

    comments = []
    for c in (raw_comments or []):
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
        'visibility': list(default_groups),
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
    return date_str, entry, clean_text


def run_import(full_sync=False, push_git=True):
    t_start = time.time()
    print("=" * 65, flush=True)
    print(f"🌿 Paniel ({DEFAULT_AUTHOR} 성도님) 위드지저스 실시간 동기화 시작...", flush=True)
    print("=" * 65, flush=True)

    existing_journals = {}
    existing_cds = set()
    if not full_sync and os.path.exists(OUTPUT_JSON_PATH):
        try:
            with open(OUTPUT_JSON_PATH, 'r', encoding='utf-8') as f:
                prev_data = json.load(f)
                existing_journals = prev_data.get('journals', {})
                for j in existing_journals.values():
                    if j.get('jwj_diaryCd'):
                        existing_cds.add(j['jwj_diaryCd'])
        except Exception:
            existing_journals = {}

    opener, cookie_header = create_authenticated_opener(USER_ID, USER_PW)
    print(f"✓ 로그인 완료 ({time.time() - t_start:.2f}s)", flush=True)

    summaries_to_fetch = []
    start_num = 0
    step = 10

    while True:
        url = f"https://jwj.kr/ajax/diary/selectMyDiaryDaily.do?gubun=diary&startNum={start_num}"
        batch = fetch_json_with_cookie(url, cookie_header).get('result', [])
        if not batch:
            break
        summaries_to_fetch.extend(batch)
        start_num += step

        if not full_sync and existing_cds:
            if start_num >= 20 and all(item.get('diaryCd') in existing_cds for item in batch):
                break

    print(f"✓ 동기화 대상 일기 {len(summaries_to_fetch)}개 확인 ({time.time() - t_start:.2f}s)", flush=True)

    def fetch_one_detail(summary_item):
        cd = summary_item['diaryCd']
        det_url = f"https://jwj.kr/api/login/selectDiaryDet.do?diaryCd={cd}&boardCd=Board000000000000006"
        com_url = f"https://jwj.kr/api/login/selectCommentList.do?diaryCd={cd}&boardCd=Board000000000000006"
        try:
            det_res = fetch_json_with_cookie(det_url, cookie_header).get('result')
        except Exception:
            det_res = None
        try:
            com_res = fetch_json_with_cookie(com_url, cookie_header).get('result', [])
        except Exception:
            com_res = []
        return summary_item, det_res, com_res

    all_journals_dict = dict(existing_journals)

    with ThreadPoolExecutor(max_workers=10) as executor:
        results = list(executor.map(fetch_one_detail, summaries_to_fetch))

    for summary_item, det_res, com_res in reversed(results):
        date_str, entry, clean_text = build_entry_from_raw(summary_item, det_res, com_res, DEFAULT_GROUPS)
        prev = all_journals_dict.get(date_str)
        if prev:
            prev_text = (prev.get('guide17', {}).get('freeContent') or '').strip()
            if prev_text and not clean_text.strip():
                if entry.get('comments'):
                    prev['comments'] = entry['comments']
                continue
        all_journals_dict[date_str] = entry

    backup_payload = {
        'version': '2.0',
        'exportedAt': datetime.now().isoformat(),
        'source': 'https://jwj.kr/diary',
        'account': USER_ID,
        'totalCount': len(all_journals_dict),
        'settings': {
            'authorName': DEFAULT_AUTHOR,
            'customGroups': DEFAULT_GROUPS
        },
        'journals': all_journals_dict
    }

    with open(OUTPUT_JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(backup_payload, f, ensure_ascii=False, indent=2)

    js_content = f"// 자동 생성된 위드지저스(jwj.kr) 일기 데이터 - Paniel ({DEFAULT_AUTHOR})\nwindow.INITIAL_IMPORTED_DATA = {json.dumps(backup_payload, ensure_ascii=False)};\n"
    with open(JS_DATA_PATH, 'w', encoding='utf-8') as f:
        f.write(js_content)

    elapsed = time.time() - t_start
    print(f"🎉 완료! 총 {len(all_journals_dict)}편 동기화됨 (소요시간: {elapsed:.2f}초)", flush=True)

    if push_git and os.path.exists(os.path.join(WORKSPACE_DIR, ".git")):
        try:
            subprocess.run(['git', 'add', 'jwj_imported_diaries.json', 'js/imported_data.js'], cwd=WORKSPACE_DIR, check=True)
            status = subprocess.run(['git', 'status', '--porcelain'], cwd=WORKSPACE_DIR, capture_output=True, text=True)
            if status.stdout.strip():
                subprocess.run(['git', 'commit', '-m', f'chore: auto-sync {len(all_journals_dict)} diaries for Paniel ({DEFAULT_AUTHOR})'], cwd=WORKSPACE_DIR, check=True)
                subprocess.run(['git', 'push', 'origin', 'main'], cwd=WORKSPACE_DIR, check=True)
                print("✓ GitHub Pages 자동 배포 푸시 완료!", flush=True)
        except Exception as e:
            print(f"  [알림] Git 푸시 참고: {e}", flush=True)

    return backup_payload


if __name__ == '__main__':
    full = '--full' in sys.argv
    no_push = '--no-push' in sys.argv
    run_import(full_sync=full, push_git=not no_push)
