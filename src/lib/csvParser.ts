import Papa from 'papaparse';

export interface CsvParseResult {
  headers: string[];
  data: Record<string, string>[];
  error: string | null;
}

export function parseCsv(file: File): Promise<CsvParseResult> {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const headers = results.meta.fields || [];
        const data = results.data as Record<string, string>[];
        const error =
          results.errors.length > 0
            ? results.errors.map((e) => e.message).join('; ')
            : null;

        resolve({ headers, data, error });
      },
      error: (err) => {
        resolve({ headers: [], data: [], error: err.message });
      },
    });
  });
}

export function extractColumn(data: Record<string, string>[], column: string): string[] {
  return data
    .map((row) => (row[column] || '').trim())
    .filter((val) => val.length > 0);
}
