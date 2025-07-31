// 🔥 Firebase core
import { initializeApp, getApps, getApp } from "firebase/app";
// 🗂️ Firestore (veritabanı)
import { getFirestore } from "firebase/firestore";

// ✅ Firebase config (seninle birebir)
const firebaseConfig = {
  apiKey: "AIzaSyCl1XwLQcwaJ-ah5r7ur1ixw1kimK-TDSU",
  authDomain: "hospitalsonmap-4e8fd.firebaseapp.com",
  projectId: "hospitalsonmap-4e8fd",
  storageBucket: "hospitalsonmap-4e8fd.firebasestorage.app",
  messagingSenderId: "540764153742",
  appId: "1:540764153742:web:8927b561c17b4cc3f726df",
  measurementId: "G-KDZ19GM950"
};

// 💡 Uygulama daha önce başlatıldıysa tekrar başlatma
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// ✅ Firestore instance
const db = getFirestore(app);

export { db };