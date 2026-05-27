import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ReviewRepository } from '../../domain/repositories/review.repository';
import { Review, CreateReview } from '../../domain/models/review.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewRepositoryImpl implements ReviewRepository {
  private apiUrl = 'https://localhost:7273/api/v1/Review';

  constructor(private http: HttpClient) {}

  createReview(dto: CreateReview): Observable<any> {
    return this.http.post<any>(this.apiUrl, dto).pipe(
      map(response => response.data || response.Data || response.value || response.Value || response)
    );
  }

  getReviewsByTurf(turfId: number): Observable<Review[]> {
    return this.http.get<any>(`${this.apiUrl}/turf/${turfId}`).pipe(
      map(response => {
        const result = response.data || response.Data || response.value || response.Value || response;
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
