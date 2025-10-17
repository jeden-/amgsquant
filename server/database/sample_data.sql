-- Przykładowe dane testowe dla programu do fakturowania AMGS Quant
-- Uruchom ten skrypt po pierwszym uruchomieniu aplikacji

-- Dodaj przykładowych klientów
INSERT INTO customers (name, nip, address, city, postal_code, email, phone) VALUES
('ABC Sp. z o.o.', '1234567890', 'ul. Przykładowa 123', 'Warszawa', '00-001', 'kontakt@abc.pl', '+48 123 456 789'),
('XYZ Sp. z o.o.', '0987654321', 'ul. Testowa 456', 'Kraków', '30-001', 'biuro@xyz.pl', '+48 987 654 321'),
('Jan Kowalski', '1111111111', 'ul. Kowalska 789', 'Gdańsk', '80-001', 'jan.kowalski@email.com', '+48 555 123 456'),
('Firma Testowa Sp. z o.o.', '2222222222', 'ul. Firma 321', 'Wrocław', '50-001', 'test@firma.pl', '+48 666 789 012');

-- Dodaj przykładowe faktury
INSERT INTO invoices (invoice_number, customer_id, issue_date, due_date, net_amount, vat_rate, vat_amount, gross_amount, description, status) VALUES
('FV/2024/01/001', 1, '2024-01-15', '2024-01-29', 1000.00, 23, 230.00, 1230.00, 'Usługi doradcze', 'finalized'),
('FV/2024/01/002', 2, '2024-01-20', '2024-02-03', 2500.00, 23, 575.00, 3075.00, 'Dostawa oprogramowania', 'paid'),
('FV/2024/02/001', 3, '2024-02-01', '2024-02-15', 500.00, 23, 115.00, 615.00, 'Konsultacje techniczne', 'draft'),
('FV/2024/02/002', 4, '2024-02-10', '2024-02-24', 1500.00, 23, 345.00, 1845.00, 'Szkolenie z systemu', 'finalized');

-- Dodaj pozycje faktur
INSERT INTO invoice_items (invoice_id, description, quantity, unit_price, net_amount, vat_rate, vat_amount, gross_amount) VALUES
-- Pozycje dla faktury FV/2024/01/001
(1, 'Doradztwo strategiczne', 10, 100.00, 1000.00, 23, 230.00, 1230.00),

-- Pozycje dla faktury FV/2024/01/002
(2, 'Licencja oprogramowania', 1, 2000.00, 2000.00, 23, 460.00, 2460.00),
(2, 'Instalacja i konfiguracja', 1, 500.00, 500.00, 23, 115.00, 615.00),

-- Pozycje dla faktury FV/2024/02/001
(3, 'Konsultacja techniczna', 5, 100.00, 500.00, 23, 115.00, 615.00),

-- Pozycje dla faktury FV/2024/02/002
(4, 'Szkolenie podstawowe', 1, 800.00, 800.00, 23, 184.00, 984.00),
(4, 'Szkolenie zaawansowane', 1, 700.00, 700.00, 23, 161.00, 861.00);

-- Aktualizuj ustawienia firmy
UPDATE company_settings SET 
  company_name = 'AMGS Quant Sp. z o.o.',
  nip = '1234567890',
  address = 'ul. Przykładowa 123',
  city = 'Warszawa',
  postal_code = '00-001',
  email = 'kontakt@amgsquant.pl',
  phone = '+48 123 456 789',
  bank_account = '12 3456 7890 1234 5678 9012 3456'
WHERE id = 1;

-- Wyświetl podsumowanie
SELECT 'Dane testowe zostały dodane pomyślnie!' as status;

SELECT 'Klienci:' as tabela, COUNT(*) as liczba FROM customers
UNION ALL
SELECT 'Faktury:', COUNT(*) FROM invoices
UNION ALL
SELECT 'Pozycje faktur:', COUNT(*) FROM invoice_items;
