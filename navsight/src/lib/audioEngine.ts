/**
 * Audio Engine for NavSight
 * Provides spatial audio feedback using StereoPanner and Oscillator
 */

class AudioEngine {
  private audioCtx: AudioContext | null = null;
  private oscillator: OscillatorNode | null = null;
  private panner: StereoPannerNode | null = null;
  private gainNode: GainNode | null = null;
  private intervalId: number | null = null;

  constructor() {
    // AudioContext is initialized on first user interaction
  }

  private init() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.gainNode = this.audioCtx.createGain();
      this.panner = this.audioCtx.createStereoPanner();
      
      this.panner.connect(this.gainNode);
      this.gainNode.connect(this.audioCtx.destination);
      
      this.gainNode.gain.value = 0;
    }
  }

  public startBeeping(pan: number = 0, frequency: number = 440, beepRate: number = 500) {
    this.init();
    this.stopBeeping();

    if (!this.audioCtx || !this.panner || !this.gainNode) return;

    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    this.panner.pan.value = pan;

    this.intervalId = window.setInterval(() => {
      this.playSingleBeep(frequency);
    }, beepRate);
  }

  private playSingleBeep(frequency: number) {
    if (!this.audioCtx || !this.gainNode) return;

    const osc = this.audioCtx.createOscillator();
    const beepGain = this.audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, this.audioCtx.currentTime);

    osc.connect(beepGain);
    beepGain.connect(this.gainNode);

    const now = this.audioCtx.currentTime;
    beepGain.gain.setValueAtTime(0, now);
    beepGain.gain.linearRampToValueAtTime(0.2, now + 0.05);
    beepGain.gain.linearRampToValueAtTime(0, now + 0.2);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  public updatePan(pan: number) {
    if (this.panner) {
      this.panner.pan.setTargetAtTime(pan, this.audioCtx?.currentTime || 0, 0.1);
    }
  }

  public stopBeeping() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

export const audioEngine = new AudioEngine();
