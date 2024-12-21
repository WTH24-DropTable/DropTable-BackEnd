import classController from "../controllers/classController.js";
import express from "express";

const router = express.Router();

router.route("/classes")
    .get(classController.getClasses);

export default router;