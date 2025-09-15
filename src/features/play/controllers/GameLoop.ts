export type GameLoopState = {
  isRunning: boolean;
  lastTime: number;
  deltaTime: number;
  frameCount: number;
};

export class GameLoop {
  private state: GameLoopState = {
    isRunning: false,
    lastTime: 0,
    deltaTime: 0,
    frameCount: 0,
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
    this.state.deltaTime = Math.min((currentTime - this.state.lastTime) / 1000, 0.1); // Cap at 100ms
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
}
