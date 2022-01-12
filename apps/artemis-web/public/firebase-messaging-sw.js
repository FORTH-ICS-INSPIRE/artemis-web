importScripts('https://www.gstatic.com/firebasejs/8.2.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.1/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyBpdFZRDzxDiznntPd",
    authDomain: "artemis-304609.firebaseapp.com",
    projectId: "artemis-304609",
    // storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: "1033505772898",
    appId: "1:1033505772898:web:c70a7e62a2b67ee4e8083b",
});
firebase.messaging();

//background notifications will be received here
firebase.messaging().setBackgroundMessageHandler((payload) => {
    const { title, body } = JSON.parse(payload.data.notification);
    var options = {
        body,
        icon: '/icons/launcher-icon-4x.png',
    };
    registration.showNotification(title, options);
});
