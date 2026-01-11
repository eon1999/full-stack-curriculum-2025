// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD3AMXtct5AqCfbWRTqG3OJj3dlDn1NRcc",
  authDomain: "tpeo-todo-app-f2036.firebaseapp.com",
  projectId: "tpeo-todo-app-f2036",
  storageBucket: "tpeo-todo-app-f2036.firebasestorage.app",
  messagingSenderId: "19197085472",
  appId: "1:19197085472:web:5f8c7486a3e7a643e4b945",
  measurementId: "G-XQF9T6EREX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
