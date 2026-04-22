'use client';

import { useState, useRef } from 'react';
import { parseCsv, extractColumn } from '@/lib/csvParser';
import { useCertStore } from '@/store/useCertStore';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Table, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CsvUploader() {
  const { setNames } = useCertStore();
  const [headers, setHeaders] = useState<string[]>([]);
  const [data, setData] = useState<Record<string, string>[]>([]);
  const [selectedColumn, setSelectedColumn] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = await parseCsv(file);
    if (result.error) {
      toast.error(`CSV parsing error: ${result.error}`);
      return;
    }

    if (result.headers.length === 0) {
      toast.error('No columns found in the CSV file.');
      return;
    }

    setHeaders(result.headers);
    setData(result.data);
    setFileName(file.name);
    setSelectedColumn('');
    toast.success(`Loaded ${result.data.length} rows from ${file.name}`);
  };

  const handleColumnSelect = (column: string) => {
    setSelectedColumn(column);
    const names = extractColumn(data, column);
    setNames(names);
    toast.success(`${names.length} names extracted from "${column}" column`);
  };

  return (
    <div className="space-y-4">
      <div
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          'rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-300',
          'hover:border-violet-400/50 hover:bg-violet-500/5',
          fileName ? 'border-emerald-400/50 bg-emerald-500/5' : 'border-border/50'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
        />
        <div className="flex flex-col items-center gap-2">
          {fileName ? (
            <>
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              <p className="font-medium text-sm">{fileName}</p>
              <p className="text-xs text-muted-foreground">{data.length} rows • Click to change</p>
            </>
          ) : (
            <>
              <Upload className="w-8 h-8 text-muted-foreground" />
              <p className="font-medium text-sm">Upload CSV file</p>
              <p className="text-xs text-muted-foreground">Click to browse</p>
            </>
          )}
        </div>
      </div>

      {headers.length > 0 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select name column</label>
            <Select value={selectedColumn} onValueChange={(v) => v && handleColumnSelect(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a column..." />
              </SelectTrigger>
              <SelectContent>
                {headers.map((header) => (
                  <SelectItem key={header} value={header}>
                    {header}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Preview Table */}
          <div className="rounded-xl border border-border/50 overflow-hidden">
            <div className="px-4 py-2 bg-muted/50 border-b border-border/30 flex items-center gap-2">
              <Table className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">
                Preview (first 5 rows)
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/30">
                    {headers.map((header) => (
                      <th
                        key={header}
                        className={cn(
                          'px-4 py-2 text-left font-medium text-xs',
                          header === selectedColumn
                            ? 'bg-violet-500/10 text-violet-600 dark:text-violet-400'
                            : 'text-muted-foreground'
                        )}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.slice(0, 5).map((row, i) => (
                    <tr key={i} className="border-b border-border/20 last:border-0">
                      {headers.map((header) => (
                        <td
                          key={header}
                          className={cn(
                            'px-4 py-2 text-xs',
                            header === selectedColumn
                              ? 'bg-violet-500/5 font-medium'
                              : 'text-muted-foreground'
                          )}
                        >
                          {row[header] || '—'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
