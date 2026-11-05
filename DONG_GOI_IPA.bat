@echo off
chcp 65001 > nul
title Dong Goi Ung Dung Elsa English (.ipa)
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0build_ipa.ps1"
pause

