@echo off
chcp 65001 > nul
echo ===================================================
echo [LivingBreath] GitHub 배포 및 동기화 스크립트
echo ===================================================
echo.
cd /d "%~dp0"
git add .
git commit -m "LivingBreath 업데이트: %date% %time%"
git branch -M main
git push -u origin main
echo.
echo ===================================================
echo [안내] GitHub Pages 활성화 후 아이폰 접속 주소:
echo https://seangim-netizen.github.io/LivingBreath/
echo ===================================================
pause
