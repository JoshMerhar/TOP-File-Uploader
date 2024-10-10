const { Router } = require('express');
const userRouter = Router();
const userController = require('../controllers/userController');
const auth = require('./auth');

userRouter.get('/signup', userController.newUserGet);

userRouter.post('/signup', userController.newUserPost);

userRouter.get('/library', auth.isAuth, (req, res, next) => {
    res.render('userLibrary', { username: req.user.username });
});

module.exports = userRouter;