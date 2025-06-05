import express from 'express';

import { getChecklists, createChecklist, changeChecklistItemState } from '../controllers/checklist.controller.js';

const router = express.Router();

// Route to create a new checklist
router.post('/create', createChecklist);

// Route to get all checklists
router.get('/checklists', getChecklists);

// Route to change the state of a checklist item
router.post('/change-item-state', changeChecklistItemState);

export default router;