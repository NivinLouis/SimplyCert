'use client';

import { useCertStore } from '@/store/useCertStore';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';
import StyleControls from '@/components/sidebar/StyleControls';
import TemplateConfig from '@/components/sidebar/TemplateConfig';

const CertificateCanvas = dynamic(
  () => import('@/components/canvas/CertificateCanvas'),
  {
    ssr: false,
    loading: () => (
      <div className="flex-1 flex items-center justify-center bg-muted/30 rounded-lg">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading canvas…</span>
        </div>
      </div>
    ),
  }
);

export default function Step3Configure() {
  const {
    names,
    boundingBox,
    setStep,
    setDrawMode,
  } = useCertStore();

  useEffect(() => {
    if (!boundingBox) {
      setDrawMode(true);
      toast.info('Draw a Text Box', {
        id: 'draw-mode-init-toast',
        description: 'Click and drag on the template to define where names should be placed.',
      });
    }
  }, [boundingBox, setDrawMode]);

  const handleNextBtn = () => {
    setStep(4);
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border/30 bg-card/50 shrink-0">
        <Button variant="outline" size="sm" onClick={() => setStep(2)} className="gap-2 text-xs">
          <ArrowLeft className="w-4 h-4" />
          Back to Names
        </Button>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mr-4">
            {names.length} {names.length === 1 ? 'certificate' : 'certificates'} to generate
          </div>

          <Button
            onClick={handleNextBtn}
            disabled={!boundingBox || names.length === 0}
            className="gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg shadow-violet-500/25 text-sm"
          >
            Preview & Generate
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>



      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel (Canvas) */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <CertificateCanvas />
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-[300px] shrink-0 border-l border-border/30 bg-card/30 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto scrollbar-thin pb-6">
            <StyleControls />
            <TemplateConfig />
          </div>
        </div>
      </div>
    </div>
  );
}
