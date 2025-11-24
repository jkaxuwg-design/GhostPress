/**
 * In a full production environment, this would import @ffmpeg/ffmpeg and load the wasm binary.
 * Due to the environment restrictions and complexity of setting up SharedArrayBuffer/COOP/COEP 
 * headers in a generated preview, we strictly simulate the "Industrial" processing delay and logic
 * while maintaining the architecture for easy swapping.
 */

export const processVideoMock = async (
    file: File,
    onProgress: (progress: number) => void
  ): Promise<Blob> => {
    return new Promise((resolve) => {
      let progress = 0;
      const totalTime = Math.min(5000, file.size / 10000); // Simulate processing time based on size
      const intervalTime = 100;
      const steps = totalTime / intervalTime;
      const increment = 100 / steps;
  
      const timer = setInterval(() => {
        progress += increment;
        
        // Add some "jitter" to make it look like real computing
        const jitter = Math.random() * 5 - 2; 
        const reportedProgress = Math.min(Math.max(progress + jitter, 0), 99);
        
        onProgress(reportedProgress);
  
        if (progress >= 100) {
          clearInterval(timer);
          onProgress(100);
          // Return original file as blob for the mock, pretending we compressed it
          // In reality, we'd return `ffmpeg.readFile('output.mp4')`
          resolve(file.slice(0, file.size) as Blob); 
        }
      }, intervalTime);
    });
  };
