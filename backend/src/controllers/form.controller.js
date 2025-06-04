import Form from '../models/form.model.js';

// Create a new form
export const createForm = async (req, res) => {
  try {
    const { formName, description, notes } = req.body;
    const newForm = new Form({
      formName,
      description,
      notes,
      isLocked: false,
      status: 'Available'
    });
    await newForm.save();
    res.status(201).json(newForm);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create form' });
  }
};

// Get all forms
export const getAllForms = async (req, res) => {
  try {
    const forms = await Form.find().populate('lockedBy', 'name email'); // optional
    res.status(200).json(forms);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch forms' });
  }
};

// Get a single form by ID
export const getFormById = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id).populate('lockedBy', 'name email'); // optional
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }
    res.status(200).json(form);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch form' });
  }
};

// Delete a form by ID
export const deleteForm = async (req, res) => {
  try {
    const deletedForm = await Form.findByIdAndDelete(req.params.id);
    if (!deletedForm) {
      return res.status(404).json({ error: 'Form not found' });
    }
    res.status(200).json({ message: 'Form deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete form' });
  }
};

// Lock a form
export const lockForm = async (req, res) => {
  try {
    const { userId } = req.body;
    const form = await Form.findById(req.params.id);

    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    if (form.isLocked) {
      return res.status(400).json({ error: 'Form is already locked' });
    }

    form.isLocked = true;
    form.lockedBy = userId;
    form.lockedAt = new Date();
    form.status = 'Locked';

    await form.save();
    res.status(200).json({ message: 'Form locked', form });
  } catch (error) {
    res.status(500).json({ error: 'Failed to lock form' });
  }
};

// Unlock a form
export const unlockForm = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);

    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    form.isLocked = false;
    form.lockedBy = null;
    form.lockedAt = null;
    form.status = 'Available';

    await form.save();
    res.status(200).json({ message: 'Form unlocked', form });
  } catch (error) {
    res.status(500).json({ error: 'Failed to unlock form' });
  }
};
