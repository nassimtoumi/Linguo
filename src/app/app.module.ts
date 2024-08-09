import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AudioVisualizerComponent } from './audio-visualizer/audio-visualizer.component';
import { GrapheComponent } from './graphe/graphe.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AudioVisualizerComponent,
    GrapheComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
