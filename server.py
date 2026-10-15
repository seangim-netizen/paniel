"""
예수동행일기 (Journal with Jesus) 로컬 웹앱 실행 스크립트
실행 방법: python server.py
"""
import http.server
import socketserver
import webbrowser
import os
import sys
import json
import traceback

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

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
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
            self.wfile.write(json.dumps({"status": "running", "server": "JesusWalkJournal"}, ensure_ascii=False).encode('utf-8'))
        else:
            super().do_GET()

    def do_POST(self):
        if self.path.startswith('/api/sync'):
            self.handle_sync()
        else:
            super().do_POST()

    def handle_sync(self):
        try:
            print(">>> [API] 위드지저스(jwj.kr) 실시간 동기화 요청 수신...")
            import sync_jwj_diaries
            result = sync_jwj_diaries.run_import()
            
            json_path = os.path.join(DIRECTORY, "jwj_imported_diaries.json")
            with open(json_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
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
                "exportedAt": data.get('exportedAt')
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

def run():
    os.chdir(DIRECTORY)
    port = PORT
    
    # 포트 충돌 방지
    for p in range(PORT, PORT + 20):
        try:
            with socketserver.TCPServer(("", p), Handler) as httpd:
                url = f"http://localhost:{p}"
                print("=" * 60)
                print("  🌿 예수동행일기 (Journal with Jesus) 웹앱이 시작되었습니다!")
                print(f"  🌐 브라우저 주소: {url}")
                print("  🔄 실시간 동기화 API: /api/sync 활성화")
                print("  📖 66권 전체성경 앱: /bible/index.html 탑재")
                print("  📌 종료하려면 터미널에서 Ctrl + C 를 누르세요.")
                print("=" * 60)
                webbrowser.open(url)
                try:
                    httpd.serve_forever()
                except KeyboardInterrupt:
                    print("\n서버를 종료합니다. 오늘도 주님과 평안한 하루 되세요!")
                    sys.exit(0)
            break
        except OSError:
            continue

if __name__ == "__main__":
    run()
