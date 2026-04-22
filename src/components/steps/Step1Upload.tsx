'use client';

import DropZone from '@/components/upload/DropZone';
import { Upload } from 'lucide-react';

export default function Step1Upload() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-violet-500/10 to-indigo-500/10 text-violet-600 dark:text-violet-400 text-sm font-medium mb-3">
          <Upload className="w-4 h-4" />
          Step 1 of 3
        </div>
        <h1 className="text-2xl font-bold">Upload Your Certificate Template</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Start by uploading the certificate design you want to personalize
        </p>
      </div>
      <DropZone />
    </div>
  );
}
