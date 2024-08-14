import { Component ,OnInit} from '@angular/core';
import { TtsService } from '../../services/tts.service';
@Component({
  selector: 'app-tts',
  templateUrl: './tts.component.html',
  styleUrls: ['./tts.component.css']
})
export class TtsComponent implements OnInit{
  inputText: string = 'Bonjour, ceci est un exemple de texte.';
  selectedVoice: string = '';
  selectedLanguage: string = '';
  voices: SpeechSynthesisVoice[] = [];
  languages: string[] = [];
  availableVoices: SpeechSynthesisVoice[] = [];

  constructor(private ttsService: TtsService) {}

  ngOnInit(): void {
    // Attendez que les voix soient chargées
    setTimeout(() => {
      this.voices = this.ttsService.voices;
      this.languages = this.ttsService.getAvailableLanguages();
      if (this.languages.length > 0) {
        this.selectedLanguage = this.languages[0];
        this.onLanguageChange();
      }
    }, 100);
  }

  onLanguageChange(): void {
    this.availableVoices = this.ttsService.getVoicesForLanguage(this.selectedLanguage);
    if (this.availableVoices.length > 0) {
      this.selectedVoice = this.availableVoices[0].name;
    }
  }

  generateSpeech(): void {
    this.ttsService.speak(this.inputText, this.selectedVoice, this.selectedLanguage);
  }
}
