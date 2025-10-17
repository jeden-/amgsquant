# AMGSquant Print System - System Zarządzania Drukarnią Wielkoformatową

## 🎯 Opis Projektu

Kompleksowy system e-commerce + zarządzanie produkcją dla drukarni wielkoformatowej.

### Kluczowe funkcjonalności:
- 🛒 Sklep internetowy z konfiguratorem produktów
- 💰 Automatyczna wycena w czasie rzeczywistym
- 📁 Walidacja plików graficznych (preflight)
- 🏭 Zarządzanie produkcją i kolejkowanie zadań
- 📦 Zarządzanie magazynem materiałów
- 🚚 Integracja z kurierami
- 📊 Panele dla różnych typów użytkowników (B2C, B2B, Agencje)

## 🏗️ Architektura

**Monorepo** z wykorzystaniem:
- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend**: NestJS + Prisma + PostgreSQL
- **Cache**: Redis
- **Queue**: RabbitMQ
- **Storage**: MinIO (S3-compatible)

## 🚀 Quick Start

### Wymagania
- Node.js >= 18
- pnpm >= 8
- Docker & Docker Compose

### Instalacja

1. Clone repository:
```bash
git clone https://github.com/jeden-/amgsquant.git
cd amgsquant
```

2. Zainstaluj zależności:
```bash
pnpm install
```

3. Uruchom infrastrukturę (Docker):
```bash
pnpm docker:up
```

4. Skonfiguruj zmienne środowiskowe:
```bash
cp .env.example .env
# Edytuj .env
```

5. Uruchom migracje bazy danych:
```bash
pnpm db:migrate
pnpm db:seed
```

6. Uruchom aplikację w trybie dev:
```bash
pnpm dev
```

Aplikacja dostępna pod:
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- Admin Panel: http://localhost:3001
- Prisma Studio: http://localhost:5555

## 📚 Dokumentacja

- [Architektura systemu](./docs/architecture/)
- [API Documentation](./docs/api/)
- [Deployment Guide](./docs/deployment/)

## 🔧 Dostępne komendy

```bash
pnpm dev          # Uruchom wszystkie aplikacje w trybie dev
pnpm build        # Build wszystkich aplikacji
pnpm lint         # Linting
pnpm test         # Testy
pnpm docker:up    # Uruchom infrastrukturę
pnpm docker:down  # Zatrzymaj infrastrukturę
pnpm db:migrate   # Migracje bazy danych
pnpm db:seed      # Seed danych testowych
pnpm db:studio    # Prisma Studio
```

## 📦 Struktura Projektu

```
apps/
├── frontend/     # Next.js - sklep dla klientów
├── backend/      # NestJS - API
└── admin/        # Panel administracyjny

packages/
├── database/     # Prisma schema + migracje
├── shared/       # Współdzielone typy TypeScript
└── config/       # Współdzielona konfiguracja

docker/           # Docker configs
docs/             # Dokumentacja
scripts/          # Utility scripts
```

## 👥 Team

- Project Lead: [Twoje Imię]
- Backend: NestJS + Prisma
- Frontend: Next.js + React
- DevOps: Docker + GitHub Actions

## 📄 Licencja

Proprietary - All rights reserved
