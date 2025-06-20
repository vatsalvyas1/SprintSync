import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import {
    addCommentCountToFeedback,
    getAllComments,
    getAllFeedback,
    getAllUpvotes,
    handleFeedbackUpvote,
    registerFeedback,
    registerFeedbackComment,
    getTotalUpvoteCount
} from "../controllers/retrospective.controller.js";

const router = Router();

//secure routes
router.route("/add-feedback").post(verifyJWT, registerFeedback);
router.route("/get-all-feedbacks").get(verifyJWT, getAllFeedback);
router.route("/add-feedback-comment").post(verifyJWT, registerFeedbackComment);
router.route("/get-all-comments").get(verifyJWT, getAllComments);
router
    .route("/add-feedback-commentCount")
    .post(verifyJWT, addCommentCountToFeedback);
router.route("/add-feedback-upvote").post(verifyJWT, handleFeedbackUpvote);
router.route("/get-all-upvotes").get(verifyJWT, getAllUpvotes);
router.route("/get-total-upvote-count").get(verifyJWT, getTotalUpvoteCount);


export default router;
