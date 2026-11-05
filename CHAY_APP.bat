@echo off
chcp 65001 > nul
title Elsa English - Server Cho iPad va iPhone
cd /d "%~dp0"

:: Kiem tra quyen Administrator (De mo cong Wi-Fi cho iPad ket noi)
net session >nul 2>&1
if %errorLevel% NEQ 0 (
    powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Process cmd -ArgumentList '/c `"%~f0`"' -Verb RunAs"
    exit /b
)

:: Cap phep tu dong mo cong 8080 de iPad va iPhone ket noi qua Wi-Fi
netsh http add urlacl url=http://*:8080/ user=Everyone >nul 2>&1
netsh advfirewall firewall add rule name="Elsa English Port 8080" dir=in action=allow protocol=TCP localport=8080 >nul 2>&1

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0start_server.ps1"
if errorlevel 1 pause
