export type PlayerClass =
  | 'MAGE'
  | 'WARLOCK'
  | 'SHAMAN'
  | 'PALADIN'
  | 'PRIEST'
  | 'ROGUE'
  | 'DRUID'
  | 'HUNTER'
  | 'WARRIOR';

export type CardClass = PlayerClass | 'NEUTRAL';

export type Rarity = 'FREE' | 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
