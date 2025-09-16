export type BubbleType = 'color' | 'item' | 'special' | 'avoider';
export type BubbleColor = 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'pink';

export type Bubble = {
  id: string;
  type: BubbleType;
  color?: BubbleColor;
  x: number;
  y: number;
  radius: number;
  velocityY: number;
  lifetime: number;
  maxLifetime: number;
  isPopped: boolean;
  itemKey?: string; // For item/special bubbles
};

export class BubbleController {
  static create(
    id: string,
    type: BubbleType,
    x: number,
    y: number,
    color?: BubbleColor,
    itemKey?: string
  ): Bubble {
    return {
      id,
      type,
      color,
      x,
      y,
      radius: 30, // Base radius
      velocityY: -160, // Float upward (perfect speed for beginners)
      lifetime: 0,
      maxLifetime: 15, // 15 seconds max (longer)
      isPopped: false,
      itemKey,
    };
  }

  static update(bubble: Bubble, deltaTime: number): Bubble {
    if (bubble.isPopped) return bubble;

    return {
      ...bubble,
      y: bubble.y + bubble.velocityY * deltaTime,
      lifetime: bubble.lifetime + deltaTime,
    };
  }

  static isOffScreen(bubble: Bubble, screenHeight: number): boolean {
    // Bubble is off-screen if it's completely above the screen (y + radius < 0)
    // or completely below the screen (y - radius > screenHeight)
    return bubble.y + bubble.radius < 0 || bubble.y - bubble.radius > screenHeight;
  }

  static isExpired(bubble: Bubble): boolean {
    return bubble.lifetime >= bubble.maxLifetime;
  }

  static shouldCull(bubble: Bubble, screenHeight: number): boolean {
    return bubble.isPopped || this.isOffScreen(bubble, screenHeight) || this.isExpired(bubble);
  }

  static pop(bubble: Bubble): Bubble {
    return {
      ...bubble,
      isPopped: true,
    };
  }

  static isPointInside(bubble: Bubble, pointX: number, pointY: number): boolean {
    const dx = pointX - bubble.x;
    const dy = pointY - bubble.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance <= bubble.radius;
  }

  static getScoreValue(bubble: Bubble): number {
    switch (bubble.type) {
      case 'color': return 10;
      case 'item': return 15;
      case 'special': return 25;
      case 'avoider': return -5; // Penalty for popping avoiders
      default: return 0;
    }
  }
}
