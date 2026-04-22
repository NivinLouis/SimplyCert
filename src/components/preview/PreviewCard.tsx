'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useCertStore } from '@/store/useCertStore';
import { generateCertificateImage } from '@/lib/generateCertificate';
import { exportSinglePdf } from '@/lib/zipExporter';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function PreviewCard() {
  const { templateImage, templateWidth, templateHeight, names, boundingBox, textConfig } =
    useCertStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const prevUrlRef = useRef<string | null>(null);

  const generatePreview = useCallback(async () => {
    if (!templateImage || !boundingBox || names.length === 0) return;
    setIsLoading(true);

    try {
      const blob = await generateCertificateImage({
        templateDataUrl: templateImage,
        templateWidth,
        templateHeight,
        name: names[currentIndex],
        boundingBox,
        textConfig,
      });

      if (prevUrlRef.current) {
        URL.revokeObjectURL(prevUrlRef.current);
      }

      const url = URL.createObjectURL(blob);
      prevUrlRef.current = url;
      setPreviewUrl(url);
    } catch (error) {
      console.error('Preview generation failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [templateImage, templateWidth, templateHeight, names, currentIndex, boundingBox, textConfig]);

  useEffect(() => {
    generatePreview();
  }, [generatePreview]);

  useEffect(() => {
    return () => {
      if (prevUrlRef.current) {
        URL.revokeObjectURL(prevUrlRef.current);
      }
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'ArrowRight') {
        setCurrentIndex((prev) => Math.min(names.length - 1, prev + 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [names.length]);

  const handleDownloadSingle = async () => {
    if (!templateImage || !boundingBox) return;
    setIsDownloading(true);

    try {
      await exportSinglePdf(
        templateImage,
        templateWidth,
        templateHeight,
        names[currentIndex],
        boundingBox,
        textConfig
      );
      toast.success(`Downloaded certificate for ${names[currentIndex]}`);
    } catch {
      toast.error('Failed to generate PDF');
    } finally {
      setIsDownloading(false);
    }
  };

  if (!templateImage || !boundingBox || names.length === 0) {
    return (
      <div className="rounded-xl border border-border/50 p-8 text-center">
        <p className="text-sm text-muted-foreground">
          {!boundingBox
            ? 'Draw a text box on the certificate to start previewing'
            : 'Add names in Step 2 to preview certificates'}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border/50 overflow-hidden bg-card/50">
      {/* Preview Image */}
      <div className="relative bg-muted/30 flex items-center justify-center min-h-[300px]">
        {isLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Generating preview…</span>
          </div>
        ) : previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt={`Certificate preview for ${names[currentIndex]}`}
            className="max-w-full max-h-[400px] object-contain"
          />
        ) : null}
      </div>

      {/* Controls */}
      <div className="px-4 py-3 border-t border-border/30">
        <p className="text-sm font-semibold text-center mb-3 truncate">
          {names[currentIndex]}
        </p>

        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="gap-1 text-xs"
          >
            <ChevronLeft className="w-4 h-4" />
            Prev
          </Button>

          <span className="text-xs text-muted-foreground font-mono">
            {currentIndex + 1} / {names.length}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentIndex((prev) => Math.min(names.length - 1, prev + 1))}
            disabled={currentIndex === names.length - 1}
            className="gap-1 text-xs"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <Button
          onClick={handleDownloadSingle}
          disabled={isDownloading}
          className="w-full mt-3 gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-xs"
          size="sm"
        >
          {isDownloading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          Download this PDF
        </Button>
      </div>
    </div>
  );
}
