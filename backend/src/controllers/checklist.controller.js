import asyncHandler from "../utils/asyncHandler.js";
import DeploymentChecklist from "../models/checklist.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

export const createChecklist = asyncHandler(async (req, res) => {
    const { name, sprint, sprintLink, dueDate, priority, checklistItems } = req.body;

    console.log(req.body);

    console.log(name);

    if (!name || !sprint || !dueDate || !priority || !checklistItems) {
        throw new ApiError(400, "All fields are required");
    }

    const newChecklist = new DeploymentChecklist({
        name,
        sprint,
        sprintLink,
        dueDate,
        priority,
        checklistItems,
    });

    await newChecklist.save();

    if(!newChecklist) {
        throw new ApiError(500, "Failed to create checklist");
    }

    res.status(201).json(new ApiResponse(201,newChecklist, "Checklist created successfully"));
});

export const getChecklists = asyncHandler(async (req, res) => {
    const checklists = await DeploymentChecklist.find();
    res.status(200).json(201,new ApiResponse(200,checklists, "Checklists fetched successfully"));
});

export const changeChecklistItemState = asyncHandler(async (req, res) => {
    const { checklistId, itemId, status } = req.body;

    if (!checklistId || !itemId || !status) {
        throw new ApiError(400, "Checklist ID, Item ID and Status are required");
    }

    const checklist = await DeploymentChecklist.findById(checklistId);

    if (!checklist) {
        throw new ApiError(404, "Checklist not found");
    }

    const item = checklist.checklistItems.id(itemId);

    if (!item) {
        throw new ApiError(404, "Checklist item not found");
    }

    item.status = status;
    await checklist.save();

    res.status(200).json(new ApiResponse(200, checklist, "Checklist item status updated successfully"));
});

export const getChecklistById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        throw new ApiError(400, "Checklist ID is required");
    }

    const checklist = await DeploymentChecklist.findById(id);
    if (!checklist) {
        throw new ApiError(404, "Checklist not found");
    }

    res.status(200).json(new ApiResponse(200, checklist, "Checklist fetched successfully"));
});

