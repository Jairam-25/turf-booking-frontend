const fs = require('fs');
let content = fs.readFileSync('src/app/layout/navbar/navbar.component.html', 'utf8');

const targetStr = `<div class="flex items-center gap-3 px-2">
  <button class="relative flex items-center justify-center w-12 h-12 rounded-full border border-[var(--border-color)] bg-[var(--surface-color)] hover:bg-[var(--background-color)] transition-colors overflow-hidden group">
  <img *ngIf="getProfilePictureUrl() && !profileImageError" [src]="getProfilePictureUrl()" alt="Profile" class="w-full h-full object-cover" (error)="profileImageError = true">
  <div *ngIf="!getProfilePictureUrl() || profileImageError" class="w-full h-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
  {{ authStore.user()?.name?.charAt(0) || 'U' }}
  </div>
  
  <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
  </button>
  <div class="flex flex-col">
  <span class="text-sm mobile-drawer-icon">Signed in as</span>
  <strong class="text-sm">{{ authStore.user()?.name }}</strong>
  </div>
  </div>`;

// Since line endings may vary, we'll replace using regex targeting the block
const regex = /<div class="flex items-center gap-3 px-2">[\s\S]*?<strong class="text-sm">\{\{ authStore\.user\(\)\?\.name \}\}<\/strong>\s*<\/div>\s*<\/div>/g;

const replacement = `<div class="flex items-center gap-3 px-2 mb-2">
  <button class="relative flex items-center justify-center w-14 h-14 rounded-full border border-[#7b39fc]/30 bg-[var(--surface-color)] hover:bg-[var(--background-color)] transition-colors overflow-hidden group shadow-[0_0_15px_rgba(123,57,252,0.15)]">
  <img *ngIf="getProfilePictureUrl() && !profileImageError" [src]="getProfilePictureUrl()" alt="Profile" class="w-full h-full object-cover" (error)="profileImageError = true">
  <div *ngIf="!getProfilePictureUrl() || profileImageError" class="w-full h-full bg-gradient-to-br from-[#7b39fc] to-[#38bdf8] flex items-center justify-center text-white font-bold text-xl">
  {{ authStore.user()?.name?.charAt(0) || 'U' }}
  </div>
  <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
  </button>
  <div class="flex flex-col">
  <strong class="text-base font-extrabold text-white">{{ authStore.user()?.name }}</strong>
  <span class="text-xs bg-[#7b39fc]/20 text-[#a78bfa] font-bold px-2.5 py-0.5 rounded-full mt-1 w-fit border border-[#7b39fc]/30">{{ authStore.user()?.role || 'Player' }}</span>
  </div>
  </div>`;

content = content.replace(regex, replacement);
fs.writeFileSync('src/app/layout/navbar/navbar.component.html', content, 'utf8');
