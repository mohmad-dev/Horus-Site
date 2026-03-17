import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { AdminKeyService } from './admin-key.service';
import type { ApiResponse } from '../../models/course.model';
import { Observable } from 'rxjs';

export interface EnrollmentLead {
  _id: string;
  studentName: string;
  phoneNumber: string;
  course: string; // ObjectId as string
  courseSlug: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable({ providedIn: 'root' })
export class AdminLeadsService {
  private http = inject(HttpClient);
  private adminKey = inject(AdminKeyService);

  private apiUrl(path: string): string {
    const base = (environment.apiBaseUrl || '').replace(/\/+$/g, '');
    const p = path.startsWith('/') ? path : `/${path}`;
    return `${base}${p}`;
  }

  getEnrollments(): Observable<ApiResponse<EnrollmentLead[]>> {
    const key = (this.adminKey.get() || '').trim();
    const headers = new HttpHeaders({
      'x-admin-key': key,
    });
    return this.http.get<ApiResponse<EnrollmentLead[]>>(this.apiUrl('/api/admin/enrollments'), {
      headers,
    });
  }
}

