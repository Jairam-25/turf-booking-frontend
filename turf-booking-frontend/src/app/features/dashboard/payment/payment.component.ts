import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NotificationService } from '../../../core/services/notification.service';
import { BookingRepository } from '../../../domain/repositories/booking.repository';
import { forkJoin } from 'rxjs';
import confetti from 'canvas-confetti';

declare var Razorpay: any;

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  private router = inject(Router);
  private notificationService = inject(NotificationService);
  private bookingRepository = inject(BookingRepository);

  bookingData: any;
  selectedMethod = signal<string>('razorpay');
  isProcessing = signal(false);
  isSuccess = signal(false);
  showSplitModal = signal(false);
  walletBalance = 1500;
  
  platformFee = 20;
  taxAmount = 0;
  grandTotal = 0;
  
  methods = [
    { id: 'wallet', name: 'TurfXpert Wallet', icon: 'wallet', description: 'Available Balance: ₹1,500' },
    { id: 'split', name: 'Split with Team', icon: 'users', description: 'Split bill equally via UPI/Link' },
    { id: 'razorpay', name: 'Razorpay', icon: 'credit-card', description: 'Credit Card, UPI, Net Banking' },
    { id: 'upi', name: 'UPI Quick Pay', icon: 'smartphone', description: 'Google Pay, PhonePe, Paytm' },
  ];

  ngOnInit() {
    this.bookingData = history.state.bookingData;
    if (!this.bookingData || !this.bookingData.slots || this.bookingData.slots.length === 0) {
      this.router.navigate(['/dashboard']);
      return;
    }
    
    // Calculate transparent fees
    this.taxAmount = Math.round(this.bookingData.totalPrice * 0.18);
    this.grandTotal = this.bookingData.totalPrice + this.platformFee + this.taxAmount;
    
    // Update amountToPay with taxes
    if (this.bookingData.paymentPlan === 'advance') {
       this.bookingData.amountToPay += (this.platformFee + this.taxAmount);
    } else {
       this.bookingData.amountToPay = this.grandTotal;
    }
  }

  selectMethod(methodId: string) {
    this.selectedMethod.set(methodId);
  }

  confirmPayment() {
    this.isProcessing.set(true);
    const amountToPay = this.bookingData.amountToPay;

    if (this.selectedMethod() === 'wallet') {
      if (this.walletBalance < amountToPay) {
        this.notificationService.error('Insufficient wallet balance!');
        this.isProcessing.set(false);
        return;
      }
      setTimeout(() => {
        this.processBooking('wallet_txn', 'pay_wallet_123', 'wallet_signature');
      }, 1500);
    } else if (this.selectedMethod() === 'split') {
      this.isProcessing.set(false);
      this.showSplitModal.set(true);
    } else if (this.selectedMethod() === 'razorpay') {
      this.initiateRazorpay(amountToPay);
    } else {
      // Dummy success for other methods
      setTimeout(() => {
        this.processBooking('dummy_order_xyz', `pay_${this.selectedMethod()}_123`, 'dummy_signature');
      }, 2000);
    }
  }

  shareSplitLink() {
    if (navigator.share) {
      navigator.share({
        title: 'Split Turf Bill',
        text: `Join my TurfXpert booking! Please pay your share of ₹${Math.round(this.bookingData.amountToPay / 4)} using this link:`,
        url: window.location.origin + '/pay/split-1234'
      }).catch(err => console.error('Share failed:', err));
    } else {
      alert('Split link copied to clipboard!');
    }
    this.showSplitModal.set(false);
    
    // Auto complete booking after split is configured
    this.isProcessing.set(true);
    setTimeout(() => {
      this.processBooking('split_order', 'pay_split_123', 'split_sig');
    }, 1500);
  }

  private initiateRazorpay(amountToPay: number) {
    this.bookingRepository.createOrder(amountToPay).subscribe({
      next: (orderRes) => {
        const options = {
          key: 'rzp_test_dummy',
          amount: orderRes.amount * 100,
          currency: orderRes.currency,
          name: 'TurfXpert',
          description: `Booking for ${this.bookingData.turfName}`,
          order_id: orderRes.orderId,
          handler: (response: any) => {
            this.processBooking(response.razorpay_order_id, response.razorpay_payment_id, response.razorpay_signature);
          },
          prefill: {
            name: 'Turf Player',
            email: 'player@turfbook.com',
            contact: '9999999999'
          },
          theme: {
            color: '#7b39fc'
          },
          modal: {
            ondismiss: () => {
              this.isProcessing.set(false);
              this.notificationService.error('Payment cancelled.');
            }
          }
        };

        if (options.key === 'rzp_test_dummy') {
          setTimeout(() => {
            options.handler({
              razorpay_order_id: orderRes.orderId,
              razorpay_payment_id: 'pay_dummy_' + Math.random().toString(36).substring(2, 9),
              razorpay_signature: 'dummy_signature_' + Math.random().toString(36).substring(2, 9)
            });
          }, 2000);
          return;
        }

        try {
          const rzp = new Razorpay(options);
          rzp.open();
        } catch (e) {
          setTimeout(() => {
            options.handler({
              razorpay_order_id: orderRes.orderId,
              razorpay_payment_id: 'pay_dummy_fallback',
              razorpay_signature: 'dummy_signature_fallback'
            });
          }, 1500);
        }
      },
      error: () => {
        this.notificationService.error('Failed to initiate payment.');
        this.isProcessing.set(false);
      }
    });
  }

  private processBooking(orderId: string, paymentId: string, signature: string) {
    const slots = this.bookingData.slots;
    const bookings = slots.map((slot: any) => this.bookingRepository.bookSlot({
      slotId: slot.id,
      razorpayOrderId: orderId,
      razorpayPaymentId: paymentId,
      razorpaySignature: signature
    }));

    forkJoin(bookings).subscribe({
      next: () => {
        this.isProcessing.set(false);
        this.isSuccess.set(true);
        this.notificationService.success('Payment successful! Booking confirmed.');
        this.triggerConfetti();
      },
      error: (err) => {
        this.notificationService.error(err.error?.message || 'Booking failed after payment.');
        this.isProcessing.set(false);
      }
    });
  }

  private triggerConfetti() {
    const duration = 2500;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 65,
        origin: { x: 0, y: 0.6 },
        colors: ['#7b39fc', '#ffffff', '#10b981'],
        ticks: 400,
        gravity: 0.5,
        scalar: 0.9,
        drift: 0.5
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 65,
        origin: { x: 1, y: 0.6 },
        colors: ['#7b39fc', '#ffffff', '#10b981'],
        ticks: 400,
        gravity: 0.5,
        scalar: 0.9,
        drift: -0.5
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }

  goHome() {
    this.router.navigate(['/dashboard']);
  }

  goBackToTurf() {
    if (this.bookingData?.turfId) {
      this.router.navigate(['/dashboard/turf', this.bookingData.turfId]);
    } else {
      this.goHome();
    }
  }

  goBookings() {
    this.router.navigate(['/bookings']);
  }
}
