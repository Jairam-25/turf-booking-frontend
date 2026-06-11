import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthStore } from './auth.store';

@Injectable({ providedIn: 'root' })
export class SuperadminStateService {
  private http = inject(HttpClient);
  private authStore = inject(AuthStore);
  
  pendingVerificationsCount = signal<number>(0);
  hasViewedVerifications = signal<boolean>(false);

  fetchPendingCount() {
    if (this.authStore.user()?.role !== 'SuperAdmin' || this.hasViewedVerifications()) {
      return;
    }

    this.http.get<any>('https://localhost:7273/api/v1/SuperAdmin/verifications').subscribe({
      next: (res) => {
        const data = res.data || res.Data || res;
        let count = 0;
        if (Array.isArray(data)) {
          data.forEach(ver => {
            if (ver.turfs) {
              const pending = ver.turfs.filter((t: any) => t.verificationStatus === 'Pending Verification' || t.verificationStatus === 'Under Review');
              count += pending.length;
            } else if (ver.status === 'Pending Verification' || ver.status === 'Under Review') {
               count++;
            }
          });
        }
        this.pendingVerificationsCount.set(count);
      },
      error: () => {}
    });
  }

  markAsViewed() {
    this.hasViewedVerifications.set(true);
    this.pendingVerificationsCount.set(0);
  }
}
