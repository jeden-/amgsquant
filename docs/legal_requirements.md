# Wymogi prawne faktur w Polsce

## Podstawowe wymogi dla faktur VAT

### 1. Obowiązkowe elementy faktury

Zgodnie z ustawą o podatku od towarów i usług, faktura VAT musi zawierać:

#### Dane sprzedawcy (wystawcy faktury):
- Nazwa firmy lub imię i nazwisko
- Adres siedziby
- NIP (Numer Identyfikacji Podatkowej)
- Numer konta bankowego (opcjonalnie, ale zalecane)

#### Dane nabywcy:
- Nazwa firmy lub imię i nazwisko
- Adres siedziby/adres zamieszkania
- NIP (jeśli nabywca jest podatnikiem VAT)

#### Dane faktury:
- Numer faktury (ciągły, chronologiczny)
- Data wystawienia faktury
- Data wykonania usługi/dostawy towaru
- Opis towarów lub usług
- Ilość towarów lub zakres usług
- Cena jednostkowa
- Wartość netto
- Stawka podatku VAT
- Kwota podatku VAT
- Wartość brutto

### 2. Numeracja faktur

- Numery faktur muszą być ciągłe i chronologiczne
- Format: FV/YYYY/MM/NNN (np. FV/2024/01/001)
- Nie można pomijać numerów
- W przypadku anulowania faktury, numer nie może być ponownie użyty

### 3. Terminy płatności

- Standardowy termin płatności: 14 dni od daty wystawienia
- Można ustalić inny termin w umowie
- Termin płatności musi być wyraźnie wskazany na fakturze

### 4. Stawki VAT

Podstawowe stawki VAT w Polsce:
- 23% - stawka podstawowa
- 8% - niektóre towary i usługi (np. książki, czasopisma)
- 5% - niektóre towary (np. żywność)
- 0% - eksport, niektóre usługi międzynarodowe
- ZW - zwolnione z VAT

### 5. Przechowywanie faktur

- Faktury muszą być przechowywane przez 5 lat
- W formie elektronicznej lub papierowej
- Muszą być dostępne dla organów podatkowych

### 6. Faktury elektroniczne

- Faktury elektroniczne są równorzędne z papierowymi
- Muszą być podpisane elektronicznie lub zabezpieczone w inny sposób
- Format PDF z podpisem elektronicznym jest akceptowany

### 7. Korekty faktur

- Korekty faktur muszą być wyraźnie oznaczone
- Numer faktury korygującej: FV/YYYY/MM/NNN/K
- Musi zawierać odniesienie do faktury korygowanej

### 8. Faktury pro forma

- Faktury pro forma nie są faktami VAT
- Używane do celów informacyjnych
- Nie podlegają obowiązkowi przechowywania

## Implementacja w systemie AMGS Quant

### Zrealizowane wymogi:

✅ **Numeracja faktur**: Automatyczna numeracja w formacie FV/YYYY/MM/NNN
✅ **Obowiązkowe pola**: Wszystkie wymagane pola są obecne w formularzu
✅ **Stawki VAT**: Obsługa wszystkich stawek VAT
✅ **Terminy płatności**: Konfigurowalne terminy płatności
✅ **Przechowywanie**: Baza danych SQLite z możliwością eksportu
✅ **Format PDF**: Generowanie faktur w formacie PDF
✅ **Korekty**: Możliwość edycji faktur (szkice)

### Dodatkowe funkcje:

✅ **Walidacja NIP**: Sprawdzanie formatu NIP
✅ **Raportowanie**: Raporty miesięczne i roczne
✅ **Wyszukiwanie**: Zaawansowane wyszukiwanie faktur
✅ **Statusy**: Zarządzanie statusami faktur (szkic, sfinalizowana, opłacona)
✅ **Backup**: Możliwość eksportu danych

## Uwagi prawne

⚠️ **Ostrzeżenie**: Ten system jest narzędziem pomocniczym. Przed użyciem w działalności gospodarczej należy skonsultować się z doradcą podatkowym lub księgowym.

📋 **Zalecenia**:
- Regularnie tworzyć kopie zapasowe danych
- Sprawdzać poprawność danych przed wystawieniem faktury
- Przechowywać faktury zgodnie z wymogami prawnymi
- W przypadku wątpliwości skonsultować się z ekspertem

## Kontakt

W przypadku pytań dotyczących wymogów prawnych:
- Doradca podatkowy
- Księgowy
- Urząd Skarbowy
- Ministerstwo Finansów
