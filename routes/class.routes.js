import classController from "../controllers/classController.js";
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

router.route("/")
    .get(classController.getClasses);

router.route("/:id")
    .get(classController.getClassById);
    // .get(classController.getStudentClasses);

router.route("/:id/students")
    .get(classController.getStudentsInClass);

router.route("/:id/attendance/:timeslot")
    .get(classController.getClassAttendance);

router.route("/class/:id")
    .get(classController.getClassById);
router.route("/create")
    .post(upload.single("file"), classController.createClass);

router.route("/lecturer/:id")
    .get(classController.getLecturerClasses);

router.route("/occurrences/:id")
    .get(classController.getClassOccurrences);

export default router;
