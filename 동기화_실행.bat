@echo off
chcp 65001 >nul
cd /d "%~dp0"
title Paniel 동기화

echo ======================================================
echo    Paniel (최현경) 위드지저스 일기 동기화
echo ======================================================
echo.
echo 위드지저스에 연결하여 최현경 성도님의 일기와 나눔 댓글을 동기화합니다...
echo.

if exist "C:\Python312\python.exe" (
    "C:\Python312\python.exe" sync_paniel.py
) else (
    python sync_paniel.py
)

echo.
echo [알림] 처리가 완료되었습니다. 창을 닫으려면 아무 키나 누르세요.
pause
