import mongoose, { Schema } from "mongoose";

const userFeedbackCommentSchema = new Schema(
    {
        feedback: {
            type: Schema.Types.ObjectId,
            ref: "UserFeedback",
            required: [true, "Feedback reference is required"],
            index: true,
        },
        sprint: {
            type: Schema.Types.ObjectId,
            ref: "RetrospectiveSprint",
            required: [true, "Sprint reference is required"],
            index: true,
        },
        author: {
            type: String,
            required: [true, "Comment's author is required"],
            trim: true,
        },
        message: {
            type: String,
            required: [true, "Comment's message is required"],
            trim: true,
        },
        avatar: {
            type: String,
            required: [true, "Commenter's Avatar is required"],
        },
    },
    {
        timestamps: true,
    }
);

const userFeedbackComment = mongoose.model(
    "Comment",
    userFeedbackCommentSchema
);

export default userFeedbackComment;
