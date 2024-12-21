import firebase from "../firebase.js";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default async function uploadImage(file, location, userId) {
    const { originalname, buffer } = file;

    const fileName = `${userId}-${Date.now()}`;
    const storageRef = ref(firebase.storage, `${location}/${fileName}`);

    // Upload the file
    const snapshot = await uploadBytes(storageRef, buffer, {
        contentType: file.mimetype,
    });

    const downloadUrl = await getDownloadURL(snapshot.ref);
    return downloadUrl;
}