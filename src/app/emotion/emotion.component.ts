import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-emotion',
  templateUrl: './emotion.component.html',
  styleUrls: ['./emotion.component.css']
})
export class EmotionComponent {
  selectedFile: File | null = null;
  emotionResult: string | null = null;

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

    this.http.post<any>('http://localhost:2025/predict-emotion/', formData).subscribe(
      response => {
        this.emotionResult = response.emotion;
      },
      (error: HttpErrorResponse) => {
        console.error('Error during emotion recognition:', error.message);
        this.emotionResult = 'An error occurred during emotion recognition.';
      }
    );
  }
}
