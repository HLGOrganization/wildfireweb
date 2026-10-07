@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0.."

rem 找一个没有控制台窗口的 Python：优先 pyw.exe（py 启动器），其次 pythonw.exe。
set "PYW="
for /f "delims=" %%i in ('where pyw.exe 2^>nul') do if not defined PYW set "PYW=%%i"
if not defined PYW for /f "delims=" %%i in ('where pythonw.exe 2^>nul') do if not defined PYW set "PYW=%%i"

if not defined PYW (
    echo.
    echo   没有找到 pythonw.exe。
    echo.
    echo   请先装 Python 3，安装时勾上 "Add Python to PATH"，装完重新双击本文件。
    echo.
    pause
    exit /b 1
)

start "" "%PYW%" "%~dp0afdian_sponsors_watch.py"

echo.
echo   赞助名单同步已经在后台跑起来了（不会有窗口）。
echo.
echo     日志：%~dp0afdian-sponsors.log
echo     停止：双击 %~dp0stop-sponsor-sync.bat
echo.
echo   这个窗口 8 秒后自己关掉，也可以直接按任意键。
echo.
pause >nul
