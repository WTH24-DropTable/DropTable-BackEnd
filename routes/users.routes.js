import userController from "../controllers/usersController.js";
import express from "express";
import multer from "multer";

// Handle User Profile Pic (png, jpg, jpeg)
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

router.route("/students")
    .get(userController.getStudents);

router.route("/students/:id")
    .get(userController.getStudent);

router.route("/uploadImage")
    .post(upload.single("profilePic"), userController.uploadUserImage);

export default router;