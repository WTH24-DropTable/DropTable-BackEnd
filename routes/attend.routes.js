import attendController from "../controllers/attendController.js";
import { Router } from "express";

const router = Router();

router.route("/")
    .get(attendController.getAttendance)

router.route("/create")
    .post(attendController.createAttendance)
    
export default router;