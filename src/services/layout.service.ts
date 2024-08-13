import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  showNavbarAndFooter = true;

  hideNavbarAndFooter() {
    this.showNavbarAndFooter = false;
  }

  ShowNavbarAndFooter() {
    this.showNavbarAndFooter = true;
  }
}
