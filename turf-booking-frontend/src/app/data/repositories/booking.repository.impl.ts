import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { BookingRepository } from '../../domain/repositories/booking.repository';
import { Booking, CreateBookingDto, Slot } from '../../domain/models/booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingRepositoryImpl implements BookingRepository {
  private bookingUrl = 'https://localhost:7273/api/v1/Booking';
  private slotUrl = 'https://localhost:7273/api/v1/Slot';

  constructor(private http: HttpClient) {}

  bookSlot(dto: CreateBookingDto): Observable<any> {
    return this.http.post<any>(this.bookingUrl, dto).pipe(
      map(response => response.data || response.Data || response.value || response.Value || response)
    );
  }

  getMyBookings(): Observable<Booking[]> {
    return this.http.get<any>(`${this.bookingUrl}/my`).pipe(
      map(response => {
        const result = response.data || response.Data || response.value || response.Value || response;
        return (Array.isArray(result) ? result : []).map((b: any) => ({
          bookingId: b.bookingId || b.BookingId,
          bookedOn: b.bookedOn || b.BookedOn,
          turfName: b.turfName || b.TurfName,
          location: b.location || b.Location,
          price: b.price || b.Price,
          startTime: b.startTime || b.StartTime,
          endTime: b.endTime || b.EndTime
        }));
      })
    );
  }

  getSlotsByTurf(turfId: number): Observable<Slot[]> {
    const params = new HttpParams().set('turfId', turfId);
    return this.http.get<any>(this.slotUrl, { params }).pipe(
      map(response => {
        const result = response.data || response.Data || response.value || response.Value || response;
        return (Array.isArray(result) ? result : []).map((s: any) => ({
          id: s.slotId || s.SlotId,
          turfId: s.turfId || s.TurfId,
          startTime: s.startTime || s.StartTime,
          endTime: s.endTime || s.EndTime,
          isBooked: false // API only returns available slots
        }));
      })
    );
  }

  cancelBooking(bookingId: number): Observable<any> {
    return this.http.delete<any>(`${this.bookingUrl}/${bookingId}`).pipe(
      map(response => response.data || response.Data || response.value || response.Value || response)
    );
  }
}

