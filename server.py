"""
예수동행일기 (LivingBreath & Paniel) 통합 실시간 동기화 로컬 서버
실행 방법: python server.py
"""
import http.server
import socketserver
import webbrowser
import os
import sys
import json
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
        except Exception:
            pass
    threading.Thread(target=_worker, daemon=True).start()


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Access-Control-Allow-Private-Network', 'true')
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

            if app_type == 'paniel' and os.path.exists(os.path.join(PANIEL_DIR, 'sync_paniel.py')):
                if PANIEL_DIR not in sys.path:
                    sys.path.insert(0, PANIEL_DIR)
                import importlib
                import sync_paniel
                importlib.reload(sync_paniel)
                data = sync_paniel.run_import(full_sync=False, push_git=False)
                git_push_async(PANIEL_DIR, f"chore: auto-sync {data.get('totalCount', 0)} diaries for Paniel")
            else:
                if LIVINGBREATH_DIR not in sys.path:
                    sys.path.insert(0, LIVINGBREATH_DIR)
                import importlib
                import sync_jwj_diaries
                importlib.reload(sync_jwj_diaries)
                data = sync_jwj_diaries.run_import(full_sync=False, push_git=False)
                git_push_async(LIVINGBREATH_DIR, f"chore: auto-sync {data.get('totalCount', 0)} diaries for LivingBreath")

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
    port = PORT

    for p in range(PORT, PORT + 20):
        try:
            socketserver.TCPServer.allow_reuse_address = True
            with socketserver.TCPServer(("", p), Handler) as httpd:
                url = f"http://localhost:{p}"
                print("=" * 60, flush=True)
                print("  🌿 예수동행일기 실시간 동기화 서버가 시작되었습니다!", flush=True)
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
