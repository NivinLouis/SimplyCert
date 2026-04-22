'use client';

import { useState, useEffect } from 'react';
import { GOOGLE_FONTS, preloadFontPreviews, loadFont } from '@/lib/fontLoader';
import { useCertStore } from '@/store/useCertStore';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Search, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export default function FontPicker() {
  const { textConfig, setTextConfig } = useCertStore();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    preloadFontPreviews();
  }, []);

  const filteredFonts = GOOGLE_FONTS.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = async (fontName: string) => {
    setTextConfig({ fontFamily: fontName });
    setIsOpen(false);
    setSearch('');

    try {
      await loadFont(fontName);
      toast.success(`Font "${fontName}" loaded`);
    } catch {
      toast.error(`Failed to load font "${fontName}"`);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger
        className={cn(
          'w-full px-3 py-2.5 rounded-lg border border-border/50 text-left text-sm',
          'bg-background hover:bg-muted/50 transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500/50'
        )}
      >
        <span style={{ fontFamily: `"${textConfig.fontFamily}", sans-serif` }}>
          {textConfig.fontFamily}
        </span>
      </PopoverTrigger>

      <PopoverContent className="w-[280px] p-0 rounded-xl border border-border/50 shadow-xl shadow-black/10" align="start">
        <div className="p-2 border-b border-border/30">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search fonts..."
              className="pl-9 h-9 text-sm bg-muted/30 border-0"
              autoFocus
            />
          </div>
        </div>
        <div className="max-h-[280px] overflow-y-auto p-1">
          {filteredFonts.map((font) => (
            <button
              key={font.name}
              onClick={() => handleSelect(font.name)}
              className={cn(
                'w-full px-3 py-2 rounded-lg text-left text-sm flex items-center justify-between',
                'hover:bg-muted/50 transition-colors duration-150',
                font.name === textConfig.fontFamily && 'bg-violet-500/10 text-violet-600 dark:text-violet-400'
              )}
            >
              <span style={{ fontFamily: `"${font.name}", sans-serif` }} className="truncate">
                {font.name}
              </span>
              {font.name === textConfig.fontFamily && <Check className="w-4 h-4 shrink-0 ml-2" />}
            </button>
          ))}
          {filteredFonts.length === 0 && (
            <p className="px-3 py-4 text-center text-sm text-muted-foreground">No fonts found</p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
