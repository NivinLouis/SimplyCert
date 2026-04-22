'use client';

import { useCertStore } from '@/store/useCertStore';
import { saveConfig, exportConfigAsJson, importConfigFromJson, loadConfig } from '@/lib/templateStorage';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useRef, useState, useEffect } from 'react';
import { Save, Download, Upload, RotateCcw, X, Settings } from 'lucide-react';
import { CollapsibleSection } from './StyleControls';

export default function TemplateConfig() {
  const {
    getSerializableConfig,
    restoreConfig,
    boundingBox,
    textConfig,
  } = useCertStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showRestore, setShowRestore] = useState(false);

  useEffect(() => {
    const saved = loadConfig();
    if (saved) {
      setShowRestore(true);
    }
  }, []);

  const handleSave = () => {
    const config = getSerializableConfig();
    saveConfig(config);
    toast.success('Configuration saved to browser');
  };

  const handleExport = () => {
    const config = getSerializableConfig();
    exportConfigAsJson(config);
    toast.success('Configuration exported as JSON');
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const config = await importConfigFromJson(file);
      restoreConfig(config);
      toast.success('Configuration imported successfully');
    } catch {
      toast.error('Failed to import configuration');
    }
  };

  const handleRestore = () => {
    const saved = loadConfig();
    if (saved) {
      restoreConfig(saved);
      setShowRestore(false);
      toast.success('Previous session restored');
    }
  };

  return (
    <div className="border-t border-border/30">
      <CollapsibleSection icon={<Settings className="w-4 h-4" />} title="Configurations" defaultOpen={false}>
        <div className="space-y-3 pt-1">
          {showRestore && (
            <div className="rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 p-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <p className="text-xs font-medium mb-2">Restore previous session?</p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleRestore}
                  className="flex-1 text-xs gap-1.5 border-amber-500/30 hover:bg-amber-500/10"
                >
                  <RotateCcw className="w-3 h-3" />
                  Restore
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowRestore(false)}
                  className="text-xs gap-1.5"
                >
                  <X className="w-3 h-3" />
                  Dismiss
                </Button>
              </div>
            </div>
          )}

          <Button onClick={handleSave} variant="outline" size="sm" className="w-full text-xs gap-2">
            <Save className="w-3.5 h-3.5" />
            Save Configuration
          </Button>
          <Button onClick={handleExport} variant="outline" size="sm" className="w-full text-xs gap-2">
            <Download className="w-3.5 h-3.5" />
            Export Config as JSON
          </Button>
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              size="sm"
              className="w-full text-xs gap-2"
            >
              <Upload className="w-3.5 h-3.5" />
              Import Config from JSON
            </Button>
          </div>
        </div>
      </CollapsibleSection>
    </div>
  );
}
