// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDNn5UTOItneEQ4zzCZ9ONV7f7LTXD_47M",
  authDomain: "crud-app-lesson.firebaseapp.com",
  projectId: "crud-app-lesson",
  storageBucket: "crud-app-lesson.appspot.com",
  messagingSenderId: "998755751103",
  appId: "1:998755751103:web:73805bffc373fd9f91e20a",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();

export { app, db };
