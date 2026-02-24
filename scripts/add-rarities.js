const fs = require('fs');
let c = fs.readFileSync('src/lib/mock-data.ts', 'utf8');

const rarityMap = {
  'OVERRUN AR': 'prestige',
  'TWIN TAP HBR': 'prestige',
  'CE TACTICAL SIDEARM': 'superior',
  'MAGNUM HC': 'superior',
  'BULLY SMG': 'deluxe',
  'WSTR COMBAT SHOTGUN': 'enhanced',
  'HARDLINE PR': 'deluxe',
  'DEMOLITION HMG': 'deluxe',
  'CONQUEST LMG': 'deluxe',
  'BRRT SMG': 'prestige',
  'LONGSHOT': 'superior',
  'V22 VOLT THROWER': 'prestige',
  'V11 PUNCH': 'superior',
  'V85 CIRCUIT BREAKER': 'superior',
  'V66 LOOKOUT': 'enhanced',
  'RETALIATOR LMG': 'standard',
  'M77 ASSAULT RIFLE': 'enhanced',
  'COPPERHEAD RF': 'deluxe',
  'REPEATER HPR': 'standard',
  'STRYDER MIT': 'standard',
};

// Add rarity to any weapon loadout entry that is missing it
// Pattern: image: '...WEAPON-Picsart-BackgroundRemover.png' followed by } (no rarity already)
for (const [weapon, rarity] of Object.entries(rarityMap)) {
  const escaped = weapon.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // Match the image path ending without rarity following
  const re = new RegExp(
    `(image: '/images/Weapons no bg/${escaped}-Picsart-BackgroundRemover\\.png')(?!,\\s*rarity)`,
    'g'
  );
  c = c.replace(re, `$1, rarity: '${rarity}'`);
}

fs.writeFileSync('src/lib/mock-data.ts', c);
console.log('Done. Checking...');

// Verify no entries are missing rarity
const weaponEntries = c.match(/slot: '(?:primary|sidearm|weapon3)'[^}]+}/g) || [];
const missing = weaponEntries.filter(e => !e.includes('rarity'));
if (missing.length) {
  console.log('Missing rarity on:', missing);
} else {
  console.log('All weapon entries have rarity!');
}
