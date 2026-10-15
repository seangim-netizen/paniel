@echo off
chcp 65001 >nul
cd /d "%~dp0"
title Paniel 동기화

echo ======================================================
echo    Paniel (indianyell5w) 위드지저스 일기 동기화
echo ======================================================
echo.
echo 브라우저를 열고 카카오 로그인을 진행합니다...
echo.

if exist "C:\Python312\python.exe" (
    "C:\Python312\python.exe" sync_paniel.py
) else (
    python sync_paniel.py
)

echo.
echo [알림] 처리가 완료되었습니다. 창을 닫으려면 아무 키나 누르세요.
pause
