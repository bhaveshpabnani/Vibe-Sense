
import { getAuth, GoogleAuthProvider, GithubAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDinQzbjU-D51WNHwDoYPjrZDWoaYuHu1g",
  authDomain: "vibe-converse.firebaseapp.com",
  projectId: "vibe-converse",
  storageBucket: "vibe-converse.firebasestorage.app",
  messagingSenderId: "775420384976",
  appId: "1:775420384976:web:582af6e4c5a6faa37f70d5",
  measurementId: "G-L88T28EW8L"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();
export const emailAuth = {
  signIn: (email: string, password: string) => signInWithEmailAndPassword(auth, email, password),
  signUp: (email: string, password: string) => createUserWithEmailAndPassword(auth, email, password)
};