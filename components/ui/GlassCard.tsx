import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  onClick,
  hoverEffect = false 
}) => {
  return (
    <div 
      onClick={onClick}
      className={`
        relative overflow-hidden
        bg-ghost-900/40 backdrop-blur-xl 
        border border-ghost-border
        rounded-2xl
        shadow-xl
        transition-all duration-300
        ${hoverEffect ? 'hover:border-ghost-neon/50 hover:shadow-ghost-neon/10 hover:-translate-y-1 cursor-pointer' : ''}
        ${className}
      `}
    >
      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
