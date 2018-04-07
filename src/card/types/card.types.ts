export type PlayerClass =
  | 'MAGE'
  | 'WARLOCK'
  | 'SHAMAN'
  | 'PALADIN'
  | 'PREIST'
  | 'ROGUE'
  | 'DRUID'
  | 'HUNTER'
  | 'WARRIOR';

export type CardClass = PlayerClass | 'NEUTRAL';

export type Rarity = 'FREE' | 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
