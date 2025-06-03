import { Router } from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    registerFeedback,
    registerFeedbackComment
} from "../controllers/user.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser); 

router.post("/test-body", (req, res) => {
    console.log("Test Body:", req.body);
    res.json({ received: req.body });
});

// Secure Routes
router.route("/logout").get(verifyJWT, logoutUser);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/add-feedback").post(verifyJWT, registerFeedback)
router.route("/add-feedback-comment").post(verifyJWT, registerFeedbackComment)


export default router;
