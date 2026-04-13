export class Loop {
  private rafId: number | null = null;
  private accumulatorMs = 0;
  private lastTimeMs = 0;
  private tickMs = 0;
  private step: (() => void) | null = null;
  private readonly maxCatchUpSteps = 5;

  start(step: () => void, tickMs: number): void {
    this.stop();
    this.step = step;
    this.tickMs = tickMs;
    this.accumulatorMs = 0;
    this.lastTimeMs = performance.now();

    const frame = (now: number): void => {
      if (!this.step) return;

      const deltaMs = Math.min(250, now - this.lastTimeMs);
      this.lastTimeMs = now;
      this.accumulatorMs += deltaMs;

      let updates = 0;
      while (this.accumulatorMs >= this.tickMs && updates < this.maxCatchUpSteps) {
        this.step();
        this.accumulatorMs -= this.tickMs;
        updates += 1;
      }

      this.rafId = window.requestAnimationFrame(frame);
    };

    this.rafId = window.requestAnimationFrame(frame);
  }

  restart(step: () => void, tickMs: number): void {
    this.start(step, tickMs);
  }

  stop(): void {
    if (this.rafId !== null) {
      window.cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.step = null;
    this.accumulatorMs = 0;
    this.lastTimeMs = 0;
  }
}
