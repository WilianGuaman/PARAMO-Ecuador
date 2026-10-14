@echo off
setlocal
cd /d "%~dp0"
where py >nul 2>&1
if %errorlevel%==0 (py -m jupyter lab notebooks\24N_Hydrology_Transmission.ipynb) else (python -m jupyter lab notebooks\24N_Hydrology_Transmission.ipynb)
if errorlevel 1 (echo Instale las dependencias: python -m pip install -r requirements-analysis.txt & pause)
endlocal
