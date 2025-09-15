import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAfA2SbAQ2C3fvJ98RA_xwVQqEhLWbp0Ck",
  authDomain: "biblioteca-pessoal-48d45.firebaseapp.com",
  projectId: "biblioteca-pessoal-48d45",
  storageBucket: "biblioteca-pessoal-48d45.firebasestorage.app",
  messagingSenderId: "962907834018",
  appId: "1:962907834018:web:0b625d7388897ad63a39fb"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
