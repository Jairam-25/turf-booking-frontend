const fs = require('fs');

let prof = fs.readFileSync('src/app/features/profile/profile.html', 'utf8');

// The issue is around line 56-60:
// 56:         </div>
// 57: 
// 58:         
// 59: 
// 60:       <div class="bg-white dark:bg-[#121212] rounded-2xl p-2 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:border dark:border-white/5">
// Let's replace the empty space with `</div>`
prof = prof.replace(
  /<\/div>\s*<svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"><\/path><\/svg>\s*<\/div>\s*<div class="bg-white dark:bg-\[#121212\] rounded-2xl p-2 shadow-\[0_4px_20px_rgba\(0,0,0,0\.03\)\] dark:border dark:border-white\/5">/,
  '</div>\n          <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>\n        </div>\n      </div>\n\n      <div class="bg-white dark:bg-[#121212] rounded-2xl p-2 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:border dark:border-white/5">'
);

// And the issue at the end:
// 97:     </div>
// 98:       </div>
// 99:     </div>
// 100:   </ng-container>
prof = prof.replace(
  /<\/div>\s*<\/div>\s*<\/div>\s*<\/ng-container>/,
  '</div>\n  </ng-container>'
);

fs.writeFileSync('src/app/features/profile/profile.html', prof);
console.log('Fixed profile.html structure');
