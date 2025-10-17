# Program do Fakturowania AMGS Quant

Prosty program do fakturowania z funkcjami zarządzania klientami, fakturami i generowania PDF.

## Funkcje

- ✅ Zarządzanie klientami (dodawanie, edycja, wyświetlanie listy)
- ✅ Tworzenie, edycja i zarządzanie fakturami
- ✅ Generowanie faktur w formacie PDF
- ✅ Podstawowe raportowanie (miesięczne zestawienia)
- ✅ Przechowywanie danych w lokalnej bazie SQLite
- ✅ Zgodność z wymogami prawnymi faktur w Polsce

## Technologie

- **Frontend**: React 18, TypeScript, Material-UI
- **Backend**: Node.js, Express, SQLite3
- **PDF**: jsPDF, html2canvas
- **Styling**: Material-UI, CSS Modules

## Instalacja i uruchomienie

### Wymagania
- Node.js 18+
- npm lub yarn

### Instalacja

1. Sklonuj repozytorium:
```bash
git clone <repository-url>
cd amgsquant-invoicing
```

2. Zainstaluj wszystkie zależności:
```bash
npm run install-all
```

3. Uruchom aplikację w trybie deweloperskim:
```bash
npm run dev
```

Aplikacja będzie dostępna pod adresem:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Produkcja

1. Zbuduj aplikację:
```bash
npm run build
```

2. Uruchom serwer produkcyjny:
```bash
npm start
```

## Struktura projektu

```
amgsquant-invoicing/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Komponenty React
│   │   ├── pages/         # Strony aplikacji
│   │   ├── services/      # API calls
│   │   ├── utils/         # Funkcje pomocnicze
│   │   └── types/         # Definicje TypeScript
│   └── public/
├── server/                 # Backend Node.js
│   ├── routes/            # Endpointy API
│   ├── models/            # Modele danych
│   ├── middleware/        # Middleware Express
│   └── database/          # Konfiguracja bazy danych
└── docs/                  # Dokumentacja
```

## API Endpoints

### Klienci
- `GET /api/customers` - Lista klientów
- `POST /api/customers` - Dodaj klienta
- `PUT /api/customers/:id` - Edytuj klienta
- `DELETE /api/customers/:id` - Usuń klienta

### Faktury
- `GET /api/invoices` - Lista faktur
- `POST /api/invoices` - Dodaj fakturę
- `PUT /api/invoices/:id` - Edytuj fakturę
- `DELETE /api/invoices/:id` - Usuń fakturę
- `GET /api/invoices/:id/pdf` - Pobierz PDF faktury

### Raporty
- `GET /api/reports/monthly` - Raport miesięczny
- `GET /api/reports/yearly` - Raport roczny

## Konfiguracja

### Zmienne środowiskowe

Utwórz plik `.env` w katalogu `server/`:

```env
PORT=5000
NODE_ENV=development
DB_PATH=./database/invoices.db
JWT_SECRET=your-secret-key
```

## Licencja

MIT License