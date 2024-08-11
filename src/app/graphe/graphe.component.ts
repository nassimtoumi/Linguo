import { Component, OnInit } from '@angular/core';
import { AudioService } from '../../services/audio.service';

@Component({
  selector: 'app-graphe',
  templateUrl: './graphe.component.html',
  styleUrls: ['./graphe.component.css']
})
export class GrapheComponent implements OnInit {

  visualElements: HTMLElement[] = [];
  visualValueCount = 16;
  showButton = true; // Variable to control the visibility of the Start button
  showStopButton = false; // Variable to control the visibility of the Stop button
  isVisualizing = false; // Track whether visualization is active

  constructor(private audioService: AudioService) { }

  ngOnInit() {
    this.createDOMElements(); // Create visual elements on component initialization
  }

  createDOMElements() {
    if (!this.visualElements.length) {
      const visualMainElement = document.querySelector('main');
      if (visualMainElement) {
        for (let i = 0; i < this.visualValueCount; ++i) {
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
        }
        this.visualElements = Array.from(document.querySelectorAll('main div'));
      }
    }
  }

  processFrame(data: Uint8Array) {
    if (!this.isVisualizing) return; // Skip processing if visualization is stopped

    const dataMap: { [key: number]: number } = {
      0: 15, 1: 10, 2: 8, 3: 9, 4: 6, 5: 5, 6: 2, 7: 1, 8: 0, 9: 4,
      10: 3, 11: 7, 12: 11, 13: 12, 14: 13, 15: 14
    };
    const values = Object.values(data);
    for (let i = 0; i < this.visualValueCount; ++i) {
      const value = values[dataMap[i]] / 255;
      const elmStyles = this.visualElements[i].style;
      elmStyles.transform = `scaleY(${value}) translateY(${(1 - value) * 1}px)`;
      elmStyles.opacity = Math.max(.25, value).toString();
    }
  }

  init() {
    this.isVisualizing = true; // Set visualization active
    this.audioService.startVisualization((data: Uint8Array) => this.processFrame(data));
    this.audioService.startTranscription(); // Start transcription with the selected language
    this.showButton = false;
    this.showStopButton = true;
  }

  stop() {
    this.isVisualizing = false; // Set visualization inactive
    this.audioService.stopVisualization(); // Stop the audio processing
    this.showButton = true;
    this.showStopButton = false;
  }
}
