import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Importer FormsModule

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AudioVisualizerComponent } from './audio-visualizer/audio-visualizer.component';
import { GrapheComponent } from './graphe/graphe.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { TranscriptionComponent } from './transcription/transcription.component';
import { LanguageSelectComponent } from './language-select/language-select.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AudioVisualizerComponent,
    GrapheComponent,
    NavbarComponent,
    FooterComponent,
    TranscriptionComponent,
    LanguageSelectComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule // Ajouter FormsModule aux imports
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
