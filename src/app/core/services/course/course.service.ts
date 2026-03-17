import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import type { ApiResponse, Course } from '../../models/course.model';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CourseService {
  private http = inject(HttpClient);

  private apiUrl(path: string): string {
    const base = (environment.apiBaseUrl || '').replace(/\/+$/g, '');
    const p = path.startsWith('/') ? path : `/${path}`;
    return `${base}${p}`;
  }

  getCourses(): Observable<Course[]> {
    return this.http.get<ApiResponse<Course[]>>(this.apiUrl('/api/courses')).pipe(
      map((res) => {
        if (!res.success) throw new Error(res.error);
        return res.data;
      }),
    );
  }

  getCourseBySlug(slug: string): Observable<Course> {
    const safeSlug = (slug ?? '').trim().toLowerCase();
    return this.http
      .get<ApiResponse<Course>>(this.apiUrl(`/api/courses/${encodeURIComponent(safeSlug)}`))
      .pipe(
      map((res) => {
        if (!res.success) throw new Error(res.error);
        return res.data;
      }),
      );
  }
}

