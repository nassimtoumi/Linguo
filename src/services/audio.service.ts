import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  createDOMElements(visualValueCount: number): HTMLElement[] {
    const visualMainElement = document.querySelector('main');
    const elements: HTMLElement[] = [];
    if (visualMainElement) {
      for (let i = 0; i < visualValueCount; ++i) {
        const elm = document.createElement('div');
        elm.style.display = 'inline-block';
        elm.style.margin = '0 7px';
        elm.style.width = '3px';
        elm.style.height = '100px';
        elm.style.background = 'currentColor';
        elm.style.transformOrigin = 'center';
        elm.style.opacity = '.25';
        elm.style.position = 'relative';
        elm.style.display = 'flex';
        elm.style.justifyContent = 'center';
        elm.style.alignItems = 'center';
        visualMainElement.appendChild(elm);
        elements.push(elm);
      }
    }
    return elements;
  }

  processFrame(data: Uint8Array, visualElements: HTMLElement[], visualValueCount: number) {
    const dataMap: { [key: number]: number } = {
      0: 15, 1: 10, 2: 8, 3: 9, 4: 6, 5: 5, 6: 2, 7: 1, 8: 0, 9: 4,
      10: 3, 11: 7, 12: 11, 13: 12, 14: 13, 15: 14
    };
    const values = Object.values(data);
    for (let i = 0; i < visualValueCount; ++i) {
      const value = values[dataMap[i]] / 255;
      const elmStyles = visualElements[i].style;
      elmStyles.transform = `scaleY(${value}) translateY(${(1 - value) * 1}px)`;
      elmStyles.opacity = Math.max(.25, value).toString();
    }
  }

  initVisualizer(processFrame: (data: Uint8Array) => void) {
    const audioContext = new AudioContext();
    new AudioVisualizer(audioContext, processFrame, this.processError);
  }

  processError() {
    const visualMainElement = document.querySelector('main');
    if (visualMainElement) {
      visualMainElement.classList.add('error');
      visualMainElement.innerText = 'Please allow access to your microphone in order to see this demo.';
    }
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
