const mongoose = require('mongoose');

const dailyJournalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true // e.g., "Working on dashboard UI"
  },
  description: {
    type: String,
    required: true // More context on the work
  },
  startTime: {
    type: Date,
    required: true // Actual start time of the task(end time khud calculate karenge)
  },
  duration: {
    type: String,
    required: true // e.g., "2h 30m" — you can parse this later
  },
  taskType: {
    type: String,
    enum: ['meeting', 'development', 'testing', 'bug fixes'],
    required: true
  },
  dailyNotes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true // includes createdAt and updatedAt
});

module.exports = mongoose.model('DailyJournal', dailyJournalSchema);
