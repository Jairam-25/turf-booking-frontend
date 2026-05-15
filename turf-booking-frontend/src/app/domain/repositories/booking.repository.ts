import { Observable } from 'rxjs';
import { Booking, CreateBookingDto, Slot } from '../models/booking.model';

export abstract class BookingRepository {
  abstract bookSlot(dto: CreateBookingDto): Observable<any>;
  abstract getMyBookings(): Observable<Booking[]>;
  abstract getSlotsByTurf(turfId: number): Observable<Slot[]>;
}
