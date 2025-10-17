@echo off
REM AMGS Quant - Program do Fakturowania
REM Skrypt uruchomieniowy dla Windows

echo 🚀 Uruchamianie programu do fakturowania AMGS Quant...

REM Sprawdź czy Node.js jest zainstalowany
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js nie jest zainstalowany. Zainstaluj Node.js 18+ z https://nodejs.org
    pause
    exit /b 1
)

echo ✅ Node.js zainstalowany - OK

REM Zainstaluj zależności główne
echo 📦 Instalowanie zależności głównych...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Błąd instalacji zależności głównych
    pause
    exit /b 1
)

REM Zainstaluj zależności serwera
echo 📦 Instalowanie zależności serwera...
cd server
call npm install
if %errorlevel% neq 0 (
    echo ❌ Błąd instalacji zależności serwera
    pause
    exit /b 1
)
cd ..

REM Zainstaluj zależności klienta
echo 📦 Instalowanie zależności klienta...
cd client
call npm install
if %errorlevel% neq 0 (
    echo ❌ Błąd instalacji zależności klienta
    pause
    exit /b 1
)
cd ..

echo ✅ Wszystkie zależności zainstalowane!
echo.
echo 🎉 Instalacja zakończona!
echo.
echo Aby uruchomić aplikację:
echo   npm run dev
echo.
echo Aplikacja będzie dostępna pod adresami:
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:5000
echo.
echo 📚 Dokumentacja: README.md
echo 🔧 Konfiguracja: server/config.env
echo.
pause
