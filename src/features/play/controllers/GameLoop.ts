export type GameLoopState = {
  isRunning: boolean;
  lastTime: number;
  deltaTime: number;
  frameCount: number;
  slowMoEnabled: boolean;
  slowMoMultiplier: number;
};

export class GameLoop {
  private state: GameLoopState = {
    isRunning: false,
    lastTime: 0,
    deltaTime: 0,
    frameCount: 0,
    slowMoEnabled: false,
    slowMoMultiplier: 0.5, // 50% speed when slow-mo is enabled
  };
  
  private animationFrameId: number | null = null;
  private onUpdate: (dt: number) => void;
  private onRender: (dt: number) => void;

  constructor(
    onUpdate: (dt: number) => void,
    onRender: (dt: number) => void
  ) {
    this.onUpdate = onUpdate;
    this.onRender = onRender;
  }

  start() {
    if (this.state.isRunning) return;
    
    this.state.isRunning = true;
    this.state.lastTime = performance.now();
    this.state.frameCount = 0;
    this.tick();
  }

  stop() {
    this.state.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private tick = () => {
    if (!this.state.isRunning) return;

    const currentTime = performance.now();
    let deltaTime = Math.min((currentTime - this.state.lastTime) / 1000, 0.1); // Cap at 100ms
    
    // Apply slow-mo multiplier if enabled
    if (this.state.slowMoEnabled) {
      deltaTime *= this.state.slowMoMultiplier;
    }
    
    this.state.deltaTime = deltaTime;
    this.state.lastTime = currentTime;
    this.state.frameCount++;

    // Update game logic
    this.onUpdate(this.state.deltaTime);
    
    // Render
    this.onRender(this.state.deltaTime);

    // Schedule next frame
    this.animationFrameId = requestAnimationFrame(this.tick);
  };

  getState(): GameLoopState {
    return { ...this.state };
  }

  isActive(): boolean {
    return this.state.isRunning;
  }

  setSlowMo(enabled: boolean) {
    this.state.slowMoEnabled = enabled;
  }

  setSlowMoMultiplier(multiplier: number) {
    this.state.slowMoMultiplier = Math.max(0.1, Math.min(1.0, multiplier));
  }
}
