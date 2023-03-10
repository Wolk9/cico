// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCH6hD6EOpzgGjzHIoWGMVYApht4XDQCFg",
  authDomain: "cico-4d5b8.firebaseapp.com",
  projectId: "cico-4d5b8",
  storageBucket: "cico-4d5b8.appspot.com",
  messagingSenderId: "27761515023",
  appId: "1:27761515023:web:dac6e1b652bf96d2d6e17a",
  measurementId: "G-8DH19ZEBCV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);