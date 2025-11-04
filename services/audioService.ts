import { moveSound, winSound, drawSound } from '../assets/sounds';

class AudioService {
  private moveAudio: HTMLAudioElement;
  private winAudio: HTMLAudioElement;
  private drawAudio: HTMLAudioElement;
  private isEnabled = true;

  constructor() {
    this.moveAudio = new Audio(moveSound);
    this.winAudio = new Audio(winSound);
    this.drawAudio = new Audio(drawSound);

    // Preload audio for better performance
    this.moveAudio.preload = 'auto';
    this.winAudio.preload = 'auto';
    this.drawAudio.preload = 'auto';
  }

  setSoundEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  private play(audio: HTMLAudioElement) {
    if (this.isEnabled) {
      audio.currentTime = 0;
      audio.play().catch(error => console.error("Audio play failed", error));
    }
  }

  playMove() {
    this.play(this.moveAudio);
  }

  playWin() {
    this.play(this.winAudio);
  }

  playDraw() {
    this.play(this.drawAudio);
  }
}

export const audioService = new AudioService();
