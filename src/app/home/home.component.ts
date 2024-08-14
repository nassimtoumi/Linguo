import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent  implements OnInit{
 
  constructor() { }

  ngOnInit(): void {
    this.playOpeningSound();
  }

  playOpeningSound(): void {
    // Crée un nouvel élément Audio
    const audio = new Audio();
    // Spécifie la source du fichier audio
    audio.src = "../../assets/audio/Starting.mp3";
    // Charge l'audio
    audio.load();
    // Joue l'audio
    audio.play().catch(error => console.log('La lecture audio a échoué :', error));
  }
}
