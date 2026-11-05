@echo off
chcp 65001 > nul
title Dong Goi Du An Elsa English
cd /d "%~dp0"

echo ==============================================================
echo    DANG NEN TOAN BO DU AN ELSA ENGLISH THANH FILE ZIP...
echo ==============================================================
echo.

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0pack_project.ps1"

echo.
echo ==============================================================
echo  File ElsaEnglish_TronGoi.zip da duoc luu ngay tren Desktop!
echo  Ban co the copy file nay vao USB hoac gui len Google Drive.
echo ==============================================================
echo.
pause
