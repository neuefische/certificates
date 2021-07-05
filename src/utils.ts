export function normalizeDiacritics(text: string): string {
  return text.normalize('NFD').replace(/\p{Diacritic}/gu, '');
}

export function calculateFontSize(
  doc: PDFKit.PDFDocument,
  text: string,
  minFontSize: number,
  maxFontSize: number,
  maxWidth: number
): number {
  let fontSize = maxFontSize;
  doc.fontSize(fontSize);
  while (doc.widthOfString(text) > maxWidth && fontSize > minFontSize) {
    fontSize -= 1;
    doc.fontSize(fontSize);
  }

  return fontSize;
}
