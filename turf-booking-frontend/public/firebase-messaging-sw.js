importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
const firebaseConfig = {
  apiKey: "AIzaSyDUuQ0-cRMkWYzs1rd_W78FK8kqalZUXWA",
  authDomain: "turf-booking-a7f92.firebaseapp.com",
  projectId: "turf-booking-a7f92",
  storageBucket: "turf-booking-a7f92.firebasestorage.app",
  messagingSenderId: "765266220775",
  appId: "1:765266220775:web:7cf16c444b648c9537b442",
  measurementId: "G-WBHF995BMK"
};

firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/favicon.ico'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
