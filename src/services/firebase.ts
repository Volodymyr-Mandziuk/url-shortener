import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAu-jyt5BPHAFArfg2v06SaYGACaLF8C0o",
  authDomain: "url-shortener-62866.firebaseapp.com",
  projectId: "url-shortener-62866",
  storageBucket: "url-shortener-62866.firebasestorage.app",
  messagingSenderId: "717379351308",
  appId: "1:717379351308:web:e412c08e0de9a960118f29",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);
