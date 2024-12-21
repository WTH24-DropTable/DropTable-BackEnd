import MedicalCertificateController from "../controllers/MedicalCertificateController.js";
import express from "express";
import multer from "multer";

// Handle MC File Upload (png, jpg, jpeg)
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
        cb(null, true);
    } else {
        cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false);
    }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5MB
    }
});

const router = express.Router();

router.route("/upload")
    .post(upload.single("mc"), MedicalCertificateController.uploadMedicalCertificate);

router.route("/pending")
    .get(MedicalCertificateController.getPendingMedicalCertificates);
    
router.route("/:id")
    .get(MedicalCertificateController.getUserMedicalCertificates);


export default router;