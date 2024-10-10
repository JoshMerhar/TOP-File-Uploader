const { Router } = require('express');
const fileRouter = Router();
const fileController = require('../controllers/fileController');
const multer = require('multer');
const upload = multer({ dest: './public/data/uploads' });
const auth = require('./auth');

fileRouter.get('/new-folder', auth.isAuth, (req, res, next) => {
    res.send('New Folder');
})

fileRouter.get('/new-file', auth.isAuth, (req, res, next) => {
    res.render('uploadFile');
});

fileRouter.post('/new-file', upload.single('uploaded_file'), function(req, res) {
    console.log(req.file, req.body.filename);
});

module.exports = fileRouter;