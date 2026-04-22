'use client';

import { useCallback, useState, useRef } from 'react';
import { useCertStore } from '@/store/useCertStore';
import { toast } from 'sonner';
import { Upload, FileImage, FileText, X, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function DropZone() {
  const { templateImage, templateFileName, templateWidth, templateHeight, setTemplate, clearTemplate, setStep } =
    useCertStore();
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processImage = useCallback(
    async (file: File) => {
      setIsProcessing(true);

      try {
        if (file.type === 'application/pdf') {
          // Dynamic import of pdfjs-dist
          const pdfjsLib = await import('pdfjs-dist');
          pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

          const arrayBuffer = await file.arrayBuffer();
          const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
          const page = await pdf.getPage(1);

          const scale = 3; // High DPI rendering
          const viewport = page.getViewport({ scale });

          const canvas = new OffscreenCanvas(viewport.width, viewport.height);
          const ctx = canvas.getContext('2d')!;


          await page.render({
            canvasContext: ctx as unknown as CanvasRenderingContext2D,
            viewport,
            canvas: canvas as unknown as HTMLCanvasElement,
          }).promise;

          const blob = await canvas.convertToBlob({ type: 'image/png' });
          const dataUrl = await blobToDataUrl(blob);

          setTemplate(dataUrl, file.name, viewport.width, viewport.height);
          toast.success('PDF template loaded successfully!');
        } else {
          // Image file
          const dataUrl = await readFileAsDataUrl(file);
          const img = await loadImage(dataUrl);

          // Scale to at least 2480px wide (A4 landscape)
          const targetWidth = Math.max(img.width, 2480);
          const scaleFactor = targetWidth / img.width;
          const targetHeight = Math.round(img.height * scaleFactor);

          const canvas = new OffscreenCanvas(targetWidth, targetHeight);
          const ctx = canvas.getContext('2d')!;
          ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

          const blob = await canvas.convertToBlob({ type: 'image/png' });
          const finalDataUrl = await blobToDataUrl(blob);

          setTemplate(finalDataUrl, file.name, targetWidth, targetHeight);
          toast.success('Template image loaded successfully!');
        }
      } catch (error) {
        console.error('Failed to process file:', error);
        toast.error('Failed to process the file. Please try a different file.');
      } finally {
        setIsProcessing(false);
      }
    },
    [setTemplate]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (!file) return;

      const validTypes = ['image/png', 'image/jpeg', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload a PNG, JPEG, or PDF file.');
        return;
      }

      processImage(file);
    },
    [processImage]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processImage(file);
    },
    [processImage]
  );

  if (templateImage) {
    return (
      <div className="max-w-5xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden shadow-xl">
          {/* Preview Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-violet-500/5 to-indigo-500/5 border-b border-border/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                <FileImage className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-sm">{templateFileName}</p>
                <p className="text-xs text-muted-foreground">
                  {templateWidth} × {templateHeight}px
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                clearTemplate();
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="gap-2"
            >
              <X className="w-4 h-4" />
              Change file
            </Button>
          </div>

          {/* Preview Image */}
          <div className="p-6">
            <div className="rounded-xl overflow-hidden border border-border/30 shadow-inner bg-muted/30">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={templateImage}
                alt="Certificate template preview"
                className="w-full h-auto object-contain max-h-[35vh]"
              />
            </div>
          </div>

          {/* Action */}
          <div className="px-6 pb-6 flex justify-end">
            <Button
              onClick={() => setStep(2)}
              size="lg"
              className="gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg shadow-violet-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/30 hover:scale-[1.02]"
            >
              Next: Add Names
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          'relative rounded-2xl border-2 border-dashed p-16 text-center cursor-pointer transition-all duration-300',
          'bg-gradient-to-br from-violet-500/[0.03] to-indigo-500/[0.03]',
          'hover:from-violet-500/[0.06] hover:to-indigo-500/[0.06]',
          'hover:border-violet-400/50 hover:shadow-xl hover:shadow-violet-500/5',
          isDragging
            ? 'border-violet-500 bg-violet-500/10 shadow-xl shadow-violet-500/10 scale-[1.02]'
            : 'border-border/50',
          isProcessing && 'pointer-events-none opacity-60'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".png,.jpg,.jpeg,.pdf"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-4">
          {isProcessing ? (
            <>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center animate-pulse shadow-lg shadow-violet-500/25">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-lg font-semibold">Processing your template…</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Optimizing resolution for high-quality certificates
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/10 to-indigo-500/10 flex items-center justify-center border border-violet-500/20 group-hover:from-violet-500/20 group-hover:to-indigo-500/20 transition-all duration-300">
                <Upload className="w-8 h-8 text-violet-500" />
              </div>
              <div>
                <p className="text-lg font-semibold">Drop your certificate template here</p>
                <p className="text-sm text-muted-foreground mt-1">
                  or click to browse — PNG, JPEG, or PDF
                </p>
              </div>
              <div className="flex gap-2 mt-2">
                <span className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-muted/80 text-muted-foreground">
                  <FileImage className="w-3 h-3" /> PNG
                </span>
                <span className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-muted/80 text-muted-foreground">
                  <FileImage className="w-3 h-3" /> JPEG
                </span>
                <span className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-muted/80 text-muted-foreground">
                  <FileText className="w-3 h-3" /> PDF
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Helpers
function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
