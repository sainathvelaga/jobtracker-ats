import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  template: `
    <div class="card">
      <h4>Navigation</h4>
      <div style="display:flex;flex-direction:column;gap:8px;margin-top:8px">
        <a routerLink="/dashboard" class="tag">Dashboard</a>
        <a routerLink="/applications" class="tag">Applications</a>
        <a routerLink="/applications/new" class="tag">Add Application</a>
        <a routerLink="/ats" class="tag">ATS Checker</a>
      </div>
    </div>
  `
})
export class SidebarComponent {}
