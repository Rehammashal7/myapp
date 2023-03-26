// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCbW6TFYhnqZkdP8JpM4DOgE1EpWuaIgQc",
  authDomain: "software-engineering-dcd78.firebaseapp.com",
  projectId: "software-engineering-dcd78",
  storageBucket: "software-engineering-dcd78.appspot.com",
  messagingSenderId: "880271325840",
  appId: "1:880271325840:web:f4c4934be1f8b7e45a3615"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export default auth