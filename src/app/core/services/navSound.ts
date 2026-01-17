// src/app/core/services/sound.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SoundService {
  private audioCtx: AudioContext | null = null;

  playPop() {
    if (!this.audioCtx)
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();

    const startTime = this.audioCtx.currentTime;
    const oscillator = this.audioCtx.createOscillator();
    const gainNode = this.audioCtx.createGain();
    const filter = this.audioCtx.createBiquadFilter();

    oscillator.type = 'triangle';

    oscillator.frequency.setValueAtTime(150, startTime);
    oscillator.frequency.exponentialRampToValueAtTime(40, startTime + 0.1);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, startTime);
    filter.frequency.exponentialRampToValueAtTime(100, startTime + 0.1);
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.2, startTime + 0.02);
    gainNode.gain.linearRampToValueAtTime(0, startTime + 0.15);

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.audioCtx.destination);

    oscillator.start(startTime);
    oscillator.stop(startTime + 0.15);
  }
}
