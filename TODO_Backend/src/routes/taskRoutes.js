const taskController = require('../controllers/taskController');
const authMiddleware = require('../middlewares/auth');

module.exports = (app) => {
    app.post('/task', authMiddleware.auth, taskController.createTask);
    app.get('/task/:id', authMiddleware.auth, taskController.getTaskById);
    app.get('/tasks/:username', authMiddleware.auth, taskController.getAllTasks);
    app.delete('/task/:id', authMiddleware.auth, taskController.deleteTask);
    app.patch('/task/:id', authMiddleware.auth, taskController.updateTask);
}