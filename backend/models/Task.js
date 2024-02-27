const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  priority: {
    type: String,
    enum: ['HIGH PRIORITY', 'MODERATE PRIORITY', 'LOW PRIORITY'],
    required: true,
  },
  checklist: {
    type: [{ text: String, done: Boolean }],
    required: true,
  },
  taskType: {
    type: String,
    default: 'To do',
    enum: ['To do', 'Backlog', 'In progress', 'Done'],
    required: true,
  },
  due_date: Date,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
