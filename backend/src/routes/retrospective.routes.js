import { Router } from "express";
import {
    getAllComments,
    getAllFeedback,
    getAllUpvotes,
    handleFeedbackUpvote,
    registerFeedback,
    registerFeedbackComment,
    getTotalUpvoteCount,
    getTotalCommentCount,
    handleActionItems,
    getAllActionItems,
    getTotalActionItemsCount,
    registerSprint,
    getAllSprint,
    getAllSprintCount,
    handleActionItemsUpvote,
    updateFeedbackCategory
} from "../controllers/retrospective.controller.js";

const router = Router();

router.route("/add-feedback").post(registerFeedback);
router.route("/get-all-feedbacks").post(getAllFeedback);
router.route("/add-feedback-comment").post(registerFeedbackComment);
router.route("/get-all-comments").post(getAllComments);
router.route("/get-total-comment-count").post(getTotalCommentCount);
router.route("/add-feedback-upvote").post(handleFeedbackUpvote);
router.route("/get-all-upvotes").post(getAllUpvotes);
router.route("/get-total-upvote-count").post(getTotalUpvoteCount);
router.route("/add-action-item").patch(handleActionItems);
router.route("/add-action-items-upvote").post(handleActionItemsUpvote);
router.route("/get-all-action-items").post(getAllActionItems);
router.route("/get-total-action-item-count").post(getTotalActionItemsCount);
router.route("/add-sprint").post(registerSprint);
router.route("/get-all-sprint").get(getAllSprint);
router.route("/get-all-sprint-count").get(getAllSprintCount);
router.route("/update-feedback/:id").patch(updateFeedbackCategory);


export default router;
