
import React from 'react';
import { useStore } from '../store';
import { Sliders, Shield, Zap, Cpu } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';
import { FileType } from '../types';
import { translations } from '../i18n';

export const ControlDeck: React.FC = () => {
  const state = useStore();
  const isImage = state.fileType === FileType.IMAGE;
  const t = translations[state.language];

  return (
    <GlassCard className="p-6 h-full flex flex-col space-y-8 min-w-[320px]">
      <div className="flex items-center space-x-3 border-b border-ghost-border pb-4">
        <Sliders className="w-5 h-5 text-ghost-neon" />
        <h3 className="font-semibold tracking-wider text-sm uppercase text-gray-300">{t.ctrl_deck}</h3>
      </div>

      {/* Quality Slider */}
      <div className="space-y-3">
        <div className="flex justify-between text-xs font-mono text-gray-400">
          <span>{t.comp_ratio}</span>
          <span className="text-ghost-neon">{state.quality}%</span>
        </div>
        <input
          type="range"
          min="1"
          max="100"
          value={state.quality}
          onChange={(e) => state.setQuality(Number(e.target.value))}
          className="w-full h-1 bg-ghost-800 rounded-lg appearance-none cursor-pointer accent-ghost-neon hover:accent-ghost-accent transition-all"
        />
        <div className="flex justify-between text-[10px] text-gray-600 uppercase font-bold">
          <span>{t.max_save}</span>
          <span>{t.lossless}</span>
        </div>
      </div>

      {/* Scale Slider (Images Only) */}
      {isImage && (
        <div className="space-y-3">
          <div className="flex justify-between text-xs font-mono text-gray-400">
            <span>{t.dim_scale}</span>
            <span className="text-ghost-accent">{state.resizeScale}x</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.1"
            value={state.resizeScale}
            onChange={(e) => state.setResizeScale(Number(e.target.value))}
            className="w-full h-1 bg-ghost-800 rounded-lg appearance-none cursor-pointer accent-ghost-accent"
          />
        </div>
      )}

      {/* Format Selector */}
      <div className="space-y-3">
        <div className="text-xs font-mono text-gray-400 uppercase">{t.out_format}</div>
        <div className="grid grid-cols-2 gap-2">
           {isImage ? (
             <>
               <button 
                 onClick={() => state.setFormat('webp')}
                 className={`p-2 text-xs border rounded transition-colors ${state.format === 'webp' ? 'border-ghost-neon bg-ghost-neon/10 text-ghost-neon' : 'border-ghost-border text-gray-500 hover:border-gray-500'}`}
               >
                 WEBP
               </button>
               <button 
                 onClick={() => state.setFormat('jpeg')}
                 className={`p-2 text-xs border rounded transition-colors ${state.format === 'jpeg' ? 'border-ghost-neon bg-ghost-neon/10 text-ghost-neon' : 'border-ghost-border text-gray-500 hover:border-gray-500'}`}
               >
                 JPEG
               </button>
             </>
           ) : (
             <button 
                onClick={() => state.setFormat('mp4')}
                className={`col-span-2 p-2 text-xs border rounded border-ghost-neon bg-ghost-neon/10 text-ghost-neon`}
             >
                MP4 (H.264)
             </button>
           )}
        </div>
      </div>

      {/* Privacy Toggle */}
      <div className="flex items-center justify-between p-3 bg-ghost-800/30 rounded-lg border border-ghost-border">
        <div className="flex items-center space-x-3">
          <Shield className={`w-4 h-4 ${state.stripMetadata ? 'text-green-400' : 'text-gray-600'}`} />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-300">{t.stealth_mode}</span>
            <span className="text-[10px] text-gray-500">{t.strip_metadata}</span>
          </div>
        </div>
        <button 
          onClick={state.toggleMetadata}
          className={`w-10 h-5 rounded-full relative transition-colors ${state.stripMetadata ? 'bg-green-500/20' : 'bg-gray-700'}`}
        >
          <div className={`absolute top-1 left-1 w-3 h-3 rounded-full bg-current transition-transform ${state.stripMetadata ? 'translate-x-5 text-green-400' : 'text-gray-400'}`} />
        </button>
      </div>

       {/* Performance Mode */}
       <div className="space-y-2 pt-4 border-t border-ghost-border">
        <div className="flex items-center space-x-2 text-xs font-mono text-gray-400 uppercase mb-2">
            <Cpu className="w-3 h-3" />
            <span>{t.proc_power}</span>
        </div>
        <div className="flex bg-ghost-800/50 p-1 rounded-lg">
            <button 
                onClick={() => state.setPerformanceMode('eco')}
                className={`flex-1 py-1.5 text-[10px] font-bold rounded transition-all ${state.performanceMode === 'eco' ? 'bg-ghost-glass shadow text-gray-200' : 'text-gray-600 hover:text-gray-400'}`}
            >
                {t.eco}
            </button>
            <button 
                onClick={() => state.setPerformanceMode('beast')}
                className={`flex-1 py-1.5 text-[10px] font-bold rounded transition-all flex items-center justify-center space-x-1 ${state.performanceMode === 'beast' ? 'bg-ghost-accent/20 text-ghost-accent shadow' : 'text-gray-600 hover:text-gray-400'}`}
            >
                <span>{t.beast}</span>
                <Zap className="w-3 h-3" />
            </button>
        </div>
       </div>

    </GlassCard>
  );
};
