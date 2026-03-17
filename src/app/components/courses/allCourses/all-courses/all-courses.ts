import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { combineLatest, map, Observable, startWith } from 'rxjs';
import type { Course } from '../../../../core/models/course.model';
import { CourseService } from '../../../../core/services/course/course.service';

@Component({
  selector: 'app-all-courses',
  imports: [RouterLink, AsyncPipe, NgIf, NgFor, ReactiveFormsModule],
  templateUrl: './all-courses.html',
  styleUrl: './all-courses.css',
})
export class AllCourses {
  private courseService = inject(CourseService);

  courses$: Observable<Course[]> = this.courseService.getCourses();

  categories = ['الكل', 'برمجة', 'تصميم', 'لغات', 'أعمال', 'شبكات'] as const;
  levels = ['الكل', 'مبتدئ', 'متوسط', 'متقدم'] as const;

  categoryCtrl = new FormControl<(typeof this.categories)[number]>('الكل', { nonNullable: true });
  levelCtrl = new FormControl<(typeof this.levels)[number]>('الكل', { nonNullable: true });
  searchCtrl = new FormControl<string>('', { nonNullable: true });

  filteredCourses$: Observable<Course[]> = combineLatest([
    this.courses$,
    this.categoryCtrl.valueChanges.pipe(startWith(this.categoryCtrl.value)),
    this.levelCtrl.valueChanges.pipe(startWith(this.levelCtrl.value)),
    this.searchCtrl.valueChanges.pipe(startWith(this.searchCtrl.value)),
  ]).pipe(
    map(([courses, category, level, search]) => {
      const q = (search || '').trim().toLowerCase();

      let out = courses.slice();
      if (category !== 'الكل') out = out.filter((c) => (c.category || '').trim() === category);
      if (level !== 'الكل') out = out.filter((c) => (c.level || '').trim() === level);
      if (q) out = out.filter((c) => (c.title || '').toLowerCase().includes(q));

      return out;
    }),
  );

  resetFilters() {
    this.categoryCtrl.setValue('الكل');
    this.levelCtrl.setValue('الكل');
    this.searchCtrl.setValue('');
  }

  trackById = (_: number, c: Course) => c._id;

}
