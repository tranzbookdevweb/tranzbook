import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBSTGTM0rFtRUnkAA2gWqQ7WvJkCosrErU",
  authDomain: "tranzbook-46969.firebaseapp.com",
  projectId: "tranzbook-46969",
  storageBucket: "tranzbook-46969.firebasestorage.app",
  messagingSenderId: "12769249706",
  appId: "1:12769249706:web:1857fbf648aa4f94aa03d3",
  measurementId: "G-3D1736CJ5B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);