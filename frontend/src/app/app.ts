import { Component, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './shared/components/navbar';
import { FooterComponent } from './shared/components/footer';

import { ContactChatComponent } from './shared/components/contact-chat';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, CommonModule, ContactChatComponent],
  template: `
    <app-navbar *ngIf="!isManagementRoute()"></app-navbar>
    <main [class.no-padding]="isManagementRoute()">
      <router-outlet></router-outlet>
    </main>
    <app-footer *ngIf="!isManagementRoute()"></app-footer>
    <app-contact-chat *ngIf="!isManagementRoute()"></app-contact-chat>
  `,
  styles: [`
    main { min-height: 80vh; }
    .no-padding { padding: 0; }
  `]
})
export class App {
  private router = inject(Router);

  isManagementRoute(): boolean {
    return this.router.url.startsWith('/management');
  }
}
