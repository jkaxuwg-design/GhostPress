
import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../store';
import { ArrowLeftRight, Download, Trash2, CheckCircle } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';
import { translations } from '../i18n';

export const Inspector: React.FC = () => {
  const { filePreview, compressedPreview, stats, reset, language } = useStore();
  const [sliderPos, setSliderPos] = useState(50);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const t = translations[language];

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDownload = () => {
    if (!compressedPreview) return;
    const link = document.createElement('a');
    link.href = compressedPreview;
    link.download = `ghostpress_optimized_${Date.now()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle dragging
  const handleMouseDown = () => setIsResizing(true);
  
  useEffect(() => {
    const handleMouseUp = () => setIsResizing(false);
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      setSliderPos((x / rect.width) * 100);
    };

    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isResizing]);

  if (!filePreview || !compressedPreview || !stats) return null;

  return (
    <div className="flex flex-col lg:flex-row h-full gap-6 animate-fade-in">
      {/* Comparison Area */}
      <div className="flex-1 relative flex items-center justify-center bg-black/40 rounded-2xl border border-ghost-border p-4 overflow-hidden">
        <div 
            ref={containerRef}
            className="relative w-full h-full max-h-[70vh] flex items-center justify-center select-none"
        >
            {/* Original Image (Bottom Layer) */}
            <img 
                src={filePreview} 
                className="absolute inset-0 w-full h-full object-contain pointer-events-none opacity-50 blur-sm scale-95" 
                alt="Background reference"
            />
            
            {/* Actual Comparison Container */}
            <div className="relative h-full w-full max-w-4xl max-h-full aspect-video mx-auto shadow-2xl">
                 {/* Compressed (Underneath) */}
                <img 
                    src={compressedPreview} 
                    className="absolute inset-0 w-full h-full object-contain bg-ghost-900/50"
                    alt="Compressed"
                />

                {/* Original (Overlaid & Clipped) */}
                <div 
                    className="absolute inset-0 w-full h-full"
                    style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
                >
                    <img 
                        src={filePreview} 
                        className="absolute inset-0 w-full h-full object-contain bg-ghost-900/50"
                        alt="Original"
                    />
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur text-xs px-2 py-1 rounded text-white border border-white/10">{t.badge_orig}</div>
                </div>
                
                 {/* Compressed Label */}
                 <div className="absolute top-4 right-4 bg-ghost-neon/20 backdrop-blur text-xs px-2 py-1 rounded text-ghost-neon border border-ghost-neon/30">
                    {t.badge_new}
                 </div>

                {/* Slider Handle */}
                <div 
                    className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                    style={{ left: `${sliderPos}%` }}
                    onMouseDown={handleMouseDown}
                >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg text-black">
                        <ArrowLeftRight size={16} />
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Results Panel */}
      <GlassCard className="w-full lg:w-80 p-6 flex flex-col justify-between space-y-6">
        <div>
            <div className="flex items-center space-x-2 text-ghost-neon mb-6">
                <CheckCircle className="w-5 h-5" />
                <span className="font-bold tracking-widest uppercase">{t.proc_complete}</span>
            </div>

            <div className="space-y-6">
                <div className="p-4 bg-ghost-800/50 rounded-lg border border-white/5">
                    <p className="text-gray-400 text-xs uppercase mb-1">{t.savings}</p>
                    <div className="text-3xl font-bold text-white">
                        {stats.compressionRatio.toFixed(1)}%
                    </div>
                    <div className="text-sm text-green-400 font-mono">
                        -{formatSize(stats.originalSize - stats.compressedSize)}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-gray-500 text-[10px] uppercase">{t.label_orig}</p>
                        <p className="text-sm font-mono text-gray-300">{formatSize(stats.originalSize)}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 text-[10px] uppercase">{t.label_new}</p>
                        <p className="text-sm font-mono text-ghost-neon">{formatSize(stats.compressedSize)}</p>
                    </div>
                </div>
            </div>
        </div>

        <div className="space-y-3">
            <button 
                onClick={handleDownload}
                className="w-full py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
            >
                <Download size={18} />
                <span>{t.btn_extract}</span>
            </button>
            <button 
                onClick={reset}
                className="w-full py-3 border border-ghost-border text-gray-400 hover:text-red-400 hover:border-red-400/30 rounded-lg transition-colors flex items-center justify-center space-x-2 text-xs uppercase tracking-wider"
            >
                <Trash2 size={14} />
                <span>{t.btn_burn}</span>
            </button>
        </div>
      </GlassCard>
    </div>
  );
};
