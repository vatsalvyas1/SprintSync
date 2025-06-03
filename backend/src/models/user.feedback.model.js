import mongoose, { Schema } from "mongoose";

const userFeedbackSchema = new Schema(
    {
        email: {
            type: String,
            required: [true, "Feedback's email is required"],
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
        upvotes: {
            type: Number,
            required: [true, "Count of upvotes is required"],
            default: 0,
            min: 0,
        },
    },
    {
        timestamps: true,
    }
);

const UserFeedback = mongoose.model("Feedback", userFeedbackSchema);

export default UserFeedback;
