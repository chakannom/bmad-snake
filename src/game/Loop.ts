export class Loop {
  private timer: number | null = null;

  start(step: () => void, tickMs: number): void {
    this.stop();
    this.timer = window.setInterval(step, tickMs);
  }

  restart(step: () => void, tickMs: number): void {
    this.start(step, tickMs);
  }

  stop(): void {
    if (this.timer !== null) {
      window.clearInterval(this.timer);
      this.timer = null;
    }
  }
}
