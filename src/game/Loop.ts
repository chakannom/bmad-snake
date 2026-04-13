export class Loop {
  private rafId = 0;
  private lastTs = 0;
  private acc = 0;

  constructor(
    private readonly getStepMs: () => number,
    private readonly step: (stepMs: number) => void,
    private readonly render: () => void,
  ) {}

  start(): void {
    const tick = (ts: number): void => {
      if (!this.lastTs) this.lastTs = ts;
      const delta = ts - this.lastTs;
      this.lastTs = ts;

      const stepMs = this.getStepMs();
      this.acc += delta;
      while (this.acc >= stepMs) {
        this.step(stepMs);
        this.acc -= stepMs;
      }
      this.render();
      this.rafId = requestAnimationFrame(tick);
    };

    this.rafId = requestAnimationFrame(tick);
  }

  stop(): void {
    cancelAnimationFrame(this.rafId);
  }
}
