// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {doc, getFirestore, updateDoc} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDkqzrsOEUrCqKAXnJVZt33KsfKHaLBxc8",
  authDomain: "userstudy-dissertation.firebaseapp.com",
  projectId: "userstudy-dissertation",
  storageBucket: "userstudy-dissertation.appspot.com",
  messagingSenderId: "756526932550",
  appId: "1:756526932550:web:4876ad542aa89afceae047"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export const updateUser = async ({ uid, ...data }) => {
  const userDocRef = doc(db, 'users', uid);
  await updateDoc(userDocRef, data);
  console.log(`Updated user! ${uid}`);
}