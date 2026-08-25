import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '@core/layout/sidebar/sidebar';
import { Header } from '@core/layout/header/header';

@Component({
  selector: 'df-root',
  imports: [RouterOutlet, Sidebar, Header],
  styles: [
    `
      #content {
        position: relative;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        padding: calc(var(--spacing-step) * 3);
        box-sizing: border-box;
        background-color: var(--color-surface);
        margin: 0 calc(var(--spacing-step) * 2) calc(var(--spacing-step) * 2);
        width: calc(100% - calc(var(--spacing-step) * 4));
        min-height: calc(100vh - var(--header-height) - calc(var(--spacing-step) * 2));
        border-radius: calc(var(--border-radius) * 2);
      }
    `,
  ],
  template: `
    <header df-header></header>
    <main id="content">
      <router-outlet />
    </main>
    <df-sidebar>
      <router-outlet name="sidebar" />
    </df-sidebar>
  `,
})
export class App {}
