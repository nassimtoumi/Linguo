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
    // this.startTranscriptions();
  }
  // stop() {
  //   this.showStopButton = false; // Hide the Stop button
  //   this.showButton = true; // Show the Start button again
  //   // Add any additional logic to stop the visualization
  //   console.log('Visualization stopped');
  // }


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
