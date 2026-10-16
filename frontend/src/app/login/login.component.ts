import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="card" style="max-width: 480px; margin: 60px auto;">
      <h2>Welcome back</h2>
      <p style="color: var(--muted); margin-bottom: 20px;">Sign in to track applications and analyze job descriptions.</p>

      <div class="form-grid">
        <div class="form-group">
          <label for="username">Username</label>
          <input id="username" class="input" [(ngModel)]="username" placeholder="Enter username" />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input id="password" class="input" [(ngModel)]="password" type="password" placeholder="Enter password" />
        </div>

        <div style="display:flex; gap: 10px; align-items:center; flex-wrap:wrap;">
          <button class="btn" (click)="doLogin()">Login</button>
          <button class="btn btn-secondary" (click)="fillDemo()">Use demo account</button>
        </div>

        <div *ngIf="error" style="color: var(--danger); font-weight: 600;">{{ error }}</div>
      </div>
    </div>
  `
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  doLogin(): void {
    this.error = '';

    this.auth.login(this.username, this.password).subscribe({
      next: (res) => {
        if (res?.token) {
          this.auth.setToken(res.token);
          this.router.navigate(['/']);
        } else {
          this.error = 'Invalid server response.';
        }
      },
      error: (err) => {
        this.error = err?.error?.error || 'Login failed. Please check your credentials.';
      }
    });
  }

  fillDemo(): void {
    this.username = 'alice';
    this.password = 'alicepass';
  }
}
