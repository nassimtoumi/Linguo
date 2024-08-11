import { Component } from '@angular/core';
import { AudioService } from '../../services/audio.service';
import { SpeechRecognitionService } from '../../services/speech-recognition.service';

@Component({
  selector: 'app-graphe',
  templateUrl: './graphe.component.html',
  styleUrls: ['./graphe.component.css']
})
export class GrapheComponent {
  visualElements: HTMLElement[] = [];
  visualValueCount = 16;
  currentTranscription: string = '';
  showButton = true;
  showStopButton = false;
  divsCreated = false;
  langues = [
    { code: 'ar-TN', nom: 'Arabe (Tunisie)' },
    { code: 'en-US', nom: 'Anglais (États-Unis)' },
    { code: 'fr-FR', nom: 'Français (France)' }
  ];
  langueSelectionnee = this.langues[2].code;

  constructor(
    private audioService: AudioService,
    private speechRecognitionService: SpeechRecognitionService
  ) { }

  createDOMElements() {
    if (!this.divsCreated) {
      this.visualElements = this.audioService.createDOMElements(this.visualValueCount);
      this.divsCreated = true;
    }
  }

  processFrame(data: Uint8Array) {
    this.audioService.processFrame(data, this.visualElements, this.visualValueCount);
  }

  init() {
    this.createDOMElements();
    this.audioService.initVisualizer(data => this.processFrame(data));
    this.showButton = false;
    this.showStopButton = true;
    this.startTranscription();
  }

  onChangeLangue() {
    this.speechRecognitionService.changeLanguage(this.langueSelectionnee);
  }

  startTranscription() {
    this.speechRecognitionService.startTranscription(
      transcript => this.addTranscription(transcript),
      currentTranscription => this.currentTranscription = currentTranscription
    );
  }

  addTranscription(transcript: string) {
    this.speechRecognitionService.addTranscription(transcript);
  }

  stop() {
    this.showStopButton = false;
    this.showButton = true;
    this.speechRecognitionService.stopTranscription();
    this.currentTranscription = '';
  }
}
