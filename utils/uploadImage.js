import { storage } from "../firebase.js";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";


export default function uploadImage(file, location, userId) {
    const { originalname, buffer } = file;

    const fileName = `${userId}-${Date.now()}`;
    const storageRef = ref(storage, `${location}/${fileName}`);
}