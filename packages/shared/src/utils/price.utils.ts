/**
 * Zaokrągla cenę do 2 miejsc po przecinku
 */
export function roundPrice(price: number): number {
  return Math.round(price * 100) / 100;
}

/**
 * Formatuje cenę do wyświetlenia w PLN
 */
export function formatPrice(price: number, includeCurrency = true): string {
  const formatted = price.toFixed(2);
  return includeCurrency ? `${formatted} PLN` : formatted;
}

/**
 * Oblicza rabat procentowy
 */
export function calculateDiscount(price: number, discountPercent: number): number {
  return roundPrice(price * (discountPercent / 100));
}

/**
 * Oblicza cenę po rabacie
 */
export function applyDiscount(price: number, discountPercent: number): number {
  const discount = calculateDiscount(price, discountPercent);
  return roundPrice(price - discount);
}

/**
 * Oblicza VAT (23%)
 */
export function calculateVAT(priceNet: number, vatRate = 23): number {
  return roundPrice(priceNet * (vatRate / 100));
}

/**
 * Oblicza cenę brutto z netto
 */
export function calculateGrossPrice(priceNet: number, vatRate = 23): number {
  return roundPrice(priceNet * (1 + vatRate / 100));
}

/**
 * Oblicza cenę netto z brutto
 */
export function calculateNetPrice(priceGross: number, vatRate = 23): number {
  return roundPrice(priceGross / (1 + vatRate / 100));
}

/**
 * Porównuje ceny z tolerancją (dla zaokrągleń)
 */
export function comparePrices(price1: number, price2: number, tolerance = 0.01): boolean {
  return Math.abs(price1 - price2) <= tolerance;
}

