import UserFeedback from "../models/retrospective.feedback.model.js";
import userFeedbackComment from "../models/retrospective.feedback.comment.model.js";
import userFeedbackUpvote from "../models/retrospective.feedback.upvote.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const registerFeedback = asyncHandler(async function (req, res) {
    const { author, category, message, avatar } = req.body;
    if (!author || !category || !message || !avatar)
        throw new ApiError(
            200,
            "Invalid or Missing Details for Registering Feedback"
        );
    const feedback = await UserFeedback({
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
            error.errors.name || error.errors.category || error.errors.message;
        throw new ApiError(200, firstError.properties.message);
    }

    return res
        .status(201)
        .json(new ApiResponse(201, feedback, "Feedback Taken Successfully"));
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

    const comment = await userFeedbackComment({
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

const addCommentCountToFeedback = asyncHandler(async function (req, res) {
    const { feedbackId, commentCount } = req.body;

    if (!feedbackId || !commentCount == undefined)
        throw new ApiError(
            200,
            "Invalid request: feedbackId or Count of Comments  missing"
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

const handleFeedbackUpvote = asyncHandler(async function (req, res) {
    const { feedbackId, userId } = req.body;

    if (!feedbackId || !userId) {
        throw new ApiError(
            200,
            "feedbackId and userId are required"
        );
    }

    // Check if upvote already exists
    const existingUpvote = await userFeedbackUpvote.findOne({
        user: userId,
        feedback: feedbackId,
    });

    let message;

    if (existingUpvote) {
        // Remove the upvote 
        await userFeedbackUpvote.deleteOne({ _id: existingUpvote._id });
        message = "Upvote removed successfully";
    } else {
        // Add the upvote  
        await userFeedbackUpvote.create({
            user: userId,
            feedback: feedbackId,
        });
        message = "Upvote added successfully";
    }

    // Recalculate total upvotes for this feedback
    const updatedUpvoteCount = await userFeedbackUpvote.countDocuments({
        feedback: feedbackId,
    });

    // Update the feedback document's upvote count
    const result = await UserFeedback.updateOne(
        { _id: feedbackId },
        { upvoteCount: updatedUpvoteCount }
    );

    if (result.matchedCount === 0) {
        throw new ApiError(200, "Feedback not found");
    }

    return res.status(200).json(
        new ApiResponse(200, { upvoteCount: updatedUpvoteCount }, message)
    );
});

const getAllUpvotes = asyncHandler(async function (req, res) {
    const upvotes = await userFeedbackUpvote.find();

    if (!upvotes) throw new ApiError(200, "Upvotes couldn't be fetched");

    return res
        .status(201)
        .json(new ApiResponse(201, upvotes, "Upvotes Fetched"));
});

const getTotalUpvoteCount = asyncHandler(async (req, res) => {
    try {
        const count = await userFeedbackUpvote.countDocuments();
        return res.status(201).json(
            new ApiResponse(201, { count }, "Total upvotes count fetched")
        );
    } catch (error) {
        console.error("Error fetching total upvote count:", error);
        throw new ApiError(200, "Failed to fetch upvote count");
    }
})

export {
    registerFeedback,
    getAllFeedback,
    registerFeedbackComment,
    getAllComments,
    addCommentCountToFeedback,
    handleFeedbackUpvote,
    getAllUpvotes,
    getTotalUpvoteCount
};
