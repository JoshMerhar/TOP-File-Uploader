const express = require('express');
const session = require('express-session');
const passport = require('passport');
const createError = require('http-errors');
const path = require('node:path');
const cookieParser = require('cookie-parser');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const { PrismaClient } = require('@prisma/client');
const compression = require('compression');
const helmet = require('helmet');
const indexRouter = require('./routes/indexRouter');
const userRouter = require('./routes/userRouter');
const fileRouter = require('./routes/fileRouter');
require('dotenv').config();

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression());

app.use(
    session({
        cookie: {
            maxAge: 7 * 24 * 60 * 60 * 1000 // ms
        },
        secret: 'super duper secret',
        resave: true,
        saveUninitialized: true,
        store: new PrismaSessionStore(
            new PrismaClient(),
                {
                    checkPeriod: 2 * 60 * 1000,  //ms
                    dbRecordIdIsSessionId: true,
                    dbRecordIdFunction: undefined,
                }
        )
    })
);

app.use(passport.session());

const assetsPath = path.join(__dirname, 'public');
app.use(express.static(assetsPath));

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            "script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net"]
        },
    }),
);

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/library', fileRouter);

app.use(function(req, res, next) {
    next(createError(404));
});

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});  

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    console.log(res.locals.error);
    res.status(err.status || 500);
    res.render('error', { error: err });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Express app listening on port ${PORT}!`));