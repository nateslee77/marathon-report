import { RunnerType } from '@/types';

export type AbilityType = 'prime' | 'tactical' | 'trait1' | 'trait2';

export interface RunnerAbility {
  name: string;
  type: AbilityType;
  summary: string;
  description: string;
}

export const ABILITY_LABELS: Record<AbilityType, string> = {
  prime: 'Prime Ability',
  tactical: 'Tactical Ability',
  trait1: 'Trait 1',
  trait2: 'Trait 2',
};

// Placeholder symbols for each ability type
export const ABILITY_SYMBOLS: Record<AbilityType, string> = {
  prime: '◆',
  tactical: '▲',
  trait1: '◉',
  trait2: '◈',
};

export const RUNNER_ABILITIES: Record<RunnerType, RunnerAbility[]> = {
  destroyer: [
    {
      name: 'Search and Destroy',
      type: 'prime',
      summary: 'Homing missile suppression',
      description: 'Activate your shoulder-mounted missile pods. Dealing sustained damage to targets launches homing missiles that track enemies, immobilizing and dealing damage upon impact.',
    },
    {
      name: 'Riot Barricade',
      type: 'tactical',
      summary: 'Deployable energy shield',
      description: 'Deploy an energy barricade that blocks incoming damage. The barricade drains tactical ability energy over time, and taking damage drains additional energy.',
    },
    {
      name: 'Thruster',
      type: 'trait1',
      summary: 'Directional air boost',
      description: 'Activate while airborne to fire boosters that thrust you in the direction you are currently moving.',
    },
    {
      name: 'Tactical Sprint',
      type: 'trait2',
      summary: 'Overdrive movement',
      description: 'Double-press sprint to move faster at the cost of generating additional heat.',
    },
  ],
  vandal: [
    {
      name: 'Amplify',
      type: 'prime',
      summary: 'Movement overcharge',
      description: 'Overcharge your movement systems, reducing the heat buildup of movement abilities. Increases movement speed and weapon dexterity.',
    },
    {
      name: 'Disrupt Cannon',
      type: 'tactical',
      summary: 'Charged knockback blast',
      description: 'Press: Transform your arm into a cannon and fire a high-powered energy projectile that deals damage and pushes targets away. Hold: Overcharge your arm cannon, greatly increasing the size and damage of the blast.',
    },
    {
      name: 'Microjets',
      type: 'trait1',
      summary: 'Midair extra jump',
      description: 'Activate in air to perform another jump at the cost of generating additional heat.',
    },
    {
      name: 'Power Slide',
      type: 'trait2',
      summary: 'Supercharged slide',
      description: 'Grants a supercharged slide that generates additional heat.',
    },
  ],
  recon: [
    {
      name: 'Echo Pulse',
      type: 'prime',
      summary: 'Area sonar reveal',
      description: "Activate your shell's advanced detection systems, releasing a series of sonar pulses that reveal the location of nearby hostiles.",
    },
    {
      name: 'Tracker Drone',
      type: 'tactical',
      summary: 'Tracking explosive drone',
      description: 'Deploy a mechanized microbot that tracks down nearby hostiles and explodes, overheating any targets caught in the blast.',
    },
    {
      name: 'Interrogation',
      type: 'trait1',
      summary: 'Enemy intel feedback',
      description: "When pinged by a hostile Runner, you automatically receive a warning in your shell's HUD. Performing a finisher on a Runner pings their crew.",
    },
    {
      name: 'Stalker Protocol',
      type: 'trait2',
      summary: 'Shield-break tracking',
      description: "After breaking a combatant's shields, they leave behind a lingering holographic trail for a short time.",
    },
  ],
  assassin: [
    {
      name: 'Smoke Screen',
      type: 'prime',
      summary: 'Line smoke deployment',
      description: 'Throw a smoke disc that emits a line of smoke fields in front of you, disrupting the optics of those who step inside.',
    },
    {
      name: 'Active Camo',
      type: 'tactical',
      summary: 'Temporary invisibility',
      description: "Activate your shell's camouflage systems, pulling a shroud of invisibility over yourself. Performing offensive actions, taking damage, and using abilities or consumables briefly disrupts your invisibility.",
    },
    {
      name: 'Shadow Dive',
      type: 'trait1',
      summary: 'Aerial smoke slam',
      description: 'Activate while airborne to slam a smoke disc into the ground, deploying a smoke field.',
    },
    {
      name: 'Shroud',
      type: 'trait2',
      summary: 'Smoke-triggered invisibility',
      description: 'Your shell automatically activates camouflage systems when entering any smoke field, making you invisible. Invisibility persists for a short time after leaving the smoke field.',
    },
  ],
  triage: [
    {
      name: 'Reboot+',
      type: 'prime',
      summary: 'Ranged revive and EMP',
      description: 'Lock on to downed crew members or hostile targets and fire your Reboot+ device at them, which revives crew members and EMPs hostiles.',
    },
    {
      name: 'Med-Drone',
      type: 'tactical',
      summary: 'Mobile healing drone',
      description: 'Deploy a floating medical drone that attaches to crew members and restores health or recharges shields, and prevents them from bleeding out while downed.',
    },
    {
      name: 'Shareware.exe',
      type: 'trait1',
      summary: 'Shared healing effects',
      description: 'Benefits from medical consumables are shared between crew members with Med-Drone attached to them.',
    },
    {
      name: 'Battery Overcharge',
      type: 'trait2',
      summary: 'Weapon power boost',
      description: "Divert energy from your cooling systems to boost the performance of your weapons at the cost of generating additional heat. While active, breaking a target's shield with a volt weapon EMPs them.",
    },
  ],
  thief: [
    {
      name: 'Pickpocket Drone',
      type: 'prime',
      summary: 'Remote utility drone',
      description: 'Deploy a remotely piloted flying drone with a limited lifespan.',
    },
    {
      name: 'Grapple Device',
      type: 'tactical',
      summary: 'Mobility grapple',
      description: 'Launch a grapple device in your aim direction, propelling yourself towards it.',
    },
    {
      name: 'X-ray Visor',
      type: 'trait1',
      summary: 'Value-based tracking',
      description: "Activate your visor, highlighting hostiles and containers in the color of the most valuable item they're storing. Containers are revealed through walls, while hostiles require line of sight. While active, aiming at a hostile for a short time hacks their optics, disrupting their vision until you look away.",
    },
    {
      name: 'The Finer Things',
      type: 'trait2',
      summary: 'Loot-scaling buffs',
      description: 'Gain increased weapon handling and accelerated Grapple Device recharge rate based on the number of items in your backpack.',
    },
  ],
  rook: [
    {
      name: 'Recuperation',
      type: 'prime',
      summary: 'Coming soon',
      description: 'Description coming soon.',
    },
    {
      name: 'Signal Mask',
      type: 'tactical',
      summary: 'Coming soon',
      description: 'Description coming soon.',
    },
    {
      name: '—',
      type: 'trait1',
      summary: 'Coming soon',
      description: 'Description coming soon.',
    },
    {
      name: '—',
      type: 'trait2',
      summary: 'Coming soon',
      description: 'Description coming soon.',
    },
  ],
};
