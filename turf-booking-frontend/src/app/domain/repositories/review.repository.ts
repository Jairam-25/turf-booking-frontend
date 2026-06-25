import { Observable } from 'rxjs';
import { Review, CreateReview } from '../models/review.model';

export abstract class ReviewRepository {
 abstract createReview(dto: CreateReview): Observable<any>;
 abstract getReviewsByTurf(turfId: number): Observable<Review[]>;
}
