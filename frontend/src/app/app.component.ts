import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="app-shell">
      <header class="topbar">
        <div class="topbar-inner">
          <div class="brand">JobTracker ATS</div>
          <nav class="nav-links">
            <a class="nav-link" routerLink="/">Dashboard</a>
            <a class="nav-link" routerLink="/ats">ATS Checker</a>
            <a class="nav-link" routerLink="/login">Login</a>
          </nav>
        </div>
      </header>

      <main class="page">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class AppComponent {}
