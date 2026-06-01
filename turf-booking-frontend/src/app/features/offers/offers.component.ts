import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface PromoOffer {
  id: string;
  title: string;
  code: string;
  discount: string;
  description: string;
  validUntil: string;
  category: 'First Time' | 'Weekday Special' | 'Night Slot' | 'Group Discount';
  gradient: string;
  badge: string;
}

@Component({
  selector: 'app-offers',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="offers-page-container fade-in">
      
      <!-- Premium Hero Header -->
      <header class="offers-hero glass">
        <div class="glow-blob -top-20 -left-20"></div>
        <div class="glow-blob bottom-[-150px] right-[-150px]" style="background: radial-gradient(circle, rgba(123, 57, 252, 0.15) 0%, transparent 70%);"></div>
        
        <div class="hero-text-content">
          <span class="promo-badge">EXCLUSIVE DEALS</span>
          <h1>Score Big with Special Offers</h1>
          <p>Grab handpicked discounts, happy hour promo codes, and loyalty cashbacks. Book your court today and pay less.</p>
        </div>
      </header>

      <!-- Category Filter Tabs -->
      <div class="category-tabs">
        <button 
          class="tab-btn glass" 
          [class.active]="selectedCategory() === 'All'"
          (click)="selectedCategory.set('All')"
        >
          All Deals
        </button>
        <button 
          *ngFor="let cat of categories" 
          class="tab-btn glass" 
          [class.active]="selectedCategory() === cat"
          (click)="selectedCategory.set(cat)"
        >
          {{ cat }}
        </button>
      </div>

      <!-- Offers Grid -->
      <div class="offers-grid">
        <div 
          *ngFor="let offer of filteredOffers()" 
          class="offer-card glass"
          [style.border-top-color]="getAccentColor(offer.category)"
        >
          <!-- Decorative Top Light Bar -->
          <div class="light-bar" [style.background]="offer.gradient"></div>

          <!-- Card Header -->
          <div class="card-header">
            <span class="cat-tag" [style.color]="getAccentColor(offer.category)" [style.background]="getAccentBg(offer.category)">
              {{ offer.category }}
            </span>
            <span class="valid-badge">{{ offer.validUntil }}</span>
          </div>

          <!-- Card Title & Discount -->
          <div class="card-main">
            <div class="discount-display" [style.background-image]="offer.gradient">
              {{ offer.discount }}
            </div>
            <h3 class="offer-title">{{ offer.title }}</h3>
            <p class="offer-desc">{{ offer.description }}</p>
          </div>

          <!-- Promo Code Bar -->
          <div class="promo-code-bar">
            <div class="code-box">
              <span class="code-label">PROMO CODE</span>
              <span class="code-value">{{ offer.code }}</span>
            </div>
            <button 
              class="btn-copy" 
              (click)="copyPromoCode(offer.code, offer.id)"
              [class.copied]="copiedId() === offer.id"
            >
              {{ copiedId() === offer.id ? '✓ Copied' : 'Copy' }}
            </button>
          </div>

          <!-- Card Action Button -->
          <button class="btn-premium card-book-btn" routerLink="/dashboard">
            Book Turf Now
          </button>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .offers-page-container {
      max-width: 1300px;
      margin: 0 auto;
      padding: 2rem;
      display: flex;
      flex-direction: column;
      gap: 2.5rem;
      font-family: 'Manrope', sans-serif;
    }

    .offers-hero {
      position: relative;
      padding: 5rem 3rem;
      border-radius: 24px;
      text-align: center;
      overflow: hidden;
      background: linear-gradient(135deg, rgba(12, 10, 20, 0.8) 0%, rgba(31, 41, 55, 0.45) 100%);
    }

    :host-context(body[data-theme="light"]) .offers-hero {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(241, 245, 249, 0.95) 100%);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
      border: 1px solid rgba(0, 0, 0, 0.06);
    }

    .glow-blob {
      position: absolute;
      width: 300px;
      height: 300px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(123, 57, 252, 0.12) 0%, transparent 70%);
      z-index: 0;
      pointer-events: none;
    }

    .hero-text-content {
      position: relative;
      z-index: 10;
      max-width: 700px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .promo-badge {
      font-size: 0.75rem;
      font-weight: 800;
      letter-spacing: 0.2em;
      color: var(--primary);
      background: rgba(var(--primary-rgb), 0.1);
      padding: 6px 16px;
      border-radius: 20px;
      border: 1px solid rgba(var(--primary-rgb), 0.25);
    }

    .hero-text-content h1 {
      font-size: clamp(2rem, 5vw, 3rem);
      font-weight: 850;
      line-height: 1.1;
      margin: 0;
      color: var(--text-primary);
    }

    .hero-text-content p {
      font-size: 1.05rem;
      line-height: 1.6;
      color: var(--text-secondary);
      margin: 0;
    }

    .category-tabs {
      display: flex;
      justify-content: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    .tab-btn {
      padding: 10px 20px;
      border-radius: 12px;
      font-weight: 700;
      font-size: 0.9rem;
      cursor: pointer;
      color: var(--text-secondary);
      background: rgba(255,255,255,0.01);
      transition: var(--transition-smooth);
      border-color: var(--border-color);
    }

    .tab-btn:hover {
      border-color: var(--primary);
      color: var(--text-primary);
      background: rgba(var(--primary-rgb), 0.04);
    }

    .tab-btn.active {
      background: var(--primary);
      color: var(--on-primary);
      border-color: var(--primary);
      box-shadow: 0 4px 15px rgba(var(--primary-rgb), 0.3);
    }

    .offers-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
      gap: 2rem;
    }

    .offer-card {
      position: relative;
      border-radius: 24px;
      padding: 2rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      border-top: 4px solid var(--primary);
      transition: var(--transition-smooth);
      background: var(--bg-card);
      overflow: hidden;
    }

    .offer-card:hover {
      transform: translateY(-6px);
      box-shadow: var(--shadow-hover);
      border-color: transparent !important;
    }

    .light-bar {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      opacity: 0.85;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .cat-tag {
      font-size: 0.7rem;
      font-weight: 800;
      text-transform: uppercase;
      padding: 4px 10px;
      border-radius: 8px;
      letter-spacing: 0.02em;
    }

    .valid-badge {
      font-size: 0.75rem;
      color: var(--text-secondary);
      font-weight: 500;
      opacity: 0.8;
    }

    .card-main {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      flex-grow: 1;
    }

    .discount-display {
      font-size: 2.25rem;
      font-weight: 900;
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      line-height: 1;
      margin-bottom: 2px;
      width: fit-content;
    }

    .offer-title {
      font-size: 1.25rem;
      font-weight: 800;
      color: var(--text-primary);
      margin: 0;
      line-height: 1.3;
    }

    .offer-desc {
      font-size: 0.875rem;
      line-height: 1.5;
      color: var(--text-secondary);
      margin: 0;
    }

    .promo-code-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 14px;
      background: rgba(0, 0, 0, 0.2);
      border: 1px dashed var(--border-color);
      border-radius: 14px;
      transition: var(--transition-smooth);
    }

    :host-context(body[data-theme="light"]) .promo-code-bar {
      background: rgba(0, 0, 0, 0.02);
      border: 1px dashed rgba(0, 0, 0, 0.1);
    }

    :host-context(body[data-theme="light"]) .offer-card {
      background: #ffffff;
      border: 1px solid rgba(0, 0, 0, 0.06);
      border-top: 4px solid var(--primary);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
    }

    :host-context(body[data-theme="light"]) .offer-card:hover {
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.06);
      transform: translateY(-6px);
    }

    :host-context(body[data-theme="light"]) .tab-btn {
      background: rgba(0, 0, 0, 0.02);
      border-color: rgba(0, 0, 0, 0.06);
    }

    :host-context(body[data-theme="light"]) .tab-btn:hover {
      background: rgba(0, 0, 0, 0.04);
      border-color: var(--primary);
    }

    :host-context(body[data-theme="light"]) .tab-btn.active {
      background: var(--primary);
      color: var(--on-primary);
      border-color: var(--primary);
    }

    .code-box {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .code-label {
      font-size: 0.65rem;
      font-weight: 700;
      color: var(--text-secondary);
      opacity: 0.6;
      letter-spacing: 0.05em;
    }

    .code-value {
      font-family: monospace;
      font-size: 1.1rem;
      font-weight: 750;
      color: var(--text-primary);
      letter-spacing: 0.02em;
    }

    .btn-copy {
      background: var(--primary);
      color: var(--on-primary);
      border: none;
      padding: 6px 14px;
      border-radius: 8px;
      font-size: 0.8rem;
      font-weight: 700;
      cursor: pointer;
      transition: var(--transition-smooth);
    }

    .btn-copy:hover {
      background: var(--primary-hover);
    }

    .btn-copy.copied {
      background: #10b981;
      color: #ffffff;
      box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
    }

    .card-book-btn {
      width: 100%;
      height: 46px;
      font-size: 0.9rem;
      border-radius: 12px;
    }

    @media (max-width: 768px) {
      .offers-page-container {
        padding: 1rem;
      }
      .offers-hero {
        padding: 3rem 1.5rem;
      }
      .offers-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class OffersComponent {
  selectedCategory = signal<string>('All');
  copiedId = signal<string | null>(null);

  categories = ['First Time', 'Weekday Special', 'Night Slot', 'Group Discount'];

  offers: PromoOffer[] = [
    {
      id: 'o1',
      title: 'Welcome Kickoff discount',
      code: 'FIRSTKICK20',
      discount: '20% OFF',
      description: 'Get an instant 20% discount on your first booking with TurfXpert. Valid for any court, any sport.',
      validUntil: 'Valid for new users',
      category: 'First Time',
      gradient: 'linear-gradient(to right, #7b39fc, #60a5fa)',
      badge: 'WELCOME'
    },
    {
      id: 'o2',
      title: 'Midweek Happy Hours',
      code: 'MIDWEEK30',
      discount: '30% OFF',
      description: 'Book slots between 12:00 PM and 5:00 PM on Mondays through Thursdays and score 30% discount off standard prices.',
      validUntil: 'Valid till June 30',
      category: 'Weekday Special',
      gradient: 'linear-gradient(to right, #f59e0b, #eab308)',
      badge: 'HAPPY HOUR'
    },
    {
      id: 'o3',
      title: 'Night Owl Matches',
      code: 'NIGHTOWL15',
      discount: '₹100 FLAT',
      description: 'Love playing under the floodlights? Enjoy a flat ₹100 cashback code on slots booked from 6:00 PM till Midnight.',
      validUntil: 'Valid on weekends',
      category: 'Night Slot',
      gradient: 'linear-gradient(to right, #a78bfa, #c084fc)',
      badge: 'NIGHT PLAY'
    },
    {
      id: 'o4',
      title: 'Split & Save Billing Offer',
      code: 'SPLITSAVE10',
      discount: '10% OFF',
      description: 'Choose the "Advance Pay" or split option on any booking and apply this code to instantly get 10% discount on entire base total.',
      validUntil: 'Expires June 15',
      category: 'Group Discount',
      gradient: 'linear-gradient(to right, #10b981, #34d399)',
      badge: 'GROUP DEALS'
    },
    {
      id: 'o5',
      title: 'Corporate Club Discount',
      code: 'CORPCLUB15',
      discount: '15% OFF',
      description: 'Book 3 or more slots together for team games, practices, or corporate tourneys and get 15% discount on the entire booking.',
      validUntil: 'Valid for min 3 slots',
      category: 'Group Discount',
      gradient: 'linear-gradient(to right, #ec4899, #f43f5e)',
      badge: 'CORPORATE'
    },
    {
      id: 'o6',
      title: 'Early Bird Athlete Special',
      code: 'EARLYBIRD25',
      discount: '25% OFF',
      description: 'For early morning enthusiasts! Book slots between 6:00 AM and 9:00 AM and claim a 25% discount on your reservation.',
      validUntil: 'Valid till June 30',
      category: 'Weekday Special',
      gradient: 'linear-gradient(to right, #3b82f6, #06b6d4)',
      badge: 'EARLY BIRD'
    }
  ];

  filteredOffers(): PromoOffer[] {
    const cat = this.selectedCategory();
    if (cat === 'All') return this.offers;
    return this.offers.filter(o => o.category === cat);
  }

  getAccentColor(category: string): string {
    switch (category) {
      case 'First Time': return '#7b39fc';
      case 'Weekday Special': return '#f59e0b';
      case 'Night Slot': return '#a78bfa';
      case 'Group Discount': return '#10b981';
      default: return '#7b39fc';
    }
  }

  getAccentBg(category: string): string {
    switch (category) {
      case 'First Time': return 'rgba(123, 57, 252, 0.12)';
      case 'Weekday Special': return 'rgba(245, 158, 11, 0.12)';
      case 'Night Slot': return 'rgba(167, 139, 250, 0.12)';
      case 'Group Discount': return 'rgba(16, 185, 129, 0.12)';
      default: return 'rgba(123, 57, 252, 0.12)';
    }
  }

  copyPromoCode(code: string, id: string) {
    navigator.clipboard.writeText(code).then(() => {
      this.copiedId.set(id);
      setTimeout(() => {
        if (this.copiedId() === id) {
          this.copiedId.set(null);
        }
      }, 2000);
    });
  }
}
