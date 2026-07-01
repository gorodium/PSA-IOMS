@echo off
setlocal

set "SCRIPT_DIR=%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%SCRIPT_DIR%Move-29DigitZipFiles.ps1"
set "EXITCODE=%ERRORLEVEL%"

echo.
pause
exit /b %EXITCODE%
