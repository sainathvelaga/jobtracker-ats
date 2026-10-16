import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  base = '';
  constructor(private http: HttpClient, private router: Router) { }

  login(username: string, password: string) {
    return this.http.post<any>(`${this.base}/auth/login`, { username, password });
  }

  setToken(token: string) {
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  logout() {
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }

  isAuthenticated() {
    return !!this.getToken();
  }
}
