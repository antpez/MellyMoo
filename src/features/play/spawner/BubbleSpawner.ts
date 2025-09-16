import { Bubble, BubbleColor, BubbleController, BubbleType } from '../components/Bubble';

export type SpawnConfig = {
  interval: number; // ms between spawns
  speed: number; // px/s upward velocity
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

  constructor(config: SpawnConfig, screenWidth: number, screenHeight: number) {
    this.config = config;
    this.screenWidth = screenWidth;
    this.screenHeight = screenHeight;
    this.lastSpawnTime = performance.now(); // Initialize with current time
  }

  update(currentTime: number, bubbles: Bubble[]): Bubble[] {
    const newBubbles: Bubble[] = [];
    
    // Check if it's time to spawn
    const timeSinceLastSpawn = currentTime - this.lastSpawnTime;
    if (timeSinceLastSpawn >= this.config.interval) {
      const bubble = this.spawnBubble();
      if (bubble) {
        newBubbles.push(bubble);
      }
      this.lastSpawnTime = currentTime;
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
    const id = `bubble_${++this.idCounter}`;

    switch (type) {
      case 'color':
        const color = this.getRandomColor();
        return BubbleController.create(id, 'color', x, y, color);
      
      case 'item':
        const itemKey = this.getRandomItem();
        return BubbleController.create(id, 'item', x, y, undefined, itemKey);
      
      case 'special':
        const specialKey = this.getRandomSpecial();
        return BubbleController.create(id, 'special', x, y, undefined, specialKey);
      
      case 'avoider':
        const avoiderKey = this.getRandomAvoider();
        return BubbleController.create(id, 'avoider', x, y, undefined, avoiderKey);
      
      default:
        return null;
    }
  }

  private rollBubbleType(): BubbleType | null {
    const rand = Math.random();
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
    return Math.random() * (this.screenWidth - 2 * margin) + margin;
  }

  private getRandomColor(): BubbleColor {
    const index = Math.floor(Math.random() * this.config.colors.length);
    return this.config.colors[index];
  }

  private getRandomItem(): string {
    const index = Math.floor(Math.random() * this.config.items.length);
    return this.config.items[index];
  }

  private getRandomSpecial(): string {
    const index = Math.floor(Math.random() * this.config.specials.length);
    return this.config.specials[index];
  }

  private getRandomAvoider(): string {
    const index = Math.floor(Math.random() * this.config.avoiders.length);
    return this.config.avoiders[index];
  }

  // Farm L1 defaults from the spec
  static getFarmL1Config(screenWidth: number, screenHeight: number): SpawnConfig {
    return {
      interval: 800, // 0.8 seconds between spawns (faster, more challenging)
      speed: 20, // 20 px/s upward (slower)
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
}
