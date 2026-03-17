import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminKeyService } from '../../../core/services/admin/admin-key.service';

@Component({
  selector: 'app-admin-home',
  imports: [RouterLink],
  templateUrl: './admin-home.html',
  styleUrl: './admin-home.css',
})
export class AdminHomePage {
  private adminKey = inject(AdminKeyService);

  logout() {
    this.adminKey.clear();
    location.href = '/';
  }
}

