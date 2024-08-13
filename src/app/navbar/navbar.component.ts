import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  showProfileDropdown = false;
  darkMode = false;

  constructor() { }

  ngOnInit(): void {
  }

  toggleDarkMode(): void {
    this.darkMode =!this.darkMode;
  }

  toggleProfileDropdown(): void {
    this.showProfileDropdown =!this.showProfileDropdown;
  }
}