import { Observable } from 'rxjs';
import { Turf, TurfResponse } from '../models/turf.model';

export abstract class TurfRepository {
 abstract getAll(params?: any): Observable<TurfResponse>;
 abstract getById(id: number): Observable<Turf>;
}
