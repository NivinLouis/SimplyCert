import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { generateCertificateImage } from './generateCertificate';
import { createPdfFromImage } from './pdfExporter';
import { sanitizeFilename } from './nameUtils';
import { TextConfig, BoundingBox } from '@/store/useCertStore';

interface ExportOptions {
  templateDataUrl: string;
  templateWidth: number;
  templateHeight: number;
  names: string[];
  boundingBox: BoundingBox;
  textConfig: TextConfig;
  onProgress: (current: number, total: number) => void;
}

export async function exportAllAsZip(options: ExportOptions): Promise<void> {
  const { templateDataUrl, templateWidth, templateHeight, names, boundingBox, textConfig, onProgress } = options;

  const zip = new JSZip();
  const total = names.length;

  for (let i = 0; i < total; i++) {
    const name = names[i];
    onProgress(i + 1, total);

    const imageBlob = await generateCertificateImage({
      templateDataUrl,
      templateWidth,
      templateHeight,
      name,
      boundingBox,
      textConfig,
    });

    const pdfBytes = await createPdfFromImage(imageBlob, templateWidth, templateHeight);
    const filename = `${sanitizeFilename(name)}.pdf`;
    zip.file(filename, pdfBytes);

    // Yield to keep UI responsive
    await new Promise((resolve) => setTimeout(resolve, 0));
  }

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  saveAs(zipBlob, 'certificates.zip');
}

export async function exportSinglePdf(
  templateDataUrl: string,
  templateWidth: number,
  templateHeight: number,
  name: string,
  boundingBox: BoundingBox,
  textConfig: TextConfig
): Promise<void> {
  const imageBlob = await generateCertificateImage({
    templateDataUrl,
    templateWidth,
    templateHeight,
    name,
    boundingBox,
    textConfig,
  });

  const pdfBytes = await createPdfFromImage(imageBlob, templateWidth, templateHeight);
  const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });
  saveAs(blob, `${sanitizeFilename(name)}.pdf`);
}
