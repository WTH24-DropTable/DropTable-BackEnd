import classController from "../controllers/classController.js";
import express from "express";

const router = express.Router();

router.route("/class/:classid")
    .get(classController.getClasses);

router.route("/:id")
    .get(classController.getStudentClasses)

export default router;