import type { RadioStationId } from '../data/delhiRadio';

interface StationPattern {
  stepMs: number;
  droneNotes: number[];
  melody: Array<number | null>;
  bass: Array<number | null>;
  timbre: 'harmonium' | 'sitar' | 'indie' | 'tumbi' | 'bansuri';
}

const STATION_PATTERNS: Record<RadioStationId, StationPattern> = {
  // 98.3 FM - Sufi Qawwali & Harmonium (Raag Bhairavi / Khamaj warmth)
  'qawwali-sufi': {
    stepMs: 255,
    droneNotes: [130.81, 196.0], // C3 + G3
    melody: [
      261.63, null, 277.18, 311.13, 349.23, null, 392.0, 349.23,
      311.13, null, 349.23, 311.13, 277.18, 261.63, null, 196.0,
    ],
    bass: [
      130.81, null, null, 130.81, 196.0, null, 130.81, null,
      130.81, null, 174.61, null, 196.0, null, 130.81, null,
    ],
    timbre: 'harmonium',
  },
  // 101.4 FM - Hindustani Classical Sitar (Raag Yaman)
  'classical-sitar': {
    stepMs: 320,
    droneNotes: [146.83, 220.0], // D3 + A3
    melody: [
      293.66, null, 329.63, 369.99, 415.3, null, 440.0, null,
      493.88, 440.0, 415.3, 369.99, null, 329.63, 293.66, null,
    ],
    bass: [
      146.83, null, null, null, 220.0, null, null, null,
      146.83, null, null, 185.0, 220.0, null, null, null,
    ],
    timbre: 'sitar',
  },
  // 93.5 FM - Hindi Indie & Retro Filmi Groove
  'indie-retro': {
    stepMs: 270,
    droneNotes: [130.81, 164.81], // C3 + E3
    melody: [
      523.25, null, 440.0, 392.0, null, 329.63, 392.0, 440.0,
      392.0, null, 329.63, 293.66, 329.63, null, 261.63, null,
    ],
    bass: [
      130.81, null, 196.0, null, 164.81, null, 196.0, null,
      174.61, null, 220.0, null, 196.0, null, 146.83, null,
    ],
    timbre: 'indie',
  },
  // 104.8 FM - Punjabi Pop & Electronic Dhol
  'punjabi-electronic': {
    stepMs: 230,
    droneNotes: [146.83, 220.0], // D3 + A3
    melody: [
      587.33, 587.33, 523.25, 587.33, 659.25, null, 587.33, 523.25,
      440.0, 523.25, 587.33, null, 523.25, 440.0, 392.0, null,
    ],
    bass: [
      146.83, null, 146.83, 220.0, 146.83, null, 174.61, null,
      146.83, null, 146.83, 220.0, 130.81, null, 196.0, null,
    ],
    timbre: 'tumbi',
  },
  // 89.7 FM - Desi Lo-Fi & Monsoon Bansuri
  'yamuna-chill': {
    stepMs: 360,
    droneNotes: [130.81, 196.0], // C3 + G3
    melody: [
      392.0, null, 440.0, 523.25, null, null, 440.0, 392.0,
      329.63, null, 293.66, 329.63, null, 392.0, null, null,
    ],
    bass: [
      130.81, null, null, null, 174.61, null, null, null,
      164.81, null, null, null, 196.0, null, null, null,
    ],
    timbre: 'bansuri',
  },
};

class DelhiRadioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private droneOscs: OscillatorNode[] = [];
  private droneGain: GainNode | null = null;
  private timerId: number | null = null;

  private isPlaying = false;
  private isMuted = false;
  private volume = 0.45;
  private currentStation: RadioStationId = 'indie-retro';
  private stepIdx = 0;

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(
        this.isMuted ? 0 : this.volume * 0.28,
        this.ctx.currentTime
      );
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private updateMasterGain(): void {
    if (!this.ctx || !this.masterGain) return;
    const target = this.isPlaying && !this.isMuted ? this.volume * 0.28 : 0;
    this.masterGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.05);
  }

  private stopDrone(): void {
    for (const osc of this.droneOscs) {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // ignore stopped oscillator
      }
    }
    this.droneOscs = [];
    if (this.droneGain) {
      try {
        this.droneGain.disconnect();
      } catch {
        // ignore
      }
      this.droneGain = null;
    }
  }

  private startDrone(station: RadioStationId): void {
    this.stopDrone();
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain || !this.isPlaying) return;

    const pattern = STATION_PATTERNS[station];
    const dGain = ctx.createGain();
    dGain.gain.setValueAtTime(0.001, ctx.currentTime);
    dGain.gain.exponentialRampToValueAtTime(0.11, ctx.currentTime + 0.35);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(620, ctx.currentTime);
    dGain.connect(filter);
    filter.connect(this.masterGain);

    pattern.droneNotes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      osc.type = idx === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.connect(dGain);
      osc.start(ctx.currentTime);
      this.droneOscs.push(osc);
    });

    this.droneGain = dGain;
  }

  private triggerLeadNote(freq: number, timbre: StationPattern['timbre']): void {
    if (!this.ctx || !this.masterGain || !this.isPlaying || this.isMuted) return;
    const now = this.ctx.currentTime;

    if (timbre === 'harmonium') {
      // Warm reed chord feel using two slightly detuned triangles
      [-4, 4].forEach((cents) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now);
        osc.detune.setValueAtTime(cents, now);
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1150, now);
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.11, now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.4);
      });
    } else if (timbre === 'sitar') {
      // Plucked resonant string with filter sweep
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq * 0.985, now);
      osc.frequency.exponentialRampToValueAtTime(freq, now + 0.045);

      filter.type = 'bandpass';
      filter.Q.setValueAtTime(3.2, now);
      filter.frequency.setValueAtTime(freq * 4.2, now);
      filter.frequency.exponentialRampToValueAtTime(freq * 1.3, now + 0.48);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.24, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.56);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.58);
    } else if (timbre === 'tumbi') {
      // Bright snappy folk pluck
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.22, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.21);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.23);
    } else if (timbre === 'bansuri') {
      // Airy bamboo flute with gentle breath attack
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * 0.99, now);
      osc.frequency.linearRampToValueAtTime(freq, now + 0.09);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.18, now + 0.09);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.58);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.62);
    } else {
      // Indie electric chord pluck
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1800, now);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.19, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.34);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.36);
    }
  }

  private triggerPercBass(freq: number, timbre: StationPattern['timbre'], step: number): void {
    if (!this.ctx || !this.masterGain || !this.isPlaying || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    if (timbre === 'tumbi' && step % 4 === 0) {
      // Warm dhol thump
      osc.type = 'sine';
      osc.frequency.setValueAtTime(115, now);
      osc.frequency.exponentialRampToValueAtTime(54, now + 0.14);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.28, now + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.16, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
    }

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.28);
  }

  private scheduleLoop(): void {
    if (this.timerId !== null) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }
    if (!this.isPlaying) return;

    const pattern = STATION_PATTERNS[this.currentStation];
    this.startDrone(this.currentStation);

    const tick = () => {
      if (!this.isPlaying) return;
      const step = this.stepIdx % pattern.melody.length;
      const lead = pattern.melody[step];
      const bass = pattern.bass[step];
      if (lead !== null) {
        this.triggerLeadNote(lead, pattern.timbre);
      }
      if (bass !== null) {
        this.triggerPercBass(bass, pattern.timbre, step);
      }
      this.stepIdx = (this.stepIdx + 1) % pattern.melody.length;
    };

    tick();
    this.timerId = window.setInterval(tick, pattern.stepMs);
  }

  public playTuneChirp(): void {
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain || this.isMuted) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(720, now);
    osc.frequency.exponentialRampToValueAtTime(1180, now + 0.07);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.08, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.11);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.12);
  }

  public syncState(opts: {
    playing: boolean;
    stationId: RadioStationId;
    volume: number;
    muted: boolean;
  }): void {
    const stationChanged = opts.stationId !== this.currentStation;
    const playChanged = opts.playing !== this.isPlaying;

    this.currentStation = opts.stationId;
    this.volume = Math.max(0, Math.min(1, opts.volume));
    this.isMuted = opts.muted;
    this.isPlaying = opts.playing;

    if (!this.isPlaying) {
      if (this.timerId !== null) {
        window.clearInterval(this.timerId);
        this.timerId = null;
      }
      this.stopDrone();
      this.updateMasterGain();
      return;
    }

    this.ensureContext();
    this.updateMasterGain();

    if (playChanged || stationChanged) {
      this.stepIdx = 0;
      if (stationChanged && !opts.muted) {
        this.playTuneChirp();
      }
      this.scheduleLoop();
    }
  }
}

export const delhiRadio = new DelhiRadioEngine();
