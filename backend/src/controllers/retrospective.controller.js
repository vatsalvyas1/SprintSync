import UserFeedback from "../models/user.feedback.model.js";
import userFeedbackComment from "../models/user.feedback.comment.model.js";

const registerFeedback = asyncHandler(async function (req, res) {
const { author, category, message, upvotes } = req.body;

    const feedback = await UserFeedback({
        author,
        category,
        message,
        upvotes,
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
    const feedback = await UserFeedback.findById(feedbackId);
    feedback.commentCount = commentCount;
    console.log(feedback.commentCount);
    const savedFeedback = await feedback.save({ validateBeforeSave: false });
    console.log("HI");
    if (savedFeedback) console.log(savedFeedback);
    console.log("sd: ", savedFeedback);
    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                savedFeedback,
                "Comment Count Updated Successfully"
            )
        );
});

const getAllFeedback = asyncHandler(async function (req, res) {
    const feedbacks = await UserFeedback.find();

    if (!feedbacks) throw new ApiError(200, "Feedbacks couldn't be fetched");

    return res
        .status(201)
        .json(new ApiResponse(201, feedbacks, "Feedback Fetched"));
});

const registerFeedbackComment = asyncHandler(async function (req, res) {
    const { feedbackId, author, message } = req.body;

    const comment = new userFeedbackComment({
        feedback: feedbackId,
        author,
        message,
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
            throw new ApiError(200, error.errors.email.message);

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
