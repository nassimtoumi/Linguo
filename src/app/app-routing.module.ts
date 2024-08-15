import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { GrapheComponent } from './graphe/graphe.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { TtsComponent } from './tts/tts.component';
import { SttComponent } from './stt/stt.component';
import { NerComponent } from './ner/ner.component';
import { EmotionComponent } from './emotion/emotion.component';
import { PonctuationComponent } from './ponctuation/ponctuation.component';
import { ComboComponent } from './combo/combo.component';
import { AboutComponent } from './about/about.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'signUp', component: SignUpComponent },
  { path: 'tts', component: TtsComponent },
  { path: 'ner', component: NerComponent },
  { path: 'emotion', component: EmotionComponent },
  { path: 'punctuation', component: PonctuationComponent },
  { path: 'about', component: AboutComponent },
  { path: 'combo', component: ComboComponent },
  { path: 'stt', component: SttComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
