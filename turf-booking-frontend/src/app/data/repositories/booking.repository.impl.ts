import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, catchError, of, throwError } from 'rxjs';
import { BookingRepository } from '../../domain/repositories/booking.repository';
import { Booking, CreateBookingDto, Slot } from '../../domain/models/booking.model';
import { environment } from '../../../environments/environment';
import { STORAGE_KEYS } from '../../core/constants/storage.constants';

@Injectable({
  providedIn: 'root'
})
export class BookingRepositoryImpl implements BookingRepository {
  private bookingUrl = `${environment.apiUrl}/Booking`;
  private slotUrl = `${environment.apiUrl}/Slot`;

  constructor(private http: HttpClient) {}

  bookSlot(dto: CreateBookingDto): Observable<any> {
    return this.http.post<any>(this.bookingUrl, dto);
  }

  createOrder(amount: number): Observable<any> {
    return this.http.post<any>('https://turf-booking-backend-fixl.onrender.com/api/v1/Payment/create-order', { amount });
  }

  getMyBookings(): Observable<Booking[]> {
    return this.http.get<any>(`${this.bookingUrl}/my`).pipe(
      map(result => {
        const mapped = (Array.isArray(result) ? result : []).map((b: any) => ({
          bookingId: b.bookingId || b.BookingId,
          bookedOn: b.bookedOn || b.BookedOn,
          turfName: b.turfName || b.TurfName,
          location: b.location || b.Location,
          price: b.price || b.Price,
          startTime: b.startTime || b.StartTime,
          endTime: b.endTime || b.EndTime
        }));
        // Cache for offline mode
        try {
          localStorage.setItem(STORAGE_KEYS.TURF_CACHED_BOOKINGS, JSON.stringify(mapped));
        } catch (e) { }
        return mapped;
      }),
      catchError(error => {
        // Fallback to offline cache
        try {
          const cached = localStorage.getItem(STORAGE_KEYS.TURF_CACHED_BOOKINGS);
          if (cached) {
            // Network error, loading bookings from offline cache.
            return of(JSON.parse(cached) as Booking[]);
          }
        } catch (e) { }
        return throwError(() => error);
      })
    );
  }

  getSlotsByTurf(turfId: number): Observable<Slot[]> {
    const params = new HttpParams()
      .set('turfId', turfId)
      .set('_t', new Date().getTime().toString());
    return this.http.get<any>(this.slotUrl, { params }).pipe(
      map(result => {
        return (Array.isArray(result) ? result : []).map((s: any) => ({
          id: s.slotId || s.SlotId,
          turfId: s.turfId || s.TurfId,
          startTime: s.startTime || s.StartTime,
          endTime: s.endTime || s.EndTime,
          isBooked: s.isBooked !== undefined ? s.isBooked : (s.IsBooked !== undefined ? s.IsBooked : false)
        }));
      })
    );
  }

  cancelBooking(bookingId: number, reason: string): Observable<any> {
    const params = new HttpParams().set('reason', reason);
    return this.http.delete<any>(`${this.bookingUrl}/${bookingId}`, { params });
  }
}

