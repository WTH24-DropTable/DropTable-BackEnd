import adminController from "../controllers/adminController.js";
import express from "express";
import multer from "multer";

// Handle Class CSV Upload
const storage = multer.diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
        // You can use `Date.now()` or `UUID` for uniqueness
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === "text/csv") {
        cb(null, true);
    } else {
        cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false);
    }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 15 // 15MB
    }
});

const router = express.Router();

router.route("/createUsers")
    .post(upload.single("file"), adminController.createUsersFromMasterSheet);

export default router;