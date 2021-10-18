import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey:"AIzaSyCaEkyIJUXlm8z0sbyoJPtVWIxQJydhxgg",
  authDomain: "desafio2-f8e86.firebaseapp.com",
  projectId: "desafio2-f8e86",
  storageBucket: "desafio2-f8e86.appspot.com",
  messagingSenderId: "632932757271",
  appId: "1:632932757271:web:0f813a5051673b30a41152"
};

// Initialize Firebase
export const appFire = initializeApp(firebaseConfig);
//BD
export const dbFire = getFirestore(appFire);