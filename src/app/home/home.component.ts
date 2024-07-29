import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  audioContext!: AudioContext;
  visualElements: HTMLElement[] = [];
  visualValueCount = 16;
  transcript = '';

  constructor() { }

  ngOnInit(): void {
    this.createDOMElements();
  }

  init(): void {
    this.audioContext = new AudioContext();
    this.initDOM();
    this.startAudioVisualizer();
    this.startTranscriptions();
  }

  createDOMElements(): void {
    const visualMainElement = document.querySelector('main')!;
    for (let i = 0; i < this.visualValueCount; ++i) {
      const elm = document.createElement('div');
      visualMainElement.appendChild(elm);
    }
    this.visualElements = Array.from(document.querySelectorAll('main div'));
  }

  initDOM(): void {
    const visualMainElement = document.querySelector('main')!;
    visualMainElement.innerHTML = '';
    this.createDOMElements();
  }

  startAudioVisualizer(): void {
    const processFrame = (data: Uint8Array) => {
      console.log('Process frame data:', data);
      const values = Array.from(data);
      const dataMap = [15, 10, 8, 9, 6, 5, 2, 1, 0, 4, 3, 7, 11, 12, 13, 14];
      for (let i = 0; i < this.visualValueCount; ++i) {
        const value = values[dataMap[i]] / 255;
        const elmStyles = this.visualElements[i].style;
        elmStyles.transform = `scaleY(${value})`;
        elmStyles.opacity = `${Math.max(.25, value)}`;
      }
    };

    const processError = () => {
      const visualMainElement = document.querySelector('main')!;
      visualMainElement.classList.add('error');
      visualMainElement.innerText = 'Please allow access to your microphone in order to see this demo.\nNothing bad is going to happen... hopefully :P';
    };

    console.log('Initializing AudioVisualizer...');
    const visualizer = new AudioVisualizer(this.audioContext, processFrame, processError);
  }

  startTranscriptions(): void {
    fetch("/start_asr").then(res => res.json()).then(data => console.log(data));
    setInterval(() => {
      fetch("/get_audio").then(res => res.json()).then(data => {
        if (data !== "") {
          this.transcript = data;
        }
      });
    }, 100);
  }
}

class AudioVisualizer {
  analyser!: AnalyserNode;

  constructor(audioContext: AudioContext, processFrame: (data: Uint8Array) => void, processError: () => void) {
    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      .then(stream => {
        console.log('Microphone stream obtained:', stream);
        this.connectStream(audioContext, stream, processFrame);
      })
      .catch(error => {
        console.error('Error accessing microphone:', error);
        if (processError) {
          processError();
        }
      });
  }

  connectStream(audioContext: AudioContext, stream: MediaStream, processFrame: (data: Uint8Array) => void): void {
    this.analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(stream);
    console.log('Media stream source created:', source);
    source.connect(this.analyser);
    this.analyser.smoothingTimeConstant = 0.5;
    this.analyser.fftSize = 32;

    this.initRenderLoop(this.analyser, processFrame);
  }

  initRenderLoop(analyser: AnalyserNode, processFrame: (data: Uint8Array) => void): void {
    const frequencyData = new Uint8Array(analyser.frequencyBinCount);

    const renderFrame = () => {
      analyser.getByteFrequencyData(frequencyData);
      console.log('Frequency data:', frequencyData);
      processFrame(frequencyData);
      requestAnimationFrame(renderFrame);
    };
    requestAnimationFrame(renderFrame);
  }
}
