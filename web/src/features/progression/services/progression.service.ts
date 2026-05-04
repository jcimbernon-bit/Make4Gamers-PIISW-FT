
import { progressionConfig, defaultTierConfig, type Tier, type GlobalTier, globalThresholds } from '../config/progression.config';

export function getTierForScore(gameTitle: string, score: number): Tier {
  const config = progressionConfig.find(
    c => c.gameTitle.toLowerCase() === gameTitle.toLowerCase()
  ) || defaultTierConfig;

  const thresholds = config.thresholds;


  if (score >= thresholds.PS5) return 'PS5';
  if (score >= thresholds.PS4) return 'PS4';
  if (score >= thresholds.PS3) return 'PS3';
  if (score >= thresholds.PS1) return 'PS1';
  return 'SNES'; 
}

export function getGlobalTier(totalScore: number): GlobalTier {
  if (totalScore >= globalThresholds.Obsidiana) return 'Obsidiana';
  if (totalScore >= globalThresholds.Oro) return 'Oro';
  if (totalScore >= globalThresholds.Plata) return 'Plata';
  if (totalScore >= globalThresholds.Bronce) return 'Bronce';
  return 'Hierro';
}

export function calculateLazyGlobalScore(highScores: {displayTitle: string, score: number}[]): number {
  if (!highScores || highScores.length === 0) return 0;
  

  const gamePoints = highScores.map(record => {
    const tier = getTierForScore(record.displayTitle, record.score);
    const config = progressionConfig.find(
      c => c.gameTitle.toLowerCase() === record.displayTitle.toLowerCase()
    ) || defaultTierConfig;
    
    return config.multipliers[tier];
  });

  
  gamePoints.sort((a, b) => b - a);


  const top10Games = gamePoints.slice(0, 10);


  const totalScore = top10Games.reduce((sum, points) => sum + points, 0);

  return totalScore;
}

export function getGlobalProgress(totalScore: number) {

  if (totalScore >= globalThresholds.Obsidiana) {
    return {
      isMaxLevel: true,
      currentPoints: totalScore,
      nextTierName: 'Máximo Nivel',
      pointsNeeded: 0,
      percentage: 100
    };
  }

  let nextTierThreshold = 0;
  let currentTierThreshold = 0;
  let nextTierName = '';


  if (totalScore >= globalThresholds.Oro) {
    currentTierThreshold = globalThresholds.Oro;
    nextTierThreshold = globalThresholds.Obsidiana;
    nextTierName = 'Obsidiana';
  } else if (totalScore >= globalThresholds.Plata) {
    currentTierThreshold = globalThresholds.Plata;
    nextTierThreshold = globalThresholds.Oro;
    nextTierName = 'Oro';
  } else if (totalScore >= globalThresholds.Bronce) {
    currentTierThreshold = globalThresholds.Bronce;
    nextTierThreshold = globalThresholds.Plata;
    nextTierName = 'Plata';
  } else {
    currentTierThreshold = 0; 
    nextTierThreshold = globalThresholds.Bronce;
    nextTierName = 'Bronce';
  }


  const pointsNeeded = nextTierThreshold - totalScore;
  const pointsInCurrentTier = totalScore - currentTierThreshold;
  const pointsRequiredForNextTier = nextTierThreshold - currentTierThreshold;
  
  let percentage = Math.floor((pointsInCurrentTier / pointsRequiredForNextTier) * 100);


  if (isNaN(percentage) || percentage < 0) percentage = 0;
  if (percentage > 100) percentage = 100;

  return {
    isMaxLevel: false,
    currentPoints: totalScore,
    nextTierName,
    pointsNeeded,
    percentage,
    nextTierThreshold
  };
}



export function getGameProgress(gameTitle: string, score: number) {

  const config = progressionConfig.find(
    c => c.gameTitle.toLowerCase() === gameTitle.toLowerCase()
  ) || defaultTierConfig;

  const t = config.thresholds;


  if (score >= t.PS5) {
    return { percentage: 100, nextTierName: 'MAX', pointsNeeded: 0 };
  }
  
  let currentTierThreshold = 0;
  let nextTierThreshold = t.SNES;
  let nextTierName = 'SNES';

  if (score >= t.PS4) {
    currentTierThreshold = t.PS4;
    nextTierThreshold = t.PS5;
    nextTierName = 'PS5';
  } else if (score >= t.PS3) {
    currentTierThreshold = t.PS3;
    nextTierThreshold = t.PS4;
    nextTierName = 'PS4';
  } else if (score >= t.PS1) {
    currentTierThreshold = t.PS1;
    nextTierThreshold = t.PS3;
    nextTierName = 'PS3';
  } else if (score >= t.SNES) {
    currentTierThreshold = t.SNES;
    nextTierThreshold = t.PS1;
    nextTierName = 'PS1';
  }

  // Calculamos el porcentaje
  const pointsInCurrent = score - currentTierThreshold;
  const pointsRequired = nextTierThreshold - currentTierThreshold;
  const percentage = Math.max(0, Math.min(100, Math.floor((pointsInCurrent / pointsRequired) * 100)));

  return {
    percentage,
    nextTierName,
    pointsNeeded: nextTierThreshold - score,
  };
}


export function getGameControllerData(tier: string) {
  const basePath = '/assets/emblems';
  switch(tier) {
    case 'SNES': return { name: 'SNES', image: `${basePath}/nintendoEmblem.png`, color: 'text-slate-400', glow: 'shadow-slate-500/40', border: 'hover:border-slate-500/50', bgClass: 'bg-slate-400' };
    case 'PS1': return { name: 'PS1', image: `${basePath}/ps1Emblem.png`, color: 'text-orange-400', glow: 'shadow-orange-500/40', border: 'hover:border-orange-500/50', bgClass: 'bg-orange-400' };
    case 'PS3': return { name: 'PS3', image: `${basePath}/ps3Emblem.png`, color: 'text-slate-200', glow: 'shadow-slate-300/50', border: 'hover:border-slate-300/50', bgClass: 'bg-slate-200' };
    case 'PS4': return { name: 'PS4', image: `${basePath}/ps4Emblem.png`, color: 'text-yellow-400', glow: 'shadow-yellow-500/50', border: 'hover:border-yellow-500/50', bgClass: 'bg-yellow-400' };
    case 'PS5': return { name: 'PS5', image: `${basePath}/ps5Emblem.png`, color: 'text-fuchsia-400', glow: 'shadow-fuchsia-500/60', border: 'hover:border-fuchsia-500/50', bgClass: 'bg-fuchsia-400' };
    default: return { name: 'SNES', image: `${basePath}/nintendoEmblem.png`, color: 'text-slate-500', glow: 'shadow-slate-500/20', border: 'hover:border-slate-500/50', bgClass: 'bg-slate-500' };
  }
}

export function getGlobalControllerData(tier: string) {
  const basePath = '/assets';
  switch(tier) {
    case 'Hierro': return { name: 'Iniciado', image: `${basePath}/hierro.png`, color: 'text-slate-400', bgClass: 'bg-slate-400', glowClass: 'shadow-[0_0_15px_rgba(148,163,184,0.6)]' };
    case 'Bronce': return { name: 'Bronce', image: `${basePath}/bronce.png`, color: 'text-orange-400', bgClass: 'bg-orange-400', glowClass: 'shadow-[0_0_15px_rgba(251,146,60,0.6)]' };
    case 'Plata': return { name: 'Plata', image: `${basePath}/plata.png`, color: 'text-slate-200', bgClass: 'bg-slate-200', glowClass: 'shadow-[0_0_15px_rgba(226,232,240,0.7)]' };
    case 'Oro': return { name: 'Oro', image: `${basePath}/oro.png`, color: 'text-yellow-400', bgClass: 'bg-yellow-400', glowClass: 'shadow-[0_0_15px_rgba(250,204,21,0.7)]' };
    case 'Obsidiana': return { name: 'Leyenda', image: `${basePath}/obsidiana.png`, color: 'text-fuchsia-400', bgClass: 'bg-fuchsia-400', glowClass: 'shadow-[0_0_20px_rgba(192,38,211,0.8)]' };
    default: return { name: 'Iniciado', image: `${basePath}/hierro.png`, color: 'text-slate-400', bgClass: 'bg-slate-400', glowClass: 'shadow-[0_0_10px_rgba(148,163,184,0.4)]' };
  }
}