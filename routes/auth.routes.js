import authController from "../controllers/authController.js";
import { Router } from "express";

const router = Router();

router.route("/login")
    .post(authController.authLoginUser);

router.route("/logout")
    .get(authController.authLogoutUser);

export default router;