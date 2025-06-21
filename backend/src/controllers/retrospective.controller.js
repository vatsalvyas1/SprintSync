import UserFeedback from "../models/retrospective.feedback.model.js";
import userFeedbackComment from "../models/retrospective.feedback.comment.model.js";
import userFeedbackUpvote from "../models/retrospective.feedback.upvote.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const registerFeedback = asyncHandler(async function (req, res) {
    const { sprintId, author, category, message, avatar } = req.body;
    if (!sprintId || !author || !category || !message || !avatar)
        throw new ApiError(
            200,
            "Invalid or Missing Details for Registering Feedback"
        );
    const feedback = await UserFeedback({
        sprint: sprintId,
        author,
        category,
        message,
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
            error.errors.sprint ||
            error.errors.author ||
            error.errors.category ||
            error.errors.message;
        throw new ApiError(200, firstError.properties.message);
    }

    return res
        .status(201)
        .json(new ApiResponse(201, feedback, "Feedback Taken Successfully"));
});

const getAllFeedback = asyncHandler(async function (req, res) {
    const { sprintId } = req.body;

    if (!sprintId) throw new ApiError(200, "Sprint Reference is Required");

    const feedbacks = await UserFeedback.find({ sprint: sprintId });

    return res
        .status(201)
        .json(new ApiResponse(201, feedbacks, "Feedback Fetched"));
});

const registerFeedbackComment = asyncHandler(async function (req, res) {
    const { sprintId, feedbackId, author, message, avatar } = req.body;
    if (
        [sprintId, feedbackId, author, message, avatar].some(
            (field) => field?.trim() === ""
        )
    ) {
        throw new ApiError(
            200,
            "Invalid or missing details for registering feedback's comment"
        );
    }

    const comment = await userFeedbackComment({
        sprint: sprintId,
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

        if (error.errors?.sprint)
            throw new ApiError(200, error.errors.message.message);

        if (error.errors?.feedback) {
            throw new ApiError(200, error.errors.feedback.message);
        }
    }

    const updatedCommentCount = await userFeedbackComment.countDocuments({
        feedback: feedbackId,
        sprint: sprintId,
    });

    const result = await UserFeedback.updateOne(
        { _id: feedbackId },
        { commentCount: updatedCommentCount }
    );

    if (result.matchedCount === 0)
        throw new ApiError(200, "Feedback not found");

    return res
        .status(201)
        .json(new ApiResponse(201, comment, "Comment Taken Successfully"));
});

const getAllComments = asyncHandler(async function (req, res) {
    const { sprintId } = req.body;

    if (!sprintId) {
        throw new ApiError(200, "SprintId is required to fetch comments");
    }

    const comments = await userFeedbackComment.find({ sprint: sprintId });

    if (!comments) {
        throw new ApiError(200, "Error in Fetching Comments");
    }

    return res
        .status(201)
        .json(new ApiResponse(201, comments, "Comments Fetched"));
});

const getTotalCommentCount = asyncHandler(async (req, res) => {
    const { sprintId } = req.body;

    if (!sprintId) throw new ApiError(200, "SprintId reference is required");

    try {
        const count = await userFeedbackComment.countDocuments({
            sprint: sprintId,
        });
        return res
            .status(201)
            .json(
                new ApiResponse(201, { count }, "Total upvotes count fetched")
            );
    } catch (error) {
        console.error("Error fetching total upvote count:", error);
        throw new ApiError(200, "Failed to fetch upvote count");
    }
});

const handleFeedbackUpvote = asyncHandler(async function (req, res) {
    const { sprintId, feedbackId, userId } = req.body;

    if (!sprintId || !feedbackId || !userId) {
        throw new ApiError(200, "feedbackId and userId are required");
    }

    const existingUpvote = await userFeedbackUpvote.findOne({
        sprint: sprintId,
        user: userId,
        feedback: feedbackId,
    });

    let message;

    if (existingUpvote) {
        await userFeedbackUpvote.deleteOne({ _id: existingUpvote._id });
        message = "Upvote removed successfully";
    } else {
        await userFeedbackUpvote.create({
            sprint: sprintId,
            user: userId,
            feedback: feedbackId,
        });
        message = "Upvote added successfully";
    }

    const updatedUpvoteCount = await userFeedbackUpvote.countDocuments({
        feedback: feedbackId,
        sprint: sprintId,
    });

    const result = await UserFeedback.updateOne(
        { _id: feedbackId },
        { upvoteCount: updatedUpvoteCount }
    );

    if (result.matchedCount === 0) {
        throw new ApiError(200, "Feedback not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, { upvoteCount: updatedUpvoteCount }, message)
        );
});

const getAllUpvotes = asyncHandler(async function (req, res) {
    const { sprintId } = req.body;

    const upvotes = await userFeedbackUpvote.find({ sprint: sprintId });

    return res
        .status(201)
        .json(new ApiResponse(201, upvotes, "Upvotes Fetched"));
});

const getTotalUpvoteCount = asyncHandler(async (req, res) => {
    const { sprintId } = req.body;
    try {
        const count = await userFeedbackUpvote.countDocuments({
            sprint: sprintId,
        });
        return res
            .status(201)
            .json(
                new ApiResponse(201, { count }, "Total upvotes count fetched")
            );
    } catch (error) {
        console.error("Error fetching total upvote count:", error);
        throw new ApiError(200, "Failed to fetch upvote count");
    }
});

export {
    registerFeedback,
    getAllFeedback,
    registerFeedbackComment,
    getAllComments,
    handleFeedbackUpvote,
    getAllUpvotes,
    getTotalUpvoteCount,
    getTotalCommentCount,
};
