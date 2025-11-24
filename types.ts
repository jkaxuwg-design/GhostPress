
export enum AppStatus {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR',
}

export enum FileType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  UNKNOWN = 'UNKNOWN',
}

export type Language = 'en' | 'zh';

export interface ProcessingStats {
  originalSize: number;
  compressedSize: number;
  compressionRatio: number; // percentage saved
  timeElapsed: number;
}

export interface AppState {
  file: File | null;
  filePreview: string | null; // URL
  compressedPreview: string | null; // URL of blob
  fileType: FileType;
  status: AppStatus;
  progress: number;
  error: string | null;
  
  // Settings
  quality: number; // 0-100
  resizeScale: number; // 0.1 - 1.0
  format: 'original' | 'webp' | 'jpeg' | 'mp4';
  stripMetadata: boolean;
  performanceMode: 'eco' | 'beast';
  language: Language;

  // Stats
  stats: ProcessingStats | null;

  // Actions
  setFile: (file: File) => void;
  reset: () => void;
  setQuality: (q: number) => void;
  setResizeScale: (s: number) => void;
  setFormat: (f: 'original' | 'webp' | 'jpeg' | 'mp4') => void;
  toggleMetadata: () => void;
  setPerformanceMode: (m: 'eco' | 'beast') => void;
  setLanguage: (l: Language) => void;
  setStatus: (s: AppStatus) => void;
  setProgress: (p: number) => void;
  setCompressedResult: (url: string, size: number) => void;
  setError: (msg: string) => void;
}
