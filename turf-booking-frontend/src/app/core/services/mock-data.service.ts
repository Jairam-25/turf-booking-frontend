import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Turf, TurfResponse } from '../../domain/models/turf.model';

@Injectable({
 providedIn: 'root'
})
export class MockDataService {
 private mockTurfs: Turf[] = [
 { id: 1, name: 'Greenfield Arena', location: 'Chennai', pricePerHour: 1500, imageUrl: '/assets/greenfield.jpg', rating: 4.5, description: 'Premium football turf with great drainage.', latitude: 13.0827, longitude: 80.2707 },
 { id: 2, name: 'Sunset Courts', location: 'Chennai', pricePerHour: 800, imageUrl: '/assets/sunset.jpg', rating: 4.2, description: 'Indoor badminton courts with lighting.', latitude: 13.0604, longitude: 80.2496 },
 { id: 3, name: 'Riverbank Sports Complex', location: 'Bangalore', pricePerHour: 2000, imageUrl: '/assets/riverbank.jpg', rating: 4.8, description: 'Multiple tennis fields and facilities.', latitude: 12.9716, longitude: 77.5946 },
 { id: 4, name: 'Thanjavur Football Club', location: 'Thanjavur', pricePerHour: 600, imageUrl: '/assets/thanjavur.jpg', rating: 4.0, description: 'Local ground.', latitude: 10.7870, longitude: 79.1378 }
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
