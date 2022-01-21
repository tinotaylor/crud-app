// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR KEY HERE",
  authDomain: "YOUR KEY HERE",
  projectId: "YOUR KEY HERE",
  storageBucket: "YOUR KEY HERE",
  messagingSenderId: "YOUR KEY HERE",
  appId: "YOUR KEY HERE"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();

export { app, db };
