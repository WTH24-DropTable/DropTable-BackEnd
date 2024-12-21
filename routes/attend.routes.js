import attendController from "../controllers/attendController.js";
import { Router } from "express";

const router = Router();

router.route("/mark")
    .post(attendController.markAttendance);

router.route("/createAttendance")
    .post(attendController.createAttendance);

router.route("/:classId")
    .get(attendController.getAttendanceByClass);

router.route("/:classId/:userId")
    .get(attendController.getClassesAttended);

router.route("/user/:userId")
    .get(attendController.getUserClasses);

router.route("/lecturer/:userId")
    .get(attendController.getLecturerClasses);
    
export default router;
