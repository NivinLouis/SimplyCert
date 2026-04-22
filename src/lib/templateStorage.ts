import { SerializableConfig } from '@/store/useCertStore';

const STORAGE_KEY = 'certgen_template';

export function saveConfig(config: SerializableConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save config:', e);
  }
}

export function loadConfig(): SerializableConfig | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as SerializableConfig;
  } catch {
    return null;
  }
}

export function clearConfig(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function exportConfigAsJson(config: SerializableConfig): void {
  const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'simplycert_config.json';
  a.click();
  URL.revokeObjectURL(url);
}

export function importConfigFromJson(file: File): Promise<SerializableConfig> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const config = JSON.parse(reader.result as string) as SerializableConfig;
        resolve(config);
      } catch {
        reject(new Error('Invalid JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
