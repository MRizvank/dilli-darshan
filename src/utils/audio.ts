class SoundEngine {
  private ctx: AudioContext | null = null;
  private muted = false;

  private ensureContext(): AudioContext | null {
    if (this.muted || typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean): void {
    this.muted = muted;
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public playTone(freq: number, duration: number, type: OscillatorType = 'sine', volume = 0.08, delay = 0): void {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  public playMetroChime(): void {
    // Crisp two-tone transit station chime
    this.playTone(587.33, 0.22, 'triangle', 0.09, 0);
    this.playTone(880, 0.35, 'triangle', 0.09, 0.14);
  }

  public playStamp(): void {
    // Low thud + bright heritage chord
    this.playTone(130, 0.12, 'square', 0.07, 0);
    this.playTone(523.25, 0.25, 'triangle', 0.08, 0.06);
    this.playTone(659.25, 0.3, 'triangle', 0.08, 0.14);
  }

  public playEat(): void {
    // Warm cheerful culinary chord
    this.playTone(440, 0.14, 'sine', 0.08, 0);
    this.playTone(554.37, 0.16, 'sine', 0.08, 0.08);
    this.playTone(659.25, 0.24, 'sine', 0.08, 0.16);
  }

  public playCoin(): void {
    this.playTone(987.77, 0.12, 'sine', 0.07, 0);
    this.playTone(1318.51, 0.24, 'sine', 0.07, 0.08);
  }

  public playQuestComplete(): void {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((n, idx) => {
      this.playTone(n, 0.28, 'triangle', 0.085, idx * 0.09);
    });
  }

  public playChatPing(): void {
    this.playTone(740, 0.1, 'sine', 0.04, 0);
  }

  public playError(): void {
    this.playTone(220, 0.15, 'sawtooth', 0.045, 0);
    this.playTone(185, 0.18, 'sawtooth', 0.045, 0.1);
  }

  public playVehicleDispatch(mode: 'walk' | 'bike' | 'auto' | 'car'): void {
    if (mode === 'walk') {
      this.playTone(392, 0.08, 'sine', 0.05, 0);
      return;
    }
    if (mode === 'bike') {
      // Quick nimble scooter double-chirp
      this.playTone(660, 0.09, 'triangle', 0.06, 0);
      this.playTone(880, 0.12, 'triangle', 0.06, 0.09);
      return;
    }
    if (mode === 'auto') {
      // Classic cheerful auto-rickshaw double horn
      this.playTone(440, 0.11, 'sawtooth', 0.035, 0);
      this.playTone(440, 0.14, 'sawtooth', 0.035, 0.13);
      return;
    }
    // Sleek cab confirmation chime
    this.playTone(523.25, 0.12, 'sine', 0.06, 0);
    this.playTone(659.25, 0.18, 'sine', 0.06, 0.09);
  }

  public playShutter(): void {
    // Crisp two-stage mechanical camera shutter click + soft chime
    this.playTone(1450, 0.04, 'triangle', 0.08, 0);
    this.playTone(920, 0.055, 'square', 0.045, 0.045);
    this.playTone(1760, 0.09, 'sine', 0.04, 0.09);
  }
}

export const soundEngine = new SoundEngine();
