/**
 * Real Video Processor using FFmpeg WASM via Web Worker
 */
export const processVideo = async (
  file: File,
  options: { quality: number }, // 0 to 1
  onProgress: (progress: number) => void
): Promise<Blob> => {
  
  return new Promise((resolve, reject) => {
    // Instantiate the worker
    const worker = new Worker(new URL('./ffmpegWorker.ts', import.meta.url), {
      type: 'module',
    });

    // Calculate CRF (Constant Rate Factor)
    // Range 0-51: 0 is lossless, 51 is worst.
    // Quality 1.0 (100%) -> CRF 18 (High Quality)
    // Quality 0.0 (0%) -> CRF 51 (Low Quality)
    const crf = Math.floor(51 - (options.quality * 33));

    worker.onmessage = (e) => {
      const { type, progress, blob, error } = e.data;

      if (type === 'progress') {
        onProgress(progress);
      } else if (type === 'done') {
        onProgress(100);
        resolve(blob);
        worker.terminate(); // Kill worker to free memory
      } else if (type === 'error') {
        reject(new Error(error));
        worker.terminate();
      }
    };

    worker.onerror = (err) => {
      console.error("Worker Error:", err);
      reject(new Error("Worker failed to process video"));
      worker.terminate();
    };

    // Start processing
    worker.postMessage({ file, crf });
  });
};

// Deprecated: Mock processor removed. 
// If specific environment fallback is needed, it can be re-added here.
