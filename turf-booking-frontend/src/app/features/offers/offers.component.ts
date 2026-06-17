import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface PromoOffer {
  id: string;
  title: string;
  code: string;
  discount: string;
  description: string;
  validUntil: string;
  isUsed: boolean;
  category: 'First Time' | 'Weekday Special' | 'Night Slot' | 'Group Discount' | 'General';
  gradient: string;
  badge: string;
}

import { PromoService, PromoOfferDto } from '../../core/services/promo.service';

@Component({
  selector: 'app-offers',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="offers-page-container container-fluid spacing-vertical-24 fade-in">
      
      <!-- Back Button -->
      <div class="navigation-bar">
        <button class="btn-back" routerLink="/dashboard" title="Back">
          <svg  class="back-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Book Turf
        </button>
      </div>

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
      <div class="category-tabs-wrapper">
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
      </div>

      <!-- Offers Grid -->
      <div class="offers-grid">
        <div 
          *ngFor="let offer of filteredOffers()" 
          class="offer-card flex-card-layout glass"
          [style.border-top-color]="getAccentColor(offer.category)"
        >
          <!-- Decorative Top Light Bar -->
          <div class="light-bar" [style.background]="offer.gradient"></div>

          <!-- Card Header -->
          <div class="card-header">
            <span class="cat-tag" [style.color]="getAccentColor(offer.category)" [style.background]="getAccentBg(offer.category)">
              {{ offer.category }}
            </span>
            <span class="valid-badge" [class.used]="offer.isUsed">{{ offer.isUsed ? 'USED' : offer.validUntil }}</span>
          </div>

          <!-- Card Title & Discount -->
          <div class="card-main flex-card-body">
            <div class="discount-display" [style.background-image]="offer.gradient">
              {{ offer.discount }}
            </div>
            <h3 class="offer-title">{{ offer.title }}</h3>
            <p class="offer-desc">{{ offer.description }}</p>
          </div>

          <!-- Promo Code Bar -->
          <button 
            class="promo-code-bar w-full" 
            (click)="copyPromoCode(offer.code, offer.id, offer.isUsed)"
            [class.copied]="copiedId() === offer.id"
            [class.opacity-50]="offer.isUsed"
            [disabled]="offer.isUsed"
            title="Tap to Copy"
          >
            <div class="code-box">
              <span class="code-label" *ngIf="!offer.isUsed">{{ copiedId() === offer.id ? 'COPIED!' : 'TAP TO COPY CODE' }}</span>
              <span class="code-label text-red-500" *ngIf="offer.isUsed">ALREADY USED</span>
              <span class="code-value" [class.line-through]="offer.isUsed">{{ offer.code }}</span>
            </div>
            <svg *ngIf="copiedId() !== offer.id && !offer.isUsed" class="copy-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <svg *ngIf="copiedId() === offer.id && !offer.isUsed" class="copy-icon text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </button>

          <!-- Card Action Button -->
          <button class="btn-premium btn-uniform card-book-btn" routerLink="/dashboard">
            Book Turf Now
          </button>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .navigation-bar {
      display: flex;
      align-items: center;
    }
    .btn-back {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: transparent;
      border: 1px solid var(--border-color);
      color: var(--text-primary);
      padding: 8px 16px;
      border-radius: 12px;
      cursor: pointer;
      font-weight: 600;
      transition: var(--transition-smooth);
    }
    @media (max-width: 768px) {
      .btn-back {
        padding: 6px 10px;
        font-size: 0.75rem; 
        border-radius: 6px;
        gap: 4px;
        min-height: 32px !important;
      }
      .back-icon, .btn-back svg {
        width: 14px;
        height: 14px;
      }
    }
    .btn-back:hover {
      background: rgba(255,255,255,0.05);
      border-color: var(--primary);
    }
    .back-icon {
      width: 16px;
      height: 16px;
    }

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

    .category-tabs-wrapper {
      position: sticky;
      top: 80px; /* Accounts for mobile navbar */
      z-index: 30;
      padding: 10px 0;
      background: rgba(17, 24, 39, 0.85);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      margin: 0 -1rem; /* Full bleed on mobile */
      padding: 10px 1rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }
    :host-context(body[data-theme="light"]) .category-tabs-wrapper {
      background: rgba(248, 250, 252, 0.85);
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    }

    .category-tabs {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      scroll-behavior: smooth;
      -ms-overflow-style: none;  /* IE and Edge */
      scrollbar-width: none;  /* Firefox */
    }
    .category-tabs::-webkit-scrollbar {
      display: none;
    }

    .tab-btn {
      padding: 8px 14px;
      border-radius: 10px;
      font-weight: 700;
      font-size: 0.75rem;
      white-space: nowrap;
      cursor: pointer;
      color: var(--text-secondary);
      background: rgba(255,255,255,0.01);
      transition: var(--transition-smooth);
      border-color: var(--border-color);
      flex-shrink: 0;
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

    @media (min-width: 768px) {
      .category-tabs-wrapper {
        position: static;
        margin: 0;
        padding: 0;
        background: transparent;
        backdrop-filter: none;
        -webkit-backdrop-filter: none;
        border-bottom: none;
      }
      .category-tabs {
        justify-content: center;
        flex-wrap: wrap;
        gap: 12px;
      }
      .tab-btn {
        padding: 10px 20px;
        font-size: 0.9rem;
      }
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
      cursor: pointer;
      text-align: left;
    }
    
    .promo-code-bar:hover {
      background: rgba(0, 0, 0, 0.3);
      border-color: var(--primary);
    }
    
    .promo-code-bar.copied {
      background: rgba(16, 185, 129, 0.1);
      border-color: #10b981;
    }

    :host-context(body[data-theme="light"]) .promo-code-bar {
      background: rgba(0, 0, 0, 0.02);
      border: 1px dashed rgba(0, 0, 0, 0.1);
    }
    
    :host-context(body[data-theme="light"]) .promo-code-bar:hover {
      background: rgba(0, 0, 0, 0.05);
      border-color: var(--primary);
    }
    
    :host-context(body[data-theme="light"]) .promo-code-bar.copied {
      background: rgba(16, 185, 129, 0.05);
      border-color: #10b981;
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
      color: var(--text-primary);
    }

    :host-context(body[data-theme="light"]) .tab-btn:hover {
      background: rgba(0, 0, 0, 0.04);
      border-color: var(--primary);
    }

    :host-context(body[data-theme="light"]) .tab-btn.active {
      background: var(--primary) !important;
      color: var(--on-primary) !important;
      border-color: var(--primary) !important;
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
    
    .promo-code-bar.copied .code-label,
    .promo-code-bar.copied .code-value {
      color: #10b981;
    }

    .copy-icon {
      width: 20px;
      height: 20px;
      color: var(--text-secondary);
      transition: var(--transition-smooth);
    }
    
    .promo-code-bar:hover .copy-icon {
      color: var(--primary);
      transform: scale(1.1);
    }

    .card-book-btn {
      width: 100%;
      height: 46px;
      font-size: 0.9rem;
      border-radius: 12px;
    }

    @media (max-width: 768px) {
      .offers-page-container {
        padding: 0.5rem;
        gap: 1rem;
      }
      .offers-hero {
        padding: 1.5rem 1rem;
      }
      .offers-hero h1 {
        font-size: 1.15rem;
      }
      .offers-hero p {
        font-size: 0.75rem;
      }
      
      .offers-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 0.5rem;
      }
      .offer-card {
        padding: 0.75rem;
        border-radius: 12px;
        gap: 0.75rem;
      }
      .cat-tag {
        font-size: 0.5rem;
        padding: 3px 6px;
        border-radius: 4px;
      }
      .valid-badge {
        font-size: 0.5rem;
      }
      .card-main {
        gap: 0.5rem;
      }
      .discount-display {
        font-size: 1.1rem;
        margin-bottom: 0;
      }
      .offer-title {
        font-size: 0.8rem;
        line-height: 1.2;
      }
      .offer-desc {
        font-size: 0.6rem;
        line-height: 1.3;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .promo-code-bar {
        padding: 6px 8px;
        border-radius: 8px;
        flex-direction: row;
        gap: 4px;
        align-items: center;
        justify-content: space-between;
      }
      .code-box {
        width: auto;
        flex-direction: column;
        align-items: flex-start;
        gap: 0;
      }
      .code-label {
        font-size: 0.45rem;
      }
      .code-value {
        font-size: 0.65rem;
      }
      .copy-icon {
        width: 14px;
        height: 14px;
      }
      .card-book-btn {
        height: 28px;
        min-height: 28px !important;
        font-size: 0.65rem;
        border-radius: 6px;
        margin-top: 0;
        padding: 0;
      }
    }
  `]
})
export class OffersComponent implements OnInit {
  selectedCategory = signal<string>('All');
  copiedId = signal<string | null>(null);

  promoService = inject(PromoService);

  categories = ['First Time', 'Weekday Special', 'Night Slot', 'Group Discount', 'General'];

  offers: PromoOffer[] = [];

  ngOnInit() {
    this.promoService.getPromoOffers().subscribe({
      next: (data) => {
        this.offers = (data || []).map(o => ({
          id: o.id.toString(),
          title: o.title,
          code: o.promoCode,
          discount: o.discountPercentage + '% OFF',
          description: o.description,
          validUntil: o.expiryDate ? new Date(o.expiryDate).toLocaleDateString() : 'Available',
          category: this.mapCategory(o.title),
          gradient: this.getGradient(this.mapCategory(o.title)),
          badge: '',
          isUsed: o.isUsed
        }));
      },
      error: (err) => console.error('Failed to load promo offers', err)
    });
  }

  mapCategory(title: string): any {
    const t = title.toLowerCase();
    if (t.includes('first')) return 'First Time';
    if (t.includes('weekday') || t.includes('midweek')) return 'Weekday Special';
    if (t.includes('night')) return 'Night Slot';
    if (t.includes('group') || t.includes('split')) return 'Group Discount';
    return 'General';
  }

  getGradient(cat: string): string {
    switch (cat) {
      case 'First Time': return 'linear-gradient(to right, #7b39fc, #60a5fa)';
      case 'Weekday Special': return 'linear-gradient(to right, #f59e0b, #eab308)';
      case 'Night Slot': return 'linear-gradient(to right, #a78bfa, #c084fc)';
      case 'Group Discount': return 'linear-gradient(to right, #10b981, #34d399)';
      default: return 'linear-gradient(to right, #ec4899, #f43f5e)';
    }
  }

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

  copyPromoCode(code: string, id: string, isUsed: boolean) {
    if (isUsed) return;
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
