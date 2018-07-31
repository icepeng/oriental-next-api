const list = require('./input.json');
const changeCase = require('change-case');
const fs = require('fs-extra');

const ko = list.reduce((obj, item) => {
  return {
    ...obj,
    [changeCase.paramCase(item.cardNameSlug)]: {
      imgLink: item.localizedImage.ko_KR,
      name: '',
    },
  };
}, {});

const en = list.reduce((obj, item) => {
  return {
    ...obj,
    [changeCase.paramCase(item.cardNameSlug)]: {
      imgLink: item.localizedImage.en_US,
      name: '',
    },
  };
}, {});

const cards = list.map(item => {
  return {
    id: changeCase.paramCase(item.cardNameSlug),
    class: item.class,
    rarity: '',
    cost: '',
  };
});

const druid = cards.filter(x => x.class === 'DRUID');
const hunter = cards.filter(x => x.class === 'HUNTER');
const mage = cards.filter(x => x.class === 'MAGE');
const neutral = cards.filter(x => x.class === 'NEUTRAL');
const paladin = cards.filter(x => x.class === 'PALADIN');
const priest = cards.filter(x => x.class === 'PRIEST');
const rogue = cards.filter(x => x.class === 'ROGUE');
const shaman = cards.filter(x => x.class === 'SHAMAN');
const warlock = cards.filter(x => x.class === 'WARLOCK');
const warrior = cards.filter(x => x.class === 'WARRIOR');

Promise.all([
  // fs.writeJSON('ko-kr.cards.json', ko, { spaces: 2 }),
  // fs.writeJSON('en-us.cards.json', en, { spaces: 2 }),
  // fs.writeJSON('cards_DRUID.json', druid, { spaces: 2 }),
  // fs.writeJSON('cards_HUNTER.json', hunter, { spaces: 2 }),
  // fs.writeJSON('cards_MAGE.json', mage, { spaces: 2 }),
  // fs.writeJSON('cards_NEUTRAL.json', neutral, { spaces: 2 }),
  fs.writeJSON('cards_PALADIN.json', paladin, { spaces: 2 }),
  // fs.writeJSON('cards_PRIEST.json', priest, { spaces: 2 }),
  // fs.writeJSON('cards_ROGUE.json', rogue, { spaces: 2 }),
  // fs.writeJSON('cards_SHAMAN.json', shaman, { spaces: 2 }),
  // fs.writeJSON('cards_WARLOCK.json', warlock, { spaces: 2 }),
  // fs.writeJSON('cards_WARRIOR.json', warrior, { spaces: 2 }),
]);
