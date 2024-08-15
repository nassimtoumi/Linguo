import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-ponctuation',
  templateUrl: './ponctuation.component.html',
  styleUrls: ['./ponctuation.component.css']
})
export class PonctuationComponent {
  inputText: string = '';
  punctuatedText: string | null = null;

  constructor(private http: HttpClient) {}

  onSubmit() {
    if (!this.inputText.trim()) {
      alert('Please enter some text.');
      return;
    }

    const requestBody = { text: this.inputText };

    this.http.post<any>('http://localhost:8853/punctuation/punctuate_text/', requestBody).subscribe(
      response => {
        this.punctuatedText = response.punctuated_text;
      },
      (error: HttpErrorResponse) => {
        console.error('Error during punctuation:', error.message);
        this.punctuatedText = 'An error occurred during punctuation.';
      }
    );
  }
}
