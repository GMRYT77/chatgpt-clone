// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB0uLOil_d5_oer1ylx610ke8A0CsT_JPo",
  authDomain: "chatgpt-clone-e8726.firebaseapp.com",
  projectId: "chatgpt-clone-e8726",
  storageBucket: "chatgpt-clone-e8726.appspot.com",
  messagingSenderId: "154728019059",
  appId: "1:154728019059:web:91fd8af5f6b81caa69e606",
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
