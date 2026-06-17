export interface Slot {
  id: number;
  turfId: number;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

export interface Booking {
  bookingId: number;
  bookedOn: string;
  turfName: string;
  location: string;
  price: number;
  startTime: string;
  endTime: string;
}

export interface CreateBookingDto {
  slotId: number;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  promoCode?: string;
}
