@echo off
echo ============================================
echo   Unbound Gym - Deploy Update
echo ============================================
echo.
echo This will update the application code without
echo touching the database (your data is safe).
echo.

set /p SOURCE="Enter path to new code folder (e.g. E:\CrossFit): "

if not exist "%SOURCE%\server.js" (
    echo ERROR: Invalid source folder. server.js not found.
    pause
    exit /b
)

echo.
echo Stopping the server...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do taskkill /PID %%a /F >nul 2>&1

echo.
echo Backing up current database...
if not exist "%~dp0backups" mkdir "%~dp0backups"
copy "%~dp0data\crossfit.db" "%~dp0backups\crossfit_%date:~-4%%date:~3,2%%date:~0,2%.db" >nul 2>&1
echo Database backed up.

echo.
echo Updating code files...
:: Copy everything except data folder and node_modules
xcopy "%SOURCE%\*.js" "%~dp0" /Y /Q >nul
xcopy "%SOURCE%\*.bat" "%~dp0" /Y /Q >nul
xcopy "%SOURCE%\*.vbs" "%~dp0" /Y /Q >nul
xcopy "%SOURCE%\views\*" "%~dp0views\" /Y /Q >nul
xcopy "%SOURCE%\routes\*" "%~dp0routes\" /Y /Q >nul
xcopy "%SOURCE%\middleware\*" "%~dp0middleware\" /Y /Q >nul
xcopy "%SOURCE%\public\*" "%~dp0public\" /S /Y /Q >nul
xcopy "%SOURCE%\db\*" "%~dp0db\" /Y /Q >nul

echo.
echo ============================================
echo   Update complete! Database untouched.
echo   Starting the system...
echo ============================================
echo.

start "" "%~dp0Unbound Gym.vbs"
timeout /t 3 /nobreak >nul
echo System started. You can close this window.
pause
