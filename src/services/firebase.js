import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD_-ucXuiYTo3VfslEIx1ZRML0hFrnuc9k",
  authDomain: "movies-9c520.firebaseapp.com",
  projectId: "movies-9c520",
  storageBucket: "movies-9c520.firebasestorage.app",
  messagingSenderId: "803543336886",
  appId: "1:803543336886:web:bea669a31b80294308a317"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export const loginWithGoogle = () => signInWithPopup(auth, googleProvider);
export const loginWithEmail = (email, password) => signInWithEmailAndPassword(auth, email, password);
export const registerWithEmail = (email, password) => createUserWithEmailAndPassword(auth, email, password);
export const logout = () => signOut(auth);
