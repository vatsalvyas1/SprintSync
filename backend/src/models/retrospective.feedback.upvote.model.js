import mongoose, { Schema } from "mongoose";

const userFeedbackUpvoteSchema = new Schema({
    sprint: {
        type: String,
        required: [true, "User reference is required"],
        index: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User reference is required"],
        index: true,
    },
    feedback: {
        type: Schema.Types.ObjectId,
        ref: "UserFeedback",
        required: [true, "Feedback reference is required"],
        index: true,
    },
});

const userFeedbackUpvote = mongoose.model("Upvote", userFeedbackUpvoteSchema);

export default userFeedbackUpvote;
