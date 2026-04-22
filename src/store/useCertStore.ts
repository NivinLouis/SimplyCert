import { create } from 'zustand';

export interface TextConfig {
  fontFamily: string;
  fontSize: number;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  caseTransform: 'none' | 'uppercase' | 'lowercase' | 'titlecase' | 'sentencecase';
  alignment: 'left' | 'center' | 'right';
  color: string;
  opacity: number;
  letterSpacing: number;
  lineHeight: number;
}

export interface BoundingBox {
  // Stored as percentages (0-1) of certificate dimensions
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CertState {
  // Step
  currentStep: number;
  setStep: (step: number) => void;

  // Certificate template
  templateImage: string | null; // data URL
  templateFileName: string | null;
  templateWidth: number;
  templateHeight: number;
  setTemplate: (image: string, fileName: string, width: number, height: number) => void;
  clearTemplate: () => void;

  // Names
  names: string[];
  setNames: (names: string[]) => void;

  // Bounding box (percentage-based)
  boundingBox: BoundingBox | null;
  setBoundingBox: (box: BoundingBox | null) => void;

  // Text config
  textConfig: TextConfig;
  setTextConfig: (config: Partial<TextConfig>) => void;

  // Draw mode
  isDrawMode: boolean;
  setDrawMode: (mode: boolean) => void;

  // Preview
  showPreview: boolean;
  setShowPreview: (show: boolean) => void;
  previewText: string | null;
  setPreviewText: (text: string | null) => void;

  // Export
  isExporting: boolean;
  exportProgress: number;
  exportTotal: number;
  setExportState: (isExporting: boolean, progress?: number, total?: number) => void;

  // Full config save/restore
  getSerializableConfig: () => SerializableConfig;
  restoreConfig: (config: SerializableConfig) => void;
}

export interface SerializableConfig {
  boundingBox: BoundingBox | null;
  textConfig: TextConfig;
}

const defaultTextConfig: TextConfig = {
  fontFamily: 'Poppins',
  fontSize: 48,
  bold: false,
  italic: false,
  underline: false,
  caseTransform: 'none',
  alignment: 'left',
  color: '#1a1a2e',
  opacity: 100,
  letterSpacing: 0,
  lineHeight: 1.4,
};

export const useCertStore = create<CertState>((set, get) => ({
  currentStep: 0,
  setStep: (step) => set({ currentStep: step }),

  templateImage: null,
  templateFileName: null,
  templateWidth: 0,
  templateHeight: 0,
  setTemplate: (image, fileName, width, height) =>
    set({ templateImage: image, templateFileName: fileName, templateWidth: width, templateHeight: height }),
  clearTemplate: () =>
    set({ templateImage: null, templateFileName: null, templateWidth: 0, templateHeight: 0 }),

  names: [],
  setNames: (names) => set({ names }),

  boundingBox: null,
  setBoundingBox: (box) => set({ boundingBox: box }),

  textConfig: { ...defaultTextConfig },
  setTextConfig: (config) =>
    set((state) => ({ textConfig: { ...state.textConfig, ...config } })),

  isDrawMode: false,
  setDrawMode: (mode) => set({ isDrawMode: mode }),

  showPreview: true,
  setShowPreview: (show) => set({ showPreview: show }),
  previewText: null,
  setPreviewText: (text) => set({ previewText: text }),

  isExporting: false,
  exportProgress: 0,
  exportTotal: 0,
  setExportState: (isExporting, progress = 0, total = 0) =>
    set({ isExporting, exportProgress: progress, exportTotal: total }),

  getSerializableConfig: () => {
    const state = get();
    return {
      boundingBox: state.boundingBox,
      textConfig: state.textConfig,
    };
  },

  restoreConfig: (config) =>
    set({
      boundingBox: config.boundingBox,
      textConfig: { ...defaultTextConfig, ...config.textConfig },
    }),
}));
