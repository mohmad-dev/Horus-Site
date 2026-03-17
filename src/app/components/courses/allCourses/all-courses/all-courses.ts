import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import type { Course } from '../../../../core/models/course.model';
import { CourseService } from '../../../../core/services/course/course.service';

@Component({
  selector: 'app-all-courses',
  imports: [RouterLink, AsyncPipe, NgIf, NgFor],
  templateUrl: './all-courses.html',
  styleUrl: './all-courses.css',
})
export class AllCourses {
  private courseService = inject(CourseService);

  courses$: Observable<Course[]> = this.courseService.getCourses();

  trackById = (_: number, c: Course) => c._id;

}
