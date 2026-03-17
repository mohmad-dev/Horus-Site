import { Component, inject } from '@angular/core';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CourseService } from '../../../core/services/course/course.service';
import type { Course } from '../../../core/models/course.model';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { combineLatest, map, Observable, startWith } from 'rxjs';

@Component({
  selector: 'app-courses',
  imports: [RouterLink, AsyncPipe, NgIf, NgFor, ReactiveFormsModule],
  templateUrl: './courses.html',
  styleUrl: './courses.css',
})
export class Courses {
  private courseService = inject(CourseService);

  courses$: Observable<Course[]> = this.courseService.getCourses();

  categories = ['الكل', 'برمجة', 'تصميم', 'لغات', 'أعمال', 'شبكات'] as const;
  levels = ['الكل', 'مبتدئ', 'متوسط', 'متقدم'] as const;
  priceSorts = [
    { value: 'none', label: 'بدون ترتيب' },
    { value: 'asc', label: 'السعر: من الأقل للأعلى' },
    { value: 'desc', label: 'السعر: من الأعلى للأقل' },
  ] as const;

  categoryCtrl = new FormControl<(typeof this.categories)[number]>('الكل', { nonNullable: true });
  levelCtrl = new FormControl<(typeof this.levels)[number]>('الكل', { nonNullable: true });
  priceSortCtrl = new FormControl<(typeof this.priceSorts)[number]['value']>('none', { nonNullable: true });
  searchCtrl = new FormControl<string>('', { nonNullable: true });

  filteredCourses$: Observable<Course[]> = combineLatest([
    this.courses$,
    this.categoryCtrl.valueChanges.pipe(startWith(this.categoryCtrl.value)),
    this.levelCtrl.valueChanges.pipe(startWith(this.levelCtrl.value)),
    this.priceSortCtrl.valueChanges.pipe(startWith(this.priceSortCtrl.value)),
    this.searchCtrl.valueChanges.pipe(startWith(this.searchCtrl.value)),
  ]).pipe(
    map(([courses, category, level, priceSort, search]) => {
      const q = (search || '').trim().toLowerCase();

      let out = courses.slice();

      if (category !== 'الكل') out = out.filter((c) => (c.category || '').trim() === category);
      if (level !== 'الكل') out = out.filter((c) => (c.level || '').trim() === level);
      if (q) out = out.filter((c) => (c.title || '').toLowerCase().includes(q));

      if (priceSort === 'asc') out.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
      if (priceSort === 'desc') out.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));

      return out;
    }),
  );

  resetFilters() {
    this.categoryCtrl.setValue('الكل');
    this.levelCtrl.setValue('الكل');
    this.priceSortCtrl.setValue('none');
    this.searchCtrl.setValue('');
  }

  trackById = (_: number, c: Course) => c._id;

}
