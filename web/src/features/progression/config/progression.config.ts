
export type Tier = 'SNES' | 'PS1' | 'PS3' | 'PS4' | 'PS5';


export type GlobalTier = 'Hierro' | 'Bronce' | 'Plata' | 'Oro' | 'Obsidiana';


export const globalThresholds: Record<GlobalTier, number> = {
  Hierro: 0,
  Bronce: 50,
  Plata: 150,
  Oro: 300,
  Obsidiana: 450
};

export interface GameTierConfig {
  gameTitle: string; 
  thresholds: Record<Tier, number>; 
  multipliers: Record<Tier, number>; 
}


const baseMultipliers: Record<Tier, number> = {
  SNES: 1,
  PS1: 5,
  PS3: 10,
  PS4: 20,
  PS5: 50
};


export const defaultTierConfig: GameTierConfig = {
  gameTitle: 'default',
  thresholds: { SNES: 50, PS1: 500, PS3: 1000, PS4: 2500, PS5: 5000 },
  multipliers: baseMultipliers
};

export const progressionConfig: GameTierConfig[] = [
  {
    gameTitle: 'Pilot Adventure', 
    thresholds: { SNES: 100, PS1: 500, PS3: 1000, PS4: 2500, PS5: 5000 },
    multipliers: baseMultipliers
  },
  {
    gameTitle: '3 en Raya', 
    thresholds: { SNES: 50, PS1: 150, PS3: 300, PS4: 500, PS5: 1000 },
    multipliers: baseMultipliers
  }
];