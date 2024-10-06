const isAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401);
        res.render('notAuthorized', { authLevel: 'logged in' });
    }
}

module.exports = {
    isAuth,
};