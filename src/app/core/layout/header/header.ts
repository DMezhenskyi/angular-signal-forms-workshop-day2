import { Component } from '@angular/core';

@Component({
  selector: '[df-header], df-header',
  styleUrls: ['./header.scss'],
  template: `
    <div class="brand">
      <img src="logo.svg" alt="Decoded Frontend" width="150" height="65" />
      <span>| Angular Signal Forms: Deep Dive</span>
    </div>
  `,
})
export class Header {}
