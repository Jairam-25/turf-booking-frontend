import { Injectable, inject } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FcmNotificationService {
  private http = inject(HttpClient);
  
  // The Firebase config provided by the user
  private firebaseConfig = {
    apiKey: "AIzaSyDUuQ0-cRMkWYzs1rd_W78FK8kqalZUXWA",
    authDomain: "turf-booking-a7f92.firebaseapp.com",
    projectId: "turf-booking-a7f92",
    storageBucket: "turf-booking-a7f92.firebasestorage.app",
    messagingSenderId: "765266220775",
    appId: "1:765266220775:web:7cf16c444b648c9537b442",
    measurementId: "G-WBHF995BMK"
  };

  private app = initializeApp(this.firebaseConfig);
  private messaging: any = null;

  constructor() {
    this.initMessaging();
  }

  private async initMessaging() {
    try {
      if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
        const supported = await isSupported();
        if (supported) {
          this.messaging = getMessaging(this.app);
        } else {
          console.warn('Firebase Messaging is not supported in this environment (likely due to insecure HTTP connection).');
        }
      }
    } catch (e) {
      console.warn('Firebase Messaging initialization failed:', e);
    }
  }

  /**
   * Request permission from the browser and get the FCM Token
   */
  async requestNotificationPermission() {
    if (!this.messaging) {
      console.warn('Skipping notification permission: Messaging not supported.');
      return;
    }
    
    try {
      console.log('Requesting notification permission...');
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        console.log('Notification permission granted.');
        
        // Get the token (Firebase uses the service worker 'firebase-messaging-sw.js' automatically)
        const token = await getToken(this.messaging);
        
        if (token) {
          console.log('🎉 Successfully retrieved FCM Token:', token);
          
          // Send this token to C# backend to save in the User's FcmToken column
          this.http.post('https://turf-booking-backend-fixl.onrender.com/api/v1/auth/update-fcm-token', { token: token }).subscribe({
            next: () => console.log('✅ FCM Token saved to database successfully!'),
            error: (err) => console.error('❌ Failed to save FCM Token to database', err)
          });
          
        } else {
          console.log('No registration token available. Request permission to generate one.');
        }
      } else {
        console.log('Notification permission denied by user.');
      }
    } catch (error) {
      console.error('Error getting FCM token:', error);
    }
  }

  /**
   * Listen for incoming messages while the app is open (Foreground)
   */
  listenForMessages() {
    if (!this.messaging) return;
    
    onMessage(this.messaging, (payload) => {
      console.log('🔔 Message received in foreground:', payload);
      
      // Force a system popup even when the website is open!
      if (payload.notification) {
        new Notification(payload.notification.title || 'Notification', {
          body: payload.notification.body,
          icon: '/favicon.ico'
        });
      }
    });
  }
}
