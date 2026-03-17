import { Injectable } from '@angular/core';

const STORAGE_KEY = 'admin_api_key';

@Injectable({ providedIn: 'root' })
export class AdminKeyService {
  get(): string | null {
    return sessionStorage.getItem(STORAGE_KEY);
  }

  set(key: string) {
    sessionStorage.setItem(STORAGE_KEY, key);
  }

  clear() {
    sessionStorage.removeItem(STORAGE_KEY);
  }
}

