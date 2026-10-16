import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="app-shell">
      <header class="topbar">
        <div class="topbar-inner">
          <div class="brand">JobTracker ATS</div>
          <nav class="nav-links">
            <a class="nav-link" routerLink="/dashboard">Dashboard</a>
            <a class="nav-link" routerLink="/applications">Applications</a>
            <a class="nav-link" routerLink="/applications/new">Add Application</a>
            <a class="nav-link" routerLink="/ats">ATS Checker</a>
            <a class="nav-link" routerLink="/login">Login</a>
          </nav>
        </div>
      </header>

      <main class="page">
        <div class="grid two-col">
          <aside style="max-width:260px;">
            <div class="card">
              <h4 style="margin-bottom:10px">Overview</h4>
              <p style="color:var(--muted); margin-bottom:6px">Quick links</p>
              <div class="tag-list">
                <a class="tag" routerLink="/applications">Applications</a>
                <a class="tag" routerLink="/ats">ATS Checker</a>
                <a class="tag" routerLink="/applications/new">New Application</a>
              </div>
            </div>
          </aside>

          <section>
            <router-outlet></router-outlet>
          </section>
        </div>
      </main>
    </div>
  `
})
export class AppComponent {}
