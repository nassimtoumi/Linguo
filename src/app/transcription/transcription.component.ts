import { Component } from '@angular/core';
import { AudioService } from '../../services/audio.service';

@Component({
  selector: 'app-transcription',
  templateUrl: './transcription.component.html',
  styleUrls: ['./transcription.component.css']
})
export class TranscriptionComponent {

  currentTranscription = '';

  constructor(private audioService: AudioService) {
    this.audioService.transcriptionUpdated.subscribe(transcription => {
      this.currentTranscription = transcription;
    });
  }
}