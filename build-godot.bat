@echo off
setlocal enabledelayedexpansion

:: --- CONFIGURAZIONE ---
set "GODOT_PATH=A:\Software\Godot_v4.7-stable_win64.exe\Godot_v4.7-stable_win64_console.exe"
set "GODOT_PROJECT_PATH=.\game"
set "EXPORT_DIR=.\game\dist"
set "DEST_ASSETS=.\web\public"

echo Avvio build di Godot...

:: 1. Build di Godot (headless)
start /wait "" "%GODOT_PATH%" --headless --path "%GODOT_PROJECT_PATH%" --export-release "Web"
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Errore durante la build di Godot!
    pause
    exit /b 1
)

:: 2. Preparazione cartella destinazione
if not exist "%DEST_ASSETS%" mkdir "%DEST_ASSETS%"

echo Spostamento file binari...
copy /y "%EXPORT_DIR%\index.js" "%DEST_ASSETS%\"
copy /y "%EXPORT_DIR%\index.audio.position.worklet.js" "%DEST_ASSETS%\"
copy /y "%EXPORT_DIR%\index.audio.worklet.js" "%DEST_ASSETS%\"
copy /y "%EXPORT_DIR%\index.service.worker.js" "%DEST_ASSETS%\"
copy /y "%EXPORT_DIR%\index.pck" "%DEST_ASSETS%\"
copy /y "%EXPORT_DIR%\index.wasm" "%DEST_ASSETS%\"
copy /y "%EXPORT_DIR%\index.side.wasm" "%DEST_ASSETS%\"
copy /y "%EXPORT_DIR%\index.manifest.json" "%DEST_ASSETS%\"

:: 3. Estrazione configurazione e generazione game-meta.json
echo Generazione metadati e configurazione...

powershell -Command "$html = Get-Content '%EXPORT_DIR%\index.html' -Raw; if ($html -match 'const GODOT_CONFIG = (\{.*?\});') { $matches[1] | Set-Content '%DEST_ASSETS%\game-meta.json'; } else { Write-Error 'Configurazione non trovata'; exit 1; }"

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Errore durante la generazione dei metadati!
    pause
    exit /b 1
)

echo Build completata! File pronti in %DEST_ASSETS%
pause