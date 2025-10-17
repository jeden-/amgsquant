#!/bin/bash

# AMGS Quant - Program do Fakturowania
# Skrypt uruchomieniowy

echo "🚀 Uruchamianie programu do fakturowania AMGS Quant..."

# Sprawdź czy Node.js jest zainstalowany
if ! command -v node &> /dev/null; then
    echo "❌ Node.js nie jest zainstalowany. Zainstaluj Node.js 18+ z https://nodejs.org"
    exit 1
fi

# Sprawdź wersję Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Wymagana jest wersja Node.js 18 lub nowsza. Obecna wersja: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) - OK"

# Zainstaluj zależności główne
echo "📦 Instalowanie zależności głównych..."
npm install

# Zainstaluj zależności serwera
echo "📦 Instalowanie zależności serwera..."
cd server
npm install
cd ..

# Zainstaluj zależności klienta
echo "📦 Instalowanie zależności klienta..."
cd client
npm install
cd ..

echo "✅ Wszystkie zależności zainstalowane!"

# Sprawdź czy porty są wolne
if lsof -Pi :5000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port 5000 jest zajęty. Zatrzymaj proces używający tego portu lub zmień PORT w server/config.env"
fi

if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port 3000 jest zajęty. Zatrzymaj proces używający tego portu"
fi

echo ""
echo "🎉 Instalacja zakończona!"
echo ""
echo "Aby uruchomić aplikację:"
echo "  npm run dev"
echo ""
echo "Aplikacja będzie dostępna pod adresami:"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:5000"
echo ""
echo "Aby zatrzymać aplikację, naciśnij Ctrl+C"
echo ""
echo "📚 Dokumentacja: README.md"
echo "🔧 Konfiguracja: server/config.env"
