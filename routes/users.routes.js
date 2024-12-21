import userController from "../controllers/usersController.js";
import express from "express";

const router = express.Router();

router.route("/users")
    .get(userController.getStudents);

router.route("/:id")
    .get(userController.getStudent);
export default router;