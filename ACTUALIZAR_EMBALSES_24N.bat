@echo off
setlocal
cd /d "%~dp0"
echo PARAMO 24N - importar SOLO las dos tablas originales research.
echo No ejecuta GAMS. No modifica las fuentes. La actualizacion es opcional.
set /p "SOURCE=Carpeta de las tablas CSV o carpeta con 10_canonical: "
if not defined SOURCE (echo No se indico una carpeta. & pause & exit /b 2)
where py >nul 2>&1
if %errorlevel%==0 (py scripts\import_reservoir_tables.py --source "%SOURCE%") else (python scripts\import_reservoir_tables.py --source "%SOURCE%")
set "RC=%errorlevel%"
pause
exit /b %RC%
