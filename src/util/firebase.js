// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {doc, getFirestore, updateDoc} from "firebase/firestore";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyBMWK6RRpur4zVO7eVQKqYH9kubeD7M-9g",
  authDomain: "siddhi-stockanalysis-project.firebaseapp.com",
  projectId: "siddhi-stockanalysis-project",
  storageBucket: "siddhi-stockanalysis-project.appspot.com",
  messagingSenderId: "732895979509",
  appId: "1:732895979509:web:35396db1fa174551df62bc",
  measurementId: "G-HEYE80YVEF"
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

