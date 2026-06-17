import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface PromoOfferDto {
  id: number;
  title: string;
  promoCode: string;
  description: string;
  discountPercentage: number;
  expiryDate?: string;
  isUsed: boolean;
}

export interface ValidatePromoResult {
  isValid: boolean;
  message: string;
  discountPercentage: number;
  promoOfferId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class PromoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/PromoOffers`;

  getPromoOffers(): Observable<PromoOfferDto[]> {
    return this.http.get<{ data: PromoOfferDto[] }>(this.apiUrl).pipe(
      map(res => res.data)
    );
  }

  validatePromoCode(code: string): Observable<ValidatePromoResult> {
    return this.http.get<{ data: ValidatePromoResult }>(`${this.apiUrl}/validate/${code}`).pipe(
      map(res => res.data)
    );
  }
}
