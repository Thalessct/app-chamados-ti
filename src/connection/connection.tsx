// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDzNP2d0xmE2y5-37nEFiSkU2D0i2u03Us",
  authDomain: "chamados-ti-c7a63.firebaseapp.com",
  projectId: "chamados-ti-c7a63",
  storageBucket: "chamados-ti-c7a63.firebasestorage.app",
  messagingSenderId: "472984153618",
  appId: "1:472984153618:web:bba1992e15567ff253b2cb",
  measurementId: "G-7Y0S46W4RT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);