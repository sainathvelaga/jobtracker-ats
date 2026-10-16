import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-application-form',
  template: `
    <div class="card" style="max-width:820px">
      <h3>Add Application</h3>
      <div class="form-grid">
        <div class="form-group">
          <label>Company</label>
          <input class="input" [(ngModel)]="companyName" placeholder="Company name" />
        </div>

        <div class="form-group">
          <label>Job title</label>
          <input class="input" [(ngModel)]="jobTitle" placeholder="Job title" />
        </div>

        <div class="form-group">
          <label>Job ID / Source</label>
          <input class="input" [(ngModel)]="jobId" placeholder="Job ID or source URL" />
        </div>

        <div class="form-group">
          <label>Notes</label>
          <textarea class="textarea" [(ngModel)]="notesText" placeholder="Notes about this application"></textarea>
        </div>

        <div style="display:flex;gap:8px">
          <button class="btn" (click)="submit()">Create</button>
          <button class="btn btn-secondary" (click)="cancel()">Cancel</button>
        </div>
      </div>

      <div *ngIf="message" style="margin-top:12px;color:var(--primary)">{{message}}</div>
    </div>
  `
})
export class ApplicationFormComponent {
  companyName = '';
  jobTitle = '';
  jobId = '';
  notesText = '';
  message = '';

  constructor(private api: ApiService, private router: Router) {}

  submit() {
    const payload: any = {
      companyName: this.companyName,
      jobTitle: this.jobTitle,
      jobId: this.jobId,
      notes: this.notesText ? [this.notesText] : []
    };

    this.api.createApplication(payload).subscribe({
      next: () => {
        this.message = 'Application created';
        setTimeout(() => this.router.navigate(['/applications']), 700);
      },
      error: (err) => this.message = err?.error?.message || 'Failed to create application'
    });
  }

  cancel() { this.router.navigate(['/applications']); }
}
