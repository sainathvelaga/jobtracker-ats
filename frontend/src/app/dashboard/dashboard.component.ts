import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="card">
      <h3>Dashboard</h3>
      <div *ngIf="!auth.isAuthenticated()">
        <p>Please <a routerLink="/login">login</a> to see your applications.</p>
      </div>

      <div *ngIf="auth.isAuthenticated()">
        <div style="margin-bottom:12px">
          <button (click)="logout()">Logout</button>
        </div>
        <div *ngIf="loading">Loading...</div>
        <div *ngIf="!loading && applications?.length === 0">No applications yet.</div>
        <ul *ngIf="applications?.length">
          <li *ngFor="let a of applications">
            <strong>{{a.jobTitle || a.jobId}}</strong> — {{a.companyName || 'Unknown'}} — {{a.status}}
          </li>
        </ul>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  applications: any[] = [];
  loading = false;

  constructor(private api: ApiService, public auth: AuthService) { }

  ngOnInit(): void {
    if (this.auth.isAuthenticated()) this.fetch();
  }

  fetch() {
    this.loading = true;
    this.api.getApplications().subscribe({ next: data => { this.applications = data; this.loading = false; }, error: () => this.loading = false });
  }

  logout() { this.auth.logout(); }
}
