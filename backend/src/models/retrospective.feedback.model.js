import mongoose, { Schema } from "mongoose";

const userFeedbackSchema = new Schema(
    {
        author: {
            type: String,
            required: [true, "Feedback's name is required"],
            trim: true,
        },
        category: {
            type: String,
            enum: ["What Went Well", "What Didn't Go Well", "Suggestions"],
            required: [true, "Feedback's category is required"],
        },
        message: {
            type: String,
            required: [true, "Feedback's message is required"],
            trim: true,
        },
        commentCount: {
            type: Number,
            default: 0,
            min: 0,
        },
        upvoteCount: {
            type: Number,
            default: 0,
            min: 0,
        },
        avatar: {
            type: String,
            required: [true, "Feedbacker's Avatar is required"],
        },
    },
    {
        timestamps: true,
    }
);

const UserFeedback = mongoose.model("Feedback", userFeedbackSchema);

export default UserFeedback;
