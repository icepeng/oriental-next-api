// tslint:disable:no-var-requires

const DRUID = require('./cards_DRUID.json');
const HUNTER = require('./cards_HUNTER.json');
const MAGE = require('./cards_MAGE.json');
const PALADIN = require('./cards_PALADIN.json');
const PRIEST = require('./cards_PRIEST.json');
const ROGUE = require('./cards_ROGUE.json');
const SHAMAN = require('./cards_SHAMAN.json');
const WARLOCK = require('./cards_WARLOCK.json');
const WARRIOR = require('./cards_WARRIOR.json');
const NEUTRAL = require('./cards_NEUTRAL.json');

export const cards = [
  ...DRUID,
  ...HUNTER,
  ...MAGE,
  ...PALADIN,
  ...PRIEST,
  ...ROGUE,
  ...SHAMAN,
  ...WARLOCK,
  ...WARRIOR,
  ...NEUTRAL,
];
