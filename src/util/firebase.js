// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {doc, getFirestore, updateDoc} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyApYUphwYsaxgYIZkufcm9Z8W8bbzSR1vI",//
  authDomain: "vizproject-7703a.firebaseapp.comm", //
  projectId: "vizproject-7703a",//
  storageBucket: "vizproject-7703a.appspot.com",
  messagingSenderId: "294788256803", //
  appId: "1:294788256803:web:e846a75a362ed00b558d96",
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