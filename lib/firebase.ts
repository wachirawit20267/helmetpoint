import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCFKyk08aCP-rwga_eRK8X_54lGaNrJnuk",
  authDomain: "helmetpoint-18d0a.firebaseapp.com",
  projectId: "helmetpoint-18d0a",
  storageBucket: "helmetpoint-18d0a.firebasestorage.app",
  messagingSenderId: "856899203324",
  appId: "1:856899203324:web:82a17897226633add0e779",
  measurementId: "G-LRNZ6W9YCJ",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;