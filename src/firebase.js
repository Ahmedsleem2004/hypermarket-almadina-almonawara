import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyANgXpZlBqG2sw4b8NcPaH6sB79x068Yts",
  authDomain: "hyper-marker.firebaseapp.com",
  projectId: "hyper-marker",
  storageBucket: "hyper-marker.firebasestorage.app",
  messagingSenderId: "609716405468",
  appId: "1:609716405468:web:09a5093b2cecf5a5796019",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;