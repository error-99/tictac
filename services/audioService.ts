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

  // Fix: Add missing `playVoiceMessage` method to handle playing voice messages.
  playVoiceMessage(audioBase64: string) {
    if (this.isEnabled) {
      const audio = new Audio(audioBase64);
      audio.play().catch(error => console.error("Voice message play failed", error));
    }
  }
}

export const audioService = new AudioService();