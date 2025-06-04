import express from 'express';
import {
  createForm,
  getAllForms,
  getFormById,
  deleteForm,
  lockForm,
  unlockForm
} from '../controllers/form.controller.js'; 

const router = express.Router();

router.post('/', createForm);
router.get('/', getAllForms);
router.get('/:id', getFormById);
router.delete('/:id', deleteForm);
router.patch('/:id/lock', lockForm);
router.patch('/:id/unlock', unlockForm);

export default router;
