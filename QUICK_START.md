# 🚀 Instrukcja uruchomienia - AMGS Quant Program do Fakturowania

## Szybki start

### Opcja 1: Automatyczna instalacja (Zalecana)

**Windows:**
```bash
start.bat
```

**Linux/macOS:**
```bash
./start.sh
```

### Opcja 2: Instalacja ręczna

1. **Zainstaluj zależności główne:**
```bash
npm install
```

2. **Zainstaluj zależności serwera:**
```bash
cd server
npm install
cd ..
```

3. **Zainstaluj zależności klienta:**
```bash
cd client
npm install
cd ..
```

4. **Uruchom aplikację:**
```bash
npm run dev
```

## Dostęp do aplikacji

Po uruchomieniu aplikacja będzie dostępna pod adresami:

- **Frontend (interfejs użytkownika):** http://localhost:3000
- **Backend (API):** http://localhost:5000
- **Health check:** http://localhost:5000/api/health

## Pierwsze kroki

### 1. Dodaj dane firmy

Przed rozpoczęciem pracy dodaj dane swojej firmy w bazie danych:

```sql
-- Edytuj plik server/database/sample_data.sql
-- Zmień dane firmy na swoje
UPDATE company_settings SET 
  company_name = 'Twoja Firma Sp. z o.o.',
  nip = 'TWÓJ_NIP',
  address = 'Twój adres',
  city = 'Twoje miasto',
  postal_code = 'Twój kod pocztowy',
  email = 'twoj@email.pl',
  phone = 'Twój telefon',
  bank_account = 'Twoje konto bankowe'
WHERE id = 1;
```

### 2. Dodaj przykładowe dane (opcjonalnie)

```bash
cd server
sqlite3 database/invoices.db < database/sample_data.sql
cd ..
```

### 3. Rozpocznij pracę

1. Otwórz http://localhost:3000
2. Dodaj pierwszego klienta
3. Utwórz pierwszą fakturę
4. Wygeneruj PDF

## Konfiguracja

### Zmienne środowiskowe

Edytuj plik `server/config.env`:

```env
PORT=5000
NODE_ENV=development
DB_PATH=./database/invoices.db
JWT_SECRET=twoj-sekretny-klucz
```

### Porty

- **Frontend:** 3000 (React)
- **Backend:** 5000 (Node.js/Express)

Jeśli porty są zajęte, zmień je w:
- `server/config.env` (backend)
- `client/package.json` (frontend)

## Struktura projektu

```
amgsquant-invoicing/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Komponenty React
│   │   ├── pages/         # Strony aplikacji
│   │   ├── services/      # API calls
│   │   ├── types/         # Definicje TypeScript
│   │   └── utils/         # Funkcje pomocnicze
│   └── public/            # Pliki publiczne
├── server/                 # Backend Node.js
│   ├── routes/            # Endpointy API
│   ├── models/            # Modele danych
│   ├── database/          # Konfiguracja bazy danych
│   └── middleware/        # Middleware Express
├── docs/                  # Dokumentacja
└── README.md             # Główna dokumentacja
```

## Funkcje aplikacji

### ✅ Zrealizowane funkcje:

1. **Zarządzanie klientami**
   - Dodawanie, edycja, usuwanie klientów
   - Wyszukiwanie klientów
   - Walidacja danych

2. **Zarządzanie fakturami**
   - Tworzenie faktur z pozycjami
   - Automatyczna numeracja faktur
   - Statusy faktur (szkic, sfinalizowana, opłacona)
   - Edycja faktur w stanie szkicu

3. **Generowanie PDF**
   - Profesjonalne faktury PDF
   - Zgodne z wymogami prawnymi Polski
   - Automatyczne pobieranie

4. **Raportowanie**
   - Raporty miesięczne
   - Raporty roczne
   - Raporty klientów
   - Raporty VAT

5. **Zgodność prawna**
   - Wszystkie wymagane pola faktury
   - Automatyczna numeracja
   - Przechowywanie danych
   - Format zgodny z polskim prawem

## Rozwiązywanie problemów

### Problem: Port 3000/5000 zajęty

**Rozwiązanie:**
```bash
# Znajdź proces używający portu
lsof -i :3000
lsof -i :5000

# Zatrzymaj proces
kill -9 PID_PROCESU
```

### Problem: Błąd instalacji zależności

**Rozwiązanie:**
```bash
# Wyczyść cache npm
npm cache clean --force

# Usuń node_modules
rm -rf node_modules
rm -rf server/node_modules
rm -rf client/node_modules

# Zainstaluj ponownie
npm run install-all
```

### Problem: Błąd bazy danych

**Rozwiązanie:**
```bash
# Sprawdź czy katalog database istnieje
ls -la server/database/

# Jeśli nie istnieje, utwórz go
mkdir -p server/database

# Uruchom ponownie aplikację
npm run dev
```

### Problem: Błąd generowania PDF

**Rozwiązanie:**
```bash
# Sprawdź czy Puppeteer jest zainstalowany
cd server
npm list puppeteer

# Jeśli nie, zainstaluj ponownie
npm install puppeteer
```

## Bezpieczeństwo

### Produkcja

Przed wdrożeniem na produkcję:

1. **Zmień JWT_SECRET** w `server/config.env`
2. **Ustaw NODE_ENV=production**
3. **Skonfiguruj HTTPS**
4. **Skonfiguruj firewall**
5. **Utwórz kopie zapasowe bazy danych**

### Kopie zapasowe

```bash
# Eksport bazy danych
sqlite3 server/database/invoices.db .dump > backup_$(date +%Y%m%d).sql

# Import bazy danych
sqlite3 server/database/invoices.db < backup_20240101.sql
```

## Wsparcie

### Dokumentacja

- `README.md` - Główna dokumentacja
- `docs/legal_requirements.md` - Wymogi prawne
- `server/database/sample_data.sql` - Przykładowe dane

### Logi

Logi aplikacji znajdują się w konsoli terminala. W przypadku problemów sprawdź:

1. Logi serwera (terminal z `npm run dev`)
2. Logi przeglądarki (F12 → Console)
3. Logi bazy danych (plik `server/database/invoices.db`)

## Licencja

MIT License - zobacz plik LICENSE dla szczegółów.

---

**Powodzenia w korzystaniu z programu do fakturowania AMGS Quant! 🎉**
