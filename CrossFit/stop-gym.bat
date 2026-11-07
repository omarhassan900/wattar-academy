@echo off
echo Stopping Unbound Gym System...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do taskkill /PID %%a /F >nul 2>&1
echo System stopped.
timeout /t 2 /nobreak >nul
