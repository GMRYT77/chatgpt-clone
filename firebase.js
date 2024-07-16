// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD3REtq_8sazM2qPmo8WeDjagd8mWqZneg",
  authDomain: "chatgpt-clone-2.firebaseapp.com",
  projectId: "chatgpt-clone-2",
  storageBucket: "chatgpt-clone-2.appspot.com",
  messagingSenderId: "476072958217",
  appId: "1:476072958217:web:0458a7a17334ac6dc31bd8",
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
