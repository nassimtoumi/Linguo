import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TtsService {
  voices: SpeechSynthesisVoice[] = [];

  constructor() {
    this.loadVoices();
  }

  loadVoices(): void {
    if ('speechSynthesis' in window) {
      const synth = window.speechSynthesis;
      const updateVoices = () => {
        this.voices = synth.getVoices();
        if (this.voices.length === 0) {
          // Si les voix ne sont pas encore chargées, réessayer après un court délai
          setTimeout(updateVoices, 100);
        }
      };
      updateVoices();
    }
  }

  getAvailableLanguages(): string[] {
    return [...new Set(this.voices.map(voice => voice.lang))];
  }

  getVoicesForLanguage(lang: string): SpeechSynthesisVoice[] {
    return this.voices.filter(voice => voice.lang === lang);
  }

  speak(text: string, voiceName?: string, lang?: string): void {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);

      if (voiceName) {
        const selectedVoice = this.voices.find(voice => voice.name === voiceName && voice.lang === lang);
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
      }

      if (lang) {
        utterance.lang = lang;
      }

      window.speechSynthesis.speak(utterance);
    } else {
      console.error('La synthèse vocale n\'est pas supportée dans ce navigateur.');
    }
  }
}
