import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ApiService {
  base = '';
  constructor(private http: HttpClient) { }

  getApplications() {
    return this.http.get<any[]>(`${this.base}/applications`);
  }

  getJobs() {
    return this.http.get<any[]>(`${this.base}/jobs`);
  }

  createApplication(payload: any) {
    return this.http.post<any>(`${this.base}/applications`, payload);
  }

  updateApplicationStatus(id: string, status: string) {
    return this.http.patch<any>(`${this.base}/applications/${id}/status`, { status });
  }

  checkAts(payload: any) {
    return this.http.post<any>(`${this.base}/ats/check`, payload);
  }
}
