@echo off
setlocal
cd /d "%~dp0"
where py >nul 2>&1
if %errorlevel%==0 (py scripts\serve.py) else (python scripts\serve.py)
if errorlevel 1 (echo Revise que Python este disponible. & pause)
endlocal
