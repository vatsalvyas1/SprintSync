import mongoose, { Schema } from "mongoose";

const userFeedbackCommentSchema = new Schema(
    {
        feedback: {
            type: Schema.Types.ObjectId,
            ref: "UserFeedback",
            required: [true, "Feedback reference is required"],
        },
        email: {
            type: String,
            required: [true, "Comment's email is required"],
            trim: true,
        },
        message: {
            type: String,
            required: [true, "Comment's message is required"],
            trim: true,
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
