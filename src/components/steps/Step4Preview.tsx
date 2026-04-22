'use client';

import { useCertStore } from '@/store/useCertStore';
import { Button } from '@/components/ui/button';
import { exportAllAsZip } from '@/lib/zipExporter';
import { toast } from 'sonner';
import ExportProgress from '@/components/preview/ExportProgress';
import PreviewCard from '@/components/preview/PreviewCard';
import { ArrowLeft, Package, Loader2 } from 'lucide-react';

export default function Step4Preview() {
  const {
    templateImage,
    templateWidth,
    templateHeight,
    names,
    boundingBox,
    textConfig,
    isExporting,
    setExportState,
    setStep,
  } = useCertStore();

  const handleExportAll = async () => {
    if (!templateImage || !boundingBox) {
      toast.error('Please draw a text box on the certificate first.');
      return;
    }

    setExportState(true, 0, names.length);

    try {
      await exportAllAsZip({
        templateDataUrl: templateImage,
        templateWidth,
        templateHeight,
        names,
        boundingBox,
        textConfig,
        onProgress: (current, total) => {
          setExportState(true, current, total);
        },
      });
      toast.success('All certificates exported successfully!');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Export failed. Please try again.');
    } finally {
      setExportState(false);
    }
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border/30 bg-card/50 shrink-0">
        <Button variant="outline" size="sm" onClick={() => setStep(3)} className="gap-2 text-xs">
          <ArrowLeft className="w-4 h-4" />
          Back to Configure
        </Button>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mr-4">
            {names.length} {names.length === 1 ? 'certificate' : 'certificates'} ready
          </div>

          <Button
            onClick={handleExportAll}
            disabled={isExporting || !boundingBox || names.length === 0}
            className="gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg shadow-violet-500/25 text-sm"
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Package className="w-4 h-4" />
            )}
            Download All PDFs (ZIP)
          </Button>
        </div>
      </div>

      {/* Export Progress */}
      {isExporting && (
        <div className="px-6 py-3">
          <ExportProgress />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 overflow-y-auto p-6 md:p-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-semibold tracking-tight">Review & Generate</h2>
            <p className="text-muted-foreground mt-2">
              Preview your certificates before downloading. You can navigate through them to ensure everything looks perfect.
            </p>
          </div>
          <div className="shadow-2xl rounded-2xl overflow-hidden border border-border/50">
            <PreviewCard />
          </div>
        </div>
      </div>
    </div>
  );
}
