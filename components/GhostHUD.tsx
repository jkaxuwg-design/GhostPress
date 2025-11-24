
import React, { useEffect, useState } from 'react';
import { useStore } from '../store';
import { AppStatus } from '../types';
import { Activity, Cpu, HardDrive } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';
import { translations } from '../i18n';

export const GhostHUD: React.FC = () => {
  const { status, progress, performanceMode, language } = useStore();
  const [metrics, setMetrics] = useState({
    cpu: 0,
    threads: 0,
    temp: 35,
    throughput: 0
  });
  
  const t = translations[language];

  // Simulate metrics update
  useEffect(() => {
    if (status !== AppStatus.PROCESSING) return;

    const interval = setInterval(() => {
      setMetrics(prev => ({
        cpu: performanceMode === 'beast' ? 85 + Math.random() * 15 : 30 + Math.random() * 10,
        threads: performanceMode === 'beast' ? 12 : 2,
        temp: prev.temp < (performanceMode === 'beast' ? 75 : 45) ? prev.temp + Math.random() * 2 : prev.temp - Math.random(),
        throughput: Math.random() * 150 + 50 // MB/s
      }));
    }, 200);

    return () => clearInterval(interval);
  }, [status, performanceMode]);

  if (status !== AppStatus.PROCESSING) return null;

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in-down w-full max-w-lg px-4">
      <GlassCard className="p-4 border-ghost-neon/30 shadow-[0_0_50px_rgba(6,182,212,0.1)]">
        <div className="flex justify-between items-end mb-2">
            <span className="text-xs font-mono text-ghost-neon animate-pulse">{t.hud_active}</span>
            <span className="text-xs font-mono text-gray-400">{Math.round(progress)}%</span>
        </div>
        
        {/* Progress Bar */}
        <div className="h-1 w-full bg-ghost-800 rounded-full overflow-hidden mb-4">
            <div 
                className="h-full bg-ghost-neon shadow-[0_0_10px_currentColor] transition-all duration-200"
                style={{ width: `${progress}%` }}
            />
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center">
                <div className="text-[10px] uppercase text-gray-500 mb-1 flex items-center gap-1">
                    <Cpu className="w-3 h-3" /> {t.load}
                </div>
                <div className="text-lg font-mono font-bold text-white">{Math.round(metrics.cpu)}%</div>
            </div>
            <div className="flex flex-col items-center border-l border-ghost-border border-r">
                <div className="text-[10px] uppercase text-gray-500 mb-1 flex items-center gap-1">
                    <Activity className="w-3 h-3" /> {t.temp}
                </div>
                <div className={`text-lg font-mono font-bold ${metrics.temp > 70 ? 'text-red-400' : 'text-white'}`}>
                    {Math.round(metrics.temp)}°C
                </div>
            </div>
            <div className="flex flex-col items-center">
                <div className="text-[10px] uppercase text-gray-500 mb-1 flex items-center gap-1">
                    <HardDrive className="w-3 h-3" /> {t.io}
                </div>
                <div className="text-lg font-mono font-bold text-white">{Math.round(metrics.throughput)} <span className="text-[10px]">MB/s</span></div>
            </div>
        </div>
      </GlassCard>
    </div>
  );
};
