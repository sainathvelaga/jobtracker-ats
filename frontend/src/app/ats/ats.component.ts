import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-ats',
  template: `
    <div class="card" style="max-width:800px;margin:0 auto">
      <h3>ATS Checker</h3>
      <div class="form-field">
        <textarea rows="10" [(ngModel)]="jd" placeholder="Paste job description here"></textarea>
      </div>
      <div class="form-field">
        <input [(ngModel)]="jobTitle" placeholder="Job title (optional)" />
      </div>
      <div class="form-field">
        <input [(ngModel)]="expectedSkillsText" placeholder="Expected skills (comma-separated, optional)" />
      </div>
      <div class="form-field">
        <button (click)="check()">Analyze</button>
      </div>

      <div *ngIf="result">
        <h4>Score: {{result.score}}</h4>
        <div *ngIf="result.issues?.length">
          <h5>Issues</h5>
          <ul>
            <li *ngFor="let i of result.issues">[{{i.severity}}] {{i.message}}</li>
          </ul>
        </div>
        <div *ngIf="result.suggestions?.length">
          <h5>Suggestions</h5>
          <ul>
            <li *ngFor="let s of result.suggestions">{{s}}</li>
          </ul>
        </div>
        <div *ngIf="result.detectedSkills?.length">
          <h5>Detected skills</h5>
          <div>{{result.detectedSkills.join(', ')}}</div>
        </div>
        <pre style="background:#f6f6f6;padding:8px;margin-top:8px">{{result | json}}</pre>
      </div>
    </div>
  `
})
export class AtsComponent {
  jd = '';
  jobTitle = '';
  expectedSkillsText = '';
  result: any = null;

  constructor(private api: ApiService) { }

  check() {
    const expected = this.expectedSkillsText.split(',').map(s => s.trim()).filter(s => s.length);
    this.api.checkAts({ jd: this.jd, jobTitle: this.jobTitle, expectedSkills: expected }).subscribe({ next: res => this.result = res, error: err => this.result = { error: err?.error || 'Analysis failed' } });
  }
}
