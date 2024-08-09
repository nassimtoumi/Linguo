import { Component } from '@angular/core';

@Component({
  selector: 'app-graphe',
  templateUrl: './graphe.component.html',
  styleUrls: ['./graphe.component.css']
})
export class GrapheComponent {
  visualElements: HTMLElement[] = [];
  visualValueCount = 16;
  transcript = '';
  showButton = true; // Variable to control the visibility of the button
  // showStopButton = false; // Variable to control the visibility of the Stop button
  // audioContext: AudioContext | null = null;
  // visualizer: AudioVisualizer | null = null;
  // transcription :
  public currentTranscription: string = '';
  private allTranscriptions: string[] = [];
  private silenceTimeout!: any;
  private silenceDelay = 2000; // 2 seconds of silence
  private recognition!: any;

  constructor() { }

  createDOMElements() {
    const visualMainElement = document.querySelector('main');
    if (visualMainElement) {
      for (let i = 0; i < this.visualValueCount; ++i) {
        const elm = document.createElement('div');
        // Set the initial styles
        //elm.style.transform = 'scaleY(.25)';
        elm.style.display = 'inline-block';
        elm.style.margin = '0 7px';
        elm.style.width = '3px'; // Set width
        elm.style.height = '100px'; // Set initial height
        elm.style.background = 'currentColor'; // Set background color
        elm.style.transformOrigin = 'center'; // Set transform origin to center
        elm.style.opacity =  '.25';
        elm.style.position = 'relative';
        elm.style.display = 'flex';
        elm.style.justifyContent = 'center';
        elm.style.alignItems = 'center';
        // Set the initial styles

        visualMainElement.appendChild(elm);
      }
      console.log('Elements created:', visualMainElement.innerHTML);
      this.visualElements = Array.from(document.querySelectorAll('main div'));
    }
}

processFrame(data: Uint8Array) {
  const dataMap: { [key: number]: number } = { 
    0: 15, 1: 10, 2: 8, 3: 9, 4: 6, 5: 5, 6: 2, 7: 1, 8: 0, 9: 4, 
    10: 3, 11: 7, 12: 11, 13: 12, 14: 13, 15: 14 
  };
  const values = Object.values(data);
  for (let i = 0; i < this.visualValueCount; ++i) {
    const value = values[dataMap[i]] / 255;
    const elmStyles = this.visualElements[i].style;
    const scaleYValue = value;
    elmStyles.transform = `scaleY(${scaleYValue}) translateY(${(1 - scaleYValue) * 1}px)`;
    elmStyles.opacity = Math.max(.25, value).toString();
  }
}


  init() {
    this.createDOMElements();
    const audioContext = new AudioContext();
    const visualizer = new AudioVisualizer(audioContext, (data: Uint8Array) => this.processFrame(data), this.processError);
    this.showButton = false; // Hide the button after starting the visualization
    // this.showStopButton = true;
    
    // Commencer les transcriptions
    this.startTranscription();
  }
  // stop() {
  //   this.showStopButton = false; // Hide the Stop button
  //   this.showButton = true; // Show the Start button again
  //   // Add any additional logic to stop the visualization
  //   console.log('Visualization stopped');
  // }

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
  processError() {
    const visualMainElement = document.querySelector('main');
    if (visualMainElement) {
      visualMainElement.classList.add('error');
      visualMainElement.innerText = 'Please allow access to your microphone in order to see this demo.\nNothing bad is going to happen... hopefully :P';
    }
  }

  // startTranscriptions() {
  //   // Remplacez par vos appels API
  //   fetch('/start_asr')
  //     .then(res => res.json())
  //     .then(() => {
  //       setInterval(() => {
  //         fetch('/get_audio')
  //           .then(res => res.json())
  //           .then(data => {
  //             if (data !== '') {
  //               this.transcript = data;
  //             }
  //           });
  //       }, 100);
  //     });
  // }
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
