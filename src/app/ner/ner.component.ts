import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-ner',
  templateUrl: './ner.component.html',
  styleUrls: ['./ner.component.css']
})
export class NerComponent {
  inputText: string = '';
  nerResult: any = null;

  constructor(private http: HttpClient) {}

  onSubmit() {
    if (!this.inputText.trim()) {
      alert('Please enter some text.');
      return;
    }

    const requestBody = { text: this.inputText };

    this.http.post<any>('http://localhost:2505/ner', requestBody).subscribe(
      response => {
        this.nerResult = response.entities;
      },
      (error: HttpErrorResponse) => {
        console.error('Error during NER detection:', error.message);
        this.nerResult = 'An error occurred during NER detection.';
      }
    );
  }
}
