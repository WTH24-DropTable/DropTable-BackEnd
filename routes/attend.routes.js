import attendController from "../controllers/attendController.js";
import { Router } from "express";

const router = Router();

router.route("/")
    .get(attendController.getAttendance)

export default router;