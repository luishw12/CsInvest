import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCDY4mU6DYJGkUkk3OwgnlkdgoL-ESCpDE",
  authDomain: "csinvest-d57b0.firebaseapp.com",
  projectId: "csinvest-d57b0",
  storageBucket: "csinvest-d57b0.appspot.com",
  messagingSenderId: "248721559024",
  appId: "1:248721559024:web:54ad2acf8214b50ba7a135"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db }
