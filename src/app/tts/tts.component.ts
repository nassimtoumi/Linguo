import { Component ,OnInit} from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
@Component({
  selector: 'app-tts',
  templateUrl: './tts.component.html',
  styleUrls: ['./tts.component.css']
})
export class TtsComponent {
  inputText: string = '';
  selectedLanguage: string = 'en';
  languages: string[] = ['en', 'fr', 'es', 'de'];
  selectedFile: File | null = null;
  audioUrl: string | null = null;

  constructor(private http: HttpClient) {}

  onLanguageChange() {
    console.log('Language changed to:', this.selectedLanguage);
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  generateSpeech() {
    if (!this.selectedFile) {
      alert('Please upload a voice sample.');
      return;
    }

    const formData = new FormData();
    formData.append('text', this.inputText);
    formData.append('speaker_wav', this.selectedFile);
    formData.append('language', this.selectedLanguage);

    this.http.post<any>('http://51.21.59.112:8882/clone-voice/', formData).subscribe(
      response => {
        this.audioUrl = `http://51.21.59.112:8882/data-tts/${response.uuid}`;
        console.log('Audio generated:', this.audioUrl);
      },
      error => {
        console.error('Error generating speech:', error);
      }
    );
  }
}
