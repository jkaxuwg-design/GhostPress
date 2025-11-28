import React, { useEffect, useCallback } from 'react';
import { useStore } from './store';
import { AppStatus, FileType } from './types';
import { Dropzone } from './components/Dropzone';
import { ControlDeck } from './components/ControlDeck';
import { GhostHUD } from './components/GhostHUD';
import { Inspector } from './components/Inspector';
import { compressImage } from './services/imageProcessor';
import { processVideo } from './services/videoProcessor';
import { GlassCard } from './components/ui/GlassCard';
import { Zap, AlertTriangle, Globe } from 'lucide-react';
import { translations } from './i18n';

const App: React.FC = () => {
  const state = useStore();
  const t = translations[state.language];

  const handleProcess = useCallback(async () => {
    if (!state.file) return;

    state.setStatus(AppStatus.PROCESSING);
    state.setProgress(0);

    try {
      let resultBlob: Blob;

      if (state.fileType === FileType.IMAGE) {
        // Image Processing
        // Artificial small delay to show off the HUD animation if file is tiny
        if (state.file.size < 1000000) await new Promise(r => setTimeout(r, 800));
        
        const formatMime = state.format === 'jpeg' ? 'image/jpeg' : 'image/webp';
        resultBlob = await compressImage(state.file, {
          quality: state.quality / 100,
          scale: state.resizeScale,
          format: state.format === 'original' ? 'image/jpeg' : formatMime, // Fallback to jpeg if original
        });
        
        state.setProgress(100);
      } else {
        // Video Processing (Real FFmpeg with Fallback)
        resultBlob = await processVideo(
            state.file, 
            { quality: state.quality / 100 }, 
            (p) => state.setProgress(p)
        );
      }

      const url = URL.createObjectURL(resultBlob);
      state.setCompressedResult(url, resultBlob.size);
    } catch (err) {
      console.error(err);
      state.setError(t.err_corrupt);
    }
  }, [state, t]);

  const toggleLanguage = () => {
    state.setLanguage(state.language === 'en' ? 'zh' : 'en');
  };

  return (
    <div className="min-h-screen bg-ghost-900 text-gray-100 font-sans selection:bg-ghost-neon/30 relative overflow-hidden flex flex-col">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[120px] animate-pulse-fast"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-900/20 rounded-full blur-[120px] animate-pulse-fast" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 p-6 flex justify-between items-center border-b border-white/5 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 flex items-center justify-center text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
             <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-full h-full">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 30V12C6 6.47715 10.4772 2 16 2C21.5228 2 26 6.47715 26 12V30C26 31 24 31 23 30C22 28 20 28 19 30C18 32 16 32 15 30C14 28 12 28 11 30C10 32 8 32 7 30C6 29 4 29 6 30Z" />
             </svg>
          </div>
          <h1 className="text-xl font-light tracking-[0.2em] text-white hidden sm:block">
            GHOST<span className="font-bold text-ghost-neon">PRESS</span>
          </h1>
        </div>
        <div className="flex items-center space-x-6 text-xs font-mono text-gray-500">
           
           {/* Language Switcher */}
           <button 
             onClick={toggleLanguage} 
             className="flex items-center space-x-2 hover:text-white transition-colors group cursor-pointer border border-transparent hover:border-ghost-glass px-2 py-1 rounded"
           >
             <Globe className="w-3 h-3 text-ghost-neon group-hover:animate-spin" />
             <span className={state.language === 'en' ? 'text-white font-bold' : ''}>EN</span>
             <span className="text-gray-700">/</span>
             <span className={state.language === 'zh' ? 'text-white font-bold' : ''}>中文</span>
           </button>

           <div className="hidden md:flex items-center space-x-4">
             <span>V1.0.5_VID_ENABLED</span>
             <div className="flex items-center space-x-1">
               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
               <span>{t.system_online}</span>
             </div>
           </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-10 flex flex-col p-4 md:p-8 overflow-hidden">
        
        <GhostHUD />

        {/* Error Toast */}
        {state.error && (
          <div className="absolute top-4 right-4 z-50 animate-glitch">
            <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg flex items-center space-x-3 backdrop-blur-md">
              <AlertTriangle />
              <span className="font-mono font-bold uppercase">{state.error}</span>
              <button onClick={() => state.reset()} className="text-xs underline ml-4">{t.reset}</button>
            </div>
          </div>
        )}

        {/* View Switcher */}
        {state.status === AppStatus.IDLE && !state.file && (
          <div className="flex-1 flex items-center justify-center">
             <Dropzone />
          </div>
        )}

        {(state.status === AppStatus.IDLE || state.status === AppStatus.PROCESSING) && state.file && (
           <div className="flex-1 flex flex-col md:flex-row gap-6 h-full max-w-7xl mx-auto w-full items-start justify-center pt-8">
              {/* Preview Card */}
              <div className="flex-1 w-full animate-fade-in">
                 <GlassCard className="p-4 relative group">
                    <img 
                      src={state.filePreview!} 
                      className={`w-full max-h-[60vh] object-contain rounded-lg border border-ghost-border transition-all duration-500 ${state.status === AppStatus.PROCESSING ? 'opacity-50 blur-sm scale-95 grayscale' : ''}`} 
                      alt="Preview" 
                    />
                    
                    {/* Processing Overlay Effect */}
                    {state.status === AppStatus.PROCESSING && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-full h-1 bg-transparent overflow-hidden absolute top-1/2">
                                <div className="h-full bg-ghost-neon shadow-[0_0_20px_#06b6d4] animate-[shimmer_2s_infinite]"></div>
                            </div>
                        </div>
                    )}
                 </GlassCard>
                 
                 <div className="mt-6 flex justify-center">
                    {state.status === AppStatus.IDLE && (
                      <button 
                        onClick={handleProcess}
                        className="group relative px-8 py-4 bg-white text-black font-bold tracking-wider rounded-lg overflow-hidden transition-all hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                        <span className="relative flex items-center space-x-2">
                           <Zap className="w-4 h-4" />
                           <span>{t.init_seq}</span>
                        </span>
                      </button>
                    )}
                 </div>
              </div>

              {/* Controls */}
              <div className="w-full md:w-80 animate-fade-in-right delay-100">
                 <ControlDeck />
              </div>
           </div>
        )}

        {state.status === AppStatus.COMPLETED && (
           <div className="flex-1 w-full max-w-7xl mx-auto">
              <Inspector />
           </div>
        )}

      </main>
    </div>
  );
};

export default App;