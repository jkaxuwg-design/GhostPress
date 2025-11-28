/// <reference lib="dom" />
import React, { useRef, useState } from 'react';
import { Upload, ScanLine } from 'lucide-react';
import { useStore } from '../store';
import { GlassCard } from './ui/GlassCard';
import { translations } from '../i18n';

export const Dropzone: React.FC = () => {
  const { setFile, language } = useStore((state) => state);
  const [isDragActive, setIsDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const t = translations[language];

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-12 px-4 animate-fade-in-up">
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`
          relative group cursor-pointer transition-all duration-500
          ${isDragActive ? 'scale-105' : 'scale-100'}
        `}
      >
        <GlassCard className={`
          h-96 flex flex-col items-center justify-center text-center p-8
          border-dashed border-2 
          ${isDragActive ? 'border-ghost-neon bg-ghost-neon/5' : 'border-ghost-border hover:border-ghost-accent/50'}
        `}>
          {/* Animated decorative rings */}
          <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-700 ${isDragActive ? 'opacity-100' : 'opacity-0'}`}>
             <div className="w-64 h-64 rounded-full border border-ghost-neon/30 animate-ping absolute"></div>
             <div className="w-48 h-48 rounded-full border border-ghost-neon/50 animate-pulse absolute"></div>
          </div>

          <div className="relative z-10 flex flex-col items-center space-y-6">
            <div className={`p-6 rounded-full bg-ghost-800/50 backdrop-blur-md border border-ghost-border transition-transform duration-500 ${isDragActive ? 'rotate-180 scale-110 border-ghost-neon' : ''}`}>
              {isDragActive ? (
                <ScanLine className="w-12 h-12 text-ghost-neon" />
              ) : (
                <Upload className="w-12 h-12 text-gray-400 group-hover:text-ghost-accent transition-colors" />
              )}
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-light tracking-tight text-white">
                {isDragActive ? t.drop_title_active : t.drop_title_idle}
              </h2>
              <p className="text-gray-400 max-w-md mx-auto text-sm font-mono">
                {t.drop_subtitle} <br/>
                <span className="text-xs text-gray-600">{t.drop_secure}</span>
              </p>
            </div>
          </div>

          <input 
            ref={inputRef}
            type="file" 
            className="hidden" 
            accept="image/png, image/jpeg, image/webp, video/mp4, video/quicktime"
            onChange={handleFileSelect}
          />
        </GlassCard>
      </div>
    </div>
  );
};