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
  }
}, { timestamps: true });

const Form = mongoose.model('Form', formSchema);

export default Form;
