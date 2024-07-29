import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-audio-visualizer',
  templateUrl: './audio-visualizer.component.html',
  styleUrls: ['./audio-visualizer.component.css']
})
export class AudioVisualizerComponent implements OnInit {
  @ViewChild('audioCanvas', { static: true }) audioCanvas!: ElementRef<HTMLCanvasElement>;
  private audioContext!: AudioContext;
  private analyser!: AnalyserNode;
  private dataArray!: Uint8Array;
  public currentTranscription: string = '';
  private allTranscriptions: string[] = [];
  private silenceTimeout!: any;
  private silenceDelay = 3000; // 3 seconds of silence
  private recognition!: any;
  public showButton: boolean = true;
  private visualElements!: HTMLDivElement[];
  private visualValueCount = 16;

  ngOnInit() {
    this.initializeAudio();
  }

  initializeAudio() {
    this.audioContext = new AudioContext();
    this.analyser = this.audioContext.createAnalyser();

    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const source = this.audioContext.createMediaStreamSource(stream);
      source.connect(this.analyser);

      this.analyser.fftSize = 32;
      this.analyser.smoothingTimeConstant = 0.5;
      this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);

      this.createDOMElements();
    }).catch((err) => {
      console.error('Error accessing audio stream: ', err);
    });
  }

  createDOMElements() {
    const mainElement = document.querySelector('main') as HTMLElement;
    for (let i = 0; i < this.visualValueCount; ++i) {
      const elm = document.createElement('div');
      mainElement.appendChild(elm);
    }
    this.visualElements = Array.from(document.querySelectorAll('main div'));
  }

  draw() {
    requestAnimationFrame(() => this.draw());
  
    this.analyser.getByteTimeDomainData(this.dataArray);
  
    const canvas = this.audioCanvas.nativeElement;
    const canvasCtx = canvas.getContext('2d');
    if (!canvasCtx) return;
  
    // Changer le fond à blanc
    canvasCtx.fillStyle = 'rgb(255, 255, 255)';
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
  
    // Changer la couleur de la ligne à noir
    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = 'rgb(0, 0, 0)';
  
    canvasCtx.beginPath();
    const sliceWidth = canvas.width * 1.0 / this.dataArray.length;
    let x = 0;
  
    for (let i = 0; i < this.dataArray.length; i++) {
      const v = this.dataArray[i] / 128.0;
      const y = v * canvas.height / 2;
  
      if (i === 0) {
        canvasCtx.moveTo(x, y);
      } else {
        canvasCtx.lineTo(x, y);
      }
  
      x += sliceWidth;
    }
  
    canvasCtx.lineTo(canvas.width, canvas.height / 2);
    canvasCtx.stroke();
  }
  

  onStartClick() {
    this.showButton = false;
    this.draw();
    this.startTranscription();
  }

  startTranscription() {
    if (!this.recognition) {
      this.recognition = new (window as any).webkitSpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (event: any) => {
        clearTimeout(this.silenceTimeout);

        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            this.addTranscription(transcript);
          } else {
            interimTranscript += transcript;
          }
        }

        // Mise à jour instantanée de la transcription
        this.currentTranscription = this.allTranscriptions.join(' ') + ' ' + interimTranscript;

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
  }
}
