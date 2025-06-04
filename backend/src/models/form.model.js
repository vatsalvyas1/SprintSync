import mongoose from 'mongoose';

const formSchema = new mongoose.Schema({
  formName: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  notes: {
    type: String,
    default: '',
    trim: true
  },
  lockedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  lockedAt: {
    type: Date,
    default: null
  },
  isLocked: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['Available', 'Locked'],
    default: 'Available'
  }
}, { timestamps: true });

const Form = mongoose.model('Form', formSchema);
export default Form;
