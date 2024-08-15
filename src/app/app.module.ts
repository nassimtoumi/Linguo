import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { GrapheComponent } from './graphe/graphe.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { TranscriptionComponent } from './transcription/transcription.component';
import { LanguageSelectComponent } from './language-select/language-select.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { TtsComponent } from './tts/tts.component';
import { TtsService } from '../services/tts.service';
import { HttpClientModule } from '@angular/common/http';
import { SttComponent } from './stt/stt.component';
import { NerComponent } from './ner/ner.component';
import { PonctuationComponent } from './ponctuation/ponctuation.component';
import { EmotionComponent } from './emotion/emotion.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    GrapheComponent,
    NavbarComponent,
    FooterComponent,
    TranscriptionComponent,
    LanguageSelectComponent,
    LoginComponent,
    SignUpComponent,
    TtsComponent,
    SttComponent,
    NerComponent,
    PonctuationComponent,
    EmotionComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule, // Ajouter FormsModule aux imports
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
