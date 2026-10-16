import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-ats',
  template: `
    <div class="card" style="max-width: 980px; margin: 0 auto;">
      <h2>ATS Job Description Checker</h2>
      <p style="color: var(--muted); margin-bottom: 20px;">
        Paste a job description to evaluate readability, structure, and skill alignment for ATS parsing.
      </p>

      <div class="grid two-col">
        <div class="form-grid">
          <div class="form-group">
            <label>Job title (optional)</label>
            <input class="input" [(ngModel)]="jobTitle" placeholder="Senior Java Developer" />
          </div>

          <div class="form-group">
            <label>Expected skills (comma-separated)</label>
            <input class="input" [(ngModel)]="expectedSkillsText" placeholder="Java, Spring, Docker, AWS" />
          </div>

          <div class="form-group">
            <label>Job description</label>
            <textarea class="textarea" [(ngModel)]="jd" placeholder="Paste the full JD here..."></textarea>
          </div>

          <div style="display:flex; gap:10px; flex-wrap:wrap;">
            <button class="btn" (click)="check()">Analyze JD</button>
            <button class="btn btn-secondary" (click)="loadSample()">Use sample</button>
          </div>
        </div>

        <div *ngIf="result">
          <div class="metric-card" style="margin-bottom:16px;">
            <div class="metric-label">ATS score</div>
            <div class="metric-value" style="font-size: 2.8rem;">{{ result.score }}</div>
          </div>

          <div class="form-group" *ngIf="result.detectedSkills?.length">
            <label>Detected skills</label>
            <div class="tag-list">
              <span class="tag" *ngFor="let skill of result.detectedSkills">{{ skill }}</span>
            </div>
          </div>

          <div class="form-group">
            <label>Issues</label>
            <ul class="issues" *ngIf="result.issues?.length; else noIssues">
              <li class="issue-item" *ngFor="let issue of result.issues" [ngClass]="issue.severity.toLowerCase()">
                <strong>[{{ issue.severity }}]</strong>
                <span>{{ issue.message }}</span>
              </li>
            </ul>
            <ng-template #noIssues>
              <div class="empty-state">No major issues detected.</div>
            </ng-template>
          </div>

          <div class="form-group" *ngIf="result.suggestions?.length">
            <label>Suggestions</label>
            <ul class="suggestion-list">
              <li *ngFor="let s of result.suggestions">{{ s }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AtsComponent {
  jd = '';
  jobTitle = '';
  expectedSkillsText = '';
  result: any = null;

  constructor(private api: ApiService) {}

  check(): void {
    if (!this.jd.trim()) {
      this.result = { score: 0, issues: [{ severity: 'WARN', message: 'Please provide a job description.' }], suggestions: [] };
      return;
    }

    const expectedSkills = this.expectedSkillsText
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    this.api.checkAts({ jd: this.jd, jobTitle: this.jobTitle, expectedSkills }).subscribe({
      next: (res) => {
        this.result = res;
      },
      error: (err) => {
        this.result = {
          score: 0,
          issues: [{ severity: 'ERROR', message: err?.error?.message || 'Unable to analyze the job description.' }],
          suggestions: ['Verify the backend is running and the ATS endpoint is reachable.']
        };
      }
    });
  }

  loadSample(): void {
    this.jobTitle = 'Senior Java Developer';
    this.expectedSkillsText = 'Java, Spring Boot, REST, Docker, AWS';
    this.jd = `Senior Java Developer

About the Role
We are looking for a Senior Java Developer to help design and deliver scalable backend services for our next-generation platform. This role requires hands-on experience with Java, Spring Boot, REST APIs, and cloud-native deployment.

Responsibilities
- Design, build, and maintain backend services using Java and Spring Boot
- Create REST APIs and integrate with relational and NoSQL databases
- Collaborate with product and frontend teams to deliver end-to-end features
- Improve application reliability and performance across production services
- Support CI/CD automation and deployment workflows in AWS

Requirements
- 5+ years of experience in Java development
- Strong knowledge of Spring Boot, Spring MVC, and REST APIs
- Experience with Docker, CI/CD, and cloud infrastructure
- Solid understanding of SQL and database optimization
- Excellent communication and teamwork skills

Preferred Qualifications
- Experience with Kubernetes and microservices architecture
- Knowledge of AWS services and deployment automation
- Exposure to monitoring and observability tools`;
  }
}
