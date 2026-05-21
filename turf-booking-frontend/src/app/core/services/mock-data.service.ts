import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Turf, TurfResponse } from '../../domain/models/turf.model';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  private mockTurfs: Turf[] = [
    { id: 1, name: 'Greenfield Arena', location: 'Downtown', pricePerHour: 50, imageUrl: '/assets/greenfield.jpg', rating: 4.5, description: 'Premium turf with great drainage.' },
    { id: 2, name: 'Sunset Courts', location: 'Uptown', pricePerHour: 40, imageUrl: '/assets/sunset.jpg', rating: 4.2, description: 'Indoor courts with lighting.' },
    { id: 3, name: 'Riverbank Sports Complex', location: 'Riverside', pricePerHour: 60, imageUrl: '/assets/riverbank.jpg', rating: 4.8, description: 'Multiple fields and facilities.' }
  ];

  getAll(_params?: any): Observable<TurfResponse> {
    const response: TurfResponse = {
      items: this.mockTurfs,
      totalCount: this.mockTurfs.length,
      pageNumber: 1,
      pageSize: this.mockTurfs.length
    };
    return of(response);
  }

  getById(id: number): Observable<Turf> {
    const turf = this.mockTurfs.find(t => t.id === id) as Turf;
    return of(turf);
  }
}
