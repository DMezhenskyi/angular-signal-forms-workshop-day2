import { Component, signal } from '@angular/core';

@Component({
  selector: 'df-sidebar',
  styleUrls: ['./sidebar.scss'],
  host: {
    '[class.collapsed]': 'collapsed()',
  },
  template: `
    <header class="sidebar-header">
      <button type="button" class="toggle" (click)="collapsed.update((collapsed) => !collapsed)">
        <span class="chevron"></span>
      </button>
    </header>

    @if (!collapsed()) {
      <div class="sidebar-body" animate.enter="body-enter" animate.leave="body-leave">
        <ng-content />
      </div>
    }
  `,
})
export class Sidebar {
  protected readonly collapsed = signal(true);
}
