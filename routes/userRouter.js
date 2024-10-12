const { Router } = require('express');
const userRouter = Router();
const userController = require('../controllers/userController');

userRouter.get('/signup', userController.newUserGet);

userRouter.post('/signup', userController.newUserPost);

module.exports = userRouter;