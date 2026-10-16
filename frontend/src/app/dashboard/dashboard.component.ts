import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="card">
      <div style="display:flex; justify-content:space-between; align-items:center; gap:12px; margin-bottom: 22px; flex-wrap: wrap;">
        <div>
          <h2>Application dashboard</h2>
          <p style="color: var(--muted);">Track progress across your job pipeline.</p>
        </div>
        <button class="btn btn-secondary" *ngIf="auth.isAuthenticated()" (click)="logout()">Logout</button>
      </div>

      <div *ngIf="!auth.isAuthenticated()" class="empty-state">
        Please <a routerLink="/login">log in</a> to view your applications and metrics.
      </div>

      <div *ngIf="auth.isAuthenticated()">
        <div class="metrics" style="margin-bottom:18px;">
          <div class="metric-card">
            <div class="metric-label">Total</div>
            <div class="metric-value">{{ applications.length }}</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Applied</div>
            <div class="metric-value">{{ appliedCount }}</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Interviews</div>
            <div class="metric-value">{{ interviewCount }}</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Offers</div>
            <div class="metric-value">{{ offerCount }}</div>
          </div>
        </div>

        <div *ngIf="loading" class="empty-state">Loading applications...</div>

        <div *ngIf="!loading && applications.length === 0" class="empty-state">
          No applications yet. Add your first role and start tracking.
        </div>

        <table *ngIf="!loading && applications.length > 0" class="table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Role</th>
              <th>Status</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let app of applications">
              <td>{{ app.companyName || 'Unknown company' }}</td>
              <td>{{ app.jobTitle || app.jobId || 'Untitled role' }}</td>
              <td>
                <span class="status-badge" [ngClass]="statusClass(app.status)">
                  {{ app.status || 'Applied' }}
                </span>
              </td>
              <td>{{ app.updatedAt | date: 'MMM d, y' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  applications: any[] = [];
  loading = false;

  constructor(private api: ApiService, public auth: AuthService) {}

  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      this.fetch();
    }
  }

  fetch(): void {
    this.loading = true;
    this.api.getApplications().subscribe({
      next: (data) => {
        this.applications = data || [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  logout(): void {
    this.auth.logout();
  }

  get appliedCount(): number {
    return this.applications.filter(app => (app.status || '').toLowerCase() === 'applied').length;
  }

  get interviewCount(): number {
    return this.applications.filter(app => ['phone screen', 'onsite', 'interview'].includes((app.status || '').toLowerCase())).length;
  }

  get offerCount(): number {
    return this.applications.filter(app => (app.status || '').toLowerCase() === 'offer').length;
  }

  statusClass(status: string): string {
    const value = (status || 'applied').toLowerCase();
    if (value.includes('phone')) return 'status-phone-screen';
    if (value.includes('onsite')) return 'status-onsite';
    if (value.includes('offer')) return 'status-offer';
    if (value.includes('reject')) return 'status-rejected';
    return 'status-applied';
  }
}
