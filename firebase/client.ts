// Import the functions you need from the SDKs you need
import {getApp, getApps, initializeApp} from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCXxFaQP2zczSPeyoURPczQXif36mzQyQ4",
    authDomain: "ai-job-interview-3c481.firebaseapp.com",
    projectId: "ai-job-interview-3c481",
    storageBucket: "ai-job-interview-3c481.firebasestorage.app",
    messagingSenderId: "268184808399",
    appId: "1:268184808399:web:c4bfcca34387c930fbc0ba",
    measurementId: "G-DNS34PJRTN"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);