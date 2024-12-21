import dotenv from 'dotenv';
dotenv.config();

async function uploadMedicalCertificate(req, res) {
    try {
        const medicalCertImage = req.mc;
        const userId = req.body.userId;

        if (medicalCertImage === undefined || userId === undefined) {
            throw {
                status: 400,
                message: "Missing required fields"
            }
        }

        
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