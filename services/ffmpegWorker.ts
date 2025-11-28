import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

// Define message types
interface WorkerMessage {
  file: File;
  crf: number;
}

const ffmpeg = new FFmpeg();

self.onmessage = async (e: MessageEvent<WorkerMessage>) => {
  const { file, crf } = e.data;

  try {
    if (!ffmpeg.loaded) {
      // Load FFmpeg core from public directory
      // We use relative paths assuming they are served from /ffmpeg-core/
      await ffmpeg.load({
        coreURL: '/ffmpeg-core/ffmpeg-core.js',
        wasmURL: '/ffmpeg-core/ffmpeg-core.wasm',
      });
    }

    // Handle progress updates
    ffmpeg.on('progress', ({ progress }) => {
      // FFmpeg reports 0 to 1, we send 0 to 100
      self.postMessage({ type: 'progress', progress: progress * 100 });
    });

    const inputName = 'input.mp4';
    const outputName = 'output.mp4';

    // Write file to memory
    await ffmpeg.writeFile(inputName, await fetchFile(file));

    // Execute compression
    // -preset ultrafast: sacrifices some compression ratio for speed, critical for browser
    await ffmpeg.exec([
      '-i', inputName,
      '-c:v', 'libx264',
      '-crf', crf.toString(),
      '-preset', 'ultrafast',
      '-c:a', 'copy', // Copy audio to save processing time
      outputName
    ]);

    // Read result
    const data = await ffmpeg.readFile(outputName);
    const blob = new Blob([data as Uint8Array], { type: 'video/mp4' });

    // Cleanup
    await ffmpeg.deleteFile(inputName);
    await ffmpeg.deleteFile(outputName);

    // Return result
    self.postMessage({ type: 'done', blob });

  } catch (error: any) {
    console.error('FFmpeg Worker Error:', error);
    self.postMessage({ type: 'error', error: error.message || 'Unknown processing error' });
  }
};