import { Component, inject } from '@angular/core';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CourseService } from '../../../core/services/course/course.service';
import type { Course } from '../../../core/models/course.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-courses',
  imports: [RouterLink, AsyncPipe, NgIf, NgFor],
  templateUrl: './courses.html',
  styleUrl: './courses.css',
})
export class Courses {
  private courseService = inject(CourseService);

  courses$: Observable<Course[]> = this.courseService.getCourses();

  trackById = (_: number, c: Course) => c._id;

}
