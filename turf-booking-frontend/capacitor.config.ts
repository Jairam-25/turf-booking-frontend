import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.turfxpert.app',
  appName: 'TurfXpert',
  webDir: 'dist/turf-booking-frontend/browser'
,
  plugins: {
    SplashScreen: {
      backgroundColor: "#0f172a",
      launchAutoHide: false,
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true
    }
  }
};

export default config;
