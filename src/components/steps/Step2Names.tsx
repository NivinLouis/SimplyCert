'use client';

import { useState } from 'react';
import { useCertStore } from '@/store/useCertStore';
import { parseNames } from '@/lib/nameUtils';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import CsvUploader from '@/components/upload/CsvUploader';
import { ArrowLeft, ArrowRight, FileText, Upload, PenLine, X, Plus, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Step2Names() {
  const { names, setNames, setStep } = useCertStore();
  const [pasteText, setPasteText] = useState('');
  const [manualEntries, setManualEntries] = useState<string[]>(['']);

  const handlePasteChange = (text: string) => {
    setPasteText(text);
    const parsed = parseNames(text);
    setNames(parsed);
  };

  const handleManualChange = (index: number, value: string) => {
    const updated = [...manualEntries];
    updated[index] = value;
    setManualEntries(updated);
    setNames(updated.map((n) => n.trim()).filter((n) => n.length > 0));
  };

  const addManualEntry = () => {
    setManualEntries([...manualEntries, '']);
  };

  const removeManualEntry = (index: number) => {
    const updated = manualEntries.filter((_, i) => i !== index);
    setManualEntries(updated.length === 0 ? [''] : updated);
    setNames(updated.map((n) => n.trim()).filter((n) => n.length > 0));
  };

  return (
    <div className="max-w-3xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-violet-500/10 to-indigo-500/10 text-violet-600 dark:text-violet-400 text-sm font-medium mb-3">
          <Users className="w-4 h-4" />
          Step 2 of 3
        </div>
        <h1 className="text-2xl font-bold">Add Participant Names</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Paste, upload, or type the names for your certificates
        </p>
      </div>

      <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden shadow-xl">
        <Tabs defaultValue="paste" className="w-full">
          <div className="px-6 pt-4">
            <TabsList className="w-full grid grid-cols-3 bg-muted/50">
              <TabsTrigger value="paste" className="gap-2 text-xs">
                <FileText className="w-3.5 h-3.5" />
                Paste Text
              </TabsTrigger>
              <TabsTrigger value="csv" className="gap-2 text-xs">
                <Upload className="w-3.5 h-3.5" />
                Upload CSV
              </TabsTrigger>
              <TabsTrigger value="manual" className="gap-2 text-xs">
                <PenLine className="w-3.5 h-3.5" />
                Manual Entry
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-6">
            {/* Paste Tab */}
            <TabsContent value="paste" className="mt-0 space-y-3">
              <div className="relative">
                <textarea
                  value={pasteText}
                  onChange={(e) => handlePasteChange(e.target.value)}
                  placeholder="Paste names here, separated by commas or new lines…

John Doe
Jane Smith
Alex Johnson"
                  className={cn(
                    'w-full h-40 rounded-xl border border-border/50 bg-background p-4 text-sm resize-none',
                    'focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500/50',
                    'placeholder:text-muted-foreground/40'
                  )}
                />
                {pasteText && (
                  <Badge
                    variant="secondary"
                    className="absolute top-3 right-3 bg-violet-500/10 text-violet-600 dark:text-violet-400 border-0"
                  >
                    {names.length} names detected
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Auto-detects delimiter: commas or new lines
              </p>
            </TabsContent>

            {/* CSV Tab */}
            <TabsContent value="csv" className="mt-0">
              <CsvUploader />
            </TabsContent>

            {/* Manual Tab */}
            <TabsContent value="manual" className="mt-0 space-y-3">
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                {manualEntries.map((entry, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-6 text-right shrink-0">
                      {i + 1}.
                    </span>
                    <Input
                      value={entry}
                      onChange={(e) => handleManualChange(i, e.target.value)}
                      placeholder="Enter name…"
                      className="h-9 text-sm"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 shrink-0 text-muted-foreground hover:text-destructive"
                      onClick={() => removeManualEntry(i)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={addManualEntry}
                className="w-full gap-2 text-xs"
              >
                <Plus className="w-4 h-4" />
                Add another name
              </Button>
            </TabsContent>
          </div>
        </Tabs>

        {/* Name List Display */}
        {names.length > 0 && (
          <div className="border-t border-border/30 px-6 py-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-violet-500" />
                {names.length} {names.length === 1 ? 'name' : 'names'} ready
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-[200px] overflow-y-auto">
              {names.map((name, i) => (
                <span
                  key={i}
                  className="inline-flex items-center px-2.5 py-1 rounded-md bg-muted/50 text-xs font-medium border border-border/30"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="px-6 pb-6 flex justify-between">
          <Button variant="outline" onClick={() => setStep(1)} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <Button
            onClick={() => setStep(3)}
            disabled={names.length === 0}
            className="gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg shadow-violet-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/30 disabled:opacity-50"
          >
            Next: Configure & Export
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
