import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const ChecklistItemSchema = new Schema({
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'done', 'backlog'],
    default: 'pending'
  },
  assignee: {
    type: String // You can use Schema.Types.ObjectId if referencing a User
  },
  notes: {
    type: String
  },
  attachments: [
    {
      filename: String,
      url: String,
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    }
  ]
}, { timestamps: true });

const DeploymentChecklistSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  sprint: {
    type: String,
    required: true
  },
  sprintLink: {
    type: String // URL to Jira or any external tracker
  },
  dueDate: {
    type: Date,
    required: true
  },
  priority: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'medium'
  },
  checklistItems: [ChecklistItemSchema]
}, { timestamps: true });

const DeploymentChecklist = model('DeploymentChecklist', DeploymentChecklistSchema);

export default DeploymentChecklist;
