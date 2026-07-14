import { Component, OnInit, signal, OnDestroy } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { Turf, TurfResponse } from '../../domain/models/turf.model';
import { TurfCardComponent } from './ui/turf-card.component';
import { NotificationService } from '../../core/services/notification.service';
import { FcmNotificationService } from '../../core/services/fcm-notification.service';
import { Router } from '@angular/router';
import { ThemeService } from '../../core/services/theme.service';
import { TurfRepository } from '../../domain/repositories/turf.repository';
import { AuthStore } from '../../core/services/auth.store';

@Component({
 selector: 'app-dashboard',
 standalone: true,
 imports: [CommonModule, TurfCardComponent],
 template: `
    <!-- MOBILE APP LAYOUT (TurfXpert Premium) -->
  <div class="mobile-app-layout min-h-screen pb-[100px] font-sans transition-colors duration-300 bg-white dark:bg-[#0A0E1A] text-slate-900 dark:text-white"
       (touchstart)="onTouchStart($event)" 
       (touchmove)="onTouchMove($event)" 
       (touchend)="onTouchEnd()">
       
    <!-- Custom Pull to Refresh Indicator -->
    <div class="w-full flex justify-center items-end overflow-hidden transition-all duration-300 pointer-events-none"
         [style.height.px]="pullDownDistance()">
      <div class="mb-4 bg-white dark:bg-slate-800 shadow-lg rounded-full p-2 flex items-center justify-center border border-slate-100 dark:border-slate-700"
           [style.transform]="'rotate(' + (pullDownDistance() * 3) + 'deg)'"
           [style.opacity]="pullDownDistance() / 80">
        <svg class="w-6 h-6 text-[#7b39fc]" [class.animate-spin]="isRefreshing()" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
      </div>
    </div>
    
    <!-- Mobile Navbar Header -->
    <div class="px-5 pt-4 pb-4 sticky top-0 z-50 bg-white/95 dark:bg-[#0A0E1A]/95 " style="padding-top: calc(1.5rem + env(safe-area-inset-top));">
      <div class="flex justify-between items-center mb-5">
        <!-- User Info & Location -->
        <div class="flex flex-col">
          <span class="text-lg font-bold">Hi, {{ userName() }}</span>
          <div class="flex items-center gap-1 mt-1 cursor-pointer" (click)="toggleLocationSelect()">
            <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            <span class="text-[13px] font-medium text-slate-500">{{ selectedLocation() || 'Select Location' }}</span>
          </div>
        </div>
        
        <!-- Action Icons (Theme, Favorites, Notifications) -->
        <div class="flex items-center gap-4">
          <button (click)="toggleTheme($event)" class="text-slate-400 hover:text-slate-600 transition-colors">
            <svg *ngIf="themeService.theme() === 'dark'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            <svg *ngIf="themeService.theme() !== 'dark'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
          </button>
          <button class="text-slate-400 hover:text-slate-600 transition-colors" (click)="navigateToLiked()">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
          </button>
          <button class="text-slate-400 hover:text-slate-600 transition-colors relative" (click)="navigateToNotifications()">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
            </svg>
            <div class="absolute top-0 right-1 w-2 h-2 bg-[#ea5b5b] rounded-full" *ngIf="hasNotifications()"></div>
          </button>
        </div>
      </div>

      <!-- Search & Filter Row -->
      <div class="flex items-center gap-3">
        <div class="relative bg-[#f3f9f0] dark:bg-slate-800/40 rounded-full flex items-center p-1 flex-grow transition-all">
          <svg class="w-5 h-5 text-slate-400 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          <input class="bg-transparent border-none text-[14px] font-medium p-3 w-full outline-none text-slate-800 dark:text-white placeholder-slate-400" placeholder="What sport are you looking for?" [value]="searchTerm()" #mobileSearch (input)="onSearch(mobileSearch.value)" />
        </div>
        <button class="text-slate-500 hover:text-slate-800 transition-colors p-2" (click)="toggleFilter()">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
        </button>
      </div>

          </div>
  
    <!-- Banner Slider -->
    <div class="px-5 mb-8">
      <div class="relative w-full rounded-[24px] overflow-hidden shadow-lg bg-gradient-to-r from-[#7b39fc] to-[#5a24c3] px-6 py-6 cursor-pointer transition-transform active:scale-95 flex" (click)="navigateToOffers()">
        <div class="z-10 w-2/3">
          <p class="text-[11px] font-medium text-white/90 mb-1">Batdoor Badminton Academy</p>
          <h2 class="text-[20px] font-bold text-white leading-tight mb-4">Get Special offer<br><span class="font-normal text-sm">Up to</span> 40%</h2>
          <button class="bg-white text-[#22c55e] text-xs font-bold px-4 py-2 rounded-full shadow-sm">View details</button>
        </div>
        <div class="absolute right-[-20px] top-1/2 transform -translate-y-1/2 opacity-90 text-[100px]">⚽</div>
      </div>
    </div>
  
    <!-- Categories -->
    <div class="px-0 mb-8">
      <div class="flex justify-between items-center px-5 mb-4">
        <h3 class="text-[18px] font-bold">Categories</h3>
        <span class="text-[12px] text-[#9b51e0] font-bold uppercase cursor-pointer active:scale-95 transition-transform" (click)="selectAllGamesAndScroll()">See All</span>
      </div>
      <div class="flex gap-4 overflow-x-auto px-5 pb-2 scrollbar-hide snap-x">
        
        <div class="flex flex-col items-center gap-2 min-w-[72px] snap-start cursor-pointer" (click)="selectGame('All')">
          <div class="w-[72px] h-[72px] rounded-2xl flex items-center justify-center text-xl transition-all duration-300 relative"
               [ngClass]="selectedGame() === 'All' ? 'bg-slate-900 text-white shadow-lg border-2 border-slate-900 dark:border-white' : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/5 text-slate-900 dark:text-white'">
            <span class="font-bold text-sm">All</span>
          </div>
        </div>

        <div class="flex flex-col items-center gap-2 min-w-[72px] snap-start cursor-pointer" *ngFor="let game of ['Cricket', 'Football', 'Badminton', 'Basketball', 'Volleyball']" (click)="selectGame(game)">
          <div class="w-[72px] h-[72px] rounded-2xl flex items-center justify-center text-3xl transition-all duration-300 relative"
               [ngClass]="{
                 'bg-[#eef2fc] text-[#5b73e8]': game === 'Cricket',
                 'bg-[#fdebea] text-[#ea5b5b]': game === 'Football',
                 'bg-[#fdf4e7] text-[#f2a74c]': game === 'Badminton',
                 'bg-[#fdf0e7] text-[#ea7f41]': game === 'Basketball',
                 'bg-[#f3ebfe] text-[#9b51e0]': game === 'Volleyball',
                 'shadow-lg border-2 border-current': selectedGame() === game
               }">
            <span *ngIf="game === 'Cricket'">🏏</span>
            <span *ngIf="game === 'Football'">⚽</span>
            <span *ngIf="game === 'Badminton'">🏸</span>
            <span *ngIf="game === 'Tennis'">🎾</span>
            <span *ngIf="game === 'Volleyball'">🏐</span>
            <span *ngIf="game === 'Basketball'">🏀</span>
          </div>
          <span class="text-[12px] font-medium transition-colors" [class.font-bold]="selectedGame() === game"
            [ngClass]="{
                 'text-[#5b73e8]': game === 'Cricket' && selectedGame() === game,
                 'text-[#ea5b5b]': game === 'Football' && selectedGame() === game,
                 'text-[#f2a74c]': game === 'Badminton' && selectedGame() === game,
                 'text-[#ea7f41]': game === 'Basketball' && selectedGame() === game,
                 'text-[#9b51e0]': game === 'Volleyball' && selectedGame() === game,
                 'text-slate-500': selectedGame() !== game
               }">{{ game }}</span>
        </div>
      </div>
    </div>
  
    <!-- Popular Turfs -->
    <div class="px-5">
      <div class="flex justify-between items-center mb-5">
        <h3 class="text-[18px] font-bold">Nearby Arenas</h3>
        <span class="text-[14px] text-[#7b39fc] font-bold capitalize cursor-pointer active:scale-95 transition-transform" (click)="resetFiltersAndScroll()">View all</span>
      </div>
      
      <div class="flex flex-col gap-5" *ngIf="!isLoading() && viewMode() === 'grid'">
        <app-turf-card *ngFor="let turf of turfs()" [turf]="turf"></app-turf-card>
      </div>
      <div class="flex flex-col gap-5" *ngIf="isLoading()">
        <div class="h-[280px] w-full bg-slate-100 dark:bg-slate-800/50 rounded-3xl animate-pulse"></div>
        <div class="h-[280px] w-full bg-slate-100 dark:bg-slate-800/50 rounded-3xl animate-pulse"></div>
      </div>
      
      <!-- Mobile Map View -->
      <div *ngIf="viewMode() === 'map' && !isLoading()" class="w-full h-[60vh] rounded-[24px] overflow-hidden relative z-10 border border-slate-200 dark:border-white/10 shadow-lg mt-4">
         <div id="turf-map-mobile" class="w-full h-full bg-slate-200 dark:bg-slate-900"></div>
      </div>

      <!-- Floating Map/List Toggle for Mobile -->
      <div class="fixed left-1/2 transform -translate-x-1/2 z-[90]" style="bottom: 110px;">
        <button class="bg-[#1e293b] text-white px-5 py-3 rounded-full shadow-lg flex items-center gap-2 active:scale-95 transition-transform" (click)="toggleMobileViewMode()">
          <span class="font-bold text-[13px] tracking-wide">{{ viewMode() === 'grid' ? 'Map' : 'List' }}</span>
          <svg *ngIf="viewMode() === 'grid'" class="w-4 h-4 text-[#7b39fc]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>
          <svg *ngIf="viewMode() === 'map'" class="w-4 h-4 text-[#7b39fc]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
        </button>
      </div>

      <!-- Empty State -->
      <div class="empty-state text-center py-10 bg-slate-50 dark:bg-slate-800/30 rounded-3xl border border-slate-100 dark:border-white/5 " *ngIf="!isLoading() && turfs().length === 0">
        <div class="w-16 h-16 mx-auto bg-slate-100 dark:bg-slate-800/80 rounded-full flex items-center justify-center mb-4">
          <svg class="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <h3 class="text-lg font-bold">No arenas found</h3>
        <p class="text-sm text-slate-500 mt-2">Try switching sports or location</p>
      </div>
    </div>

    
    <!-- Filter Modal (Full Screen / Bottom Sheet) -->
    <div class="fixed inset-0 z-[2000] bg-black/60  transition-opacity flex items-end justify-center" *ngIf="isFilterOpen()" (click)="toggleFilter()">
      <div class="w-full h-[90vh] bg-[#f8f9fa] dark:bg-[#0A0E1A] rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.3)] flex flex-col relative overflow-hidden" (click)="$event.stopPropagation()">
        
        <!-- Header -->
        <div class="flex items-center p-5 bg-[#f8f9fa] dark:bg-[#121212] rounded-t-3xl">
          <button class="p-1 -ml-2" (click)="toggleFilter()">
            <svg class="w-6 h-6 text-slate-800 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          </button>
          <h2 class="text-xl font-bold ml-2 text-slate-900 dark:text-white">Filters</h2>
        </div>
        
        <!-- Content -->
        <div class="flex-1 overflow-y-auto px-5 pt-2 pb-32">
          <div class="bg-white dark:bg-[#1A1F2E] rounded-[32px] p-6 shadow-sm border border-slate-100 dark:border-white/5 space-y-8">
            

            <!-- Price Range -->
            <div>
              <p class="text-[13px] text-slate-400 font-semibold mb-3">Fees Range Per schedule</p>
              <div class="flex justify-between mb-2">
                <span class="text-[13px] font-bold text-slate-700 dark:text-slate-300">INR 500 - {{ maxPrice() }} Rs</span>
              </div>
              <input type="range" class="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-800 dark:accent-[#4ade80]" min="500" max="5000" step="100" [value]="maxPrice()" (input)="onPriceChange($event)">
            </div>
            
            <!-- Sports -->
            <div>
              <p class="text-[13px] text-slate-400 font-semibold mb-3">Sports</p>
              <div class="flex flex-wrap gap-2.5">
                <button *ngFor="let game of gameTypes" 
                        class="px-5 py-2.5 rounded-[20px] text-[13px] font-bold transition-all border"
                        [ngClass]="selectedGame() === game ? 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white shadow-sm' : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5'"
                        (click)="selectGame(game)">
                  {{ game }}
                </button>
              </div>
            </div>

            <!-- Rating -->
            <div>
              <p class="text-[13px] text-slate-400 font-semibold mb-3">Rating</p>
              <div class="flex flex-wrap gap-2.5">
                <button class="px-5 py-2.5 rounded-[20px] text-[13px] font-bold transition-all border flex items-center gap-1" [ngClass]="minRating() === 4 ? 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white shadow-sm' : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-50'" (click)="selectRating(4)">4+ <span class="text-[#fbbf24] text-lg leading-none">★</span></button>
                <button class="px-5 py-2.5 rounded-[20px] text-[13px] font-bold transition-all border flex items-center gap-1" [ngClass]="minRating() === 5 ? 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white shadow-sm' : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-50'" (click)="selectRating(5)">5+ <span class="text-[#fbbf24] text-lg leading-none">★</span></button>
                <button class="px-5 py-2.5 rounded-[20px] text-[13px] font-bold transition-all border" [ngClass]="minRating() === 0 ? 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white shadow-sm' : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-50'" (click)="selectRating(0)">All</button>
              </div>
            </div>

            <!-- Sort By -->
            <div>
              <p class="text-[13px] text-slate-400 font-semibold mb-3">Sort By</p>
              <div class="flex flex-wrap gap-2.5">
                <button class="px-5 py-2.5 rounded-[20px] text-[13px] font-bold transition-all border" [ngClass]="sortBy() === 'recommended' ? 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white shadow-sm' : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-50'" (click)="selectSort('recommended')">Recommended</button>
                <button class="px-5 py-2.5 rounded-[20px] text-[13px] font-bold transition-all border" [ngClass]="sortBy() === 'price_asc' ? 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white shadow-sm' : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-50'" (click)="selectSort('price_asc')">Lowest Price</button>
              </div>
            </div>

          </div>
        </div>

        <!-- Footer Actions -->
        <div class="absolute bottom-0 left-0 right-0 p-5 bg-[#f8f9fa] dark:bg-[#0A0E1A] flex gap-4 z-10 items-center justify-between shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
          <button class="flex-1 py-4 bg-[#0ea5e9] dark:bg-[#7b39fc] text-white rounded-full font-bold text-[16px] shadow-lg active:scale-95 transition-transform" (click)="resetFiltersAndScroll(); toggleFilter()">Reset</button>
          <button class="flex-1 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-full font-bold text-[16px] border border-slate-200 dark:border-white/10 shadow-sm active:scale-95 transition-transform" (click)="toggleFilter()">Apply</button>
        </div>
      </div>
    </div>
    
    <!-- Mobile Location Selector Modal -->
    <div class="fixed inset-0 z-[2000] bg-black/60  transition-opacity" *ngIf="isLocationSelectOpen()" (click)="toggleLocationSelect()">
      <div class="absolute bottom-0 left-0 right-0 bg-[#141A28] rounded-t-3xl border-t border-white/10 p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] transform transition-transform" (click)="$event.stopPropagation()">
        <div class="w-12 h-1 bg-white/20 rounded-full mx-auto mb-6"></div>
        <h3 class="text-xl font-bold text-white mb-4">Select Location</h3>
        <div class="max-h-[60vh] overflow-y-auto scrollbar-hide pr-2 pb-10">
          
          <ng-container *ngIf="!viewingDistrictsForState()">
            <div class="py-3 px-4 rounded-xl bg-[#7b39fc]/10 border border-[#7b39fc]/30 text-[#7b39fc] mb-3 cursor-pointer hover:bg-[#7b39fc]/20 transition-colors flex items-center justify-center gap-2" (click)="autoDetectLocation(true)">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <span class="font-bold text-base">Detect My Location</span>
            </div>

            <div class="py-3 px-4 rounded-xl border border-white/5 mb-2 cursor-pointer transition-colors" (click)="selectLocation($event, '', '')" [ngClass]="{'bg-[var(--primary)]/20 border-[var(--primary)]/50 text-[var(--primary)]': selectedState() === '' && selectedDistrict() === '', 'hover:bg-white/5 text-slate-300': selectedState() !== '' || selectedDistrict() !== ''}">
              <span class="font-bold text-base">All Locations</span>
            </div>
            
            <div class="py-3 px-4 rounded-xl border border-white/5 mb-2 cursor-pointer transition-colors flex justify-between items-center" *ngFor="let state of statesList()" (click)="openStateDistricts($event, state)" [ngClass]="{'bg-[var(--primary)]/10 border-[var(--primary)]/30 text-white': selectedState() === state, 'hover:bg-white/5 text-slate-300': selectedState() !== state}">
              <span class="font-bold text-base">{{ state }}</span>
              <svg class="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
            </div>
          </ng-container>
          
          <ng-container *ngIf="viewingDistrictsForState() as stateName">
            <div class="py-2 px-3 flex items-center gap-2 font-bold text-[var(--primary)] mb-4 cursor-pointer" (click)="backToStates($event)">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
              Back to States
            </div>
            
            <div class="py-3 px-4 rounded-xl border border-white/5 mb-2 cursor-pointer transition-colors" (click)="selectLocation($event, stateName, '')" [ngClass]="{'bg-[var(--primary)]/20 border-[var(--primary)]/50 text-[var(--primary)]': selectedState() === stateName && selectedDistrict() === '', 'hover:bg-white/5 text-slate-300': selectedState() !== stateName || selectedDistrict() !== ''}">
              <span class="font-bold text-base">All of {{ stateName }}</span>
            </div>
            
            <div class="py-3 px-4 rounded-xl border border-white/5 mb-2 cursor-pointer transition-colors" *ngFor="let dist of getDistrictsForState(stateName)" (click)="selectLocation($event, stateName, dist)" [ngClass]="{'bg-[var(--primary)]/20 border-[var(--primary)]/50 text-[var(--primary)]': selectedDistrict() === dist, 'hover:bg-white/5 text-slate-300': selectedDistrict() !== dist}">
              <span class="font-medium text-[15px]">{{ dist }}</span>
            </div>
            
            <div *ngIf="getDistrictsForState(stateName).length === 0" class="py-4 text-center text-slate-500">
              No districts available
            </div>
          </ng-container>

        </div>
      </div>
    </div>

  </div>

    <!-- DESKTOP WEB LAYOUT -->
 <div class="desktop-web-layout dashboard-page container-fluid spacing-vertical-48 fade-in">
 <header class="dashboard-header glass">
 <div class="header-content">
 <h1>Find Your Perfect <span class="typing-text">{{ displayedWord() }}</span><span class="typing-cursor">|</span></h1>
 <div class="search-container">
 <div class="flex justify-between items-center mb-3 px-4">
 <h2 class="text-slate-900 dark:text-white text-lg font-bold">Discover</h2>
 <button (click)="navigateToOffers()" class="bg-[#f59e0b] text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 hover:scale-105 transition-transform border-none outline-none cursor-pointer">
 <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"></path></svg>
 Promo Offers
        </button>
 </div>
 <div class="search-bar glass">
 
 <!-- Professional Location Select -->
 <div class="custom-select-container" (click)="toggleLocationSelect()">
 <div class="custom-select-value" title="Location">
 <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
 <span class="whitespace-nowrap">{{ selectedLocation() || 'All Locations' }}</span>
 <svg class="w-4 h-4 ml-2 transition-transform duration-300" [class.rotate-180]="isLocationSelectOpen()" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<title>Location</title><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
 </div>
 
 <div class="custom-select-dropdown glass-card" [class.show]="isLocationSelectOpen()">
 
 <ng-container *ngIf="!viewingDistrictsForState()">
 <div class="select-option" (click)="selectLocation($event, '', '')" [class.active]="selectedState() === '' && selectedDistrict() === ''">All Locations</div>
 <div class="select-option flex justify-between items-center" *ngFor="let state of statesList()" (click)="openStateDistricts($event, state)" [class.active]="selectedState() === state">
 <span>{{ state }}</span>
 <svg class="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<title>Expand</title><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
 </div>
 </ng-container>

 <ng-container *ngIf="viewingDistrictsForState() as stateName">
 <div class="select-option flex items-center gap-2 font-bold border-b border-white/10 dark:border-white/5 pb-2 mb-2 text-[var(--primary)]" (click)="backToStates($event)" title="Back">
 <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
 Back to States
 </div>
 <div class="select-option" (click)="selectLocation($event, stateName, '')" [class.active]="selectedState() === stateName && selectedDistrict() === ''">
 All of {{ stateName }}
 </div>
 <div class="select-option" *ngFor="let dist of getDistrictsForState(stateName)" (click)="selectLocation($event, stateName, dist)" [class.active]="selectedDistrict() === dist">
 {{ dist }}
 </div>
 <div *ngIf="getDistrictsForState(stateName).length === 0" class="px-4 py-2 text-xs text-[var(--text-secondary)]">
 No districts available
 </div>
 </ng-container>

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
 
 <button class="btn-filter" (click)="toggleFilter()" [class.active]="isFilterOpen()" title="Search">
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

 <!-- Personalized Insights Section -->
 <section class="dashboard-insights fade-in">
 <h2 class="font-instrument-serif text-2xl mb-4 text-[var(--text-primary)]">Your Insights</h2>
 <div class="insights-grid">
 <div class="insight-card glass">
 <div class="insight-icon bg-blue-500/20 text-blue-400" title="Information">
 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
 </div>
 <div class="insight-info">
 <span class="insight-label text-xs uppercase tracking-wider text-[var(--text-secondary)] font-bold">Most Played Turf</span>
 <h4 class="text-lg font-bold mt-1">Kickoff Arena</h4>
 <p class="text-xs text-[var(--text-secondary)] mt-1">12 Bookings this month</p>
 </div>
 </div>

 <div class="insight-card glass">
 <div class="insight-icon bg-amber-500/20 text-amber-400" title="Information">
 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
 </div>
 <div class="insight-info">
 <span class="insight-label text-xs uppercase tracking-wider text-[var(--text-secondary)] font-bold">Preferred Time</span>
 <h4 class="text-lg font-bold mt-1">Night (8 PM - 11 PM)</h4>
 <p class="text-xs text-[var(--text-secondary)] mt-1">Night Owl Badge Earned</p>
 </div>
 </div>

 <div class="insight-card glass border border-purple-500/30" style="background: linear-gradient(145deg, rgba(var(--primary-rgb), 0.1), rgba(var(--bg-card-rgb), 1));">
 <div class="insight-icon bg-purple-500/20 text-purple-400" title="Action">
 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg>
 </div>
 <div class="insight-info">
 <span class="insight-label text-xs uppercase tracking-wider text-purple-400 font-bold">Upcoming Event</span>
 <h4 class="text-lg font-bold mt-1">Summer Cup 2026</h4>
 <p class="text-xs text-[var(--text-secondary)] mt-1">Starts in 3 Days • <a href="#" class="text-[var(--primary)] hover:underline">Register</a></p>
 </div>
 </div>
 </div>
 </section>

 <!-- Turf Grid / Map Area -->
 <main class="turf-grid-container">
 <div class="grid-header">
 <h2>Available Turfs <span class="badge">{{ turfs().length }}</span></h2>
 <div class="view-toggles">
 <button class="view-btn" [class.active]="viewMode() === 'grid'" (click)="setViewMode('grid')" title="Action">
 <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
 Grid
 </button>
 <button class="view-btn" [class.active]="viewMode() === 'map'" (click)="setViewMode('map')" title="Location">
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
  /* Layout Isolation */
  .mobile-app-layout {
    display: none;
  }
  .desktop-web-layout {
    display: flex;
  }

  :host-context(body.is-mobile-app) .mobile-app-layout {
    display: block !important;
  }
  :host-context(body.is-mobile-app) .desktop-web-layout {
    display: none !important;
  }

 .dashboard-page {
 padding: 2rem 5%;
 max-width: 1400px;
 margin: 0 auto;
 display: flex;
 flex-direction: column;
 gap: 3rem;
 }
 
 /* Insights Section Styles */
 .dashboard-insights {
 display: flex;
 flex-direction: column;
 gap: 1rem;
 }
 .insights-grid {
 display: grid;
 grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
 gap: 1.5rem;
 }
 .insight-card {
 padding: 1.5rem;
 border-radius: 16px;
 display: flex;
 align-items: center;
 gap: 1.25rem;
 transition: transform 0.3s ease, box-shadow 0.3s ease;
 }
 .insight-card:hover {
 transform: translateY(-4px);
 box-shadow: var(--shadow-float);
 }
 .insight-icon {
 width: 54px;
 height: 54px;
 border-radius: 14px;
 display: flex;
 align-items: center;
 justify-content: center;
 flex-shrink: 0;
 }
 .insight-icon svg {
 width: 28px;
 height: 28px;
 }
 .insight-info {
 display: flex;
 flex-direction: column;
 }

 .dashboard-header {
 padding: 4rem 2rem;
 border-radius: 24px;
 text-align: center;
 position: relative;
 z-index: 50;
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
 font-weight: inherit;
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
 z-index: 30;
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
 background: var(--bg-card);
 border: 1px solid var(--border-color);
 border-radius: 16px;
 padding: 0.5rem;
 box-shadow: 0 10px 40px rgba(0,0,0,0.5);
 opacity: 0;
 visibility: hidden;
 transform: translateY(-10px);
 transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
 z-index: 999;
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
 .dashboard-page { padding: 0.5rem; gap: 1rem; }
 .dashboard-header { padding: 1rem 0.5rem; border-radius: 12px; }
 .header-content h1 { font-size: 1.15rem; margin-bottom: 0.75rem; }
 
 /* Hide Insights entirely on mobile */
 .dashboard-insights { display: none !important; }
 .insights-grid { display: none !important; }
 .insight-card { display: none !important; }
 
 /* Mobile Search Bar Stacking */
 
 /* Horizontal Scroll for Insights */
 .insights-grid {
 display: flex;
 overflow-x: auto;
 scroll-snap-type: x mandatory;
 padding-bottom: 0.5rem;
 gap: 0.75rem;
 }
 .insight-card {
 min-width: 85vw;
 scroll-snap-align: center;
 flex-shrink: 0;
 padding: 0.875rem;
 gap: 0.75rem;
 }
 .insight-icon {
 width: 40px;
 height: 40px;
 border-radius: 10px;
 }
 .insight-icon svg {
 width: 20px;
 height: 20px;
 }
 
 .search-bar { 
 flex-direction: row; 
 flex-wrap: wrap;
 align-items: center; 
 gap: 8px; 
 padding: 8px; 
 border-radius: 20px; 
 }
 .divider { display: none; }
 .custom-select-container { width: 100%; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 4px; }
 .custom-select-value { justify-content: space-between; padding: 4px 8px; font-size: 0.85rem; }
 .search-input { flex: 1; padding: 8px 12px; font-size: 0.85rem; min-width: 0; background: rgba(0,0,0,0.2); border-radius: 12px; height: 40px; }
 .btn-search { width: 40px; height: 40px; padding: 0; border-radius: 12px; font-size: 0; display: flex; align-items: center; justify-content: center; }
 .btn-search::after {
   content: '';
   width: 18px;
   height: 18px;
   background: url('data:image/svg+xml;utf8,<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>') no-repeat center;
   display: block;
 }
 .btn-filter { 
 width: 40px; 
 height: 40px;
 border-radius: 12px; 
 padding: 0; 
 background: rgba(123, 57, 252, 0.15); 
 display: flex;
 align-items: center;
 justify-content: center;
 }
 .btn-filter svg { width: 18px; height: 18px; }
 .btn-filter::after { display: none; }
 
 /* Mobile Grid Header & Toggles */
 .grid-header { 
 flex-direction: column; 
 align-items: stretch; 
 gap: 0.75rem; 
 text-align: center;
 }
 .grid-header h2 { justify-content: center; font-size: 1.25rem; }
 .view-toggles { display: flex; }
 .view-btn { justify-content: center; padding: 6px 12px; font-size: 0.875rem; }
 .view-btn:first-child { flex: 1; }
 .view-btn:last-child { flex: 0 0 auto; padding: 6px 10px; font-size: 0.8rem; }
 
 .turf-grid {
 display: flex;
 overflow-x: auto;
 scroll-snap-type: x mandatory;
 padding-bottom: 1rem;
 gap: 0.75rem;
 /* grid-template-columns: repeat(3, 1fr); */
 gap: 0.75rem;
 }
 
 /* Mobile Map */
 .map-wrapper { height: 350px; padding: 0.5rem; border-radius: 16px; }
 
 /* Mobile Filters */
 .filter-section-wrapper.open { max-height: 1200px; }
 .filter-grid { grid-template-columns: 1fr; gap: 0.5rem; }
 .filter-section { padding: 0.75rem; border-radius: 12px; }
 .filter-chips { justify-content: flex-start; gap: 0.35rem; }
 .filter-group { align-items: flex-start; text-align: left; gap: 0.25rem; }
 .filter-label { font-size: 0.75rem; }
 .filter-chip { padding: 4px 10px; font-size: 0.75rem; border-radius: 8px; }
 .range-container { height: 28px; gap: 0.5rem; }
 .range-value { font-size: 0.75rem; min-width: auto; }
 }
 `]
})
export class DashboardComponent implements OnInit, OnDestroy {
 allTurfs = signal<Turf[]>([]);
 turfs = signal<Turf[]>([]);
 isLoading = signal(true);
  isDarkMode = signal<boolean>(false);
  hasNotifications = signal<boolean>(true);
  userName = signal<string>('Guest');
 
 // Load state from sessionStorage if available
 searchTerm = signal<string>(sessionStorage.getItem('dashboard_search') || '');
 selectedLocation = signal<string>(sessionStorage.getItem('dashboard_locationStr') || '');
 selectedState = signal<string>(sessionStorage.getItem('dashboard_state') || '');
 selectedDistrict = signal<string>(sessionStorage.getItem('dashboard_district') || '');
 
 statesList = signal<string[]>([]);
 districtsMap = signal<Map<string, Set<string>>>(new Map());
 viewingDistrictsForState = signal<string | null>(null);

 isLocationSelectOpen = signal(false);
 isFilterOpen = signal(false);
 
 // Filters
 gameTypes = ['All', 'Football', 'Cricket', 'Tennis', 'Badminton', 'Basketball'];
 selectedGame = signal<string>(sessionStorage.getItem('dashboard_game') || 'All');
 maxPrice = signal<number>(Number(sessionStorage.getItem('dashboard_maxPrice')) || 5000);
 minRating = signal<number>(Number(sessionStorage.getItem('dashboard_minRating')) || 0);
 sortBy = signal<string>(sessionStorage.getItem('dashboard_sort') || 'recommended');

 sortOptions = [
 { label: 'Recommended', value: 'recommended' },
 { label: 'Price: Low to High', value: 'price_asc' },
 { label: 'Price: High to Low', value: 'price_desc' },
 { label: 'Highest Rated', value: 'rating_desc' }
 ];

 viewMode = signal<'grid' | 'map'>((sessionStorage.getItem('dashboard_view') as 'grid' | 'map') || 'grid');
 private map: L.Map | null = null;
 private markersLayer: L.LayerGroup | null = null;

 // Typing animation properties
 
  // Pull to refresh state
  isRefreshing = signal(false);
  pullDownDistance = signal(0);
  private touchStartY = 0;

  words = ['Turf', 'Court', 'Pitch', 'Match', 'Arena', 'Game'];
 currentWordIndex = 0;
 displayedWord = signal('');
 isDeleting = false;
 typingTimeout: any;

 constructor(
  private turfRepository: TurfRepository,
  private notificationService: NotificationService,
  private fcmService: FcmNotificationService,
  private authStore: AuthStore,
  private router: Router,
  public themeService: ThemeService
  ) {}

 
  onTouchStart(event: TouchEvent) {
    if (window.scrollY === 0) {
      this.touchStartY = event.touches[0].clientY;
    } else {
      this.touchStartY = 0;
    }
  }

  onTouchMove(event: TouchEvent) {
    if (this.touchStartY === 0 || this.isRefreshing()) return;
    
    const currentY = event.touches[0].clientY;
    const diff = currentY - this.touchStartY;
    
    if (diff > 0 && diff < 150) {
      this.pullDownDistance.set(diff);
    }
  }

  onTouchEnd() {
    if (this.pullDownDistance() > 80) {
      this.triggerRefresh();
    } else {
      this.pullDownDistance.set(0);
    }
  }

  triggerRefresh() {
    this.isRefreshing.set(true);
    this.pullDownDistance.set(80);
    
    this.loadInitialLocationsAndTurfs();
    
    setTimeout(() => {
      this.isRefreshing.set(false);
      this.pullDownDistance.set(0);
    }, 1500);
  }


  ngOnInit() {
    

  this.loadInitialLocationsAndTurfs();
  this.startTypingAnimation();
  
  const user = this.authStore.user();
  if (user && user.name) {
    this.userName.set(user.name.split(' ')[0]);
  }

  // Ask for Push Notification permission and save token to DB
  this.fcmService.requestNotificationPermission();
  this.fcmService.listenForMessages();

  // Auto detect location on fresh login/open
  if (!sessionStorage.getItem('dashboard_locationStr')) {
    this.autoDetectLocation();
  }
  }

  
  async autoDetectLocation(manualTrigger = false) {
    if (manualTrigger) {
      this.notificationService.success('Detecting your location...');
    }
    try {
      // Prompt for permissions
      let perm = await Geolocation.checkPermissions();
      if (perm.location !== 'granted') {
        perm = await Geolocation.requestPermissions();
        if (perm.location !== 'granted') {
          if (manualTrigger) this.notificationService.error('Location permission denied.');
          return;
        }
      }

      // Get Coordinates
      const pos = await Geolocation.getCurrentPosition();
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;

      // Reverse Geocode
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
      const data = await res.json();
      
      const address = data.address || {};
      const district = address.state_district || address.county || address.city || address.town;
      const state = address.state;

      if (state || district) {
        // Try to match the closest available state and district in our list
        let matchedState = '';
        let matchedDistrict = '';
        
        // Find matching state
        const sMatch = this.statesList().find(s => s.toLowerCase().includes(state?.toLowerCase() || '') || (state && state.toLowerCase().includes(s.toLowerCase())));
        if (sMatch) {
           matchedState = sMatch;
           const dists = this.getDistrictsForState(sMatch);
           const dMatch = dists.find(d => d.toLowerCase().includes(district?.toLowerCase() || '') || (district && district.toLowerCase().includes(d.toLowerCase())));
           if (dMatch) {
              matchedDistrict = dMatch;
           }
        }
        
        // Auto Select
        if (matchedState || matchedDistrict) {
           this.selectLocation({ stopPropagation: () => {} } as any, matchedState, matchedDistrict);
           this.notificationService.success(`Location auto-detected: ${matchedDistrict || matchedState}`);
        } else {
           // Fallback to setting exact string if exact match isn't found
           let locStr = '';
           if (district && state) locStr = `${district}, ${state}`;
           else if (state) locStr = state;
           else if (district) locStr = district;
           
           if (locStr) {
             this.selectedLocation.set(locStr);
             this.selectedState.set(state || '');
             this.selectedDistrict.set(district || '');
             this.isLocationSelectOpen.set(false);
             this.loadTurfs();
             this.notificationService.success(`Location set to: ${locStr}`);
           }
        }
      } else if (manualTrigger) {
        this.notificationService.error('Could not determine your state or district from location.');
      }
    } catch (e) {
      if (manualTrigger) {
        this.notificationService.error('Failed to get location. Please enable location services.');
      }
    }
  }

  navigateToLiked() {
    this.router.navigate(['/liked-turfs']);
  }

  navigateToOffers() {
    this.router.navigate(['/offers']);
  }

  navigateToNotifications() {
    this.hasNotifications.set(false);
    this.notificationService.info('No notifications found');
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
 this.allTurfs.set(items);
 this.applyFiltersLocally(); // Apply saved filters on initial load
 
 // Extract unique locations from turfs, grouping by state -> districts
 const defaultStates = ['Tamil Nadu', 'Karnataka', 'Maharashtra', 'Kerala', 'Delhi'];
 const map = new Map<string, Set<string>>();
 defaultStates.forEach(s => map.set(s, new Set()));
 
 const getState = (t: Turf) => {
 if (t.state) return t.state;
 const parts = t.location.split(',');
 if (parts.length > 1) {
 return parts[parts.length - 1].replace(/[0-9]/g, '').trim();
 }
 return t.location.trim(); // Fallback
 };

 const getCity = (t: Turf) => {
 if (t.city) return t.city;
 const parts = t.location.split(',').map(s => s.trim());
 if (parts.length >= 2) {
 // Usually City is the second to last part before State
 const stateIndex = parts.length - 1; 
 return parts[stateIndex - 1].replace(/[0-9]/g, '').trim();
 }
 return '';
 };

 items.forEach(t => {
 const state = getState(t);
 const city = getCity(t);
 
 if (state) {
 if (!map.has(state)) map.set(state, new Set());
 if (city) {
 map.get(state)!.add(city);
 }
 }
 });

 this.statesList.set(Array.from(map.keys()).sort());
 this.districtsMap.set(map);
 this.isLoading.set(false);
 },
 error: () => {
 this.notificationService.error('Failed to load turfs. Please try again later.');
 this.isLoading.set(false);
 }
 });
 }

 saveStateToStorage() {
 sessionStorage.setItem('dashboard_search', this.searchTerm());
 sessionStorage.setItem('dashboard_state', this.selectedState());
 sessionStorage.setItem('dashboard_district', this.selectedDistrict());
 sessionStorage.setItem('dashboard_locationStr', this.selectedLocation());
 sessionStorage.setItem('dashboard_game', this.selectedGame());
 sessionStorage.setItem('dashboard_maxPrice', this.maxPrice().toString());
 sessionStorage.setItem('dashboard_minRating', this.minRating().toString());
 sessionStorage.setItem('dashboard_sort', this.sortBy());
 sessionStorage.setItem('dashboard_view', this.viewMode());
 }

 loadTurfs() {
 this.applyFiltersLocally();
 }

 applyFiltersLocally() {
 this.saveStateToStorage();
 const search = this.searchTerm();
 const state = this.selectedState();
 const district = this.selectedDistrict();
 const game = this.selectedGame();

 let items = [...this.allTurfs()];
 
 // Failsafe client-side filtering to guarantee exact match search results
 if (search) {
 const query = search.toLowerCase().trim();
 items = items.filter(t => 
 t.name.toLowerCase().includes(query) || 
 t.location.toLowerCase().includes(query) ||
 (t.description && t.description.toLowerCase().includes(query))
 );
 }
 
 if (state) {
 const stateQuery = state.toLowerCase().trim();
 items = items.filter(t => {
 if (t.state && t.state.toLowerCase() === stateQuery) return true;
 const extractedState = t.location.split(',').pop()?.replace(/[0-9]/g, '').trim().toLowerCase();
 return extractedState === stateQuery || t.location.toLowerCase().includes(stateQuery);
 });
 }

 if (district) {
 const distQuery = district.toLowerCase().trim();
 items = items.filter(t => {
 if (t.city && t.city.toLowerCase() === distQuery) return true;
 return t.location.toLowerCase().includes(distQuery);
 });
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
 if (this.viewMode() === 'map') {
 setTimeout(() => {
 this.updateMapMarkers();
 if (this.map) this.map.invalidateSize();
 }, 150);
 }
 }

 setViewMode(mode: 'grid' | 'map') {
 this.viewMode.set(mode);
 this.saveStateToStorage();
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

 const mapId = document.body.classList.contains('is-mobile-app') ? 'turf-map-mobile' : 'turf-map';
  const mapEl = document.getElementById(mapId);
  if (!mapEl) return;

  this.map = L.map(mapId, { attributionControl: false }).setView([13.0827, 80.2707], 10);
 
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
 // Geolocation denied or failed.
 });
 }
 }

 onSearch(term: string) {
 this.searchTerm.set(term);
 this.loadTurfs();
 }

 toggleLocationSelect() {
 this.isLocationSelectOpen.update(v => !v);
 if (!this.isLocationSelectOpen()) {
 // Reset view to states when closed
 setTimeout(() => this.viewingDistrictsForState.set(null), 300);
 }
 }

 closeLocationSelect() {
 this.isLocationSelectOpen.set(false);
 setTimeout(() => this.viewingDistrictsForState.set(null), 300);
 }

 openStateDistricts(event: Event, state: string) {
 if(event) event.stopPropagation();
 this.viewingDistrictsForState.set(state);
 }

 backToStates(event: Event) {
 event.stopPropagation();
 this.viewingDistrictsForState.set(null);
 }

 getDistrictsForState(state: string): string[] {
 const districts = this.districtsMap().get(state);
 return districts ? Array.from(districts).sort() : [];
 }

 selectLocation(event: Event, state: string, district: string) {
 event.stopPropagation();
 this.selectedState.set(state);
 this.selectedDistrict.set(district);
 
 if (!state) {
 this.selectedLocation.set('');
 } else if (district) {
 this.selectedLocation.set(`${district}, ${state}`);
 } else {
 this.selectedLocation.set(state);
 }
 
 this.isLocationSelectOpen.set(false);
 setTimeout(() => this.viewingDistrictsForState.set(null), 300);
 this.loadTurfs();
 }

 selectAllGamesAndScroll() {
    this.selectGame('All');
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  }

  resetFiltersAndScroll() {
    this.resetFilters();
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  }

  toggleTheme(event?: MouseEvent) {
    this.themeService.toggle(event);
  }

  resetFilters() {
    this.searchTerm.set('');
    this.selectedGame.set('All');
    this.maxPrice.set(5000);
    this.minRating.set(0);
    this.selectedState.set('');
    this.selectedDistrict.set('');
    this.selectedLocation.set('');
    this.loadTurfs();
  }

  toggleMobileViewMode() {
    this.setViewMode(this.viewMode() === 'grid' ? 'map' : 'grid');
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


