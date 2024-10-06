const { Router } = require('express');
const indexRouter = Router();
const indexController = require('../controllers/indexController');
const passport = require('passport');
require('../passport-config');

indexRouter.get('/', indexController.indexGet);

// indexRouter.get('/login', indexController.getLogin);

/* indexRouter.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, options) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            req.session.messages = options;
            return res.redirect('/login');
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            return res.send('Logged in!');
            // return res.redirect('/user/library');
        });
    })(req, res, next);
}); */

module.exports = indexRouter;