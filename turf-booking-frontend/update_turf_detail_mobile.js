const fs = require('fs');

const path = 'src/app/features/dashboard/turf-detail/turf-detail.component.ts';
let code = fs.readFileSync(path, 'utf8');

// 1. Add Mobile Sticky Bar HTML
const mobileBarHtml = `
      <!-- Mobile Sticky Booking Bar -->
      <div class="mobile-sticky-booking-bar glass">
        <div class="price-info" *ngIf="selectedSlots().length === 0">
          <span class="price-label">Starts from</span>
          <span class="price-val">₹{{ turf()?.pricePerHour }}/hr</span>
        </div>
        <div class="price-info" *ngIf="selectedSlots().length > 0">
          <span class="price-label">Total to Pay Now</span>
          <span class="price-val">₹{{ paymentOption() === 'full' ? getTotalPrice() : getAdvancePrice() }}</span>
        </div>
        <button 
          class="btn-premium"
          (click)="handleMobileStickyAction()"
        >
          {{ selectedSlots().length > 0 ? 'Checkout' : 'Select Time' }}
        </button>
      </div>
`;

// Insert before the goal overlay
code = code.replace(
  '<!-- Goal Overlay for Payment Transition',
  mobileBarHtml + '\n    <!-- Goal Overlay for Payment Transition'
);

// 2. Add Mobile Sticky Bar CSS
const mobileBarCss = `
    /* Mobile Sticky Booking Bar */
    .mobile-sticky-booking-bar {
      display: none;
      position: fixed;
      bottom: calc(env(safe-area-inset-bottom, 0) + 75px);
      left: 1rem;
      right: 1rem;
      z-index: 99;
      padding: 1rem 1.25rem;
      border-radius: 20px;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      border: 1px solid var(--border-color);
      animation: slideUpFade 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }

    @keyframes slideUpFade {
      from { transform: translateY(100px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    .mobile-sticky-booking-bar .price-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .mobile-sticky-booking-bar .price-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .mobile-sticky-booking-bar .price-val {
      font-size: 1.25rem;
      font-weight: 800;
      color: var(--text-primary);
    }
    .mobile-sticky-booking-bar .btn-premium {
      padding: 12px 24px;
      font-size: 0.95rem;
      border-radius: 14px;
    }

    @media (max-width: 768px) {
      .detail-page-container {
        padding: 1rem;
        padding-bottom: 120px; /* Space for the sticky bar */
      }
      .detail-grid {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }
      .mobile-sticky-booking-bar {
        display: flex;
      }
      
      /* Hide some less critical elements on mobile to shorten the page */
      .pricing-rules-card, .booking-steps-indicator {
        display: none; /* Make it more compact */
      }
      .turf-details-content {
        padding: 1.5rem 1rem;
      }
      .booking-panel {
        padding: 1.5rem 1rem;
      }
      .slots-grid-view {
        grid-template-columns: repeat(3, 1fr) !important;
      }
      /* Hide the desktop confirm button */
      .booking-panel .actions {
        display: none;
      }
    }
`;

code = code.replace(
  '.detail-page-container {',
  mobileBarCss + '\n    .detail-page-container {'
);

// 3. Add handleMobileStickyAction logic to TS
const tsMethod = `
  handleMobileStickyAction() {
    if (this.selectedSlots().length > 0) {
      this.confirmBooking();
    } else {
      // Scroll to slots section
      const slotsEl = document.querySelector('.slots-section');
      if (slotsEl) {
        slotsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }
`;

code = code.replace(
  'confirmBooking() {',
  tsMethod + '\n  confirmBooking() {'
);

fs.writeFileSync(path, code);
console.log("Updated turf-detail.component.ts");
