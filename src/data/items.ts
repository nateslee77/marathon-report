import rawItems from './marathon-items.json';

// ── Types ──

export type ItemType =
  | 'Weapon'
  | 'Ammo'
  | 'Backpack'
  | 'Consumable'
  | 'Core'
  | 'Equipment'
  | 'Implant'
  | 'Mod'
  | 'Salvage'
  | 'Key'
  | 'Lost Contract'
  | 'Sponsored Kit'
  | 'Currency'
  | 'Valuable';

export type ItemRarity = 'Standard' | 'Enhanced' | 'Deluxe' | 'Superior' | 'Prestige';

export interface GameItem {
  Name: string;
  Type: ItemType;
  Rarity: ItemRarity;
  AppliesTo: string;
  Sources: string;
  FactionUsages: string;
  Credits: number | null;
  Notes: string;
}

// ── All items ──

export const ALL_ITEMS: GameItem[] = rawItems as GameItem[];

// ── Filtered helpers ──

export const WEAPONS = ALL_ITEMS.filter((i) => i.Type === 'Weapon');
export const CORES = ALL_ITEMS.filter((i) => i.Type === 'Core');
export const EQUIPMENT = ALL_ITEMS.filter((i) => i.Type === 'Equipment');
export const IMPLANTS = ALL_ITEMS.filter((i) => i.Type === 'Implant');
export const MODS = ALL_ITEMS.filter((i) => i.Type === 'Mod');
export const CONSUMABLES = ALL_ITEMS.filter((i) => i.Type === 'Consumable');
export const BACKPACKS = ALL_ITEMS.filter((i) => i.Type === 'Backpack');
export const AMMO = ALL_ITEMS.filter((i) => i.Type === 'Ammo');
export const SALVAGE = ALL_ITEMS.filter((i) => i.Type === 'Salvage');

// ── Lookup by name ──

export function getItemByName(name: string): GameItem | undefined {
  return ALL_ITEMS.find((i) => i.Name === name);
}

// ── Cores filtered by runner ──

export function getCoresForRunner(runner: string): GameItem[] {
  return CORES.filter((c) => c.AppliesTo === runner);
}

// ── Weapon icon shorthand (first letter of last word) ──

export function getWeaponIcon(name: string): string {
  const words = name.split(' ');
  return words[words.length - 1][0].toUpperCase();
}
