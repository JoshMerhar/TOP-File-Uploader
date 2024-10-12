const { Router } = require('express');
const fileRouter = Router();
const fileController = require('../controllers/fileController');
const multer = require('multer');
const upload = multer({ dest: './public/data/uploads' });
const auth = require('./auth');

fileRouter.get('/', auth.isAuth, async (req, res, next) => {
    const folders = await fileController.getUserFolders(req.user.id);
    res.render('userLibrary', { 
        username: req.user.username,
        folders: folders
     });
});

fileRouter.get('/new-folder', auth.isAuth, (req, res, next) => {
    res.render('newFolder');
})

fileRouter.post('/new-folder', fileController.newFolderPost);

fileRouter.get('/new-file', auth.isAuth, async (req, res, next) => {
    const folders = await fileController.getUserFolders(req.user.id);
    res.render('uploadFile', { folders: folders });
});

fileRouter.post('/new-file', upload.single('uploaded_file'), fileController.newFilePost);

fileRouter.get('/folder/:id', auth.isAuth, async (req, res, next) => {
    const folder = await fileController.getFolderInfo(req.params.id);
    const files = await fileController.getFolderFiles(req.params.id);
    res.render('folderContents', { 
        folder: folder,
        files: files 
    });
});

fileRouter.get('/folder/file/:id', auth.isAuth, async (req, res, next) => {
    const file = await fileController.getFileInfo(req.params.id);
    res.render('fileInfo', { file: file });
});

module.exports = fileRouter;