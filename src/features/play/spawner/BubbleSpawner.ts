import { Bubble, BubbleColor, BubbleController, BubbleType } from '../components/Bubble';

export type SpawnConfig = {
  interval: number; // ms between spawns
  speed: number; // px/s upward velocity
  sizeChances: { small: number; medium: number; large: number };
  probabilities: {
    color: number;
    item: number;
    special: number;
    avoider: number;
  };
  colors: BubbleColor[];
  items: string[];
  specials: string[];
  avoiders: string[];
};

export class BubbleSpawner {
  private config: SpawnConfig;
  private lastSpawnTime: number = 0;
  private screenWidth: number;
  private screenHeight: number;
  private idCounter: number = 0;
  private spawnRateMultiplier: number = 1.0;
  private deterministicSeed: boolean = false;
  private randomSeed: number = Math.random();

  constructor(config: SpawnConfig, screenWidth: number, screenHeight: number) {
    this.config = config;
    this.screenWidth = screenWidth;
    this.screenHeight = screenHeight;
    this.lastSpawnTime = performance.now(); // Initialize with current time
  }

  update(currentTime: number, bubbles: Bubble[]): Bubble[] {
    const newBubbles: Bubble[] = [];
    
    // Check if it's time to spawn (apply spawn rate multiplier)
    const adjustedInterval = this.config.interval / this.spawnRateMultiplier;
    let timeSinceLastSpawn = currentTime - this.lastSpawnTime;

    // If the screen is empty, guarantee at least one bubble immediately
    if (bubbles.length === 0 && timeSinceLastSpawn > 50) {
      const immediate = this.spawnBubble();
      if (immediate) newBubbles.push(immediate);
      this.lastSpawnTime = currentTime;
      timeSinceLastSpawn = 0;
    }

    // Spawn catch-up in case frames are delayed
    const maxPerTick = 3; // spawn burst cap
    let spawned = 0;
    while (timeSinceLastSpawn >= adjustedInterval && spawned < maxPerTick) {
      const bubble = this.spawnBubble();
      if (bubble) newBubbles.push(bubble);
      this.lastSpawnTime += adjustedInterval;
      timeSinceLastSpawn = currentTime - this.lastSpawnTime;
      spawned++;
    }

    return newBubbles;
  }

  /** Allows the Director to adjust spawn rate dynamically */
  public setIntervalMs(interval: number) {
    this.config.interval = Math.max(100, interval); // clamp to sane minimum
  }

  private spawnBubble(): Bubble | null {
    const type = this.rollBubbleType();
    if (!type) return null;

    const x = this.getRandomX();
    const y = this.screenHeight * 0.8; // Spawn in the lower part of screen (80% down)
    const id = `bubble_${Date.now()}_${++this.idCounter}_${Math.random().toString(36).slice(2,6)}`;

    // Choose size based on config
    const size = this.rollSize();
    const speedBySize = size === 'small' ? this.config.speed * 1.25 : size === 'large' ? this.config.speed * 0.75 : this.config.speed;

    switch (type) {
      case 'color':
        const color = this.getRandomColor();
        return BubbleController.create(id, 'color', x, y, color, undefined, -speedBySize, size);
      
      case 'item':
        const itemKey = this.getRandomItem();
        return BubbleController.create(id, 'item', x, y, undefined, itemKey, -speedBySize, size);
      
      case 'special':
        const specialKey = this.getRandomSpecial();
        return BubbleController.create(id, 'special', x, y, undefined, specialKey, -speedBySize, size);
      
      case 'avoider':
        const avoiderKey = this.getRandomAvoider();
        return BubbleController.create(id, 'avoider', x, y, undefined, avoiderKey, -speedBySize, size);
      
      default:
        return null;
    }
  }

  private rollSize(): 'small' | 'medium' | 'large' {
    const r = this.seededRandom();
    const { small, medium, large } = this.config.sizeChances;
    if (r < small) return 'small';
    if (r < small + medium) return 'medium';
    return 'large';
  }

  private rollBubbleType(): BubbleType | null {
    const rand = this.seededRandom();
    let cumulative = 0;

    cumulative += this.config.probabilities.color;
    if (rand <= cumulative) return 'color';

    cumulative += this.config.probabilities.item;
    if (rand <= cumulative) return 'item';

    cumulative += this.config.probabilities.special;
    if (rand <= cumulative) return 'special';

    cumulative += this.config.probabilities.avoider;
    if (rand <= cumulative) return 'avoider';

    return null;
  }

  private getRandomX(): number {
    const margin = 50;
    return this.seededRandom() * (this.screenWidth - 2 * margin) + margin;
  }

  private getRandomColor(): BubbleColor {
    const index = Math.floor(this.seededRandom() * this.config.colors.length);
    return this.config.colors[index];
  }

  private getRandomItem(): string {
    const index = Math.floor(this.seededRandom() * this.config.items.length);
    return this.config.items[index];
  }

  private getRandomSpecial(): string {
    const index = Math.floor(this.seededRandom() * this.config.specials.length);
    return this.config.specials[index];
  }

  private getRandomAvoider(): string {
    const index = Math.floor(this.seededRandom() * this.config.avoiders.length);
    return this.config.avoiders[index];
  }

  // Farm L1 defaults from the spec
  static getFarmL1Config(screenWidth: number, screenHeight: number): SpawnConfig {
    return {
      interval: 800, // base
      speed: 160, // beginner baseline
      sizeChances: { small: 0.0, medium: 1.0, large: 0.0 },
      probabilities: {
        color: 1.0, // Only color bubbles for now
        item: 0.0,
        special: 0.0,
        avoider: 0.0,
      },
      colors: ['blue', 'green', 'pink', 'yellow'],
      items: ['flower', 'carrot', 'apple'],
      specials: ['rainbow_bubble'],
      avoiders: ['mud'],
    };
  }

  /** Level-based spawn config helper (1..20). Uses new LevelConfigs system */
  static getLevelConfig(level: number, screenWidth: number, screenHeight: number): SpawnConfig {
    // Import here to avoid circular dependencies
    const { getLevelConfig } = require('../config/LevelConfigs');
    const levelConfig = getLevelConfig(level, screenWidth, screenHeight);
    
    if (levelConfig) {
      return levelConfig.spawnConfig;
    }
    
    // Fallback to old system if level config not found
    const clamped = Math.min(20, Math.max(1, level));
    const t = (clamped - 1) / 19; // 0..1 progression
    const interval = 800 - Math.round(450 * t); // 800 → 350ms
    const speed = 160 + Math.round(120 * t);    // 160 → 280 px/s
    const base = this.getFarmL1Config(screenWidth, screenHeight);
    // Size unlocks: large from level>=3, small from level>=6. Gradually add chances.
    const sizeChances = {
      small: clamped >= 6 ? 0.25 + 0.15 * t : 0.0, // up to ~0.40
      large: clamped >= 3 ? 0.20 + 0.10 * t : 0.0, // up to ~0.30
      medium: 1.0, // placeholder, normalized below
    };
    const sumSL = sizeChances.small + sizeChances.large;
    sizeChances.medium = Math.max(0, 1 - sumSL);
    return { ...base, interval, speed, sizeChances };
  }

  // Dev toggle methods
  setSpawnRateMultiplier(multiplier: number) {
    this.spawnRateMultiplier = Math.max(0.1, Math.min(5.0, multiplier));
  }

  setDeterministic(enabled: boolean) {
    this.deterministicSeed = enabled;
    if (enabled) {
      this.randomSeed = 12345; // Fixed seed for deterministic behavior
    } else {
      this.randomSeed = Math.random();
    }
  }

  // Deterministic random number generator
  private seededRandom(): number {
    if (this.deterministicSeed) {
      // Simple linear congruential generator
      this.randomSeed = (this.randomSeed * 1664525 + 1013904223) % 4294967296;
      return this.randomSeed / 4294967296;
    }
    return Math.random();
  }
}
