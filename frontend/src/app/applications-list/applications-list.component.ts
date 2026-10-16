import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-applications-list',
  template: `
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <div>
          <h3>Your applications</h3>
          <p style="color:var(--muted)">Filter and update application status</p>
        </div>
        <div>
          <button class="btn" routerLink="/applications/new">New application</button>
        </div>
      </div>

      <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap">
        <button class="tag" [class.active]="filter === 'all'" (click)="setFilter('all')">All</button>
        <button class="tag" [class.active]="filter === 'applied'" (click)="setFilter('applied')">Applied</button>
        <button class="tag" [class.active]="filter === 'interview'" (click)="setFilter('interview')">Interviews</button>
        <button class="tag" [class.active]="filter === 'offer'" (click)="setFilter('offer')">Offers</button>
        <button class="tag" [class.active]="filter === 'rejected'" (click)="setFilter('rejected')">Rejected</button>
      </div>

      <div *ngIf="loading" class="empty-state">Loading...</div>
      <div *ngIf="!loading && applications.length === 0" class="empty-state">You have no applications yet.</div>

      <table *ngIf="!loading && applications.length" class="table">
        <thead>
          <tr>
            <th>Company</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let a of filtered()">
            <td>{{a.companyName || '—'}}</td>
            <td>{{a.jobTitle || a.jobId || '—'}}</td>
            <td><span class="status-badge" [ngClass]="statusClass(a.status)">{{a.status}}</span></td>
            <td>
              <button class="btn btn-secondary" (click)="updateStatus(a, 'Phone Screen')">Phone Screen</button>
              <button class="btn btn-secondary" (click)="updateStatus(a, 'Onsite')">Onsite</button>
              <button class="btn" (click)="updateStatus(a, 'Offer')">Offer</button>
              <button class="btn btn-danger" (click)="updateStatus(a, 'Rejected')">Reject</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class ApplicationsListComponent implements OnInit {
  applications: any[] = [];
  loading = false;
  filter: string = 'all';

  constructor(private api: ApiService) {}

  ngOnInit(): void { this.fetch(); }

  fetch(): void {
    this.loading = true;
    this.api.getApplications().subscribe({ next: data => { this.applications = data || []; this.loading = false; }, error: () => this.loading = false });
  }

  filtered(): any[] {
    if (this.filter === 'all') return this.applications;
    if (this.filter === 'applied') return this.applications.filter(a => (a.status || '').toLowerCase() === 'applied');
    if (this.filter === 'interview') return this.applications.filter(a => ['phone screen','onsite','interview'].includes((a.status || '').toLowerCase()));
    if (this.filter === 'offer') return this.applications.filter(a => (a.status || '').toLowerCase() === 'offer');
    if (this.filter === 'rejected') return this.applications.filter(a => (a.status || '').toLowerCase().includes('reject'));
    return this.applications;
  }

  setFilter(f: string) { this.filter = f; }

  updateStatus(app: any, status: string) {
    this.api.updateApplicationStatus(app.id, status).subscribe({ next: () => { app.status = status; }, error: () => alert('Failed to update status') });
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
