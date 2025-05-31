import { Router } from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser
} from "../controllers/user.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser); 

// Secure Routes
router.route("/logout").get(verifyJWT, logoutUser);
router.route("/current-user").get(verifyJWT, getCurrentUser);


export default router;
