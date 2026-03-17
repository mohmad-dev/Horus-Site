import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { map, Observable } from 'rxjs';
import type { Course } from '../../../core/models/course.model';
import { AdminKeyService } from '../../../core/services/admin/admin-key.service';
import { AdminCoursesService } from '../../../core/services/admin/admin-courses.service';

type CurriculumChapterGroup = FormGroup<{
  chapterTitle: FormControl<string>;
  lessons: FormArray<FormControl<string>>;
}>;

@Component({
  selector: 'app-admin-courses',
  imports: [NgIf, NgFor, AsyncPipe, RouterLink, ReactiveFormsModule],
  templateUrl: './admin-courses.html',
  styleUrl: './admin-courses.css',
})
export class AdminCoursesPage {
  private api = inject(AdminCoursesService);
  private fb = inject(FormBuilder);
  private adminKey = inject(AdminKeyService);

  categories = ['برمجة', 'تصميم', 'لغات', 'أعمال', 'شبكات'] as const;
  levels = ['مبتدئ', 'متوسط', 'متقدم'] as const;

  isModalOpen = false;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  editingId: string | null = null;

  courses$: Observable<Course[]> = this.api.listCourses().pipe(
    map((res) => {
      if (res.success) return res.data;
      throw new Error(res.message || res.error);
    }),
  );

  form = this.fb.nonNullable.group({
    title: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(2)]),
    slug: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(1)]),
    imageUrl: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(1)]),
    category: this.fb.nonNullable.control<string>(this.categories[0], [Validators.required]),
    price: this.fb.nonNullable.control(0, [Validators.required, Validators.min(0)]),
    level: this.fb.nonNullable.control<string>(this.levels[0], [Validators.required]),
    duration: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(1)]),
    description: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(10)]),
    aboutCourse: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(20)]),
    learningOutcomes: this.fb.nonNullable.array<FormControl<string>>([]),
    requirements: this.fb.nonNullable.array<FormControl<string>>([]),
    curriculum: this.fb.nonNullable.array<CurriculumChapterGroup>([]),
  });

  get learningOutcomes() {
    return this.form.controls.learningOutcomes;
  }
  get requirements() {
    return this.form.controls.requirements;
  }
  get curriculum() {
    return this.form.controls.curriculum;
  }

  constructor() {
    this.resetDynamicArrays();
  }

  private resetDynamicArrays() {
    this.learningOutcomes.clear();
    this.requirements.clear();
    this.curriculum.clear();
    this.addLearningOutcome();
    this.addRequirement();
    this.addChapter();
  }

  openCreate() {
    this.editingId = null;
    this.errorMessage = '';
    this.successMessage = '';
    this.isModalOpen = true;
    this.form.reset({
      title: '',
      slug: '',
      imageUrl: '',
      category: this.categories[0],
      price: 0,
      level: this.levels[0],
      duration: '',
      description: '',
      aboutCourse: '',
    });
    this.resetDynamicArrays();
  }

  openEdit(course: Course) {
    this.editingId = course._id;
    this.errorMessage = '';
    this.successMessage = '';
    this.isModalOpen = true;

    this.form.patchValue({
      title: course.title,
      slug: course.slug,
      imageUrl: course.imageUrl,
      category: course.category,
      price: course.price,
      level: course.level,
      duration: course.duration,
      description: course.description,
      aboutCourse: course.aboutCourse,
    });

    this.learningOutcomes.clear();
    for (const x of course.learningOutcomes ?? []) this.learningOutcomes.push(this.fb.nonNullable.control(x));
    if (this.learningOutcomes.length === 0) this.addLearningOutcome();

    this.requirements.clear();
    for (const x of course.requirements ?? []) this.requirements.push(this.fb.nonNullable.control(x));
    if (this.requirements.length === 0) this.addRequirement();

    this.curriculum.clear();
    for (const ch of course.curriculum ?? []) {
      const lessons = this.fb.nonNullable.array<FormControl<string>>([]);
      for (const l of ch.lessons ?? []) lessons.push(this.fb.nonNullable.control(l));
      if (lessons.length === 0) lessons.push(this.fb.nonNullable.control(''));

      this.curriculum.push(
        this.fb.nonNullable.group({
          chapterTitle: this.fb.nonNullable.control(ch.chapterTitle || '', [Validators.required]),
          lessons,
        }),
      );
    }
    if (this.curriculum.length === 0) this.addChapter();
  }

  closeModal() {
    this.isModalOpen = false;
    this.isSubmitting = false;
  }

  addLearningOutcome() {
    this.learningOutcomes.push(this.fb.nonNullable.control('', [Validators.required]));
  }
  removeLearningOutcome(i: number) {
    if (this.learningOutcomes.length <= 1) return;
    this.learningOutcomes.removeAt(i);
  }

  addRequirement() {
    this.requirements.push(this.fb.nonNullable.control('', [Validators.required]));
  }
  removeRequirement(i: number) {
    if (this.requirements.length <= 1) return;
    this.requirements.removeAt(i);
  }

  addChapter() {
    const lessons = this.fb.nonNullable.array<FormControl<string>>([this.fb.nonNullable.control('', [Validators.required])]);
    this.curriculum.push(
      this.fb.nonNullable.group({
        chapterTitle: this.fb.nonNullable.control('', [Validators.required]),
        lessons,
      }),
    );
  }
  removeChapter(i: number) {
    if (this.curriculum.length <= 1) return;
    this.curriculum.removeAt(i);
  }

  lessonsAt(chIdx: number) {
    return this.curriculum.at(chIdx).controls.lessons;
  }
  addLesson(chIdx: number) {
    this.lessonsAt(chIdx).push(this.fb.nonNullable.control('', [Validators.required]));
  }
  removeLesson(chIdx: number, lessonIdx: number) {
    const arr = this.lessonsAt(chIdx);
    if (arr.length <= 1) return;
    arr.removeAt(lessonIdx);
  }

  reload() {
    this.courses$ = this.api.listCourses().pipe(
      map((res) => {
        if (res.success) return res.data;
        throw new Error(res.message || res.error);
      }),
    );
  }

  submit() {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.errorMessage = 'يرجى تعبئة الحقول المطلوبة بشكل صحيح.';
      return;
    }

    const payload = this.toPayload();
    this.isSubmitting = true;

    const obs = this.editingId
      ? this.api.updateCourse(this.editingId, payload)
      : this.api.createCourse(payload);

    obs.subscribe({
      next: (res) => {
        this.isSubmitting = false;
        if (!res.success) {
          this.errorMessage = res.message || res.error;
          return;
        }
        this.successMessage = this.editingId ? 'تم تحديث الكورس بنجاح.' : 'تم إضافة الكورس بنجاح.';
        this.closeModal();
        this.reload();
      },
      error: () => {
        this.isSubmitting = false;
        this.errorMessage = 'حدث خطأ أثناء الاتصال بالسيرفر.';
      },
    });
  }

  delete(course: Course) {
    this.errorMessage = '';
    this.successMessage = '';
    const ok = confirm(`حذف الكورس: ${course.title} ؟`);
    if (!ok) return;

    this.api.deleteCourse(course._id).subscribe({
      next: (res) => {
        if (!res.success) {
          this.errorMessage = res.message || res.error;
          return;
        }
        this.successMessage = 'تم حذف الكورس.';
        this.reload();
      },
      error: () => {
        this.errorMessage = 'حدث خطأ أثناء الاتصال بالسيرفر.';
      },
    });
  }

  logout() {
    this.adminKey.clear();
    location.href = '/';
  }

  private toPayload() {
    const v = this.form.getRawValue();
    return {
      title: v.title.trim(),
      slug: v.slug.trim(),
      imageUrl: v.imageUrl.trim(),
      category: v.category,
      price: Number(v.price),
      level: v.level,
      duration: v.duration.trim(),
      description: v.description.trim(),
      aboutCourse: v.aboutCourse.trim(),
      learningOutcomes: v.learningOutcomes.map((x) => (x || '').trim()).filter(Boolean),
      requirements: v.requirements.map((x) => (x || '').trim()).filter(Boolean),
      curriculum: v.curriculum
        .map((ch) => ({
          chapterTitle: (ch.chapterTitle || '').trim(),
          lessons: ch.lessons.map((l) => (l || '').trim()).filter(Boolean),
        }))
        .filter((ch) => ch.chapterTitle.length > 0 && ch.lessons.length > 0),
    };
  }
}

