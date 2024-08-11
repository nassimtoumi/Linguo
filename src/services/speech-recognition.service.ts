import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpeechRecognitionService {
  private recognition: any;
  private allTranscriptions: string[] = [];
  private silenceTimeout!: any;
  private silenceDelay = 3000;

  changeLanguage(langueSelectionnee: string) {
    if (this.recognition) {
      this.recognition.lang = langueSelectionnee;
    }
  }

  startTranscription(
    addTranscription: (transcript: string) => void,
    updateTranscription: (transcription: string) => void
  ) {
    if (!this.recognition) {
      this.recognition = new (window as any).webkitSpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;

      this.recognition.onresult = (event: any) => {
        clearTimeout(this.silenceTimeout);

        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            addTranscription(transcript);
          } else {
            interimTranscript += transcript;
          }
        }

        updateTranscription(this.allTranscriptions.join(' ') + ' ' + interimTranscript);

        this.silenceTimeout = setTimeout(() => {
          this.resetTranscription(updateTranscription);
        }, this.silenceDelay);
      };

      this.recognition.onerror = (event: any) => {
        console.error('Speech recognition error detected: ' + event.error);
      };
    }

    this.recognition.start();
  }

  addTranscription(transcript: string) {
    this.allTranscriptions.push(transcript);
  }

  stopTranscription() {
    if (this.recognition) {
      this.recognition.stop();
    }
    this.resetTranscription(() => {});
  }

  resetTranscription(updateTranscription: (transcription: string) => void) {
    this.allTranscriptions = [];
    updateTranscription('');
  }
}
