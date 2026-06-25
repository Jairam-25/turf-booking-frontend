import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface Player {
 id: string;
 name: string;
 avatar: string;
 points: number;
 badges: string[];
 rank: number;
 trend: 'up' | 'down' | 'same';
 turfName: string;
}

@Component({
 selector: 'app-leaderboard',
 standalone: true,
 imports: [CommonModule, RouterModule],
 template: `
 <div class="leaderboard-container max-w-6xl mx-auto py-4 px-4 font-manrope">
 
 <!-- Header -->
 <div class="flex items-center justify-between mb-4">
 <button class="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[rgba(255,255,255,0.05)] hover:border-[#7b39fc] transition-all font-semibold" routerLink="/dashboard" title="Back">
 <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
 <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
 </svg>
 Back to Book Turf
 </button>
 </div>

 <!-- Hero Header -->
 <div class="text-center mb-6 relative flex flex-col items-center justify-center fade-in">
 <div class="flex flex-col items-center justify-center gap-2 mb-2">
 <svg class="w-6 h-12 text-[#7b39fc] hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
 <path stroke-linecap="round" stroke-linejoin="round" d="M12 2C8.13401 2 5 5.13401 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13401 15.866 2 12 2Z"></path>
 <path stroke-linecap="round" stroke-linejoin="round" d="M12 11C13.1046 11 14 10.1046 14 9C14 7.89543 13.1046 7 12 7C10.8954 7 10 7.89543 10 9C10 10.1046 10.8954 11 12 11Z"></path>
 </svg>
 <h1 class="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight text-center">Community Leaderboard</h1>
 <svg class="w-6 h-12 text-[#7b39fc] transform scale-x-[-1] hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
 <path stroke-linecap="round" stroke-linejoin="round" d="M12 2C8.13401 2 5 5.13401 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13401 15.866 2 12 2Z"></path>
 <path stroke-linecap="round" stroke-linejoin="round" d="M12 11C13.1046 11 14 10.1046 14 9C14 7.89543 13.1046 7 12 7C10.8954 7 10 7.89543 10 9C10 10.1046 10.8954 11 12 11Z"></path>
 </svg>
 </div>
 <p class="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
 Book more. Rank higher. Get <span class="text-yellow-500 font-bold">10% OFF</span> on any turf booking!
 </p>
 </div>

 <!-- Loading State -->
 <div *ngIf="isLoading()" class="flex flex-col items-center justify-center py-6 fade-in">
 <div class="w-12 h-12 border-4 border-[#7b39fc]/30 border-t-[#7b39fc] rounded-full animate-spin mb-4"></div>
 <p class="text-[var(--text-secondary)]">Loading leaderboard...</p>
 </div>

 <!-- Content -->
 <ng-container *ngIf="!isLoading()">
 
 <div *ngIf="allPlayers().length === 0" class="text-center py-6 text-[var(--text-secondary)] fade-in">
 No bookings yet. Be the first to rank up!
 </div>

 <ng-container *ngIf="allPlayers().length > 0">
 <!-- Top 3 Podium Cards -->
 <div class="flex flex-row justify-center items-end gap-2 mb-6 fade-in px-1">
 
 <!-- Second Place -->
 <div *ngIf="topPlayers().length > 1" class="w-full flex-1 max-w-[320px] order-1 flex flex-col items-center p-3 bg-[rgba(148,163,184,0.05)] border border-[rgba(148,163,184,0.3)] rounded-xl relative shadow-lg">
 <div class="relative mb-3 mt-1">
 <img [src]="topPlayers()[1].avatar" class="w-12 h-12 rounded-full border-2 border-slate-400 object-cover shadow-md" />
 <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-500 text-white w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shadow-lg">2</div>
 </div>
 <h2 class="text-xs font-bold text-[var(--text-primary)] text-center truncate w-full">{{ topPlayers()[1].name }}</h2>
 <div class="hidden text-xs text-[var(--text-secondary)] opacity-80 mt-0.5 truncate w-full text-center">Booked: {{ topPlayers()[1].turfName }}</div>
 <div class="text-lg font-bold text-[#7b39fc] my-0.5">{{ topPlayers()[1].points }}</div>
 <div class="text-[9px] text-[var(--text-secondary)] mb-2 text-center leading-tight">Bookings</div>
 
 <div class="w-full px-1 py-1.5 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] rounded-lg flex flex-col items-center justify-center gap-1 shadow-inner">
 <svg class="w-3 h-3 text-yellow-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
 <div class="flex flex-col text-center leading-tight">
 <span class="text-yellow-500 font-bold text-[10px]">10% OFF</span>
 <span class="hidden text-[0.65rem] text-[var(--text-secondary)]">on any turf booking</span>
 </div>
 </div>
 </div>
 
 <!-- First Place -->
 <div *ngIf="topPlayers().length > 0" class="w-full flex-1 max-w-[360px] order-2 flex flex-col items-center p-4 bg-[rgba(245,158,11,0.08)] border border-[rgba(245,158,11,0.5)] rounded-[1rem] .5rem] relative shadow-[0_0_20px_rgba(245,158,11,0.15)] z-10 transform">
 <div class="relative mb-3 mt-2">
 <div class="absolute -top-6 left-1/2 -translate-x-1/2 text-2xl filter drop-shadow-lg">👑</div>
 <img [src]="topPlayers()[0].avatar" class="w-16 h-16 rounded-full border-2 border-yellow-500 object-cover shadow-[0_0_20px_rgba(245,158,11,0.3)]" />
 <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-yellow-500 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shadow-lg">1</div>
 </div>
 <h2 class="text-sm font-bold text-[var(--text-primary)] text-center truncate w-full">{{ topPlayers()[0].name }}</h2>
 <div class="hidden text-sm text-[var(--text-secondary)] opacity-80 mt-0.5 truncate w-full text-center">Booked: {{ topPlayers()[0].turfName }}</div>
 <div class="text-xl font-extrabold text-[#7b39fc] my-1 drop-shadow-sm">{{ topPlayers()[0].points }}</div>
 <div class="text-[10px] text-[var(--text-secondary)] mb-2 text-center leading-tight">Bookings</div>
 
 <div class="w-full px-1 py-1.5 bg-[rgba(255,255,255,0.05)] border border-[rgba(245,158,11,0.2)] rounded-lg flex flex-col items-center justify-center gap-1 shadow-inner">
 <svg class="w-4 h-4 text-yellow-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
 <div class="flex flex-col text-center leading-tight">
 <span class="text-yellow-500 font-extrabold text-xs">10% OFF</span>
 <span class="hidden text-[0.7rem] text-[var(--text-secondary)]">on any turf booking</span>
 </div>
 </div>
 </div>
 
 <!-- Third Place -->
 <div *ngIf="topPlayers().length > 2" class="w-full flex-1 max-w-[320px] order-3 flex flex-col items-center p-3 bg-[rgba(180,83,9,0.05)] border border-[rgba(180,83,9,0.3)] rounded-xl relative shadow-lg">
 <div class="relative mb-3 mt-1">
 <img [src]="topPlayers()[2].avatar" class="w-12 h-12 rounded-full border-2 border-amber-700 object-cover shadow-md" />
 <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-700 text-white w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shadow-lg">3</div>
 </div>
 <h2 class="text-xs font-bold text-[var(--text-primary)] text-center truncate w-full">{{ topPlayers()[2].name }}</h2>
 <div class="hidden text-xs text-[var(--text-secondary)] opacity-80 mt-0.5 truncate w-full text-center">Booked: {{ topPlayers()[2].turfName }}</div>
 <div class="text-lg font-bold text-[#7b39fc] my-0.5">{{ topPlayers()[2].points }}</div>
 <div class="text-[9px] text-[var(--text-secondary)] mb-2 text-center leading-tight">Bookings</div>
 
 <div class="w-full px-1 py-1.5 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] rounded-lg flex flex-col items-center justify-center gap-1 shadow-inner">
 <svg class="w-3 h-3 text-yellow-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
 <div class="flex flex-col text-center leading-tight">
 <span class="text-yellow-500 font-bold text-[10px]">10% OFF</span>
 <span class="hidden text-[0.65rem] text-[var(--text-secondary)]">on any turf booking</span>
 </div>
 </div>
 </div>
 </div>

 <!-- List Section -->
 <div *ngIf="otherPlayers().length > 0" class="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-xl fade-in mx-4 relative">
 <div class="overflow-x-auto relative z-10">
 <table class="w-full text-left border-collapse min-w-[600px]">
 <thead>
 <tr class="text-xs font-bold text-[var(--text-secondary)] border-b border-[var(--border-color)] bg-[rgba(0,0,0,0.2)]">
 <th class="py-5 px-6 uppercase tracking-wider w-24">Rank</th>
 <th class="py-5 px-6 uppercase tracking-wider">Player</th>
 <th class="py-5 px-6 uppercase tracking-wider text-center">Total Bookings</th>
 <th class="py-5 px-6 uppercase tracking-wider text-right">Reward</th>
 </tr>
 </thead>
 <tbody>
 <tr *ngFor="let p of otherPlayers()" class="border-b border-[var(--border-color)] last:border-0 hover:bg-[rgba(255,255,255,0.02)] transition-colors group">
 <td class="py-4 px-6">
 <div class="flex items-center gap-3">
 <span class="text-xl font-bold text-[var(--text-secondary)] w-6 text-center">{{ p.rank }}</span>
 <svg *ngIf="p.trend === 'up'" class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 15l7-7 7 7"></path></svg>
 <svg *ngIf="p.trend === 'down'" class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"></path></svg>
 <svg *ngIf="p.trend === 'same'" class="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 12h14"></path></svg>
 </div>
 </td>
 <td class="py-4 px-6">
 <div class="flex items-center gap-4">
 <img [src]="p.avatar" class="w-12 h-12 rounded-full object-cover border-2 border-transparent group-hover:border-[var(--primary)] transition-all" />
 <div class="flex flex-col">
 <span class="font-bold text-[var(--text-primary)] text-base">{{ p.name }}</span>
 <span class="text-xs text-[var(--text-secondary)] opacity-80">Booked: {{ p.turfName }}</span>
 </div>
 </div>
 </td>
 <td class="py-4 px-6 text-center">
 <span class="font-extrabold text-[#7b39fc] text-lg">{{ p.points }}</span>
 </td>
 <td class="py-4 px-6 text-right">
 <div *ngIf="p.rank <= 7" class="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-[#a855f7]/30 bg-[#a855f7]/10 shadow-sm transition-all hover:bg-[#a855f7]/20">
 <svg class="w-4 h-4 text-[#a855f7]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
 <span class="text-[#a855f7] font-bold text-sm tracking-wide">5% OFF</span>
 </div>
 <div *ngIf="p.rank > 7" class="inline-flex items-center justify-center gap-2 px-4 py-2">
 <span class="text-[var(--text-secondary)] font-medium text-sm">Not Eligible</span>
 </div>
 </td>
 </tr>
 </tbody>
 </table>
 </div>
 
 <!-- Scroll indicator > -->
 <div class="absolute right-0 top-0 bottom-0 w-12 flex items-center justify-end pr-2 bg-gradient-to-l from-[var(--surface-color)] to-transparent pointer-events-none z-20">
 <svg class="w-5 h-5 text-[var(--text-secondary)] animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M9 5l7 7-7 7"></path></svg>
 </div>
 </div>

 </ng-container>

 </ng-container>

 <!-- Footer Info -->
 <div class="mt-4 text-center text-sm text-[var(--text-secondary)] flex flex-col items-center justify-center gap-2 mb-6">
 <svg class="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
 <span>Ranking is based on total number of bookings. Top 3 users get <span class="text-yellow-500 font-bold">10% OFF</span> and Top 4-7 get <span class="text-[#a855f7] font-bold">5% OFF</span> on any turf booking.</span>
 </div>

 </div>
 `,
 styles: [`
 .font-manrope {
 font-family: 'Manrope', sans-serif;
 }
 .fade-in {
 animation: fadeIn 0.8s ease-out forwards;
 }
 @keyframes fadeIn {
 from { opacity: 0; transform: translateY(10px); }
 to { opacity: 1; transform: translateY(0); }
 }
 
 /* Light theme adaptations if any */
 :host-context(body[data-theme="light"]) .bg-\\[rgba\\(0\\,0\\,0\\,0\\.2\\)\\] {
 background-color: rgba(0, 0, 0, 0.03);
 }
 :host-context(body[data-theme="light"]) .text-\\[var\\(--text-secondary\\)\\] {
 color: #64748b;
 }
 :host-context(body[data-theme="light"]) .border-\\[rgba\\(255\\,255\\,255\\,0\\.05\\)\\] {
 border-color: rgba(0,0,0,0.05);
 }
 :host-context(body[data-theme="light"]) .bg-\\[rgba\\(255\\,255\\,255\\,0\\.03\\)\\] {
 background-color: rgba(0,0,0,0.02);
 }
 
 @media (max-width: 768px) {
 .leaderboard-container { padding: 1rem 0.5rem !important; }
 .py-4 { padding-top: 1rem; padding-bottom: 1rem; }
 .mb-4 { margin-bottom: 1rem; }
 .mb-6 { margin-bottom: 1.5rem; }
 
 /* Table Adjustments */
 .min-w-\\[600px\\] { min-width: 100% !important; }
 th, td { padding: 0.5rem 0.25rem !important; }
 th { font-size: 0.65rem !important; letter-spacing: normal !important; }
 
 /* Player Info Adjustments */
 .text-base { font-size: 0.8rem !important; }
 .w-12 { width: 32px !important; height: 32px !important; }
 .text-xl { font-size: 0.85rem !important; }
 .text-lg { font-size: 0.85rem !important; }
 .gap-4 { gap: 0.5rem !important; }
 .gap-3 { gap: 0.25rem !important; }
 
 /* Reward Adjustments */
 td .inline-flex { padding: 0.25rem 0.5rem !important; gap: 0.25rem !important; }
 td .inline-flex span { font-size: 0.65rem !important; }
 td .inline-flex svg { width: 12px !important; height: 12px !important; }
 }
 `]
})
export class LeaderboardComponent implements OnInit {
 private http = inject(HttpClient);
 
 allPlayers = signal<Player[]>([]);
 isLoading = signal<boolean>(true);

 topPlayers = computed(() => this.allPlayers().slice(0, 3));
 otherPlayers = computed(() => this.allPlayers().slice(3));

 ngOnInit() {
 this.http.get<any>('https://turf-booking-backend-fixl.onrender.com/api/v1/Community/leaderboard').subscribe({
 next: (res: any) => {
 // Due to the unwrap-response interceptor, 'res' might already be the array of players (res.data)
 if (Array.isArray(res)) {
 this.allPlayers.set(res);
 } else if (res && res.success) {
 this.allPlayers.set(res.data || []);
 } else {
 this.allPlayers.set([]);
 }
 this.isLoading.set(false);
 },
 error: () => {
 console.error('Failed to load leaderboard data');
 this.isLoading.set(false);
 }
 });
 }
}
