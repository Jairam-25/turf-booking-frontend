const fs = require('fs');
const path = 'src/app/features/dashboard/dashboard.component.ts';
let content = fs.readFileSync(path, 'utf8');

// Replace the autoDetectLocation method to include proper fallback handling and toast notifications for manual triggers.
content = content.replace(
  /async autoDetectLocation\(manualTrigger = false\) \{[\s\S]*?\}\s*catch\s*\(e\)\s*\{[\s\S]*?\}\s*\}/,
  `async autoDetectLocation(manualTrigger = false) {
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
      const res = await fetch(\`https://nominatim.openstreetmap.org/reverse?format=json&lat=\${lat}&lon=\${lon}\`);
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
           this.notificationService.success(\`Location auto-detected: \${matchedDistrict || matchedState}\`);
        } else {
           // Fallback to setting exact string if exact match isn't found
           let locStr = '';
           if (district && state) locStr = \`\${district}, \${state}\`;
           else if (state) locStr = state;
           else if (district) locStr = district;
           
           if (locStr) {
             this.selectedLocation.set(locStr);
             this.selectedState.set(state || '');
             this.selectedDistrict.set(district || '');
             this.isLocationSelectOpen.set(false);
             this.loadTurfs();
             this.notificationService.success(\`Location set to: \${locStr}\`);
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
  }`
);

fs.writeFileSync(path, content);
console.log('Successfully updated autoDetectLocation logic!');
