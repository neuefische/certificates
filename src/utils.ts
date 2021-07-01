export function normalizeDiacritics(text: string): string {
  return text.normalize('NFD').replace(/\p{Diacritic}/gu, '');
}
