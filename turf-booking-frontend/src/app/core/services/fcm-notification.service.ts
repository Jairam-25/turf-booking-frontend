import { Injectable, inject } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
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
  private messaging = getMessaging(this.app);

  /**
   * Request permission from the browser and get the FCM Token
   */
  async requestNotificationPermission() {
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
          this.http.post('https://localhost:7273/api/v1/auth/update-fcm-token', { token: token }).subscribe({
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
