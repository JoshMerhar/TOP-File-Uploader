const { Router } = require('express');
const fileRouter = Router();
const fileController = require('../controllers/fileController');
const multer = require('multer');
const upload = multer({ dest: './public/data/uploads', limits: { fileSize: 1024 * 1024 * 1 } }); // 1MB size limit
const fs = require('fs');
const auth = require('./auth');

// Library route
fileRouter.get('/', auth.isAuth, async (req, res, next) => {
    const folders = await fileController.getUserFolders(req.user.id);
    const fileCounts = await fileController.countFolderFiles(folders);
    res.render('userLibrary', { 
        username: req.user.username,
        folders: folders,
        fileCounts: fileCounts
     });
});

// Folder routes
fileRouter.get('/new-folder', auth.isAuth, (req, res, next) => {
    res.render('newFolder');
})

fileRouter.post('/new-folder', fileController.newFolderPost);

fileRouter.get('/folder/:id', auth.isAuth, async (req, res, next) => {
    const folder = await fileController.getFolderInfo(req.params.id);
    const files = await fileController.getFolderFiles(req.params.id);
    res.render('folderContents', { 
        folder: folder,
        files: files 
    });
});

fileRouter.get('/folder/:id/edit', auth.isAuth, async (req, res, next) => {
    const folder = await fileController.getFolderInfo(req.params.id);
    res.render('editFolder', { folder: folder });
})

fileRouter.post('/folder/:id/edit', fileController.editFolderPost);

fileRouter.get('/folder/:id/delete', auth.isAuth, async (req, res, next) => {
    const folder = await fileController.getFolderInfo(req.params.id);
    res.render('deleteFolder', { folder: folder });
})

fileRouter.post('/folder/:id/delete', async (req, res, next) => {
    await fileController.deleteFolderPost(req.params.id);
    res.redirect('/library');
});

// File routes
fileRouter.get('/new-file', auth.isAuth, async (req, res, next) => {
    const folders = await fileController.getUserFolders(req.user.id);
    res.render('uploadFile', { folders: folders });
});

fileRouter.post('/new-file', upload.single("uploaded_file"), fileController.newFilePost);

fileRouter.get('/folder/file/:id', auth.isAuth, async (req, res, next) => {
    const file = await fileController.getFileInfo(req.params.id);
    res.render('fileInfo', { file: file });
});

fileRouter.get('/folder/file/:id/edit', auth.isAuth, async (req, res, next) => {
    const file = await fileController.getFileInfo(req.params.id);
    res.render('editFile', { file: file });
});

fileRouter.post('/folder/file/:id/edit', fileController.editFilePost)

fileRouter.get('/folder/file/:id/delete', auth.isAuth, async (req, res, next) => {
    const file = await fileController.getFileInfo(req.params.id);
    res.render('deleteFile', { file: file });
});

function multerDelete(filePath) {
    fs.unlink(`./public/data/uploads/${filePath}`, (err) => {
        if (err) {
            console.error('Error deleting file: ', err);
        } else {
            console.log('File deleted successfully');
        }
    });
};

fileRouter.post('/folder/file/:id/delete', async (req, res, next) => {
    const file = await fileController.getFileInfo(req.params.id);
    await fileController.deleteFilePost(file);
    multerDelete(file.publicId);
    res.redirect(`/library/folder/${file.folderId}`);
});

fileRouter.get('/folder/:id/new-file', auth.isAuth, async (req, res, next) => {
    const folder = await fileController.getFolderInfo(req.params.id);
    res.render('uploadFolderFile', { folder: folder });
})

fileRouter.post('/folder/:id/new-file', upload.single('uploaded_file'), fileController.newFilePost);

module.exports = fileRouter;