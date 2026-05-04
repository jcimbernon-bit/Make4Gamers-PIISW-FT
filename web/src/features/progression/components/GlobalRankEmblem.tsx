import React from 'react';
import { getGlobalTier } from '../services/progression.service';

interface GlobalRankEmblemProps {
  score: number;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showParticles?: boolean;
}


const sizeConfig = {
  sm: { container: 'w-12 h-12', icon: 'w-6 h-6 -bottom-2 -right-2' },
  md: { container: 'w-16 h-16', icon: 'w-8 h-8 -bottom-2 -right-2' },
  lg: { container: 'w-24 h-24', icon: 'w-12 h-12 -bottom-3 -right-3' },
  xl: { container: 'w-32 h-32', icon: 'w-16 h-16 -bottom-4 -right-4' },
};


const getTierEffects = (tier: string) => {
  const basePath = '/assets';
  
  switch(tier) {
    case 'Hierro': return {
      image: `${basePath}/hierro.png`,
      ring: 'ring-4 ring-slate-600',
      glow: 'shadow-[0_0_15px_rgba(71,85,105,0.3)]',
      effects: '',
      hasParticles: false,
    };
    case 'Bronce': return {
      image: `${basePath}/bronce.png`,
      ring: 'ring-4 ring-orange-700/80',
      glow: 'shadow-[0_0_20px_rgba(194,65,12,0.4)]',
      effects: '',
      hasParticles: false,
    };
    case 'Plata': return {
      image: `${basePath}/plata.png`,
      ring: 'ring-[5px] ring-slate-300',
      glow: 'shadow-[0_0_30px_rgba(203,213,225,0.6)]',
      effects: 'animate-pulse-glow',
      hasParticles: false,
    };
    case 'Oro': return {
      image: `${basePath}/oro.png`,
      ring: 'ring-[6px] ring-yellow-400',
      glow: 'shadow-[0_0_40px_rgba(250,204,21,0.8)]',
      effects: 'animate-float',
      hasParticles: true,
      particleColor: 'bg-yellow-400'
    };
    case 'Obsidiana': return {
      image: `${basePath}/obsidiana.png`,
      ring: 'ring-[6px] ring-fuchsia-600 ring-offset-2 ring-offset-slate-950', 
      glow: 'shadow-[0_0_50px_rgba(192,38,211,0.8)]',
      effects: 'animate-float',
      hasParticles: true,
      particleColor: 'bg-fuchsia-400'
    };
    default: return {
      image: `${basePath}/hierro.png`,
      ring: 'ring-4 ring-slate-600',
      glow: 'shadow-md',
      effects: '',
      hasParticles: false,
    };
  }
};

export default function GlobalRankEmblem({ score, children, size = 'md', showParticles = true }: GlobalRankEmblemProps) {
  const tier = getGlobalTier(score);
  const effects = getTierEffects(tier);
  const sizes = sizeConfig[size];

  return (
    <div className={`relative inline-flex items-center justify-center ${sizes.container} ${effects.effects}`}>
      
     
      <div className={`absolute inset-0 rounded-full ${effects.glow} bg-transparent`}></div>

    
      {showParticles && effects.hasParticles && (
        <div className="absolute inset-[-20px] pointer-events-none animate-spin-slow">
           <div className={`absolute top-0 left-1/2 w-1.5 h-1.5 rounded-full ${effects.particleColor} shadow-[0_0_10px_currentColor] blur-[1px]`}></div>
           <div className={`absolute bottom-0 right-1/4 w-2 h-2 rounded-full ${effects.particleColor} shadow-[0_0_10px_currentColor] blur-[1px]`}></div>
           <div className={`absolute top-1/3 -left-2 w-1 h-1 rounded-full ${effects.particleColor} shadow-[0_0_10px_currentColor]`}></div>
        </div>
      )}

     
      <div className={`relative z-10 w-full h-full rounded-full ${effects.ring} overflow-hidden bg-slate-900`}>
        {children}
      </div>

   
      <div className={`absolute z-20 ${sizes.icon} drop-shadow-xl hover:scale-125 transition-transform duration-300`}>
        <div className="absolute inset-0 bg-slate-950 rounded-full opacity-40 blur-sm"></div>
        <img 
          src={effects.image} 
          alt={`Rango ${tier}`} 
          className="relative w-full h-full object-contain"
        />
      </div>

    </div>
  );
}