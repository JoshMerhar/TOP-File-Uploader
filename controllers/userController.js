const db = require('../db/queries');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require("express-validator");

async function newUserGet(req, res) {
    await res.render('newUserForm');
}

const validateUser = [
    body("username").trim()
        .isLength({ min: 1, max: 50 }).withMessage("Username must be between 1 and 50 characters."),
    body("password").trim()
        .isLength({ min: 5 }).withMessage("Password must contain at least 5 characters."),
    body("passwordConfirm").trim()
        .custom((value, { req }) => {
            return value === req.body.password;
        }).withMessage("Passwords don't match!"),
];

const newUserPost = [
    validateUser,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render('newUserError', {
                username: req.body.username,
                errors: errors.array()
            });
        }
        const { username, password } = req.body;
        // const takenUsername = await db.checkUsernameEmail(username);
        /* if (takenUsername) {
            const error = { msg: 'Username already taken' }
            return res.status(400).render('newUserError', {
                username: req.body.username,
                errors: [error]
            });
        } */
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            username: username,
            password: hashedPassword
        }
        db.createUser(newUser);
        // res.redirect("/login");
        res.send('Account created!');
    }
];

module.exports = {
    newUserGet,
    newUserPost,
}