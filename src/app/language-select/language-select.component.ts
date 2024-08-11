import { Component } from '@angular/core';
import { AudioService } from '../../services/audio.service';

@Component({
  selector: 'app-language-select',
  templateUrl: './language-select.component.html',
  styleUrls: ['./language-select.component.css']
})
export class LanguageSelectComponent {

  langues = [
    { code: 'ar-TN', nom: 'Arabe (Tunisie)' },
    { code: 'en-US', nom: 'Anglais (États-Unis)' },
    { code: 'fr-FR', nom: 'Français (France)' }
  ];

  langueSelectionnee = this.langues[2].code;

  constructor(private audioService: AudioService) { }

  onChangeLangue() {
    this.audioService.setLanguage(this.langueSelectionnee);
  }
}