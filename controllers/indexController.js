async function indexGet(req, res) {
    res.render('index');
}

async function getLogin(req, res) {
    // Redirect to user portal if already logged in
    if (req.user) {
        return res.redirect('/library');
    }
    // Retrieve error messages from session
    const errorMessage = req.session.messages || [];
    if (errorMessage.message) {
        const error = { msg: errorMessage.message };
        req.session.messages = []; // Clear error messages after rendering
        return res.render('login', { errors: [error] });
    } else {
        res.render('login');
    }
}

module.exports = {
    indexGet,
    getLogin,
}