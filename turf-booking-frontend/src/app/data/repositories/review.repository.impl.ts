import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ReviewRepository } from '../../domain/repositories/review.repository';
import { Review, CreateReview } from '../../domain/models/review.model';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReviewRepositoryImpl implements ReviewRepository {
  private apiUrl = `${environment.apiUrl}/Review`;

  constructor(private http: HttpClient) {}

  createReview(dto: CreateReview): Observable<any> {
    return this.http.post<any>(this.apiUrl, dto);
  }

  getReviewsByTurf(turfId: number): Observable<Review[]> {
    return this.http.get<any>(`${this.apiUrl}/turf/${turfId}`).pipe(
      map(result => {
        return (Array.isArray(result) ? result : []).map((r: any) => ({
          id: r.id || r.Id,
          turfId: r.turfId || r.TurfId,
          userId: r.userId || r.UserId,
          userName: r.userName || r.UserName,
          rating: r.rating || r.Rating,
          comment: r.comment || r.Comment,
          createdAt: r.createdAt || r.CreatedAt
        }));
      })
    );
  }
}
