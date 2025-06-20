import mongoose, { Schema } from "mongoose";

const userFeedbackUpvoteSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User reference is required"],
    },
    feedback: {
        type: Schema.Types.ObjectId,
        ref: "UserFeedback",
        required: [true, "Feedback reference is required"],
    },
});

const userFeedbackUpvote = mongoose.model("Upvote", userFeedbackUpvoteSchema);

export default userFeedbackUpvote;
