@echo off
REM ==========================================================
REM  Wrapper cho Windows: uu tien goi start.sh qua Git Bash
REM  de dung chung logic sinh .env.
REM  Neu khong co Git Bash -> goi docker compose truc tiep.
REM  Cach dung: start.bat [dev^|prod] [--fresh] [--no-follow]
REM ==========================================================
setlocal
set "ROOT=%~dp0"

set "BASH_EXE="
if exist "%ProgramFiles%\Git\bin\bash.exe" set "BASH_EXE=%ProgramFiles%\Git\bin\bash.exe"
if not defined BASH_EXE if exist "%ProgramFiles(x86)%\Git\bin\bash.exe" set "BASH_EXE=%ProgramFiles(x86)%\Git\bin\bash.exe"
if not defined BASH_EXE if exist "%LOCALAPPDATA%\Programs\Git\bin\bash.exe" set "BASH_EXE=%LOCALAPPDATA%\Programs\Git\bin\bash.exe"

if defined BASH_EXE (
  "%BASH_EXE%" "%ROOT%start.sh" %*
  exit /b %ERRORLEVEL%
)

echo [!] Khong tim thay Git Bash -> chay docker compose truc tiep.
echo [!] File .env se khong duoc sinh tu dong; cac gia tri mac dinh van chay duoc.

where docker >nul 2>nul
if errorlevel 1 (
  echo [X] Chua cai Docker Desktop.
  exit /b 1
)

docker info >nul 2>nul
if errorlevel 1 (
  echo [X] Docker Desktop chua chay. Hay mo Docker Desktop roi thu lai.
  exit /b 1
)

set "MODE=dev"
if /I "%~1"=="prod" set "MODE=prod"

if "%MODE%"=="prod" (
  docker compose -f "%ROOT%docker-compose.yml" -f "%ROOT%docker-compose.prod.yml" up -d --build --remove-orphans
) else (
  docker compose -f "%ROOT%docker-compose.yml" -f "%ROOT%docker-compose.override.yml" up -d --build --remove-orphans
)

echo.
echo Frontend : http://localhost:3000
echo API docs : http://localhost:8000/docs
echo Dung web : docker compose down
exit /b %ERRORLEVEL%
