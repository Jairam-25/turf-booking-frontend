import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Player {
  id: string;
  name: string;
  avatar: string;
  points: number;
  badges: string[];
  rank: number;
  trend: 'up' | 'down' | 'same';
}

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="leaderboard-container container-fluid spacing-vertical-24 fade-in">
      
      <!-- Header -->
      <div class="navigation-bar">
        <button class="btn-back" routerLink="/dashboard">
          <svg title="Back" class="back-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Book Turf
        </button>
      </div>

      <header class="leaderboard-hero glass">
        <div class="glow-blob -top-20 -left-20"></div>
        <div class="glow-blob bottom-[-150px] right-[-150px]" style="background: radial-gradient(circle, #f59e0b 0%, transparent 70%);"></div>
        
        <div class="hero-content">
          <span class="hero-badge">COMMUNITY</span>
          <h1>Hall of Fame</h1>
          <p>Compete with local players, earn badges for your bookings, and climb the ranks!</p>
        </div>
      </header>

      <!-- Tabs -->
      <div class="category-tabs">
        <button 
          class="tab-btn glass" 
          [class.active]="selectedTab() === 'Global'"
          (click)="selectedTab.set('Global')"
        >Global Rank</button>
        <button 
          class="tab-btn glass" 
          [class.active]="selectedTab() === 'Friends'"
          (click)="selectedTab.set('Friends')"
        >My Friends</button>
      </div>

      <!-- Top 3 Podium -->
      <div class="podium-section">
        <!-- Second Place -->
        <div class="podium-item second">
          <div class="avatar-wrap">
            <img [src]="topPlayers[1].avatar" alt="Avatar">
            <div class="rank-badge silver">2</div>
          </div>
          <span class="player-name">{{ topPlayers[1].name }}</span>
          <span class="player-points">{{ topPlayers[1].points }} pts</span>
        </div>
        
        <!-- First Place -->
        <div class="podium-item first">
          <div class="avatar-wrap">
            <div class="crown">👑</div>
            <img [src]="topPlayers[0].avatar" alt="Avatar">
            <div class="rank-badge gold">1</div>
          </div>
          <span class="player-name">{{ topPlayers[0].name }}</span>
          <span class="player-points">{{ topPlayers[0].points }} pts</span>
        </div>
        
        <!-- Third Place -->
        <div class="podium-item third">
          <div class="avatar-wrap">
            <img [src]="topPlayers[2].avatar" alt="Avatar">
            <div class="rank-badge bronze">3</div>
          </div>
          <span class="player-name">{{ topPlayers[2].name }}</span>
          <span class="player-points">{{ topPlayers[2].points }} pts</span>
        </div>
      </div>

      <!-- List -->
      <div class="leaderboard-list glass">
        <div class="list-header">
          <span>Rank</span>
          <span>Player</span>
          <span>Badges</span>
          <span>Points</span>
        </div>
        
        <div class="list-row" *ngFor="let p of otherPlayers">
          <div class="rank-col">
            <span class="rank-num">{{ p.rank }}</span>
            <span class="trend" [class]="p.trend">
              <svg title="Action" *ngIf="p.trend === 'up'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" /></svg>
              <svg title="Action" *ngIf="p.trend === 'down'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
              <svg title="Action" *ngIf="p.trend === 'same'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15" /></svg>
            </span>
          </div>
          
          <div class="player-col">
            <img [src]="p.avatar" alt="avatar" class="sm-avatar">
            <span class="name">{{ p.name }}</span>
          </div>
          
          <div class="badges-col">
            <span class="badge" *ngFor="let b of p.badges" [title]="b">
              {{ getBadgeIcon(b) }}
            </span>
          </div>
          
          <div class="points-col">
            {{ p.points }}
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .leaderboard-container {
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 2.5rem;
      font-family: 'Manrope', sans-serif;
    }
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

    .leaderboard-hero {
      position: relative;
      padding: 4rem 2rem;
      border-radius: 24px;
      text-align: center;
      overflow: hidden;
      background: linear-gradient(135deg, rgba(31, 41, 55, 0.45) 0%, rgba(12, 10, 20, 0.8) 100%);
    }
    .glow-blob {
      position: absolute;
      width: 300px;
      height: 300px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(123, 57, 252, 0.15) 0%, transparent 70%);
      pointer-events: none;
    }
    .hero-content {
      position: relative;
      z-index: 10;
    }
    .hero-badge {
      font-size: 0.75rem;
      font-weight: 800;
      letter-spacing: 0.2em;
      color: #f59e0b;
      background: rgba(245, 158, 11, 0.1);
      padding: 6px 16px;
      border-radius: 20px;
      border: 1px solid rgba(245, 158, 11, 0.25);
    }
    .hero-content h1 {
      font-size: clamp(2rem, 5vw, 3rem);
      font-weight: 850;
      margin: 1rem 0;
      color: var(--text-primary);
    }
    .hero-content p {
      color: var(--text-secondary);
      font-size: 1.1rem;
      max-width: 500px;
      margin: 0 auto;
    }

    .category-tabs {
      display: flex;
      justify-content: center;
      gap: 12px;
    }
    .tab-btn {
      padding: 10px 24px;
      border-radius: 12px;
      font-weight: 700;
      font-size: 0.95rem;
      cursor: pointer;
      color: var(--text-secondary);
      background: rgba(255,255,255,0.01);
      transition: var(--transition-smooth);
      border-color: var(--border-color);
    }
    .tab-btn:hover {
      border-color: var(--primary);
      color: var(--text-primary);
    }
    .tab-btn.active {
      background: var(--primary);
      color: var(--on-primary);
      border-color: var(--primary);
    }

    .podium-section {
      display: flex;
      justify-content: center;
      align-items: flex-end;
      gap: 1.5rem;
      margin: 2rem 0;
      min-height: 220px;
    }
    .podium-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }
    .podium-item.second { margin-bottom: 20px; }
    .podium-item.first { margin-bottom: 50px; z-index: 10; }
    .podium-item.third { margin-bottom: 0px; }
    
    .avatar-wrap {
      position: relative;
    }
    .avatar-wrap img {
      border-radius: 50%;
      object-fit: cover;
      border: 4px solid var(--border-color);
    }
    .first .avatar-wrap img { width: 100px; height: 100px; border-color: #f59e0b; box-shadow: 0 0 30px rgba(245, 158, 11, 0.4); }
    .second .avatar-wrap img { width: 80px; height: 80px; border-color: #94a3b8; }
    .third .avatar-wrap img { width: 70px; height: 70px; border-color: #b45309; }
    
    .crown {
      position: absolute;
      top: -24px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 2rem;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
    }
    
    .rank-badge {
      position: absolute;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      color: white;
      font-size: 0.85rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    }
    .rank-badge.gold { background: #f59e0b; width: 34px; height: 34px; font-size: 1rem; }
    .rank-badge.silver { background: #94a3b8; }
    .rank-badge.bronze { background: #b45309; }
    
    .player-name {
      font-weight: 800;
      font-size: 1.1rem;
      color: var(--text-primary);
    }
    .player-points {
      font-size: 0.9rem;
      color: var(--text-secondary);
      font-weight: 600;
    }

    .leaderboard-list {
      border-radius: 20px;
      padding: 1rem;
      display: flex;
      flex-direction: column;
    }
    .list-header {
      display: grid;
      grid-template-columns: 80px 2fr 1fr 100px;
      padding: 1rem;
      border-bottom: 1px solid var(--border-color);
      color: var(--text-secondary);
      font-weight: 700;
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .list-row {
      display: grid;
      grid-template-columns: 80px 2fr 1fr 100px;
      padding: 1rem;
      align-items: center;
      border-bottom: 1px solid rgba(255,255,255,0.03);
      transition: var(--transition-smooth);
      border-radius: 12px;
    }
    .list-row:hover {
      background: rgba(255,255,255,0.02);
    }
    .list-row:last-child {
      border-bottom: none;
    }
    
    .rank-col {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .rank-num {
      font-weight: 800;
      font-size: 1.1rem;
      color: var(--text-secondary);
      width: 20px;
    }
    .trend { width: 16px; height: 16px; }
    .trend.up { color: #10b981; }
    .trend.down { color: #ef4444; }
    .trend.same { color: #64748b; }
    
    .player-col {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .sm-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
    }
    .name {
      font-weight: 700;
      color: var(--text-primary);
    }
    
    .badges-col {
      display: flex;
      gap: 6px;
    }
    .badge {
      font-size: 1.25rem;
      cursor: help;
      transition: transform 0.2s;
    }
    .badge:hover {
      transform: scale(1.2);
    }
    
    .points-col {
      font-weight: 800;
      color: var(--primary);
    }

    @media (max-width: 768px) {
      .leaderboard-container { padding: 1rem; gap: 1.5rem; }
      .leaderboard-hero { padding: 3rem 1.5rem; }
      .podium-section { gap: 0.5rem; }
      .first .avatar-wrap img { width: 80px; height: 80px; }
      .second .avatar-wrap img, .third .avatar-wrap img { width: 60px; height: 60px; }
      .list-header { display: none; } /* Hide headers on mobile */
      .list-row {
        grid-template-columns: 50px 1fr 60px;
        gap: 8px;
        padding: 1rem 0.5rem;
      }
      .badges-col { display: none; } /* Hide badges on mobile row to save space */
    }
    
    /* Light theme adaptions */
    :host-context(body[data-theme="light"]) .leaderboard-hero {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(241, 245, 249, 0.95) 100%);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
      border: 1px solid rgba(0, 0, 0, 0.06);
    }
    :host-context(body[data-theme="light"]) .tab-btn {
      background: rgba(0,0,0,0.03);
      border-color: rgba(0,0,0,0.06);
      color: var(--text-primary);
    }
    :host-context(body[data-theme="light"]) .tab-btn.active {
      background: var(--primary) !important;
      color: var(--on-primary) !important;
      border-color: var(--primary) !important;
    }
    :host-context(body[data-theme="light"]) .list-row {
      border-bottom-color: rgba(0,0,0,0.05);
    }
    :host-context(body[data-theme="light"]) .list-row:hover {
      background: rgba(0,0,0,0.02);
    }
  `]
})
export class LeaderboardComponent {
  selectedTab = signal<'Global' | 'Friends'>('Global');

  allPlayers: Player[] = [
    { id: '1', name: 'Alex Johnson', avatar: 'https://i.pravatar.cc/150?u=1', points: 12450, badges: ['Early Bird', 'Weekend Warrior', 'Night Owl'], rank: 1, trend: 'same' },
    { id: '2', name: 'Sam Rivera', avatar: 'https://i.pravatar.cc/150?u=2', points: 11200, badges: ['First Time', 'Hat Trick'], rank: 2, trend: 'up' },
    { id: '3', name: 'Michael Chen', avatar: 'https://i.pravatar.cc/150?u=3', points: 10850, badges: ['Weekend Warrior'], rank: 3, trend: 'down' },
    { id: '4', name: 'David Smith', avatar: 'https://i.pravatar.cc/150?u=4', points: 9400, badges: ['Night Owl'], rank: 4, trend: 'up' },
    { id: '5', name: 'Chris Evans', avatar: 'https://i.pravatar.cc/150?u=5', points: 8900, badges: [], rank: 5, trend: 'down' },
    { id: '6', name: 'Sarah Connor', avatar: 'https://i.pravatar.cc/150?u=6', points: 8200, badges: ['Hat Trick'], rank: 6, trend: 'same' },
    { id: '7', name: 'Tom Hardy', avatar: 'https://i.pravatar.cc/150?u=7', points: 7600, badges: ['Early Bird'], rank: 7, trend: 'up' },
  ];

  get topPlayers() {
    return this.allPlayers.slice(0, 3);
  }

  get otherPlayers() {
    return this.allPlayers.slice(3);
  }

  getBadgeIcon(badge: string): string {
    switch (badge) {
      case 'Early Bird': return '🌅';
      case 'Weekend Warrior': return '⚔️';
      case 'Night Owl': return '🦉';
      case 'First Time': return '🔰';
      case 'Hat Trick': return '⚽';
      default: return '🏅';
    }
  }
}
