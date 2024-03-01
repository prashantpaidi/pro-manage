const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const verifyAuthToken = require('../middleware/authMiddleware');

// CRUD operations
router.get('/user/:userId', verifyAuthToken, taskController.getAllTasks);
router.get('/:id', taskController.getTaskById);
router.post('/', verifyAuthToken, taskController.createTask);
router.put('/:id', verifyAuthToken, taskController.updateTask);
router.delete('/:id', verifyAuthToken, taskController.deleteTask);

// Analytics
router.get(
  '/analytics/:userId',
  verifyAuthToken,
  taskController.getTaskAnalytics
);

// Filtered tasks
router.get(
  '/grouped/user/:userId',
  verifyAuthToken,
  taskController.getAllTasksGrouped
); // Get tasks grouped by type

module.exports = router;
