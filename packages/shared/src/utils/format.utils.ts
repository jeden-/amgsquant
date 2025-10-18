/**
 * Formatuje wymiary (mm) do czytelnego formatu
 */
export function formatDimensions(width: number, height: number, unit = 'mm'): string {
  return `${width}${unit} × ${height}${unit}`;
}

/**
 * Formatuje powierzchnię w m²
 */
export function formatArea(areaM2: number): string {
  return `${areaM2.toFixed(2)} m²`;
}

/**
 * Konwertuje mm na cm
 */
export function mmToCm(mm: number): number {
  return mm / 10;
}

/**
 * Konwertuje cm na mm
 */
export function cmToMm(cm: number): number {
  return cm * 10;
}

/**
 * Konwertuje mm² na m²
 */
export function mm2ToM2(mm2: number): number {
  return mm2 / 1_000_000;
}

/**
 * Konwertuje m² na mm²
 */
export function m2ToMm2(m2: number): number {
  return m2 * 1_000_000;
}

/**
 * Formatuje czas w minutach do czytelnego formatu
 */
export function formatMinutes(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
}

/**
 * Formatuje datę do polskiego formatu
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

/**
 * Formatuje datę i czas do polskiego formatu
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('pl-PL', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Formatuje rozmiar pliku
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

