'use client';

import { useCertStore } from '@/store/useCertStore';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FontPicker from './FontPicker';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { HexColorPicker } from 'react-colorful';
import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ChevronDown,
  Type,
  Palette,
  Move,
  Eye,
  Paintbrush,
  ALargeSmall,
  ArrowLeftRight,
  ArrowUpDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { findLongestName } from '@/lib/nameUtils';

interface CollapsibleSectionProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function CollapsibleSection({ icon, title, children, defaultOpen = true }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-border/30 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors duration-200"
      >
        <div className="flex items-center gap-2.5">
          <span className="text-violet-500">{icon}</span>
          <span className="text-sm font-semibold">{title}</span>
        </div>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-muted-foreground transition-transform duration-300',
            isOpen && 'rotate-180'
          )}
        />
      </button>
      <div
        className={cn(
          'overflow-hidden transition-all duration-300',
          isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="px-4 pb-4 space-y-3">{children}</div>
      </div>
    </div>
  );
}

export default function StyleControls() {
  const { textConfig, setTextConfig, boundingBox, setBoundingBox, setDrawMode, isDrawMode, names, setPreviewText, templateWidth, templateHeight } =
    useCertStore();
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handlePositionChange = useCallback(
    (field: 'x' | 'y' | 'width' | 'height', value: number) => {
      if (!boundingBox || !templateWidth || !templateHeight) return;
      const pct =
        field === 'x' || field === 'width'
          ? value / templateWidth
          : value / templateHeight;
      setBoundingBox({ ...boundingBox, [field]: Math.max(0, Math.min(1, pct)) });
    },
    [boundingBox, setBoundingBox, templateWidth, templateHeight]
  );

  return (
    <div className="flex flex-col">
      {/* Text Placement */}
      <CollapsibleSection icon={<Move className="w-4 h-4" />} title="Text Placement" defaultOpen={false}>
        <p className="text-xs text-muted-foreground mb-2">
          Draw a text box on the certificate to define where names will appear
        </p>
        <Button
          onClick={() => setDrawMode(!isDrawMode)}
          variant={isDrawMode ? 'default' : 'outline'}
          size="sm"
          className={cn(
            'w-full gap-2',
            isDrawMode && 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white'
          )}
        >
          <Paintbrush className="w-4 h-4" />
          {isDrawMode ? 'Drawing…' : 'Draw Text Box'}
        </Button>

        {boundingBox && (
          <div className="grid grid-cols-2 gap-2 mt-3">
            <div>
              <Label className="text-xs">X (px)</Label>
              <Input
                type="number"
                value={Math.round(boundingBox.x * templateWidth)}
                onChange={(e) => handlePositionChange('x', Number(e.target.value))}
                className="h-8 text-xs"
              />
            </div>
            <div>
              <Label className="text-xs">Y (px)</Label>
              <Input
                type="number"
                value={Math.round(boundingBox.y * templateHeight)}
                onChange={(e) => handlePositionChange('y', Number(e.target.value))}
                className="h-8 text-xs"
              />
            </div>
            <div>
              <Label className="text-xs">Width (px)</Label>
              <Input
                type="number"
                value={Math.round(boundingBox.width * templateWidth)}
                onChange={(e) => handlePositionChange('width', Number(e.target.value))}
                className="h-8 text-xs"
              />
            </div>
            <div>
              <Label className="text-xs">Height (px)</Label>
              <Input
                type="number"
                value={Math.round(boundingBox.height * templateHeight)}
                onChange={(e) => handlePositionChange('height', Number(e.target.value))}
                className="h-8 text-xs"
              />
            </div>
          </div>
        )}
      </CollapsibleSection>

      {/* Font */}
      <CollapsibleSection icon={<Type className="w-4 h-4" />} title="Font">
        <FontPicker />
      </CollapsibleSection>

      {/* Size */}
      <CollapsibleSection icon={<ALargeSmall className="w-4 h-4" />} title="Size">
        <div className="flex items-center gap-3">
          <Slider
            value={[textConfig.fontSize]}
            onValueChange={(v) => setTextConfig({ fontSize: Array.isArray(v) ? v[0] : v })}
            min={8}
            max={200}
            step={1}
            className="flex-1"
          />
          <Input
            type="number"
            value={textConfig.fontSize}
            onChange={(e) => setTextConfig({ fontSize: Number(e.target.value) })}
            className="w-16 h-8 text-xs text-center"
            min={8}
            max={200}
          />
        </div>
      </CollapsibleSection>

      {/* Style */}
      <CollapsibleSection icon={<Bold className="w-4 h-4" />} title="Style">
        <div className="flex gap-1.5">
          <Button
            variant={textConfig.bold ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTextConfig({ bold: !textConfig.bold })}
            className={cn('flex-1', textConfig.bold && 'bg-violet-600 text-white hover:bg-violet-700')}
          >
            <Bold className="w-4 h-4" />
          </Button>
          <Button
            variant={textConfig.italic ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTextConfig({ italic: !textConfig.italic })}
            className={cn('flex-1', textConfig.italic && 'bg-violet-600 text-white hover:bg-violet-700')}
          >
            <Italic className="w-4 h-4" />
          </Button>
          <Button
            variant={textConfig.underline ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTextConfig({ underline: !textConfig.underline })}
            className={cn('flex-1', textConfig.underline && 'bg-violet-600 text-white hover:bg-violet-700')}
          >
            <Underline className="w-4 h-4" />
          </Button>
        </div>
      </CollapsibleSection>

      {/* Case Transform */}
      <CollapsibleSection icon={<Type className="w-4 h-4" />} title="Case Transform">
        <Select
          value={textConfig.caseTransform}
          onValueChange={(v) => setTextConfig({ caseTransform: v as typeof textConfig.caseTransform })}
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="uppercase">UPPERCASE</SelectItem>
            <SelectItem value="lowercase">lowercase</SelectItem>
            <SelectItem value="titlecase">Title Case</SelectItem>
            <SelectItem value="sentencecase">Sentence case</SelectItem>
          </SelectContent>
        </Select>
      </CollapsibleSection>

      {/* Alignment */}
      <CollapsibleSection icon={<AlignLeft className="w-4 h-4" />} title="Alignment">
        <div className="flex gap-1.5">
          {([
            ['left', AlignLeft],
            ['center', AlignCenter],
            ['right', AlignRight],
          ] as const).map(([align, Icon]) => (
            <Button
              key={align}
              variant={textConfig.alignment === align ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTextConfig({ alignment: align })}
              className={cn(
                'flex-1',
                textConfig.alignment === align && 'bg-violet-600 text-white hover:bg-violet-700'
              )}
            >
              <Icon className="w-4 h-4" />
            </Button>
          ))}
        </div>
      </CollapsibleSection>

      {/* Color */}
      <CollapsibleSection icon={<Palette className="w-4 h-4" />} title="Color">
          <Popover open={showColorPicker} onOpenChange={setShowColorPicker}>
            <div className="flex items-center gap-2">
              <PopoverTrigger
                className="w-8 h-8 rounded-lg border border-border/50 shrink-0 shadow-sm transition-transform hover:scale-105"
                style={{ backgroundColor: textConfig.color }}
                aria-label="Open color picker"
              />
              <Input
                value={textConfig.color}
                onChange={(e) => setTextConfig({ color: e.target.value })}
                className="h-8 text-xs font-mono"
                placeholder="#000000"
              />
            </div>
            <PopoverContent className="w-auto p-3 rounded-xl border border-border/50 shadow-xl" align="start">
              <HexColorPicker
                color={textConfig.color}
                onChange={(color) => setTextConfig({ color })}
              />
            </PopoverContent>
          </Popover>
      </CollapsibleSection>

      {/* Opacity */}
      <CollapsibleSection icon={<Eye className="w-4 h-4" />} title="Opacity">
        <div className="flex items-center gap-3">
          <Slider
            value={[textConfig.opacity]}
            onValueChange={(v) => setTextConfig({ opacity: Array.isArray(v) ? v[0] : v })}
            min={0}
            max={100}
            step={1}
            className="flex-1"
          />
          <Input
            type="number"
            value={textConfig.opacity}
            onChange={(e) => setTextConfig({ opacity: Number(e.target.value) })}
            className="w-16 h-8 text-xs text-center"
            min={0}
            max={100}
          />
        </div>
      </CollapsibleSection>

      {/* Letter Spacing */}
      <CollapsibleSection icon={<ArrowLeftRight className="w-4 h-4" />} title="Letter Spacing">
        <div className="flex items-center gap-3">
          <Slider
            value={[textConfig.letterSpacing]}
            onValueChange={(v) => setTextConfig({ letterSpacing: Array.isArray(v) ? v[0] : v })}
            min={-2}
            max={20}
            step={0.5}
            className="flex-1"
          />
          <Input
            type="number"
            value={textConfig.letterSpacing}
            onChange={(e) => setTextConfig({ letterSpacing: Number(e.target.value) })}
            className="w-16 h-8 text-xs text-center"
          />
        </div>
      </CollapsibleSection>

      {/* Line Spacing */}
      <CollapsibleSection icon={<ArrowUpDown className="w-4 h-4" />} title="Line Spacing">
        <div className="flex items-center gap-3">
          <Slider
            value={[textConfig.lineHeight]}
            onValueChange={(v) => setTextConfig({ lineHeight: Array.isArray(v) ? v[0] : v })}
            min={0.8}
            max={3.0}
            step={0.1}
            className="flex-1"
          />
          <Input
            type="number"
            value={textConfig.lineHeight}
            onChange={(e) => setTextConfig({ lineHeight: Number(e.target.value) })}
            className="w-16 h-8 text-xs text-center"
            step={0.1}
          />
        </div>
      </CollapsibleSection>

      {/* Preview Controls */}
      <CollapsibleSection icon={<Eye className="w-4 h-4" />} title="Preview Controls">
        <div className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs"
            onClick={() => setPreviewText('Participant Name')}
          >
            Preview: Demo Text
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs"
            onClick={() => {
              const longest = findLongestName(names);
              if (longest) {
                setPreviewText(longest);
              }
            }}
            disabled={names.length === 0}
          >
            Preview: Longest Name
          </Button>
        </div>
      </CollapsibleSection>
    </div>
  );
}
