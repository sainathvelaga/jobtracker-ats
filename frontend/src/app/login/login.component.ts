import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="card" style="max-width:400px;margin:0 auto">
      <h3>Login</h3>
      <div class="form-field">
        <input [(ngModel)]="username" placeholder="Username" />
      </div>
      <div class="form-field">
        <input [(ngModel)]="password" type="password" placeholder="Password" />
      </div>
      <div class="form-field">
        <button (click)="doLogin()">Login</button>
        <button class="secondary" (click)="fillDemo()" style="margin-left:8px">Demo</button>
      </div>
      <div *ngIf="error" style="color:#c0392b">{{error}}</div>
    </div>
  `
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) { }

  doLogin() {
    this.error = '';
    this.auth.login(this.username, this.password).subscribe({
      next: (res) => {
        if (res && res.token) {
          this.auth.setToken(res.token);
          this.router.navigate(['/']);
        } else {
          this.error = 'Invalid response from server';
        }
      },
      error: (err) => this.error = err?.error?.error || 'Login failed'
    });
  }

  fillDemo() {
    this.username = 'alice';
    this.password = 'alicepass';
  }
}
