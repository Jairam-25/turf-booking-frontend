import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { TurfRepository } from '../../domain/repositories/turf.repository';
import { Turf, TurfResponse } from '../../domain/models/turf.model';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TurfRepositoryImpl implements TurfRepository {
  private apiUrl = `${environment.apiUrl}/Turf`;

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
    // Add cache buster to prevent browser caching of GET requests
    httpParams = httpParams.set('_t', new Date().getTime().toString());

    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }

    return this.http.get<any>(this.apiUrl, { params: httpParams }).pipe(
      map(result => {
        const items = (result.items || result.Items || []).map((item: any, index: number) => {
          // Deterministic pseudo-random generation based on ID so markers stay in place
          const latOffset = ((item.id || item.Id || index) % 10) * 0.01;
          const lngOffset = (((item.id || item.Id || index) * 3) % 10) * 0.01;
          
          const locStr = (item.location || item.Location || '').trim();
          let parsedLat: number | null = null;
          let parsedLng: number | null = null;

          if (locStr.includes(',')) {
            const parts = locStr.split(',');
            if (parts.length === 2) {
              const latNum = parseFloat(parts[0].trim());
              const lngNum = parseFloat(parts[1].trim());
              if (!isNaN(latNum) && !isNaN(lngNum) && latNum >= -90 && latNum <= 90 && lngNum >= -180 && lngNum <= 180) {
                parsedLat = latNum;
                parsedLng = lngNum;
              }
            }
          }

          const locLower = locStr.toLowerCase();
          const cityLower = (item.city || item.City || '').toLowerCase();
          const isThanjavur = locLower.includes('thanjavur') || cityLower.includes('thanjavur');
          const isBangalore = locLower.includes('bangalore') || locLower.includes('bengaluru') || cityLower.includes('bangalore');
          
          const finalLat = parsedLat !== null ? parsedLat : (isThanjavur ? 10.7870 : (isBangalore ? 12.9716 : 13.0827)) + latOffset;
          const finalLng = parsedLng !== null ? parsedLng : (isThanjavur ? 79.1378 : (isBangalore ? 77.5946 : 80.2707)) + lngOffset;
          
            let rawImgUrl = item.imageUrl || item.ImageUrl;
            let formattedImgUrl = rawImgUrl ? (rawImgUrl.startsWith('http') ? rawImgUrl : `https://localhost:7273${rawImgUrl.startsWith('/') ? '' : '/'}${rawImgUrl}`) : this.mockImages[index % this.mockImages.length];

            return {
              id: item.id || item.Id,
              name: item.name || item.Name,
              location: item.location || item.Location,
              pricePerHour: item.pricePerHour || item.PricePerHour,
              dayTimePrice: item.dayTimePrice || item.DayTimePrice,
              afternoonPrice: item.afternoonPrice || item.AfternoonPrice,
              nightTimePrice: item.nightTimePrice || item.NightTimePrice,
              imageUrl: formattedImgUrl,
            rating: item.rating !== undefined ? item.rating : (item.Rating !== undefined ? item.Rating : 0),
            description: 'Experience professional-grade turf with premium facilities and easy booking.',
            latitude: item.latitude || item.Latitude || finalLat,
            longitude: item.longitude || item.Longitude || finalLng
          };
        });

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
      map((response: any) => {
        const item = response.data || response.Data || response.value || response.Value || response;
        const locStr = (item.location || item.Location || '').trim();
        let parsedLat: number | null = null;
        let parsedLng: number | null = null;

        if (locStr.includes(',')) {
          const parts = locStr.split(',');
          if (parts.length === 2) {
            const latNum = parseFloat(parts[0].trim());
            const lngNum = parseFloat(parts[1].trim());
            if (!isNaN(latNum) && !isNaN(lngNum) && latNum >= -90 && latNum <= 90 && lngNum >= -180 && lngNum <= 180) {
              parsedLat = latNum;
              parsedLng = lngNum;
            }
          }
        }

        const locLower = locStr.toLowerCase();
        const cityLower = (item.city || item.City || '').toLowerCase();
        const isThanjavur = locLower.includes('thanjavur') || cityLower.includes('thanjavur');
        const isBangalore = locLower.includes('bangalore') || locLower.includes('bengaluru') || cityLower.includes('bangalore');
        
        const finalLat = parsedLat !== null ? parsedLat : (isThanjavur ? 10.7870 : (isBangalore ? 12.9716 : 13.0827));
        const finalLng = parsedLng !== null ? parsedLng : (isThanjavur ? 79.1378 : (isBangalore ? 77.5946 : 80.2707));

        let rawImgUrl = item.imageUrl || item.ImageUrl;
        let formattedImgUrl = rawImgUrl ? (rawImgUrl.startsWith('http') ? rawImgUrl : `https://localhost:7273${rawImgUrl.startsWith('/') ? '' : '/'}${rawImgUrl}`) : this.mockImages[0];

        return {
          id: item.id || item.Id,
          name: item.name || item.Name,
          location: item.location || item.Location,
          pricePerHour: item.pricePerHour || item.PricePerHour,
          dayTimePrice: item.dayTimePrice || item.DayTimePrice,
          afternoonPrice: item.afternoonPrice || item.AfternoonPrice,
          nightTimePrice: item.nightTimePrice || item.NightTimePrice,
          imageUrl: formattedImgUrl,
          rating: item.rating !== undefined ? item.rating : (item.Rating !== undefined ? item.Rating : 0),
          latitude: item.latitude || item.Latitude || finalLat,
          longitude: item.longitude || item.Longitude || finalLng
        };
      })
    );
  }
}
