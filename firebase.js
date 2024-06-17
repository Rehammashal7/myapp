// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile } from "firebase/auth";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { useState,useEffect } from "react";
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/compat/firestore';
import { getFirestore } from "firebase/firestore";
import { collection, getDocs } from 'firebase/firestore';



// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyASuGru62hK6n5D1d6J42wUxFn9WP4PVd4",
  authDomain: "atoz-fd758.firebaseapp.com",
  projectId: "atoz-fd758",
  storageBucket: "atoz-fd758.appspot.com",
  messagingSenderId: "243055050436",
  appId: "1:243055050436:web:126adf43a29d6950305391",
  measurementId: "G-MG32J1V30N"
};
// const firebaseConfig = {
//   apiKey: "AIzaSyCbW6TFYhnqZkdP8JpM4DOgE1EpWuaIgQc",
//   authDomain: "software-engineering-dcd78.firebaseapp.com",
//   projectId: "software-engineering-dcd78",
//   storageBucket: "software-engineering-dcd78.appspot.com",
//   messagingSenderId: "880271325840",
//   appId: "1:880271325840:web:f4c4934be1f8b7e45a3615"
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);
export {auth,db ,storage} ;

// export function useAuth() {
//   const [currentUser, setCurrentUser] = useState('');

//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, user => setCurrentUser(user));
//     return unsub;
//   }, [])

//   return currentUser;
// }

// export async function upload(file, currentUser, setLoading) {
//   const fileRef = ref(storage, currentUser.uid + '.png');

//   setLoading(true);
  
//   const snapshot = await uploadBytes(fileRef, file);
//   const photoURL = await getDownloadURL(fileRef);

//   updateProfile(currentUser, {photoURL});
  
//   setLoading(false);
//   alert("Uploaded file!");
// }
