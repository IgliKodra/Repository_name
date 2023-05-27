/* eslint-disable quotes */
/* eslint-disable prettier/prettier */

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBgazEXTVvoRbYaeferyc3Gxj-4yn2IMXU",
  authDomain: "final3-fd799.firebaseapp.com",
  databaseURL: "https://final3-fd799-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "final3-fd799",
  storageBucket: "final3-fd799.appspot.com",
  messagingSenderId: "285988037829",
  appId: "1:285988037829:web:1774027444159e8f3cbcac"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;