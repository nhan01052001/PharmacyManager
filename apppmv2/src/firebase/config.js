import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBvyeRsQUGMFsjV7800vK8Hb7zKcfd2_EE",
  authDomain: "sura-chat-86708.firebaseapp.com",
  projectId: "sura-chat-86708",
  storageBucket: "sura-chat-86708.appspot.com",
  messagingSenderId: "992525331566",
  appId: "1:992525331566:web:10dbf7701df5233ee34a7f",
  measurementId: "G-P2SXT8ZSWP",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };
