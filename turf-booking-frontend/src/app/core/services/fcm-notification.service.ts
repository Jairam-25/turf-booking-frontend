import { Injectable, inject } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';
import { HttpClient } from '@angular/common/http';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { NotificationService } from './notification.service';

@Injectable({
 providedIn: 'root'
})
export class FcmNotificationService {
 private http = inject(HttpClient);
 private notificationService = inject(NotificationService);
 
 // The Firebase config provided by the user (Used for Web only)
 private firebaseConfig = {
 apiKey:"AIzaSyDUuQ0-cRMkWYzs1rd_W78FK8kqalZUXWA",
 authDomain:"turf-booking-a7f92.firebaseapp.com",
 projectId:"turf-booking-a7f92",
 storageBucket:"turf-booking-a7f92.firebasestorage.app",
 messagingSenderId:"765266220775",
 appId:"1:765266220775:web:7cf16c444b648c9537b442",
 measurementId:"G-WBHF995BMK"
 };

 private app = initializeApp(this.firebaseConfig);
 private messaging: any = null;

 constructor() {
   if (!Capacitor.isNativePlatform()) {
     this.initMessaging();
   }
 }

 private async initMessaging() {
   try {
     if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
       const supported = await isSupported();
       if (supported) {
         this.messaging = getMessaging(this.app);
       }
     }
   } catch (e) {
     // Firebase Messaging initialization failed
   }
 }

 /**
 * Request permission from the browser/device and get the FCM Token
 */
 async requestNotificationPermission() {
   if (Capacitor.isNativePlatform()) {
     // CAPACITOR (ANDROID/IOS) PUSH NOTIFICATION SETUP
     try {
       // Request permission to use push notifications
       let permStatus = await PushNotifications.checkPermissions();
       
       if (permStatus.receive === 'prompt') {
         permStatus = await PushNotifications.requestPermissions();
       }

       if (permStatus.receive !== 'granted') {
         return; // User denied permission
       }

       // Register with Apple / Google to receive push via APNS/FCM
       await PushNotifications.register();
       
       // Add registration listener to send token to backend
       PushNotifications.addListener('registration', (token) => {
         this.http.post('https://turf-booking-backend-fixl.onrender.com/api/v1/auth/update-fcm-token', { token: token.value }).subscribe({
           next: () => {},
           error: (err) => {}
         });
       });

       PushNotifications.addListener('registrationError', (error: any) => {
         console.error('Error on registration: ' + JSON.stringify(error));
       });

     } catch (e) {
       console.error("Capacitor Push Notifications error: ", e);
     }
   } else {
     // WEB BROWSER PUSH NOTIFICATION SETUP
     if (!this.messaging) return;
     
     try {
       const permission = await Notification.requestPermission();
       if (permission === 'granted') {
         const token = await getToken(this.messaging);
         if (token) {
           this.http.post('https://turf-booking-backend-fixl.onrender.com/api/v1/auth/update-fcm-token', { token: token }).subscribe({
             next: () => {},
             error: (err) => {}
           });
         }
       }
     } catch (error) {
       // Error getting FCM token
     }
   }
 }

 /**
 * Listen for incoming messages while the app is open (Foreground)
 */
 listenForMessages() {
   if (Capacitor.isNativePlatform()) {
     // CAPACITOR FOREGROUND NOTIFICATION LISTENER
     PushNotifications.addListener('pushNotificationReceived', (notification) => {
       // Show in-app toast for foreground notifications
       if (notification.title && notification.body) {
         this.notificationService.show(
           `${notification.title}: ${notification.body}`, 
           'info'
         );
       }
     });

     // Action performed when notification is tapped
     PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
       // Handle notification click if needed (e.g. routing to booking details)
     });
   } else {
     // WEB BROWSER FOREGROUND NOTIFICATION LISTENER
     if (!this.messaging) return;
     
     onMessage(this.messaging, (payload) => {
       if (payload.notification) {
         new Notification(payload.notification.title || 'Notification', {
           body: payload.notification.body,
           icon: '/favicon.ico'
         });
       }
     });
   }
 }
}
