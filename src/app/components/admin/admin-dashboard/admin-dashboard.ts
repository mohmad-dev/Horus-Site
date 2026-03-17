import { AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AdminKeyService } from '../../../core/services/admin/admin-key.service';
import { AdminLeadsService, EnrollmentLead } from '../../../core/services/admin/admin-leads.service';

@Component({
  selector: 'app-admin-dashboard',
  imports: [NgIf, NgFor, AsyncPipe, DatePipe, RouterLink],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard {
  private leadsService = inject(AdminLeadsService);
  private adminKey = inject(AdminKeyService);

  errorMessage = '';
  copiedId: string | null = null;

  leads$: Observable<EnrollmentLead[]> = this.leadsService.getEnrollments().pipe(
    map((res) => {
      if (res.success) return res.data;
      throw new Error(res.error);
    }),
  );

  async copyPhone(lead: EnrollmentLead) {
    this.errorMessage = '';
    try {
      await navigator.clipboard.writeText(lead.phoneNumber);
      this.copiedId = lead._id;
      setTimeout(() => {
        if (this.copiedId === lead._id) this.copiedId = null;
      }, 1200);
    } catch {
      this.errorMessage = 'تعذر نسخ رقم الهاتف. انسخه يدوياً من الجدول.';
    }
  }

  logout() {
    this.adminKey.clear();
    location.href = '/';
  }
}

