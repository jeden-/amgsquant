-- Inicjalizacja bazy danych
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Utworzenie dodatkowych schematów jeśli potrzebne
-- CREATE SCHEMA IF NOT EXISTS analytics;

-- Granty
GRANT ALL PRIVILEGES ON DATABASE printdb TO printuser;
