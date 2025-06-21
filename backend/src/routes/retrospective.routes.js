import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import {
    getAllComments,
    getAllFeedback,
    getAllUpvotes,
    handleFeedbackUpvote,
    registerFeedback,
    registerFeedbackComment,
    getTotalUpvoteCount,
    getTotalCommentCount
} from "../controllers/retrospective.controller.js";

const router = Router();

//secure routes
router.route("/add-feedback").post(verifyJWT, registerFeedback);
router.route("/get-all-feedbacks").post(verifyJWT, getAllFeedback);
router.route("/add-feedback-comment").post(verifyJWT, registerFeedbackComment);
router.route("/get-all-comments").post(verifyJWT, getAllComments);
router.route("/get-total-comment-count").post(verifyJWT, getTotalCommentCount);
router.route("/add-feedback-upvote").post(verifyJWT, handleFeedbackUpvote);
router.route("/get-all-upvotes").post(verifyJWT, getAllUpvotes);
router.route("/get-total-upvote-count").post(verifyJWT, getTotalUpvoteCount);


export default router;
