# @amgsquant/database

Database package zawierający Prisma schema, migracje i seed data dla systemu drukarni.

## Instalacja

```bash
cd packages/database
npm install
```

## Dostępne komendy

```bash
# Wygeneruj Prisma Client
npx prisma generate

# Push schema do bazy (dev)
npx prisma db push

# Stwórz migrację
npx prisma migrate dev

# Deploy migracji (produkcja)
npx prisma migrate deploy

# Wypełnij bazę przykładowymi danymi
npx tsx prisma/seed.ts

# Otwórz Prisma Studio
npx prisma studio

# Resetuj bazę (usuń wszystko i zaaplikuj migracje)
npx prisma migrate reset
```

## Setup Development

1. Upewnij się, że PostgreSQL działa:
```bash
docker-compose -f docker-compose.dev.yml up -d postgres
```

2. Skopiuj .env:
```bash
cp env.example .env
```

3. Push schema:
```bash
npx prisma db push
```

4. Seed data:
```bash
npx tsx prisma/seed.ts
```

5. Otwórz Prisma Studio:
```bash
npx prisma studio
```

## Schema

- **User** - Użytkownicy (B2C, B2B, Agency, Admin, Operator)
- **Address** - Adresy wysyłki/rozliczeniowe
- **Category** - Kategorie produktów
- **Product** - Produkty (Plakaty, Banery, Naklejki, Druki)
- **Material** - Materiały drukarskie (papiery, folie, banery)
- **Order** - Zamówienia
- **OrderItem** - Pozycje zamówień
- **File** - Pliki graficzne
- **ProductionJob** - Zadania produkcyjne
- **Machine** - Maszyny (plottery, laminator, cutter)
- **StockMovement** - Ruchy magazynowe
- **DailyStats** - Statystyki dzienne

## Użytkownicy testowi (po seed)

| Email | Hasło | Typ | Opis |
|-------|-------|-----|------|
| admin@amgsquant.pl | Test1234! | ADMIN | Administrator systemu |
| firma@example.com | Test1234! | BUSINESS | Klient biznesowy |
| agencja@example.com | Test1234! | AGENCY | Agencja reklamowa |
| klient@example.com | Test1234! | CUSTOMER | Klient indywidualny |
