@echo off
setlocal enabledelayedexpansion

set "GODOT_PATH=A:\Software\Godot_v4.7-stable_win64.exe\Godot_v4.7-stable_win64_console.exe"
set "GODOT_PROJECT_PATH=.\game"
set "EXPORT_DIR=.\game\dist"

echo Avvio build di Godot...

start /wait "" "%GODOT_PATH%" --headless --path "%GODOT_PROJECT_PATH%" --export-release "Web"
if %ERRORLEVEL% NEQ 0 (
    echo Errore durante la build di Godot!
    pause
    exit /b 1
)

echo Generazione metadati e configurazione...

powershell -Command "$html = Get-Content '%EXPORT_DIR%\index.html' -Raw; if ($html -match 'const GODOT_CONFIG = (\{.*?\});') { $matches[1] | Set-Content '%EXPORT_DIR%\game-config.json'; } else { Write-Error 'Configurazione non trovata'; exit 1; }"

if %ERRORLEVEL% NEQ 0 (
    echo Errore durante la generazione dei metadati!
    pause
    exit /b 1
)

echo Build completata!