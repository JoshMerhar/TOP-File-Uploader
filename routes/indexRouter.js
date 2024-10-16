const { Router } = require('express');
const indexRouter = Router();
const indexController = require('../controllers/indexController');
const passport = require('passport');
require('../passport-config');

indexRouter.get('/', indexController.indexGet);

indexRouter.get('/login', indexController.getLogin);

indexRouter.post('/login', (req, res, next) => {
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
            return res.redirect('/library');
        });
    })(req, res, next);
});

indexRouter.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
});

module.exports = indexRouter;