import firebase from '../firebase.js';
import { collection, setDoc, doc } from 'firebase/firestore';
import retrieveDataFromMC from '../utils/retrieveDataFromMC.js';
import uploadImage from '../utils/uploadImage.js';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
dotenv.config();

async function uploadMedicalCertificate(req, res) {
    try {
        const medicalCertImage = req.file;
        const userId = req.body.userId;

        if (medicalCertImage === undefined || userId === undefined) {
            throw {
                status: 400,
                message: "Missing required fields"
            }
        }

        const imageUrl = await uploadImage(medicalCertImage, "medicalcertificates", userId);
        const recognitionData = await retrieveDataFromMC(imageUrl);
        
        const mcData = {
            id: uuidv4(),
            userId: userId,
            imageUrl: imageUrl,
            patientName: recognitionData.patientName,
            startDate: recognitionData.startDate,
            duration: recognitionData.duration,
            clinicName: recognitionData.clinicName,
            status: "pending"
        }

        const docRef = doc(firebase.db, "medicalCertificates", mcData.id);
        await setDoc(docRef, mcData);
        return res.status(200).json({
            status: "success",
            mcData: mcData,
        });
    } catch (err) {
        return res.status(err.status ? err.status : 500).json({ error: err.message });
    }
}

async function getUserMedicalCertificates(req, res) {

}

async function getPendingMedicalCertificates(req, res) {

}

export default {
    uploadMedicalCertificate,
    getUserMedicalCertificates,
    getPendingMedicalCertificates
}