import { initializeApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBgFLPgG47Xaydte_pA_qkvWteGF4vHEWI",
  authDomain: "salloniim.firebaseapp.com",
  projectId: "salloniim",
  storageBucket: "salloniim.firebasestorage.app",
  messagingSenderId: "914467823403",
  appId: "1:914467823403:web:b66cb37001d3180eba2f6e"
};

let db: Firestore | null = null;

try {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Firebase initialization failed:", error);
}

export { db };
