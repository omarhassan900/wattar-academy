@echo off
title Unbound Gym System
echo Starting Unbound Gym Management System...
echo.

:: Kill any existing instance on port 3000
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do taskkill /PID %%a /F >nul 2>&1

:: Start the server hidden in background
start /B node "%~dp0server.js" > "%~dp0server.log" 2>&1

:: Wait for server to start
timeout /t 3 /nobreak >nul

:: Find Chrome location
set "CHROME="
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" set "CHROME=C:\Program Files\Google\Chrome\Application\chrome.exe"
if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" set "CHROME=C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
if exist "%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe" set "CHROME=%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"
if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" set "CHROME=%ProgramFiles%\Google\Chrome\Application\chrome.exe"

:: If Chrome not found, try default browser
if "%CHROME%"=="" (
    echo Chrome not found, opening in default browser...
    start http://localhost:3000
) else (
    start "" "%CHROME%" --app=http://localhost:3000 --start-maximized
)

echo.
echo System is running! Close this window to keep it running in background.
echo To stop: run stop-gym.bat or close Chrome and this window.
pause >nul
