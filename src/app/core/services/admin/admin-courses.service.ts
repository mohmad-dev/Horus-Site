import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { AdminKeyService } from './admin-key.service';
import type { ApiResponse, Course } from '../../models/course.model';
import { Observable } from 'rxjs';

export type AdminCourseInput = Omit<
  Course,
  '_id' | 'createdAt' | 'updatedAt' | 'instructor'
> & { instructor?: string };

@Injectable({ providedIn: 'root' })
export class AdminCoursesService {
  private http = inject(HttpClient);
  private adminKey = inject(AdminKeyService);

  private apiUrl(path: string): string {
    const base = (environment.apiBaseUrl || '').replace(/\/+$/g, '');
    const p = path.startsWith('/') ? path : `/${path}`;
    return `${base}${p}`;
  }

  private headers(): HttpHeaders {
    const key = (this.adminKey.get() || '').trim();
    return new HttpHeaders({ 'x-admin-key': key });
  }

  listCourses(): Observable<ApiResponse<Course[]>> {
    return this.http.get<ApiResponse<Course[]>>(this.apiUrl('/api/courses'), {
      headers: this.headers(),
    });
  }

  createCourse(payload: Partial<AdminCourseInput>): Observable<ApiResponse<Course>> {
    return this.http.post<ApiResponse<Course>>(this.apiUrl('/api/admin/courses'), payload, {
      headers: this.headers(),
    });
  }

  updateCourse(id: string, payload: Partial<AdminCourseInput>): Observable<ApiResponse<Course>> {
    return this.http.put<ApiResponse<Course>>(this.apiUrl(`/api/admin/courses/${encodeURIComponent(id)}`), payload, {
      headers: this.headers(),
    });
  }

  deleteCourse(id: string): Observable<ApiResponse<Course>> {
    return this.http.delete<ApiResponse<Course>>(this.apiUrl(`/api/admin/courses/${encodeURIComponent(id)}`), {
      headers: this.headers(),
    });
  }
}

