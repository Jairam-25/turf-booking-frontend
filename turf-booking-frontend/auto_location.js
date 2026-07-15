const fs = require('fs');

const path = 'src/app/features/dashboard/dashboard.component.ts';
let code = fs.readFileSync(path, 'utf8');

// Add Geolocation import
if (!code.includes('@capacitor/geolocation')) {
  code = code.replace(
    "import { Component, OnInit, signal, OnDestroy } from '@angular/core';",
    "import { Component, OnInit, signal, OnDestroy } from '@angular/core';\nimport { Geolocation } from '@capacitor/geolocation';"
  );
}

// Add auto location logic in ngOnInit
const initIndex = code.indexOf('this.fcmService.listenForMessages();');
if (initIndex !== -1 && !code.includes('this.autoDetectLocation()')) {
  code = code.replace(
    'this.fcmService.listenForMessages();',
    `this.fcmService.listenForMessages();\n\n  // Auto detect location on fresh login/open\n  if (!sessionStorage.getItem('dashboard_locationStr')) {\n    this.autoDetectLocation();\n  }`
  );
}

// Add the autoDetectLocation method
if (!code.includes('async autoDetectLocation()')) {
  const methodInjectIndex = code.indexOf('navigateToLiked() {');
  const newMethod = `
  async autoDetectLocation() {
    try {
      // Prompt for permissions
      let perm = await Geolocation.checkPermissions();
      if (perm.location !== 'granted') {
        perm = await Geolocation.requestPermissions();
        if (perm.location !== 'granted') {
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
        const sMatch = this.availableStates().find(s => s.toLowerCase().includes(state?.toLowerCase() || '') || (state && state.toLowerCase().includes(s.toLowerCase())));
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
           // We use a dummy event, but we don't need it for selectLocation since event is mostly unused or we can pass null
           this.selectLocation(null as any, matchedState, matchedDistrict);
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
             sessionStorage.setItem('dashboard_locationStr', locStr);
             this.filterTurfs();
             this.notificationService.success(\`Location auto-detected: \${locStr}\`);
           }
        }
      }
    } catch (e) {
      console.error('Auto location detection failed:', e);
    }
  }

  `;
  
  code = code.slice(0, methodInjectIndex) + newMethod + code.slice(methodInjectIndex);
}

fs.writeFileSync(path, code);
console.log('Updated dashboard.component.ts');
