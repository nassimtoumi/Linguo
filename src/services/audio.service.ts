import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  private recognition: any;
  private audioContext: AudioContext | null = null;
  private visualizer: any = null;
  private langueSelectionnee: string = 'fr-FR'; // Default language
  private silenceTimeout!: any; // Timeout for clearing transcription after silence
  private silenceDelay = 3000; // 3 seconds of silence
  private allTranscriptions: string[] = []; // Array to store all finalized transcriptions

  currentTranscription = ''; // Current interim transcription
  transcriptionUpdated = new EventEmitter<string>(); // Event for when transcription is updated

  setLanguage(langueSelectionnee: string) {
    this.langueSelectionnee = langueSelectionnee;
    if (this.recognition) {
      this.recognition.lang = langueSelectionnee;
    }
  }

  getLanguage() {
    return this.langueSelectionnee;
  }

  startVisualization(processFrame: (data: Uint8Array) => void) {
    this.audioContext = new AudioContext();
    this.visualizer = new AudioVisualizer(this.audioContext, processFrame, this.processError);
  }

  stopVisualization() {
    if (this.recognition) {
      this.recognition.stop();
    }
    this.resetTranscription();
  }

  startTranscription() {
    if (!this.recognition) {
      this.recognition = new (window as any).webkitSpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = this.langueSelectionnee;

      this.recognition.onresult = (event: any) => {
        clearTimeout(this.silenceTimeout); // Clear previous timeout

        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            this.addTranscription(transcript);
          } else {
            interimTranscript += transcript;
          }
        }

        // Update current transcription with interim results and all finalized transcriptions
        this.currentTranscription = this.allTranscriptions.join(' ') + ' ' + interimTranscript;
        this.transcriptionUpdated.emit(this.currentTranscription); // Emit the current transcription

        // Set timeout to clear the transcription after silence
        this.silenceTimeout = setTimeout(() => {
          this.resetTranscription();
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

  resetTranscription() {
    this.allTranscriptions = [];
    this.currentTranscription = '';
    this.transcriptionUpdated.emit(this.currentTranscription); // Clear the transcription
  }

  private processError() {
    console.error('Microphone access error.');
  }
}

class AudioVisualizer {
  analyser: AnalyserNode | null = null;

  constructor(
    private audioContext: AudioContext,
    private processFrame: (data: Uint8Array) => void,
    private processError: () => void
  ) {
    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      .then(this.connectStream.bind(this))
      .catch((error) => {
        if (this.processError) {
          this.processError();
        }
      });
  }

  connectStream(stream: MediaStream) {
    this.analyser = this.audioContext.createAnalyser();
    const source = this.audioContext.createMediaStreamSource(stream);
    source.connect(this.analyser);
    this.analyser.smoothingTimeConstant = 0.5;
    this.analyser.fftSize = 32;

    this.initRenderLoop();
  }

  initRenderLoop() {
    if (!this.analyser) return;

    const frequencyData = new Uint8Array(this.analyser.frequencyBinCount);

    const renderFrame = () => {
      this.analyser!.getByteFrequencyData(frequencyData);
      this.processFrame(frequencyData);
      requestAnimationFrame(renderFrame);
    };

    requestAnimationFrame(renderFrame);
  }
}
