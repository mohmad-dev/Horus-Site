import { inject } from '@angular/core';
import type { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { AdminKeyService } from '../services/admin/admin-key.service';

export const adminGuard: CanActivateFn = () => {
  const adminKey = inject(AdminKeyService);
  const router = inject(Router);

  const existing = adminKey.get();
  if (existing && existing.trim().length > 0) return true;

  const entered = window.prompt('Enter ADMIN_API_KEY to access Admin Dashboard:') ?? '';
  const key = entered.trim();

  if (!key) {
    router.navigateByUrl('/');
    return false;
  }

  adminKey.set(key);
  return true;
};

