@echo off
chcp 65001 >nul
setlocal
set "PIDF=%~dp0afdian-sync.pid"

if not exist "%PIDF%" (
    echo.
    echo   同步看起来没在跑（找不到 afdian-sync.pid）。
    echo.
    pause
    exit /b 0
)

set /p PID=<"%PIDF%"
echo.
echo   正在停止 PID=%PID% ...
taskkill /PID %PID% /T /F >nul 2>nul

if errorlevel 1 (
    echo   没杀掉 —— 那个进程可能早就自己退出了。
) else (
    echo   已停止。
)
del "%PIDF%" >nul 2>nul
echo.
pause
