const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/auth');

module.exports = (app) => {
    app.post('/user/register', userController.createUser);
    app.post('/user/login', userController.loginUser);
    app.delete('/user/:username', authMiddleware.auth, userController.deleteUser);
    app.patch('/user/:username', authMiddleware.auth, userController.updateUser);
}