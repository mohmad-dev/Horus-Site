import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize, switchMap } from 'rxjs';
import { CourseService } from '../../../../core/services/course/course.service';
import type { Course } from '../../../../core/models/course.model';
import { LeadService } from '../../../../core/services/lead/lead.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-course-details',
  imports: [RouterLink, AsyncPipe, NgIf, NgFor, ReactiveFormsModule],
  templateUrl: './course-details.html',
  styleUrl: './course-details.css',
})
export class CourseDetails {
  private route = inject(ActivatedRoute);
  private courseService = inject(CourseService);
  private leadService = inject(LeadService);

  course$ = this.route.paramMap.pipe(
    switchMap((params) => this.courseService.getCourseBySlug(params.get('slug') ?? '')),
  );

  isSubmitting = false;
  submitSuccessMessage = '';
  submitErrorMessage = '';

  form = new FormGroup({
    studentName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    phoneNumber: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  submit(courseSlug: string) {
    this.submitSuccessMessage = '';
    this.submitErrorMessage = '';

    this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.submitErrorMessage = 'من فضلك أدخل الاسم ورقم الهاتف.';
      return;
    }

    const studentName = this.form.controls.studentName.value.trim();
    const phoneNumber = this.form.controls.phoneNumber.value.trim();

    this.isSubmitting = true;
    this.leadService
      .enroll({ studentName, phoneNumber, courseSlug })
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.submitSuccessMessage = 'تم استلام طلبك بنجاح!';
            this.form.reset({ studentName: '', phoneNumber: '' });
            return;
          }

          this.submitErrorMessage =
            res.message ||
            (res.error === 'VALIDATION_ERROR'
              ? 'تأكد من صحة البيانات المدخلة.'
              : 'حدث خطأ. حاول مرة أخرى.');
        },
        error: (err: unknown) => {
          const httpErr = err as HttpErrorResponse;
          const api = httpErr?.error as any;

          if (api && api.error === 'VALIDATION_ERROR') {
            this.submitErrorMessage =
              api.message || 'تأكد من صحة الاسم ورقم الهاتف ثم حاول مرة أخرى.';
            return;
          }

          this.submitErrorMessage = 'تعذر إرسال الطلب الآن. حاول مرة أخرى لاحقاً.';
        },
      });
  }
}
