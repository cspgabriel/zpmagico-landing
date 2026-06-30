import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBhhHLRAz45UD1PfKrs8eqrZwIrDgCdUDs",
  authDomain: "agenciar-10ebd.firebaseapp.com",
  projectId: "agenciar-10ebd",
  storageBucket: "agenciar-10ebd.firebasestorage.app",
  messagingSenderId: "261848314250",
  appId: "1:261848314250:web:e058bfc7a44610a2b19873",
  measurementId: "G-N8LPJRGXVW",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

if (typeof window !== "undefined") {
  isSupported().then((yes) => yes && getAnalytics(app));
}

export { app, auth, googleProvider };
