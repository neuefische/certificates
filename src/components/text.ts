type TextProps = {
  text: string;
  x?: number;
  y?: number;
  options?: PDFKit.Mixins.TextOptions;
  fontSize?: number;
  font?: string;
  fillColor?: PDFKit.Mixins.ColorValue;
  strokeColor?: PDFKit.Mixins.ColorValue;
};

function text(
  doc: PDFKit.PDFDocument,
  { fontSize, font, text, x, y, options, fillColor, strokeColor }: TextProps
): PDFKit.PDFDocument {
  if (fontSize) {
    doc.fontSize(fontSize);
  }
  if (font) {
    doc.font(font);
  }
  if (fillColor) {
    doc.fillColor(fillColor);
  }
  if (strokeColor) {
    doc.strokeColor(strokeColor);
  }
  if (typeof x !== 'undefined' && typeof y !== 'undefined') {
    doc.text(text, x, y, options);
  } else {
    doc.text(text, options);
  }
  return doc;
}

export default text;
