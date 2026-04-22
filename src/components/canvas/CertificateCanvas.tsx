'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import { toast } from 'sonner';
import { useCertStore } from '@/store/useCertStore';
import { applyCaseTransform, CaseTransform } from '@/lib/nameUtils';
import { Button } from '@/components/ui/button';
import { Paintbrush, Eye, EyeOff, ZoomIn, ZoomOut, RotateCcw, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CertificateCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    templateImage,
    templateWidth,
    templateHeight,
    boundingBox,
    setBoundingBox,
    textConfig,
    isDrawMode,
    setDrawMode,
    showPreview,
    setShowPreview,
    previewText,
    setPreviewText,
    names,
  } = useCertStore();

  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [displayScale, setDisplayScale] = useState(1);
  const templateImgRef = useRef<HTMLImageElement | null>(null);
  const animFrameRef = useRef<number>(0);

  // Load template image
  useEffect(() => {
    if (!templateImage) return;
    const img = new Image();
    img.onload = () => {
      templateImgRef.current = img;
      renderCanvas();
    };
    img.src = templateImage;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateImage]);

  // Calculate display scale
  useEffect(() => {
    if (!containerRef.current || !templateWidth || !templateHeight) return;

    const container = containerRef.current;

    const updateScale = () => {
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight || 600;
      const scaleX = containerWidth / templateWidth;
      const scaleY = containerHeight / templateHeight;
      setDisplayScale(Math.min(scaleX, scaleY));
    };

    updateScale();
    
    const resizeObserver = new ResizeObserver(() => {
      updateScale();
    });
    resizeObserver.observe(container);

    window.addEventListener('resize', updateScale);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateScale);
    };
  }, [templateWidth, templateHeight]);

  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const img = templateImgRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d')!;
    const dpr = window.devicePixelRatio || 1;
    const displayWidth = templateWidth * displayScale * zoom;
    const displayHeight = templateHeight * displayScale * zoom;

    canvas.width = displayWidth * dpr;
    canvas.height = displayHeight * dpr;
    canvas.style.width = `${displayWidth}px`;
    canvas.style.height = `${displayHeight}px`;

    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, displayWidth, displayHeight);

    // Draw template
    ctx.drawImage(img, 0, 0, displayWidth, displayHeight);

    // Draw bounding box
    if (boundingBox) {
      const bx = boundingBox.x * displayWidth;
      const by = boundingBox.y * displayHeight;
      const bw = boundingBox.width * displayWidth;
      const bh = boundingBox.height * displayHeight;

      // Dashed border
      ctx.strokeStyle = '#7c3aed';
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 4]);
      ctx.strokeRect(bx, by, bw, bh);
      ctx.setLineDash([]);

      // Semi-transparent fill
      ctx.fillStyle = 'rgba(124, 58, 237, 0.08)';
      ctx.fillRect(bx, by, bw, bh);

      // Resize handles
      const handleSize = 8;
      const handles = [
        { x: bx, y: by }, // TL
        { x: bx + bw / 2, y: by }, // TC
        { x: bx + bw, y: by }, // TR
        { x: bx + bw, y: by + bh / 2 }, // MR
        { x: bx + bw, y: by + bh }, // BR
        { x: bx + bw / 2, y: by + bh }, // BC
        { x: bx, y: by + bh }, // BL
        { x: bx, y: by + bh / 2 }, // ML
      ];

      handles.forEach((h) => {
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#7c3aed';
        ctx.lineWidth = 2;
        ctx.fillRect(h.x - handleSize / 2, h.y - handleSize / 2, handleSize, handleSize);
        ctx.strokeRect(h.x - handleSize / 2, h.y - handleSize / 2, handleSize, handleSize);
      });

      // Preview text
      if (showPreview && previewText) {
        const text = applyCaseTransform(previewText, textConfig.caseTransform as CaseTransform);
        // Correct font size: we scale the base size by (displayWidth / 1000)
        // since displayWidth already includes displayScale and zoom.
        const scaledFontSize = textConfig.fontSize * (displayWidth / 1000);
        const style = textConfig.italic ? 'italic' : 'normal';
        const weight = textConfig.bold ? 'bold' : 'normal';

        ctx.font = `${style} ${weight} ${scaledFontSize}px "${textConfig.fontFamily}", sans-serif`;
        ctx.fillStyle = textConfig.color;
        ctx.globalAlpha = textConfig.opacity / 100;
        ctx.textBaseline = 'top';

        const scaledLetterSpacing = textConfig.letterSpacing * (displayWidth / 1000);

        const measureTextWithSpacing = (text: string, spacing: number) => {
          if (spacing === 0) return ctx.measureText(text).width;
          let totalW = 0;
          for (const char of text) {
            totalW += ctx.measureText(char).width + spacing;
          }
          return totalW - spacing;
        };

        const drawTextWithSpacing = (text: string, x: number, y: number, spacing: number) => {
          if (spacing === 0) {
            ctx.fillText(text, x, y);
            return;
          }
          let currentX = x;
          for (const char of text) {
            ctx.fillText(char, currentX, y);
            currentX += ctx.measureText(char).width + spacing;
          }
        };

        const wrapText = (text: string, maxWidth: number, letterSpacing: number) => {
          const words = text.split(' ');
          const lines: string[] = [];
          let currentLine = '';

          for (const word of words) {
            const testLine = currentLine ? `${currentLine} ${word}` : word;
            const testWidth = measureTextWithSpacing(testLine, letterSpacing);

            if (testWidth > maxWidth && currentLine) {
              lines.push(currentLine);
              currentLine = word;
            } else {
              currentLine = testLine;
            }
          }
          if (currentLine) {
            lines.push(currentLine);
          }
          return lines;
        };

        const lines = wrapText(text, bw, scaledLetterSpacing);
        const scaledLineHeightPx = scaledFontSize * textConfig.lineHeight;
        const visualTextHeight = (lines.length - 1) * scaledLineHeightPx + scaledFontSize;
        let startY = by + (bh - visualTextHeight) / 2;

        for (const line of lines) {
          const lineWidth = measureTextWithSpacing(line, scaledLetterSpacing);
          let startX: number;
          switch (textConfig.alignment) {
            case 'center':
              startX = bx + (bw - lineWidth) / 2;
              break;
            case 'right':
              startX = bx + bw - lineWidth;
              break;
            default:
              startX = bx;
          }

          drawTextWithSpacing(line, startX, startY, scaledLetterSpacing);

          if (textConfig.underline) {
            const underlineY = startY + scaledFontSize * 1.1;
            ctx.beginPath();
            ctx.strokeStyle = textConfig.color;
            ctx.lineWidth = Math.max(1, scaledFontSize / 20);
            ctx.moveTo(startX, underlineY);
            ctx.lineTo(startX + lineWidth, underlineY);
            ctx.stroke();
          }

          startY += scaledLineHeightPx;
        }

        ctx.globalAlpha = 1;
      }
    }

    // Draw mode crosshair indicator
    if (isDrawing && drawStart) {
      // This is handled by mouse move
    }
  }, [
    templateWidth,
    templateHeight,
    displayScale,
    zoom,
    boundingBox,
    showPreview,
    previewText,
    textConfig,
    isDrawing,
    drawStart,
  ]);

  // Re-render on changes
  useEffect(() => {
    cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = requestAnimationFrame(renderCanvas);
  }, [renderCanvas]);

  const getCanvasCoords = useCallback(
    (e: React.MouseEvent): { x: number; y: number } => {
      const canvas = canvasRef.current!;
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / (rect.width);
      const y = (e.clientY - rect.top) / (rect.height);
      return { x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) };
    },
    []
  );

  const getResizeHandle = useCallback(
    (coords: { x: number; y: number }): string | null => {
      if (!boundingBox) return null;

      const threshold = 0.02;
      const { x, y, width, height } = boundingBox;
      const right = x + width;
      const bottom = y + height;

      const nearLeft = Math.abs(coords.x - x) < threshold;
      const nearRight = Math.abs(coords.x - right) < threshold;
      const nearTop = Math.abs(coords.y - y) < threshold;
      const nearBottom = Math.abs(coords.y - bottom) < threshold;
      const inX = coords.x >= x - threshold && coords.x <= right + threshold;
      const inY = coords.y >= y - threshold && coords.y <= bottom + threshold;

      if (nearLeft && nearTop) return 'tl';
      if (nearRight && nearTop) return 'tr';
      if (nearLeft && nearBottom) return 'bl';
      if (nearRight && nearBottom) return 'br';
      if (nearTop && inX) return 'tc';
      if (nearBottom && inX) return 'bc';
      if (nearLeft && inY) return 'ml';
      if (nearRight && inY) return 'mr';

      return null;
    },
    [boundingBox]
  );

  const isInsideBox = useCallback(
    (coords: { x: number; y: number }): boolean => {
      if (!boundingBox) return false;
      return (
        coords.x >= boundingBox.x &&
        coords.x <= boundingBox.x + boundingBox.width &&
        coords.y >= boundingBox.y &&
        coords.y <= boundingBox.y + boundingBox.height
      );
    },
    [boundingBox]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      const coords = getCanvasCoords(e);

      if (isDrawMode) {
        setIsDrawing(true);
        setDrawStart(coords);
        return;
      }

      const handle = getResizeHandle(coords);
      if (handle) {
        setIsResizing(true);
        setResizeHandle(handle);
        setDragStart(coords);
        return;
      }

      if (isInsideBox(coords)) {
        setIsDragging(true);
        setDragStart(coords);
        return;
      }

      // Pan with middle button or when not over box
      if (e.button === 1) {
        setIsPanning(true);
        setPanStart({ x: e.clientX, y: e.clientY });
      }
    },
    [isDrawMode, getCanvasCoords, getResizeHandle, isInsideBox]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const coords = getCanvasCoords(e);

      if (isDrawing && drawStart) {
        const x = Math.min(drawStart.x, coords.x);
        const y = Math.min(drawStart.y, coords.y);
        const width = Math.abs(coords.x - drawStart.x);
        const height = Math.abs(coords.y - drawStart.y);
        setBoundingBox({ x, y, width, height });
        return;
      }

      if (isDragging && boundingBox) {
        const dx = coords.x - dragStart.x;
        const dy = coords.y - dragStart.y;
        setBoundingBox({
          ...boundingBox,
          x: Math.max(0, Math.min(1 - boundingBox.width, boundingBox.x + dx)),
          y: Math.max(0, Math.min(1 - boundingBox.height, boundingBox.y + dy)),
        });
        setDragStart(coords);
        return;
      }

      if (isResizing && boundingBox && resizeHandle) {
        const minSize = 0.02;
        let { x, y, width, height } = boundingBox;

        switch (resizeHandle) {
          case 'br':
            width = Math.max(minSize, coords.x - x);
            height = Math.max(minSize, coords.y - y);
            break;
          case 'bl':
            width = Math.max(minSize, x + width - coords.x);
            height = Math.max(minSize, coords.y - y);
            x = coords.x;
            break;
          case 'tr':
            width = Math.max(minSize, coords.x - x);
            height = Math.max(minSize, y + height - coords.y);
            y = coords.y;
            break;
          case 'tl':
            width = Math.max(minSize, x + width - coords.x);
            height = Math.max(minSize, y + height - coords.y);
            x = coords.x;
            y = coords.y;
            break;
          case 'tc':
            height = Math.max(minSize, y + height - coords.y);
            y = coords.y;
            break;
          case 'bc':
            height = Math.max(minSize, coords.y - y);
            break;
          case 'ml':
            width = Math.max(minSize, x + width - coords.x);
            x = coords.x;
            break;
          case 'mr':
            width = Math.max(minSize, coords.x - x);
            break;
        }

        setBoundingBox({
          x: Math.max(0, x),
          y: Math.max(0, y),
          width: Math.min(1 - Math.max(0, x), width),
          height: Math.min(1 - Math.max(0, y), height),
        });
        return;
      }

      if (isPanning) {
        const dx = e.clientX - panStart.x;
        const dy = e.clientY - panStart.y;
        setPanOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
        setPanStart({ x: e.clientX, y: e.clientY });
        return;
      }

      // Update cursor
      const canvas = canvasRef.current;
      if (!canvas) return;

      if (isDrawMode) {
        canvas.style.cursor = 'crosshair';
        return;
      }

      const handle = getResizeHandle(coords);
      if (handle) {
        const cursors: Record<string, string> = {
          tl: 'nw-resize',
          tr: 'ne-resize',
          bl: 'sw-resize',
          br: 'se-resize',
          tc: 'n-resize',
          bc: 's-resize',
          ml: 'w-resize',
          mr: 'e-resize',
        };
        canvas.style.cursor = cursors[handle] || 'default';
        return;
      }

      canvas.style.cursor = isInsideBox(coords) ? 'move' : 'default';
    },
    [
      isDrawing,
      drawStart,
      isDragging,
      isResizing,
      isPanning,
      boundingBox,
      resizeHandle,
      dragStart,
      panStart,
      isDrawMode,
      getCanvasCoords,
      setBoundingBox,
      getResizeHandle,
      isInsideBox,
    ]
  );

  const handleMouseUp = useCallback(() => {
    if (isDrawing) {
      setIsDrawing(false);
      setDrawStart(null);
      setDrawMode(false);
      
      setTimeout(() => {
        setPreviewText('Participant Name');
        setShowPreview(true);
        toast.info('Layout configured!', {
          description: 'Tip: Use the "Preview Controls" panel to test your longest name to avoid cut-off formatting issues.',
        });
      }, 1000);
    }
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle(null);
    setIsPanning(false);
  }, [isDrawing, setDrawMode, setPreviewText, setShowPreview]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom((prev) => Math.max(0.2, Math.min(5, prev * delta)));
  }, []);

  if (!templateImage) return null;

  return (
    <div className="flex flex-col h-full">
      {/* Canvas Toolbar */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border/30 bg-card/50 shrink-0">
        <Button
          variant={isDrawMode ? 'default' : 'outline'}
          size="sm"
          onClick={() => setDrawMode(!isDrawMode)}
          className={cn(
            'gap-1.5 text-xs',
            isDrawMode && 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white'
          )}
        >
          <Paintbrush className="w-3.5 h-3.5" />
          Draw Text Box
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowPreview(!showPreview)}
          className="gap-1.5 text-xs"
        >
          {showPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          {showPreview ? 'Hide Preview' : 'Show Preview'}
        </Button>

        <div className="flex-1" />

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => setZoom((z) => Math.min(5, z * 1.2))}
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </Button>
        <span className="text-xs text-muted-foreground min-w-[40px] text-center font-mono">
          {Math.round(zoom * 100)}%
        </span>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => setZoom((z) => Math.max(0.2, z * 0.8))}
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => {
            setZoom(1);
            setPanOffset({ x: 0, y: 0 });
          }}
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </Button>

        {boundingBox && (
          <>
            <div className="w-px h-5 bg-border/50 mx-1" />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setBoundingBox(null)}
              className="gap-1.5 text-xs text-destructive hover:text-destructive"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete Text Box
            </Button>
          </>
        )}
      </div>

      {/* Canvas */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto bg-muted/30 flex items-center justify-center p-4"
        style={{ minHeight: '400px' }}
      >
        <div
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px)`,
            transition: isPanning ? 'none' : 'transform 0.1s ease-out',
          }}
        >
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
            className="rounded-lg shadow-2xl shadow-black/20 border border-border/20"
            style={{ cursor: isDrawMode ? 'crosshair' : 'default' }}
          />
        </div>
      </div>
    </div>
  );
}
