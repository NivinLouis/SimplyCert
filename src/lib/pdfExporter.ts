import { PDFDocument } from 'pdf-lib';

export async function createPdfFromImage(imageBlob: Blob, width: number, height: number): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();

  // Create page matching certificate aspect ratio
  // Convert pixels to PDF points (72 dpi)
  const pdfWidth = 842; // A4 landscape width in points
  const pdfHeight = pdfWidth * (height / width);

  const page = pdfDoc.addPage([pdfWidth, pdfHeight]);

  const imageBytes = new Uint8Array(await imageBlob.arrayBuffer());
  const pngImage = await pdfDoc.embedPng(imageBytes);

  page.drawImage(pngImage, {
    x: 0,
    y: 0,
    width: pdfWidth,
    height: pdfHeight,
  });

  return await pdfDoc.save();
}
