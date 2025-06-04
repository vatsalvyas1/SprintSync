import express from 'express';
import {
  createForm,
  getAllForms,
  getFormById,
  deleteForm
} from '../controllers/form.controller.js'; 

const router = express.Router();

router.post('/', createForm);
router.get('/', getAllForms);
router.get('/:id', getFormById);
router.delete('/:id', deleteForm);

export default router;
