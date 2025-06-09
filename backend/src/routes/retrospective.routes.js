import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import {
    addCommentCountToFeedback,
    getAllComments,
    getAllFeedback,
    registerFeedback,
    registerFeedbackComment,
} from "../controllers/retrospective.controller.js";

const router = Router();

//secure routes
router.route("/add-feedback").post(verifyJWT, registerFeedback);
router.route("/add-feedback-comment").post(verifyJWT, registerFeedbackComment);
router.route("/get-all-feedbacks").get(verifyJWT, getAllFeedback);
router.route("/get-all-comments").get(verifyJWT, getAllComments);
router
    .route("/add-feedback-commentCount")
    .post(verifyJWT, addCommentCountToFeedback);

export default router;