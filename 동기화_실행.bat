@echo off
chcp 65001 > nul
title Paniel 예수동행일기 위드지저스 실시간 동기화
echo ==============================================================
echo 🌿 Paniel 계정 (indianyell5w@kakao.com) 위드지저스 일기 동기화
echo ==============================================================
echo 브라우저가 자동으로 열리며 카카오 계정으로 접속합니다.
echo 화면에 카카오 보안 인증 창이 나타나면 직접 확인을 눌러주세요.
echo.
python sync_paniel.py
pause
