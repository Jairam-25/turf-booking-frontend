import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { TurfRepository } from '../../domain/repositories/turf.repository';
import { Turf, TurfResponse } from '../../domain/models/turf.model';

@Injectable({
  providedIn: 'root'
})
export class TurfRepositoryImpl implements TurfRepository {
  private apiUrl = 'https://localhost:7273/api/v1/Turf';

  // Mock images to make it look professional
  private mockImages = [
    'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1459865264687-595d652de67e?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?q=80&w=800&auto=format&fit=crop'
  ];

  constructor(private http: HttpClient) {}

  getAll(params?: any): Observable<TurfResponse> {
    let httpParams = new HttpParams();
    // Default to pageSize 100 to ensure all active turfs are fetched
    httpParams = httpParams.set('pageSize', '100');

    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }

    return this.http.get<any>(this.apiUrl, { params: httpParams }).pipe(
      map(response => {
        // Handle Result wrapper if present
        const result = response.data || response.Data || response.value || response.Value || response;
        
        const items = (result.items || result.Items || []).map((item: any, index: number) => ({
          id: item.id || item.Id,
          name: item.name || item.Name,
          location: item.location || item.Location,
          pricePerHour: item.pricePerHour || item.PricePerHour,
          imageUrl: this.mockImages[index % this.mockImages.length],
          rating: item.rating !== undefined ? item.rating : (item.Rating !== undefined ? item.Rating : 0),
          description: 'Experience professional-grade turf with premium facilities and easy booking.'
        }));

        return {
          items,
          totalCount: result.totalCount || result.TotalCount || items.length,
          pageNumber: result.pageNumber || result.PageNumber || 1,
          pageSize: result.pageSize || result.PageSize || 10
        };
      })
    );
  }

  getById(id: number): Observable<Turf> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(response => {
        const item = response.data || response.Data || response.value || response.Value || response;
        return {
          id: item.id || item.Id,
          name: item.name || item.Name,
          location: item.location || item.Location,
          pricePerHour: item.pricePerHour || item.PricePerHour,
          imageUrl: this.mockImages[0],
          rating: item.rating !== undefined ? item.rating : (item.Rating !== undefined ? item.Rating : 0)
        };
      })
    );
  }
}
