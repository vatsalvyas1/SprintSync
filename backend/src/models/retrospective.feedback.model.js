import mongoose, { Schema } from "mongoose";

const userFeedbackSchema = new Schema(
    {
        sprint: {
            type: Schema.Types.ObjectId,
            ref: "RetrospectiveSprint",
            required: [true, "Sprint Id Referecne is required"],
            index: true,
        },
        author: {
            type: String,
            required: [true, "Feedback's name is required"],
            trim: true,
        },
        category: {
            type: String,
            enum: {
                values: [
                    "What Went Well",
                    "What Didn't Go Well",
                    "Suggestions",
                ],
                message: (props) => `${props.value} is not a valid category`,
            },
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
        actionItem: {
            type: Boolean,
            default: false,
        },
        actionItemMeta: {
            upvotedByUserName: [
                {
                    type: Schema.Types.ObjectId,
                    ref: "User",
                },
            ],
            addedByUserName: {
                type: String,
                default: null,
            },
            addedByUser: {
                type: Schema.Types.ObjectId,
                ref: "User",
                index: true,
            },
        },
    },
    {
        timestamps: true,
    }
);

const UserFeedback = mongoose.model("Feedback", userFeedbackSchema);

export default UserFeedback;
