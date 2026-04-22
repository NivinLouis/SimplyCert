import { TextConfig, BoundingBox } from '@/store/useCertStore';
import { applyCaseTransform, CaseTransform } from './nameUtils';

interface RenderOptions {
  templateDataUrl: string;
  templateWidth: number;
  templateHeight: number;
  name: string;
  boundingBox: BoundingBox;
  textConfig: TextConfig;
}

function buildFontString(config: TextConfig, fontSize: number): string {
  const style = config.italic ? 'italic' : 'normal';
  const weight = config.bold ? 'bold' : 'normal';
  return `${style} ${weight} ${fontSize}px "${config.fontFamily}", sans-serif`;
}


function drawTextWithSpacing(
  ctx: OffscreenCanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  letterSpacing: number
): void {
  if (letterSpacing === 0) {
    ctx.fillText(text, x, y);
    return;
  }
  let currentX = x;
  for (const char of text) {
    ctx.fillText(char, currentX, y);
    currentX += ctx.measureText(char).width + letterSpacing;
  }
}

function measureTextWithSpacing(
  ctx: OffscreenCanvasRenderingContext2D,
  text: string,
  letterSpacing: number
): number {
  if (letterSpacing === 0) {
    return ctx.measureText(text).width;
  }
  let totalWidth = 0;
  for (const char of text) {
    totalWidth += ctx.measureText(char).width + letterSpacing;
  }
  return totalWidth - letterSpacing; // Don't add spacing after last char
}

function wrapText(
  ctx: OffscreenCanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  letterSpacing: number
): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testWidth = measureTextWithSpacing(ctx, testLine, letterSpacing);

    if (testWidth > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines;
}

export async function generateCertificateImage(options: RenderOptions): Promise<Blob> {
  const { templateDataUrl, templateWidth, templateHeight, name, boundingBox, textConfig } = options;

  // Load template image
  const img = await createImageBitmap(await (await fetch(templateDataUrl)).blob());

  // Create offscreen canvas at full resolution
  const canvas = new OffscreenCanvas(templateWidth, templateHeight);
  const ctx = canvas.getContext('2d')!;

  // Draw template
  ctx.drawImage(img, 0, 0, templateWidth, templateHeight);

  // Convert bounding box from percentages to pixels
  const boxX = boundingBox.x * templateWidth;
  const boxY = boundingBox.y * templateHeight;
  const boxW = boundingBox.width * templateWidth;
  const boxH = boundingBox.height * templateHeight;

  // Apply case transform
  const transformedName = applyCaseTransform(name, textConfig.caseTransform as CaseTransform);

  // Determine font size
  let fontSize = textConfig.fontSize;

  // Scale fontSize relative to template dimensions (fontSize is defined at ~1000px reference)
  const scaleFactor = templateWidth / 1000;
  fontSize = Math.round(fontSize * scaleFactor);


  // Set up context
  ctx.font = buildFontString(textConfig, fontSize);
  ctx.fillStyle = textConfig.color;
  ctx.globalAlpha = textConfig.opacity / 100;
  ctx.textBaseline = 'top';

  const letterSpacing = textConfig.letterSpacing * scaleFactor;
  const lineHeightPx = fontSize * textConfig.lineHeight;

  // Wrap text if needed
  const lines = wrapText(ctx, transformedName, boxW, letterSpacing);

  // Calculate starting Y to vertically center text block in box
  const visualTextHeight = (lines.length - 1) * lineHeightPx + fontSize;
  let startY = boxY + (boxH - visualTextHeight) / 2;

  for (const line of lines) {
    const lineWidth = measureTextWithSpacing(ctx, line, letterSpacing);

    let startX: number;
    switch (textConfig.alignment) {
      case 'center':
        startX = boxX + (boxW - lineWidth) / 2;
        break;
      case 'right':
        startX = boxX + boxW - lineWidth;
        break;
      default:
        startX = boxX;
    }

    drawTextWithSpacing(ctx, line, startX, startY, letterSpacing);

    // Underline
    if (textConfig.underline) {
      const underlineY = startY + fontSize * 1.1;
      ctx.beginPath();
      ctx.strokeStyle = textConfig.color;
      ctx.lineWidth = Math.max(1, fontSize / 20);
      ctx.moveTo(startX, underlineY);
      ctx.lineTo(startX + lineWidth, underlineY);
      ctx.stroke();
    }

    startY += lineHeightPx;
  }

  ctx.globalAlpha = 1;

  return await canvas.convertToBlob({ type: 'image/png' });
}
