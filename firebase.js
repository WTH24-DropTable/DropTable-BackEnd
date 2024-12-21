import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { collection, getDocs } from "firebase/firestore"; 
import dotenv from "dotenv";
dotenv.config();

const firebaseConfig = {
    apiKey: "AIzaSyCtELL6Xgxs6673wXHjvG6iwNAYuJMVuUk",
    authDomain: "wth24-droptable.firebaseapp.com",
    projectId: "wth24-droptable",
    storageBucket: "wth24-droptable.firebasestorage.app",
    messagingSenderId: "389521780191",
    appId: "1:389521780191:web:43d69050dc5bfc4b80286a"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage();
const db = getFirestore();

export default { app, storage, db };
