import UserFeedback from "../models/retrospective.feedback.model.js";
import userFeedbackComment from "../models/retrospective.feedback.comment.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const registerFeedback = asyncHandler(async function (req, res) {
    const { author, category, message, upvotes, avatar } = req.body;
    if (!author || !category || !message || !avatar)
        throw new ApiError(
            200,
            "Invalid or Missing Details for Registering Feedback"
        );
    else if (!Number.isInteger(upvotes) || upvotes < 0)
        throw new ApiError(200, "Upvotes can't be negative");

    const feedback = await UserFeedback({
        author,
        category,
        message,
        upvotes,
        avatar,
    });

    if (!feedback)
        throw new ApiError(
            200,
            "Something Went Wrong While Saving The Feedback"
        );

    try {
        await feedback.validate();
        await feedback.save();
    } catch (error) {
        const firstError =
            error.errors.name ||
            error.errors.category ||
            error.errors.message ||
            error.errors.upvotes;
        throw new ApiError(200, firstError.properties.message);
    }

    return res
        .status(201)
        .json(new ApiResponse(201, feedback, "Feedback Taken Successfully"));
});

const addCommentCountToFeedback = asyncHandler(async function (req, res) {
    const { feedbackId, commentCount } = req.body;

    if (!feedbackId || !commentCount == undefined)
        throw new ApiError(
            200,
            "Invalid request: feedbackId or commentCount missing"
        );

    const result = await UserFeedback.updateOne(
        { _id: feedbackId },
        { commentCount: commentCount }
    );

    if (result.matchedCount == 0) throw new ApiError(200, "Feedback not found");

    return res
        .status(201)
        .json(new ApiResponse(201, {}, "Comment Count Updated Successfully"));
});

const getAllFeedback = asyncHandler(async function (req, res) {
    const feedbacks = await UserFeedback.find();
    if (!feedbacks.length)
        throw new ApiError(200, "Feedbacks couldn't be fetched");

    return res
        .status(201)
        .json(new ApiResponse(201, feedbacks, "Feedback Fetched"));
});

const registerFeedbackComment = asyncHandler(async function (req, res) {
    const { feedbackId, author, message, avatar } = req.body;
    if (
        [feedbackId, author, message, avatar].some(
            (field) => field?.trim() === ""
        )
    ) {
        throw new ApiError(
            200,
            "Invalid or missing details for registering feedback's comment"
        );
    }

    const comment = new userFeedbackComment({
        feedback: feedbackId,
        author,
        message,
        avatar,
    });

    if (!comment)
        throw new ApiError(
            200,
            "Something Went Wrong While Saving The Comment"
        );

    try {
        await comment.validate();
        await comment.save();
    } catch (error) {
        if (error.errors?.author)
            throw new ApiError(200, error.errors.author.message);

        if (error.errors?.avatar)
            throw new ApiError(200, error.errors.avatar.message);

        if (error.errors?.message)
            throw new ApiError(200, error.errors.message.message);

        if (error.errors?.feedback) {
            throw new ApiError(200, error.errors.feedback.message);
        }
    }
    return res
        .status(201)
        .json(new ApiResponse(201, comment, "Comment Taken Successfully"));
});

const getAllComments = asyncHandler(async function (req, res) {
    const comments = await userFeedbackComment.find();

    if (!comments) throw new ApiError(200, "Comments couldn't be fetched");

    return res
        .status(201)
        .json(new ApiResponse(201, comments, "Comments Fetched"));
});

export {
    registerFeedback,
    registerFeedbackComment,
    getAllFeedback,
    getAllComments,
    addCommentCountToFeedback,
};
