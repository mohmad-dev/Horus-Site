import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface EnrollRequest {
  studentName: string;
  phoneNumber: string;
  courseSlug: string;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiFailure {
  success: false;
  error: string;
  message?: string;
  details?: unknown;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export interface EnrollResponseData {
  id: string;
  courseSlug: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class LeadService {
  private http = inject(HttpClient);

  private apiUrl(path: string): string {
    const base = (environment.apiBaseUrl || '').replace(/\/+$/g, '');
    const p = path.startsWith('/') ? path : `/${path}`;
    return `${base}${p}`;
  }

  enroll(payload: EnrollRequest): Observable<ApiResponse<EnrollResponseData>> {
    return this.http.post<ApiResponse<EnrollResponseData>>(this.apiUrl('/api/enroll'), payload);
  }
}

