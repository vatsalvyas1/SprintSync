import DailyJournal from '../models/Journal.model.js';
import mongoose from 'mongoose';

// Helper to validate ObjectId
const isValidObjectId = id => mongoose.Types.ObjectId.isValid(id);

// Create new journal
export const createJournal = async (req, res) => {
  try {
    const { user, title, description, startTime, duration, taskType, dailyNotes } = req.body;

    // Basic validation
    if (!user || !title || !description || !startTime || !duration || !taskType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const journal = new DailyJournal({ user, title, description, startTime, duration, taskType, dailyNotes });
    await journal.save();

    res.status(201).json(journal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all journals (optionally filter by user via query string ?user=...)
export const getJournals = async (req, res) => {
  try {
    const filter = {};
    if (req.query.user) {
      if (!isValidObjectId(req.query.user)) return res.status(400).json({ error: 'Invalid user ID' });
      filter.user = req.query.user;
    }

    const journals = await DailyJournal.find(filter).sort({ startTime: -1 });
    res.json(journals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a journal by ID
export const getJournalById = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) return res.status(400).json({ error: 'Invalid ID' });

  try {
    const journal = await DailyJournal.findById(id);
    if (!journal) return res.status(404).json({ error: 'Journal not found' });
    res.json(journal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a journal by ID
export const updateJournal = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) return res.status(400).json({ error: 'Invalid ID' });

  try {
    const journal = await DailyJournal.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!journal) return res.status(404).json({ error: 'Journal not found' });
    res.json(journal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a journal by ID
export const deleteJournal = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) return res.status(400).json({ error: 'Invalid ID' });

  try {
    const journal = await DailyJournal.findByIdAndDelete(id);
    if (!journal) return res.status(404).json({ error: 'Journal not found' });
    res.json({ message: 'Journal deleted', journal });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
