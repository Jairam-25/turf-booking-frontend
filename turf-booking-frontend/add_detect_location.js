const fs = require('fs');
const path = 'src/app/features/dashboard/dashboard.component.ts';
let content = fs.readFileSync(path, 'utf8');

// Update autoDetectLocation signature and add success toast for manual trigger
content = content.replace(
  'async autoDetectLocation() {',
  `async autoDetectLocation(manualTrigger = false) {
    if (manualTrigger) {
      this.notificationService.success('Detecting your location...');
    }`
);

// If no match was found, alert the user if it was a manual trigger
content = content.replace(
  `        if (matchedState || matchedDistrict) {
           // We use a dummy event, but we don't need it for selectLocation since event is mostly unused or we can pass null
           this.selectLocation(null as any, matchedState, matchedDistrict);
           this.notificationService.success(\`Location auto-detected: \${matchedDistrict || matchedState}\`);
        }
      }
    } catch (e) {`,
  `        if (matchedState || matchedDistrict) {
           // We use a dummy event, but we don't need it for selectLocation since event is mostly unused or we can pass null
           this.selectLocation(null as any, matchedState, matchedDistrict);
           this.notificationService.success(\`Location auto-detected: \${matchedDistrict || matchedState}\`);
        } else if (manualTrigger) {
           this.notificationService.error('Location found, but no turfs available in your area.');
        }
      } else if (manualTrigger) {
        this.notificationService.error('Could not determine your state or district from location.');
      }
    } catch (e) {
      if (manualTrigger) {
        this.notificationService.error('Failed to get location. Please enable location services.');
      }`
);

// Add the Detect My Location button to the location select modal
const detectBtn = `          <ng-container *ngIf="!viewingDistrictsForState()">
            <div class="py-3 px-4 rounded-xl bg-[#7b39fc]/10 border border-[#7b39fc]/30 text-[#7b39fc] mb-3 cursor-pointer hover:bg-[#7b39fc]/20 transition-colors flex items-center justify-center gap-2" (click)="autoDetectLocation(true)">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <span class="font-bold text-base">Detect My Location</span>
            </div>
`;

content = content.replace('          <ng-container *ngIf="!viewingDistrictsForState()">', detectBtn);

fs.writeFileSync(path, content);
console.log('Added manual detect location button and updated logic');
