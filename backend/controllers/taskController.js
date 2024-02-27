const Task = require('../models/Task');

// Get all tasks
const getAllTasks = async (req, res) => {
  try {
    let startDate = req.query.startDate;
    if (startDate) {
      startDate = new Date(startDate);
    }

    const tasks = await Task.find({
      user: req.params.userId,
      createdAt: { $gte: startDate }, // Filter tasks created after the startDate
    });
    res.json(tasks);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// Get task by ID
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (task) {
      res.json(task);
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a task
const createTask = async (req, res) => {
  console.log(req.body);
  const task = new Task({
    title: req.body.title,
    priority: req.body.priority,
    checklist: req.body.checklist,
    taskType: req.body.taskType,
    due_date: req.body.due_date,
    user: req.body.user,
  });

  try {
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

// Update a task
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (task) {
      task.title = req.body.title || task.title;
      task.priority = req.body.priority || task.priority;
      task.checklist = req.body.checklist || task.checklist;
      task.taskType = req.body.taskType || task.taskType;
      task.due_date = req.body.due_date || task.due_date;
      task.user = req.body.user || task.user;

      const updatedTask = await task.save();
      res.json(updatedTask);
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  try {
    console.log('id', req.params.id);
    const task = await Task.findById(req.params.id);
    if (task) {
      await Task.deleteOne({ _id: req.params.id });
      res.json({ message: 'Task deleted' });
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
