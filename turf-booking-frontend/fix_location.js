const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/app/features/dashboard/dashboard.component.ts');
let content = fs.readFileSync(filePath, 'utf8');

const oldFunc = `  toggleLocationSelect() {
    this.isLocationSelectOpen.update(v => !v);
    if (!this.isLocationSelectOpen()) {
      // Reset view to states when closed
      setTimeout(() => this.viewingDistrictsForState.set(null), 300);
    }
  }`;

const newFunc = `  toggleLocationSelect() {
    if (this.selectedLocation() === 'Select Location' || this.selectedLocation() === 'All Locations') {
      this.notificationService.info('Detecting your location...');
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          fetch(\`https://nominatim.openstreetmap.org/reverse?format=json&lat=\${pos.coords.latitude}&lon=\${pos.coords.longitude}\`)
            .then(res => res.json())
            .then(data => {
              if (data && data.address) {
                const city = data.address.city || data.address.state_district || data.address.county;
                const state = data.address.state;
                const postcode = data.address.postcode || '';
                if (city) {
                  this.selectedLocation.set(\`\${city}, \${state} - \${postcode}\`);
                  this.notificationService.success('Location detected successfully!');
                  this.loadTurfs();
                } else {
                  this.isLocationSelectOpen.update(v => !v);
                }
              }
            })
            .catch(() => this.isLocationSelectOpen.update(v => !v));
        }, () => this.isLocationSelectOpen.update(v => !v), { timeout: 5000 });
        return;
      }
    }
    this.isLocationSelectOpen.update(v => !v);
    if (!this.isLocationSelectOpen()) {
      setTimeout(() => this.viewingDistrictsForState.set(null), 300);
    }
  }`;

content = content.replace(oldFunc, newFunc);
fs.writeFileSync(filePath, content);
console.log('Location fetch logic added.');
