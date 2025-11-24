
import { create } from 'zustand';
import { AppState, AppStatus, FileType } from './types';
import { translations } from './i18n';

export const useStore = create<AppState>((set, get) => ({
  file: null,
  filePreview: null,
  compressedPreview: null,
  fileType: FileType.UNKNOWN,
  status: AppStatus.IDLE,
  progress: 0,
  error: null,

  // Default settings
  quality: 80,
  resizeScale: 1,
  format: 'original',
  stripMetadata: true,
  performanceMode: 'beast',
  language: 'en',
  
  stats: null,

  setFile: (file: File) => {
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    const { language } = get();
    const t = translations[language];
    
    if (!isImage && !isVideo) {
      set({ error: t.err_unsupported, status: AppStatus.ERROR });
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    set({
      file,
      filePreview: previewUrl,
      fileType: isImage ? FileType.IMAGE : FileType.VIDEO,
      status: AppStatus.IDLE,
      error: null,
      compressedPreview: null,
      stats: null,
      progress: 0,
      format: isImage ? 'webp' : 'mp4', // Intelligent default
    });
  },

  reset: () => {
    const { filePreview, compressedPreview } = get();
    if (filePreview) URL.revokeObjectURL(filePreview);
    if (compressedPreview) URL.revokeObjectURL(compressedPreview);

    set({
      file: null,
      filePreview: null,
      compressedPreview: null,
      fileType: FileType.UNKNOWN,
      status: AppStatus.IDLE,
      progress: 0,
      error: null,
      stats: null,
    });
  },

  setQuality: (quality) => set({ quality }),
  setResizeScale: (resizeScale) => set({ resizeScale }),
  setFormat: (format) => set({ format }),
  toggleMetadata: () => set((state) => ({ stripMetadata: !state.stripMetadata })),
  setPerformanceMode: (performanceMode) => set({ performanceMode }),
  setLanguage: (language) => set({ language }),
  setStatus: (status) => set({ status }),
  setProgress: (progress) => set({ progress }),
  setError: (error) => set({ error, status: AppStatus.ERROR }),

  setCompressedResult: (url, size) => {
    const { file } = get();
    if (!file) return;

    const originalSize = file.size;
    const saved = originalSize - size;
    const ratio = (saved / originalSize) * 100;

    set({
      compressedPreview: url,
      status: AppStatus.COMPLETED,
      stats: {
        originalSize,
        compressedSize: size,
        compressionRatio: ratio,
        timeElapsed: 0 // handled by local timer usually
      }
    });
  }
}));
