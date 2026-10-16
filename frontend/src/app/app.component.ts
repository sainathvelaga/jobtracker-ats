import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="header">
      <div style="display:flex;align-items:center;justify-content:space-between">
        <div>JobTracker ATS</div>
        <div>
          <a routerLink="/" style="color:#fff;margin-right:12px">Dashboard</a>
          <a routerLink="/ats" style="color:#fff;margin-right:12px">ATS Checker</a>
          <a routerLink="/login" style="color:#fff">Login</a>
        </div>
      </div>
    </div>
    <div class="container">
      <router-outlet></router-outlet>
    </div>
  `
})
export class AppComponent { }
