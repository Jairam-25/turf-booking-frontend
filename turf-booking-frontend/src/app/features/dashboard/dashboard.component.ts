import { Component, OnInit, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { Turf, TurfResponse } from '../../domain/models/turf.model';
import { TurfCardComponent } from './ui/turf-card.component';
import { NotificationService } from '../../core/services/notification.service';
import { FcmNotificationService } from '../../core/services/fcm-notification.service';
import { TurfRepository } from '../../domain/repositories/turf.repository';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TurfCardComponent],
  template: `
    <div class="dashboard-page fade-in">
      <header class="dashboard-header glass">
        <div class="header-content">
          <h1>Find Your Perfect <span class="typing-text">{{ displayedWord() }}</span><span class="typing-cursor">|</span></h1>
          <div class="search-container">
            <div class="search-bar glass">
              
              <!-- Professional Location Select -->
              <div class="custom-select-container" (click)="toggleLocationSelect()">
                <div class="custom-select-value">
                  <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  <span class="whitespace-nowrap">{{ selectedLocation() || 'All Locations' }}</span>
                  <svg class="w-4 h-4 ml-2 transition-transform duration-300" [class.rotate-180]="isLocationSelectOpen()" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
                
                <div class="custom-select-dropdown glass-card" [class.show]="isLocationSelectOpen()">
                  <div class="select-option" (click)="selectLocation($event, '')" [class.active]="selectedLocation() === ''">All Locations</div>
                  <div class="select-option" *ngFor="let loc of allLocations()" (click)="selectLocation($event, loc)" [class.active]="selectedLocation() === loc">{{ loc }}</div>
                </div>
              </div>
              
              <div class="divider"></div>
              
              <input 
                type="text" 
                placeholder="Search by name..." 
                class="search-input"
                #searchInput
                (input)="onSearch(searchInput.value)"
                [value]="searchTerm()"
              >
              
              <button class="btn-filter" (click)="toggleFilter()" [class.active]="isFilterOpen()">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
              </button>
              
              <button class="btn-search" (click)="loadTurfs()">Search</button>
            </div>
            
            <!-- Animated Filter Section -->
            <div class="filter-section-wrapper" [class.open]="isFilterOpen()">
              <div class="filter-section glass">
                <div class="filter-grid">
                  
                  <!-- Game Type -->
                  <div class="filter-group">
                    <span class="filter-label">Game Type</span>
                    <div class="filter-chips">
                      <button *ngFor="let game of gameTypes" 
                              class="filter-chip" 
                              [class.active]="selectedGame() === game"
                              (click)="selectGame(game)">
                        {{ game }}
                      </button>
                    </div>
                  </div>

                  <!-- Price Range -->
                  <div class="filter-group">
                    <span class="filter-label">Max Price (₹/hr)</span>
                    <div class="range-container">
                      <input type="range" min="500" max="5000" step="100" 
                             [value]="maxPrice()" 
                             (input)="onPriceChange($event)"
                             class="range-slider">
                      <span class="range-value">₹{{ maxPrice() }}</span>
                    </div>
                  </div>

                  <!-- Minimum Rating -->
                  <div class="filter-group">
                    <span class="filter-label">Minimum Rating</span>
                    <div class="filter-chips">
                      <button *ngFor="let rating of [0, 3, 4, 4.5]" 
                              class="filter-chip" 
                              [class.active]="minRating() === rating"
                              (click)="selectRating(rating)">
                        {{ rating === 0 ? 'Any' : rating + '+' }} <span *ngIf="rating > 0">⭐</span>
                      </button>
                    </div>
                  </div>

                  <!-- Sort By -->
                  <div class="filter-group">
                    <span class="filter-label">Sort By</span>
                    <div class="filter-chips">
                      <button *ngFor="let option of sortOptions" 
                              class="filter-chip" 
                              [class.active]="sortBy() === option.value"
                              (click)="selectSort(option.value)">
                        {{ option.label }}
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Turf Grid / Map Area -->
      <main class="turf-grid-container">
        <div class="grid-header">
          <h2>Available Turfs <span class="badge">{{ turfs().length }}</span></h2>
          <div class="view-toggles">
            <button class="view-btn" [class.active]="viewMode() === 'grid'" (click)="setViewMode('grid')">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
              Grid
            </button>
            <button class="view-btn" [class.active]="viewMode() === 'map'" (click)="setViewMode('map')">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>
              Map
            </button>
          </div>
        </div>

        <div class="turf-grid" *ngIf="viewMode() === 'grid' && !isLoading(); else mapOrLoading">
          <app-turf-card 
            *ngFor="let turf of turfs()" 
            [turf]="turf"
          ></app-turf-card>
        </div>
        
        <ng-template #mapOrLoading>
          <div *ngIf="isLoading()" class="turf-grid">
            <div class="glass card skeleton" *ngFor="let i of [1,2,3,4]"></div>
          </div>
          <div *ngIf="!isLoading() && viewMode() === 'map'" class="map-wrapper glass fade-in">
            <div id="turf-map" class="turf-map-container"></div>
          </div>
        </ng-template>

        <!-- Empty State -->
        <div class="empty-state glass" *ngIf="!isLoading() && turfs().length === 0 && viewMode() === 'grid'">
          <h3>No turfs found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .dashboard-page {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 3rem;
    }
    .dashboard-header {
      padding: 4rem 2rem;
      border-radius: 24px;
      text-align: center;
      background:
        linear-gradient(rgba(var(--primary-rgb), 0.35), rgba(15, 23, 42, 0.75)),
        url('https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=2000&auto=format&fit=crop');
      background-size: cover;
      background-position: center;
    }
    .header-content h1 {
      font-size: 3rem;
      margin-bottom: 2.5rem;
      color: var(--on-primary);
      text-shadow: 0 4px 12px rgba(0, 0, 0, 0.45);
    }
    .typing-text {
      color: var(--primary);
      font-weight: 800;
    }
    .typing-cursor {
      color: var(--primary);
      animation: blink-caret 0.75s step-end infinite;
      margin-left: 2px;
      font-weight: 300;
    }
    @keyframes blink-caret {
      from, to { opacity: 0 }
      50% { opacity: 1 }
    }
    .search-container {
      max-width: 750px;
      margin: 0 auto;
      position: relative;
    }
    .search-bar {
      padding: 8px 8px 8px 16px;
      display: flex;
      gap: 0.5rem;
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      border-radius: 9999px;
      align-items: center;
      position: relative;
      z-index: 10;
      backdrop-filter: blur(16px);
      box-shadow: 0 4px 24px rgba(0,0,0,0.1);
    }
    
    /* Custom Location Select */
    .custom-select-container {
      position: relative;
      cursor: pointer;
      user-select: none;
      min-width: 160px;
    }
    .custom-select-value {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--text-primary);
      font-weight: 500;
      font-size: 0.95rem;
      padding: 0.5rem;
      border-radius: 12px;
      transition: background 0.3s ease;
      white-space: nowrap;
    }
    .custom-select-value:hover {
      background: rgba(var(--primary-rgb), 0.1);
    }
    .custom-select-dropdown {
      position: absolute;
      top: 120%;
      left: 0;
      width: 100%;
      min-width: 200px;
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      backdrop-filter: blur(24px);
      border-radius: 16px;
      padding: 0.5rem;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 20;
    }
    .custom-select-dropdown.show {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }
    .select-option {
      padding: 0.75rem 1rem;
      border-radius: 10px;
      color: var(--text-primary);
      cursor: pointer;
      transition: all 0.2s;
    }
    .select-option:hover {
      background: rgba(var(--primary-rgb), 0.15);
      color: var(--primary);
    }
    .select-option.active {
      background: var(--primary);
      color: var(--on-primary);
      font-weight: 600;
    }
    .rotate-180 {
      transform: rotate(180deg);
    }

    .divider {
      width: 1px;
      background: var(--border-color);
      height: 28px;
      align-self: center;
    }
    .search-input {
      flex-grow: 1;
      background: transparent;
      border: none;
      color: var(--text-primary);
      padding: 0 0.5rem;
      font-size: 1rem;
      outline: none;
    }
    .search-input::placeholder {
      color: var(--text-secondary);
    }
    .btn-search {
      padding: 12px 28px;
      border-radius: 9999px;
      background: var(--primary);
      color: var(--on-primary);
      border: none;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .btn-search:hover {
      transform: scale(1.02);
      box-shadow: 0 4px 12px rgba(var(--primary-rgb), 0.4);
    }
    .btn-search:active {
      transform: scale(0.98);
    }
    
    .btn-filter {
      padding: 10px;
      border-radius: 50%;
      background: transparent;
      color: var(--text-secondary);
      border: 1px solid transparent;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .btn-filter:hover {
      background: rgba(var(--primary-rgb), 0.1);
      color: var(--primary);
    }
    .btn-filter.active {
      background: var(--primary);
      color: var(--on-primary);
    }

    /* Filter Section */
    .filter-section-wrapper {
      max-height: 0;
      opacity: 0;
      overflow: hidden;
      transform: translateY(-10px);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      margin-top: 0;
      width: 100%;
    }
    .filter-section-wrapper.open {
      max-height: 600px;
      opacity: 1;
      transform: translateY(0);
      margin-top: 1rem;
    }
    .filter-section {
      padding: 1.5rem;
      border-radius: 20px;
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      backdrop-filter: blur(16px);
      box-shadow: 0 8px 32px rgba(0,0,0,0.1);
      text-align: left;
    }
    .filter-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      opacity: 0;
      transform: translateY(10px);
      transition: all 0.4s ease 0.1s;
    }
    .filter-section-wrapper.open .filter-grid {
      opacity: 1;
      transform: translateY(0);
    }
    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .filter-label {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-primary);
      opacity: 0.8;
    }
    .range-container {
      display: flex;
      align-items: center;
      gap: 1rem;
      height: 36px;
    }
    .range-slider {
      flex: 1;
      accent-color: var(--primary);
      cursor: pointer;
    }
    .range-value {
      font-weight: 600;
      color: var(--primary);
      min-width: 60px;
      text-align: right;
    }
    .filter-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
    }
    .filter-chip {
      padding: 8px 16px;
      border-radius: 9999px;
      background: rgba(var(--primary-rgb), 0.05);
      border: 1px solid rgba(var(--primary-rgb), 0.2);
      color: var(--text-primary);
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      opacity: 0;
      transform: translateY(10px);
    }
    .filter-section-wrapper.open .filter-chip {
      opacity: 1;
      transform: translateY(0);
    }
    .filter-section-wrapper.open .filter-chip:nth-child(1) { transition-delay: 0.1s; }
    .filter-section-wrapper.open .filter-chip:nth-child(2) { transition-delay: 0.15s; }
    .filter-section-wrapper.open .filter-chip:nth-child(3) { transition-delay: 0.2s; }
    .filter-section-wrapper.open .filter-chip:nth-child(4) { transition-delay: 0.25s; }
    .filter-section-wrapper.open .filter-chip:nth-child(5) { transition-delay: 0.3s; }
    .filter-section-wrapper.open .filter-chip:nth-child(6) { transition-delay: 0.35s; }

    .filter-chip:hover {
      background: rgba(var(--primary-rgb), 0.15);
      border-color: var(--primary);
    }
    .filter-chip.active {
      background: var(--primary);
      color: var(--on-primary);
      border-color: var(--primary);
      box-shadow: 0 4px 12px rgba(var(--primary-rgb), 0.3);
    }

    :host-context(body[data-theme="light"]) .dashboard-header {
      background:
        linear-gradient(rgba(255, 255, 255, 0.75), rgba(248, 250, 252, 0.9)),
        url('https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=2000&auto=format&fit=crop');
      background-size: cover;
      background-position: center;
    }

    :host-context(body[data-theme="light"]) .header-content h1 {
      color: var(--text-primary);
      text-shadow: none;
    }

    .turf-grid-container {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .grid-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .grid-header h2 {
      font-size: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .badge {
      background: rgba(99, 102, 241, 0.1);
      color: var(--primary);
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 0.875rem;
    }

    .turf-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 2rem;
    }

    .skeleton {
      height: 400px;
      animation: pulse 1.5s infinite ease-in-out;
    }

    .empty-state {
      padding: 5rem;
      text-align: center;
      color: var(--text-secondary);
    }
    
    /* View Toggles & Map */
    .view-toggles {
      display: flex;
      gap: 0.5rem;
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      border-radius: 12px;
      padding: 4px;
    }
    .view-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 8px 16px;
      border-radius: 8px;
      border: none;
      background: transparent;
      color: var(--text-secondary);
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .view-btn:hover {
      color: var(--primary);
    }
    .view-btn.active {
      background: var(--primary);
      color: var(--on-primary);
    }
    .map-wrapper {
      width: 100%;
      height: 650px;
      border-radius: 20px;
      overflow: hidden;
      padding: 1rem;
    }
    .turf-map-container {
      width: 100%;
      height: 100%;
      border-radius: 12px;
      z-index: 1; /* prevent overlapping navbar */
    }
    ::ng-deep .leaflet-popup-content-wrapper {
      background: var(--glass-bg);
      color: var(--text-primary);
      backdrop-filter: blur(16px);
      border: 1px solid var(--glass-border);
      border-radius: 12px;
    }
    ::ng-deep .leaflet-popup-tip {
      background: var(--glass-bg);
    }
    ::ng-deep .leaflet-popup-content h3 {
      margin: 0 0 5px 0;
      font-size: 1.2rem;
      font-weight: bold;
      color: var(--primary);
    }
    ::ng-deep .leaflet-popup-content p {
      margin: 0 0 8px 0;
      font-size: 0.95rem;
    }

    @keyframes pulse {
      0% { opacity: 0.6; }
      50% { opacity: 0.3; }
      100% { opacity: 0.6; }
    }

    @media (max-width: 768px) {
      .dashboard-page { padding: 1rem; gap: 2rem; }
      .dashboard-header { padding: 2.5rem 1rem; border-radius: 16px; }
      .header-content h1 { font-size: 1.5rem; margin-bottom: 1.5rem; }
      
      /* Mobile Search Bar Stacking */
      .search-bar { 
        flex-direction: column; 
        align-items: stretch; 
        gap: 0.75rem; 
        padding: 1rem; 
        border-radius: 20px; 
      }
      .divider { display: none; }
      .custom-select-container { width: 100%; }
      .custom-select-value { justify-content: space-between; }
      .search-input { padding: 0.5rem; text-align: center; }
      .btn-search { width: 100%; padding: 14px; }
      
      /* Mobile Filter Button */
      .btn-filter { 
        width: 100%; 
        border-radius: 12px; 
        padding: 12px; 
        background: rgba(123, 57, 252, 0.1); 
      }
      .btn-filter::after {
        content: 'Filters';
        margin-left: 8px;
        font-weight: 600;
      }
      
      /* Mobile Grid Header & Toggles */
      .grid-header { 
        flex-direction: column; 
        align-items: stretch; 
        gap: 1rem; 
        text-align: center;
      }
      .grid-header h2 { justify-content: center; }
      .view-toggles { justify-content: center; }
      .view-btn { flex: 1; justify-content: center; }
      
      /* Mobile Map */
      .map-wrapper { height: 400px; padding: 0.5rem; border-radius: 16px; }
      
      /* Mobile Filters */
      .filter-section-wrapper.open { max-height: 1200px; }
      .filter-grid { grid-template-columns: 1fr; gap: 1.5rem; }
      .filter-section { padding: 1.25rem; }
      .filter-chips { justify-content: center; }
      .filter-group { align-items: center; text-align: center; }
    }
  `]
})
export class DashboardComponent implements OnInit, OnDestroy {
  turfs = signal<Turf[]>([]);
  isLoading = signal(true);
  searchTerm = signal<string>('');
  selectedLocation = signal<string>('');
  allLocations = signal<string[]>([]);

  isLocationSelectOpen = signal(false);
  isFilterOpen = signal(false);
  
  // Filters
  gameTypes = ['All', 'Football', 'Cricket', 'Tennis', 'Badminton', 'Basketball'];
  selectedGame = signal<string>('All');
  maxPrice = signal<number>(5000);
  minRating = signal<number>(0);
  sortBy = signal<string>('recommended');

  sortOptions = [
    { label: 'Recommended', value: 'recommended' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
    { label: 'Highest Rated', value: 'rating_desc' }
  ];

  viewMode = signal<'grid' | 'map'>('grid');
  private map: L.Map | null = null;
  private markersLayer: L.LayerGroup | null = null;

  // Typing animation properties
  words = ['Turf', 'Court', 'Pitch', 'Match', 'Arena', 'Game'];
  currentWordIndex = 0;
  displayedWord = signal('');
  isDeleting = false;
  typingTimeout: any;

  constructor(
    private turfRepository: TurfRepository,
    private notificationService: NotificationService,
    private fcmService: FcmNotificationService
  ) {}

  ngOnInit() {
    this.loadInitialLocationsAndTurfs();
    this.startTypingAnimation();
    
    // Ask for Push Notification permission and save token to DB
    this.fcmService.requestNotificationPermission();
    this.fcmService.listenForMessages();
  }

  ngOnDestroy() {
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }
  }

  startTypingAnimation() {
    const tick = () => {
      const currentWord = this.words[this.currentWordIndex];
      const currentText = this.displayedWord();

      if (this.isDeleting) {
        this.displayedWord.set(currentWord.substring(0, currentText.length - 1));
      } else {
        this.displayedWord.set(currentWord.substring(0, currentText.length + 1));
      }

      let speed = this.isDeleting ? 75 : 150;

      if (!this.isDeleting && this.displayedWord() === currentWord) {
        speed = 2000;
        this.isDeleting = true;
      } else if (this.isDeleting && this.displayedWord() === '') {
        this.isDeleting = false;
        this.currentWordIndex = (this.currentWordIndex + 1) % this.words.length;
        speed = 500;
      }

      this.typingTimeout = setTimeout(tick, speed);
    };

    tick();
  }

  loadInitialLocationsAndTurfs() {
    this.isLoading.set(true);
    this.turfRepository.getAll().subscribe({
      next: (response: TurfResponse) => {
        const items = response.items;
        this.turfs.set(items);
        
        // Extract unique locations from turfs and merge with popular defaults like Thanjavur
        const defaultLocations = ['Thanjavur', 'Chennai', 'Coimbatore', 'Trichy', 'Madurai', 'Bangalore'];
        const uniqueLocations = Array.from(new Set([
          ...defaultLocations,
          ...items.map(t => t.location)
        ])).filter(Boolean).sort();
        
        this.allLocations.set(uniqueLocations);
        this.isLoading.set(false);
      },
      error: () => {
        this.notificationService.error('Failed to load turfs. Please try again later.');
        this.isLoading.set(false);
      }
    });
  }

  loadTurfs() {
    this.isLoading.set(true);
    const search = this.searchTerm();
    const location = this.selectedLocation();
    const game = this.selectedGame();

    const params: any = {};
    if (search) params.search = search;
    if (location) params.location = location;

    this.turfRepository.getAll(params).subscribe({
      next: (response: TurfResponse) => {
        let items = response.items;
        
        // Failsafe client-side filtering to guarantee exact match search results
        if (search) {
          const query = search.toLowerCase().trim();
          items = items.filter(t => 
            t.name.toLowerCase().includes(query) || 
            t.location.toLowerCase().includes(query) ||
            (t.description && t.description.toLowerCase().includes(query))
          );
        }
        
        if (location) {
          const locQuery = location.toLowerCase().trim();
          items = items.filter(t => t.location.toLowerCase() === locQuery);
        }

        if (game && game !== 'All') {
          const gameQuery = game.toLowerCase();
          items = items.filter(t => 
            t.name.toLowerCase().includes(gameQuery) ||
            (t.description && t.description.toLowerCase().includes(gameQuery))
          );
        }

        // Price Filter
        const maxP = this.maxPrice();
        items = items.filter(t => t.pricePerHour <= maxP);

        // Rating Filter
        const minR = this.minRating();
        if (minR > 0) {
          items = items.filter(t => (t.rating || 0) >= minR);
        }

        // Sorting
        const sort = this.sortBy();
        if (sort === 'price_asc') {
          items.sort((a, b) => a.pricePerHour - b.pricePerHour);
        } else if (sort === 'price_desc') {
          items.sort((a, b) => b.pricePerHour - a.pricePerHour);
        } else if (sort === 'rating_desc') {
          items.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        }
        
        this.turfs.set(items);
        this.isLoading.set(false);
        if (this.viewMode() === 'map') {
          setTimeout(() => {
            this.updateMapMarkers();
            if (this.map) this.map.invalidateSize();
          }, 150);
        }
      },
      error: () => {
        this.notificationService.error('Failed to load turfs. Please try again later.');
        this.isLoading.set(false);
      }
    });
  }

  setViewMode(mode: 'grid' | 'map') {
    this.viewMode.set(mode);
    if (mode === 'map') {
      setTimeout(() => {
        this.initMap();
        if (this.map) this.map.invalidateSize();
      }, 150);
    }
  }

  initMap() {
    if (this.map) {
      this.updateMapMarkers();
      setTimeout(() => this.map!.invalidateSize(), 150);
      return;
    }
    
    // Fix leaflet icon issue natively
    const iconDefault = L.icon({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
    });
    L.Marker.prototype.options.icon = iconDefault;

    const mapEl = document.getElementById('turf-map');
    if (!mapEl) return;

    this.map = L.map('turf-map', { attributionControl: false }).setView([13.0827, 80.2707], 10);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      // Attribution removed as requested
    }).addTo(this.map);

    this.markersLayer = L.layerGroup().addTo(this.map);
    
    this.updateMapMarkers();
    this.locateUser();
    
    // Force Leaflet to recalculate container dimensions after DOM paint
    setTimeout(() => this.map!.invalidateSize(), 200);
  }

  updateMapMarkers() {
    if (!this.map || !this.markersLayer) return;
    
    this.markersLayer.clearLayers();
    const currentTurfs = this.turfs();
    const bounds = L.latLngBounds([]);

    currentTurfs.forEach(turf => {
      if (turf.latitude && turf.longitude) {
        const marker = L.marker([turf.latitude, turf.longitude]);
        const popupContent = `
          <div style="min-width: 200px">
            <h3>${turf.name}</h3>
            <p>${turf.location}</p>
            <p style="font-weight: bold">₹${turf.pricePerHour}/hr</p>
            <a href="https://www.google.com/maps/dir/?api=1&destination=${turf.latitude},${turf.longitude}" 
               target="_blank" 
               style="display: block; padding: 10px 12px; background: #7b39fc; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; text-align: center; margin-top: 12px;">
              Get Directions 🚀
            </a>
          </div>
        `;
        marker.bindPopup(popupContent);
        this.markersLayer!.addLayer(marker);
        bounds.extend([turf.latitude, turf.longitude]);
      }
    });

    if (currentTurfs.length > 0 && bounds.isValid()) {
      this.map.fitBounds(bounds, { padding: [50, 50] });
    }
  }

  locateUser() {
    if (navigator.geolocation && this.map) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const userIcon = L.icon({
          iconUrl: 'https://cdn-icons-png.flaticon.com/512/1004/1004313.png',
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          popupAnchor: [0, -16]
        });
        
        L.marker([latitude, longitude], { icon: userIcon })
          .bindPopup('<b style="font-size: 1.1rem; color: #7b39fc">You are here!</b>')
          .addTo(this.map!);
      }, () => {
        console.warn('Geolocation denied or failed.');
      });
    }
  }

  onSearch(term: string) {
    this.searchTerm.set(term);
    this.loadTurfs();
  }

  toggleLocationSelect() {
    this.isLocationSelectOpen.update(v => !v);
  }

  closeLocationSelect() {
    this.isLocationSelectOpen.set(false);
  }

  selectLocation(event: Event, loc: string) {
    event.stopPropagation();
    this.selectedLocation.set(loc);
    this.isLocationSelectOpen.set(false);
    this.loadTurfs();
  }

  toggleFilter() {
    this.isFilterOpen.update(v => !v);
  }

  selectGame(game: string) {
    this.selectedGame.set(game);
    this.loadTurfs();
  }

  onPriceChange(event: any) {
    this.maxPrice.set(Number(event.target.value));
    this.loadTurfs();
  }

  selectRating(rating: number) {
    this.minRating.set(rating);
    this.loadTurfs();
  }

  selectSort(sort: string) {
    this.sortBy.set(sort);
    this.loadTurfs();
  }
}
