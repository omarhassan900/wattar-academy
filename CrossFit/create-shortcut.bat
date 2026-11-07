@echo off
echo Creating desktop shortcut for Unbound Gym...

:: Create shortcut on desktop
powershell -Command "$ws = New-Object -ComObject WScript.Shell; $s = $ws.CreateShortcut([Environment]::GetFolderPath('Desktop') + '\Unbound Gym.lnk'); $s.TargetPath = '%~dp0Unbound Gym.vbs'; $s.WorkingDirectory = '%~dp0'; $s.IconLocation = '%~dp0public\images\logo.ico'; $s.Description = 'Unbound Gym Management System'; $s.Save()"

echo.
echo Done! You should see "Unbound Gym" shortcut on your desktop.
echo Double-click it to start the system.
echo.
pause
