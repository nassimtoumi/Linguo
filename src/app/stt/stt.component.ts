import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-stt',
  templateUrl: './stt.component.html',
  styleUrls: ['./stt.component.css']
})
export class SttComponent {
  selectedFile: File | null = null;
  transcriptionResult: string | null = null;

  constructor(private http: HttpClient) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmit() {
    if (!this.selectedFile) {
      alert('Please select an audio file.');
      return;
    }

    const formData = new FormData();
    formData.append('audio', this.selectedFile);

    this.http.post<any>('http://localhost:2025/transcrire-audio', formData).subscribe(
      response => {
        this.transcriptionResult = response.texte_transcrit;
      },
      (error: HttpErrorResponse) => {
        console.error('Error during transcription:', error.message);
        this.transcriptionResult = 'An error occurred during transcription.';
      }
    );
  }
}
