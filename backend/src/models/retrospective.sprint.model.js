import mongoose, { Schema } from "mongoose";

const retrospectiveSprintSchema = new Schema(
    {
        sprintName: {
            type: String,
            required: [true, "Sprint Name is required"],
        },
        projectName: {
            type: String,
            required: [true, "Sprint's Project Name is required"],
        },
        createdBy: {
            type: String,
            required: [true, "Sprint Creator Name is required"],
        }
    },
    {
        timestamps: true,
    }
);

const RetrospectiveSprint = mongoose.model("Sprint", retrospectiveSprintSchema);

export default RetrospectiveSprint;
