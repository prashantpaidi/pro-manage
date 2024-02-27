const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const verifyAuthToken = require('../middleware/authMiddleware');

router.get('/user/:userId', verifyAuthToken, taskController.getAllTasks);
router.get('/:id', taskController.getTaskById);
router.post('/', verifyAuthToken, taskController.createTask);
router.put('/:id', verifyAuthToken, taskController.updateTask);
router.delete('/:id', verifyAuthToken, taskController.deleteTask);

module.exports = router;
