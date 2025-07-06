import UserFeedback from "../models/retrospective.feedback.model.js";
import userFeedbackComment from "../models/retrospective.feedback.comment.model.js";
import userFeedbackUpvote from "../models/retrospective.feedback.upvote.model.js";
import RetrospectiveSprint from "../models/retrospective.sprint.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import mongoose from "mongoose";

const registerFeedback = asyncHandler(async function (req, res) {
    const { sprintId, author, category, message, avatar } = req.body;
    if (!sprintId || !author || !category || !message || !avatar)
        throw new ApiError(
            400,
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
            400,
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
        throw new ApiError(400, firstError.properties.message);
    }

    return res
        .status(201)
        .json(new ApiResponse(201, feedback, "Feedback Taken Successfully"));
});

const getAllFeedback = asyncHandler(async function (req, res) {
    const { sprintId } = req.body;

    if (!sprintId) throw new ApiError(400, "Sprint Reference is Required");

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
            400,
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
            400,
            "Something Went Wrong While Saving The Comment"
        );

    try {
        await comment.validate();
        await comment.save();
    } catch (error) {
        if (error.errors?.author)
            throw new ApiError(400, error.errors.author.message);

        if (error.errors?.avatar)
            throw new ApiError(400, error.errors.avatar.message);

        if (error.errors?.message)
            throw new ApiError(400, error.errors.message.message);

        if (error.errors?.sprint)
            throw new ApiError(400, error.errors.message.message);

        if (error.errors?.feedback) {
            throw new ApiError(400, error.errors.feedback.message);
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
        throw new ApiError(400, "Feedback not found");

    return res
        .status(201)
        .json(new ApiResponse(201, comment, "Comment Taken Successfully"));
});

const getAllComments = asyncHandler(async function (req, res) {
    const { sprintId } = req.body;

    if (!sprintId) {
        throw new ApiError(400, "Sprint is required to fetch comments");
    }

    const comments = await userFeedbackComment.find({ sprint: sprintId });

    if (!comments) {
        throw new ApiError(400, "Error in Fetching Comments");
    }

    return res
        .status(201)
        .json(new ApiResponse(201, comments, "Comments Fetched"));
});

const getTotalCommentCount = asyncHandler(async (req, res) => {
    const { sprintId } = req.body;

    if (!sprintId) throw new ApiError(400, "Sprint reference is required");

    try {
        const count = await userFeedbackComment.countDocuments({
            sprint: sprintId,
        });
        return res
            .status(201)
            .json(
                new ApiResponse(201, { count }, "Total comment count fetched")
            );
    } catch (error) {
        throw new ApiError(400, "Failed to fetch comment count");
    }
});

const handleFeedbackUpvote = asyncHandler(async function (req, res) {
    const { sprintId, feedbackId, userId } = req.body;

    if (!sprintId || !feedbackId || !userId) {
        throw new ApiError(400, "feedbackId and userId are required");
    }

    const existingUpvote = await userFeedbackUpvote.findOne({
        sprint: sprintId,
        user: userId,
        feedback: feedbackId,
    });

    let message;

    if (existingUpvote) {
        await userFeedbackUpvote.deleteOne({ _id: existingUpvote._id });
        message = false; // Upvote removed successfully
    } else {
        await userFeedbackUpvote.create({
            sprint: sprintId,
            user: userId,
            feedback: feedbackId,
        });
        message = true; //Upvote added successfully
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
        throw new ApiError(400, "Feedback not found");
    }

    return res
        .status(201)
        .json(
            new ApiResponse(201, { upvoteCount: updatedUpvoteCount }, message)
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
        throw new ApiError(400, "Failed to fetch upvote count");
    }
});

const handleActionItems = asyncHandler(async (req, res) => {
    const { sprintId, feedbackId, userId, userName } = req.body;

    if (!sprintId || !feedbackId || !userId || !userName) {
        throw new ApiError(
            400,
            "SprintId, FeedbackId, UserId, and User Name are required"
        );
    }

    const feedback = await UserFeedback.findOne({
        sprint: sprintId,
        _id: feedbackId,
    });

    if (!feedback) {
        throw new ApiError(400, "Feedback not found");
    }

    if (
        feedback.actionItem &&
        feedback.actionItemMeta?.addedByUser?.toString() !== userId
    ) {
        throw new ApiError(
            400,
            "Only the user who added the action item can remove it."
        );
    }

    const newStatus = !feedback.actionItem;

    const updateData = {
        actionItem: newStatus,
        actionItemMeta: newStatus
            ? {
                  addedByUserName: userName,
                  addedByUser: userId,
              }
            : {
                  addedByUserName: null,
                  addedByUser: null,
              },
    };

    const result = await UserFeedback.updateOne(
        { _id: feedbackId, sprint: sprintId },
        updateData
    );

    if (result.matchedCount === 0) {
        throw new ApiError(400, "Feedback not found");
    }

    return res.status(201).json(
        new ApiResponse(
            201,
            {
                actionItem: newStatus,
                actionItemMeta: newStatus
                    ? {
                          addedByUserName: userName,
                          addedByUser: userId,
                      }
                    : {
                          addedByUserName: null,
                          addedByUser: null,
                      },
            },
            newStatus
                ? "Action Item added successfully"
                : "Action Item removed successfully"
        )
    );
});

const handleActionItemsUpvote = asyncHandler(async (req, res) => {
    const { feedbackId, userId } = req.body;

    if (!feedbackId || !userId)
        throw new ApiError(400, "FeedbackId and User Id are required");

    const feedback = await UserFeedback.findOne({
        _id: feedbackId,
    });

    if (!feedback) throw new ApiError(400, "Feedback not found");

    if (!feedback.actionItem)
        throw new ApiError(400, "Feedback is not an action item");

    let response;
    let message;

    if (
        feedback.actionItemMeta?.upvotedByUserName.some(
            (userid) => userid.toString() === userId
        )
    ) {
        message = "Upvote on action item successfully removed";
        response = await UserFeedback.updateOne(
            { _id: feedbackId },
            {
                $pull: {
                    "actionItemMeta.upvotedByUserName": userId,
                },
            }
        );
    } else {
        message = "Upvote on action item successfully added";
        response = await UserFeedback.updateOne(
            { _id: feedbackId },
            {
                $addToSet: { "actionItemMeta.upvotedByUserName": userId },
            }
        );
    }

    if (!response.matchedCount)
        throw new ApiError(
            500,
            "Some error while updating action items upvotes"
        );

    const [result] = await UserFeedback.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(feedbackId) } },
        {
            $project: {
                actionItemUpvoteCount: {
                    $size: "$actionItemMeta.upvotedByUserName",
                },
            },
        },
    ]);

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                { actionItemUpvoteCount: result?.actionItemUpvoteCount ?? 0 },
                message
            )
        );
});

const getAllActionItems = asyncHandler(async (req, res) => {
    const { sprintId } = req.body;

    if (!sprintId) {
        throw new ApiError(400, "Sprint ID reference is required");
    }

    const actionItems = await UserFeedback.find({
        sprint: sprintId,
        actionItem: true,
    })
        .select("message category author avatar createdAt actionItemMeta")
        .sort({ createdAt: -1 }); // sort new first

    return res
        .status(201)
        .json(new ApiResponse(201, actionItems, "Action Items Fetched"));
});

const getTotalActionItemsCount = asyncHandler(async (req, res) => {
    const { sprintId } = req.body;
    if (!sprintId) {
        throw new ApiError(400, "Sprint ID reference is required");
    }

    try {
        const count = await UserFeedback.countDocuments({
            sprint: sprintId,
            actionItem: true,
        });

        return res
            .status(201)
            .json(
                new ApiResponse(
                    201,
                    { count },
                    "Total action items count fetched"
                )
            );
    } catch (error) {
        throw new ApiError(400, "Failed to fetch action items count");
    }
});

const registerSprint = asyncHandler(async (req, res) => {
    const { sprintName, projectName, teamName, createdBy } = req.body;
    if (!sprintName || !projectName || !teamName || !createdBy)
        throw new ApiError(
            400,
            "Invalid or Missing Details for Registering Sprint"
        );

    const sprint = await RetrospectiveSprint({
        sprintName,
        projectName,
        teamName,
        createdBy,
    });

    if (!sprint)
        throw new ApiError(400, "Something Went Wrong While Saving The Sprint");

    try {
        await sprint.validate();
        await sprint.save();
    } catch (error) {
        const firstError =
            error.errors.sprintName ||
            error.errors.projectName ||
            error.errors.teamName ||
            error.errors.createdBy;
        throw new ApiError(400, firstError.properties.message);
    }

    return res
        .status(201)
        .json(new ApiResponse(201, sprint, "Sprint Registered Successfully"));
});

const getAllSprint = asyncHandler(async (req, res) => {
    const sprints = await RetrospectiveSprint.find();

    return res
        .status(201)
        .json(new ApiResponse(201, sprints, "Sprints Fetched"));
});

const getAllSprintCount = asyncHandler(async (req, res) => {
    try {
        const count = await RetrospectiveSprint.countDocuments({});
        return res
            .status(201)
            .json(
                new ApiResponse(201, { count }, "Total sprints count fetched")
            );
    } catch (error) {
        console.error("Error fetching sprint count:", error);
        throw new ApiError(400, "Failed to fetch sprint count");
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
    handleActionItems,
    handleActionItemsUpvote,
    getAllActionItems,
    getTotalActionItemsCount,
    registerSprint,
    getAllSprint,
    getAllSprintCount,
};
