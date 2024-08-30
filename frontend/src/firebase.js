// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-travel-page.firebaseapp.com",
  projectId: "mern-travel-page",
  storageBucket: "mern-travel-page.appspot.com",
  messagingSenderId: "786680856996",
  appId: "1:786680856996:web:520b9804255caed6634131"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

