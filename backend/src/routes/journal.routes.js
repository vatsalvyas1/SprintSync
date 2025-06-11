import express from "express";
import {
    createJournal,
    getJournals,
    getJournalById,
    updateJournal,
    deleteJournal,
    getAllEntriesForUser
} from "../controllers/journal.controller.js";

const router = express.Router();

router.post("/", createJournal);
router.get("/", getJournals);
router.get("/:id", getJournalById);
router.put("/:id", updateJournal);
router.delete("/:id", deleteJournal);
router.post('/user', getAllEntriesForUser); 

export default router;
