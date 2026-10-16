import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ApiService {
  base = '';
  constructor(private http: HttpClient) { }

  getApplications() {
    return this.http.get<any[]>(`${this.base}/applications`);
  }

  checkAts(payload: any) {
    return this.http.post<any>(`${this.base}/ats/check`, payload);
  }
}
