'use client';

import { useCertStore } from '@/store/useCertStore';
import { Progress } from '@/components/ui/progress';
import { Loader2, FileDown } from 'lucide-react';

export default function ExportProgress() {
  const { isExporting, exportProgress, exportTotal } = useCertStore();

  if (!isExporting) return null;

  const percentage = exportTotal > 0 ? Math.round((exportProgress / exportTotal) * 100) : 0;

  return (
    <div className="rounded-xl border border-violet-500/30 bg-gradient-to-r from-violet-500/5 to-indigo-500/5 p-6 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
          <Loader2 className="w-5 h-5 text-white animate-spin" />
        </div>
        <div>
          <p className="font-semibold text-sm">Generating Certificates</p>
          <p className="text-xs text-muted-foreground">
            Generating {exportProgress} of {exportTotal}…
          </p>
        </div>
      </div>

      <Progress value={percentage} className="h-2" />

      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-muted-foreground">{percentage}% complete</span>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <FileDown className="w-3 h-3" />
          {exportProgress} / {exportTotal}
        </div>
      </div>
    </div>
  );
}
