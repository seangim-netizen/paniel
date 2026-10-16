"""
예수동행일기 (LivingBreath & Paniel) 통합 실시간 동기화 로컬 서버 + 백그라운드 자동 감지 데몬
실행 방법: python server.py --no-browser
"""
import http.server
import socketserver
import webbrowser
import os
import sys
import json
import time
import threading
import traceback
from urllib.parse import urlparse, parse_qs

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

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(DIRECTORY) if os.path.basename(DIRECTORY).lower() in ('livingbreath', 'paniel') else DIRECTORY
LIVINGBREATH_DIR = os.path.join(ROOT_DIR, 'LivingBreath') if os.path.exists(os.path.join(ROOT_DIR, 'LivingBreath')) else DIRECTORY
PANIEL_DIR = os.path.join(ROOT_DIR, 'paniel') if os.path.exists(os.path.join(ROOT_DIR, 'paniel')) else DIRECTORY

_sync_lock = threading.Lock()
_last_fingerprints = {}


def compute_journals_fingerprint(journals_dict):
    if not journals_dict:
        return ""
    parts = []
    for date_key in sorted(journals_dict.keys()):
        j = journals_dict[date_key]
        title = j.get('title', '')
        free_txt = (j.get('guide17', {}) or {}).get('freeContent', '')
        comments = j.get('comments', []) or []
        c_sig = "|".join(f"{c.get('id','')}:{c.get('author','')}:{c.get('date','')}:{len(c.get('content',''))}" for c in comments)
        parts.append(f"{date_key}#{title}#{len(free_txt)}#{len(comments)}#{c_sig}")
    return "\n".join(parts)


def get_disk_fingerprint(target_dir):
    json_path = os.path.join(target_dir, 'jwj_imported_diaries.json')
    if not os.path.exists(json_path):
        return ""
    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return compute_journals_fingerprint(data.get('journals', {}))
    except Exception:
        return ""


def git_push_async(target_dir, commit_msg):
    def _worker():
        import subprocess
        try:
            if os.path.exists(os.path.join(target_dir, '.git')):
                subprocess.run(['git', 'add', 'jwj_imported_diaries.json', 'js/imported_data.js'], cwd=target_dir, check=True)
                st = subprocess.run(['git', 'status', '--porcelain'], cwd=target_dir, capture_output=True, text=True)
                if st.stdout.strip():
                    subprocess.run(['git', 'commit', '-m', commit_msg], cwd=target_dir, check=True)
                    subprocess.run(['git', 'push', 'origin', 'main'], cwd=target_dir, check=True)
                    print(f"✓ [Git Push] {os.path.basename(target_dir)} 최신 일기/댓글 GitHub 자동 배포 완료!", flush=True)
        except Exception as e:
            print(f"  [Git Push 참고] {e}", flush=True)
    threading.Thread(target=_worker, daemon=True).start()


def execute_app_sync(app_type):
    with _sync_lock:
        if app_type == 'paniel' and os.path.exists(os.path.join(PANIEL_DIR, 'sync_paniel.py')):
            before_fp = _last_fingerprints.get('paniel') or get_disk_fingerprint(PANIEL_DIR)
            if PANIEL_DIR not in sys.path:
                sys.path.insert(0, PANIEL_DIR)
            import importlib
            import sync_paniel
            importlib.reload(sync_paniel)
            data = sync_paniel.run_import(full_sync=False, push_git=False)
            after_fp = compute_journals_fingerprint(data.get('journals', {}))
            if after_fp != before_fp:
                _last_fingerprints['paniel'] = after_fp
                total_c = sum(len(j.get('comments', [])) for j in data.get('journals', {}).values())
                git_push_async(PANIEL_DIR, f"chore: auto-sync {data.get('totalCount', 0)} diaries ({total_c} comments) for Paniel")
            return data
        else:
            before_fp = _last_fingerprints.get('livingbreath') or get_disk_fingerprint(LIVINGBREATH_DIR)
            if ROOT_DIR not in sys.path:
                sys.path.insert(0, ROOT_DIR)
            import importlib
            import sync_jwj_diaries
            importlib.reload(sync_jwj_diaries)
            data = sync_jwj_diaries.run_import(full_sync=False, push_git=False)
            after_fp = compute_journals_fingerprint(data.get('journals', {}))
            if after_fp != before_fp:
                _last_fingerprints['livingbreath'] = after_fp
                total_c = sum(len(j.get('comments', [])) for j in data.get('journals', {}).values())
                git_push_async(LIVINGBREATH_DIR, f"chore: auto-sync {data.get('totalCount', 0)} diaries ({total_c} comments) for LivingBreath")
            return data


def background_auto_sync_daemon(interval_sec=180):
    """3분마다 백그라운드에서 위드지저스(jwj.kr) 신규 일기 및 최신 댓글을 감지하여 자동 동기화 & GitHub 배포"""
    while True:
        try:
            execute_app_sync('livingbreath')
        except Exception as e:
            print(f"[AutoSync LivingBreath Error] {e}", flush=True)
        try:
            execute_app_sync('paniel')
        except Exception as e:
            print(f"[AutoSync Paniel Error] {e}", flush=True)
        time.sleep(interval_sec)


class ThreadingHTTPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    allow_reuse_address = True
    daemon_threads = True


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.send_header('Access-Control-Allow-Private-Network', 'true')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        if self.path.startswith('/api/sync'):
            self.handle_sync()
        elif self.path.startswith('/api/status'):
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps({"status": "running", "server": "JesusWalkJournal"}).encode('utf-8'))
        else:
            super().do_GET()

    def do_POST(self):
        content_len = int(self.headers.get('Content-Length', 0) or 0)
        if content_len > 0:
            try:
                self.rfile.read(content_len)
            except Exception:
                pass
        if self.path.startswith('/api/sync'):
            self.handle_sync()
        else:
            super().do_POST()

    def handle_sync(self):
        try:
            parsed = urlparse(self.path)
            qs = parse_qs(parsed.query)
            app_type = (qs.get('app', [''])[0] or '').lower()
            if not app_type:
                app_type = 'paniel' if os.path.basename(DIRECTORY).lower() == 'paniel' else 'livingbreath'

            print(f">>> [API] 위드지저스(jwj.kr) 실시간 동기화 요청 수신 ({app_type})...", flush=True)
            data = execute_app_sync(app_type)

            total_diaries = data.get('totalCount', 0)
            total_comments = sum(len(j.get('comments', [])) for j in data.get('journals', {}).values())

            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            response_data = {
                "status": "success",
                "message": f"위드지저스 일기 {total_diaries}편과 나눔 댓글 {total_comments}개가 실시간 동기화되었습니다.",
                "totalCount": total_diaries,
                "totalComments": total_comments,
                "exportedAt": data.get('exportedAt'),
                "payload": data
            }
            self.wfile.write(json.dumps(response_data, ensure_ascii=False).encode('utf-8'))
        except Exception as e:
            traceback.print_exc()
            self.send_response(500)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            err_data = {
                "status": "error",
                "message": f"동기화 중 오류가 발생했습니다: {str(e)}"
            }
            self.wfile.write(json.dumps(err_data, ensure_ascii=False).encode('utf-8'))


def run(open_browser=True):
    os.chdir(DIRECTORY)
    # 시작 시 백그라운드 자동 동기화 스레드 가동 (3분 주기)
    t = threading.Thread(target=background_auto_sync_daemon, args=(180,), daemon=True)
    t.start()

    for p in range(PORT, PORT + 20):
        try:
            with ThreadingHTTPServer(("", p), Handler) as httpd:
                url = f"http://localhost:{p}"
                print("=" * 60, flush=True)
                print("  🌿 예수동행일기 실시간 동기화 서버 & 자동 감지 데몬 시작!", flush=True)
                print(f"  🌐 브라우저 주소: {url}", flush=True)
                print("  🔄 실시간 동기화 API: /api/sync (LivingBreath & Paniel 통합 지원)", flush=True)
                print("=" * 60, flush=True)
                if open_browser:
                    webbrowser.open(url)
                try:
                    httpd.serve_forever()
                except KeyboardInterrupt:
                    sys.exit(0)
            break
        except OSError:
            continue


if __name__ == "__main__":
    no_browser = '--no-browser' in sys.argv
    run(open_browser=not no_browser)
