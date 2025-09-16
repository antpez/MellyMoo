export class Director {
  private startMs: number;
  private readonly minIntervalMs: number;
  private readonly maxIntervalMs: number;
  private readonly rampDurationMs: number;

  constructor(options?: {
    minIntervalMs?: number;
    maxIntervalMs?: number;
    rampDurationMs?: number;
  }) {
    this.startMs = performance.now();
    this.minIntervalMs = options?.minIntervalMs ?? 350; // faster bound
    this.maxIntervalMs = options?.maxIntervalMs ?? 800; // slower bound
    this.rampDurationMs = options?.rampDurationMs ?? 60000; // ramp over 60s
  }

  public reset(now?: number) {
    this.startMs = now ?? performance.now();
  }

  public getCurrentIntervalMs(now?: number): number {
    const t = (now ?? performance.now()) - this.startMs;
    const clamped = Math.max(0, Math.min(this.rampDurationMs, t));
    const alpha = clamped / this.rampDurationMs; // 0 → 1 over ramp
    // Lerp from maxInterval (slow) to minInterval (fast)
    return this.maxIntervalMs + (this.minIntervalMs - this.maxIntervalMs) * alpha;
  }
}


