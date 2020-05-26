import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Report } from '../models/report';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  env = environment;

  constructor(private http: HttpClient) { 
    
  }

  getAll() {
    return this.http.get<Report[]>(`${this.env.apiUrl}/report`);
  }

  delete(id: number) {
    return this.http.delete(`${this.env.apiUrl}/report/delete/${id}`);
  }

  create(report: Report) {
    return this.http.post(`${this.env.apiUrl}/report/create`, report);
  }

  update(report: Report) {
    report.modified_dt = new Date();
    return this.http.post(`${this.env.apiUrl}/report/update`, report);
  }

  approve(report: Report) {
    report.status = 'approved';
    report.modified_dt = new Date();
    return this.http.post(`${this.env.apiUrl}/report/update`, report);
  }

  reject(report: Report) {
    report.status = 'rejected';
    report.modified_dt = new Date();
    return this.http.post(`${this.env.apiUrl}/report/update`, report);
  }
  

}
