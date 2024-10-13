const db = require('../db/queries');
const { body, validationResult } = require("express-validator");
const cloudinary = require('cloudinary').v2;

cloudinary.config({ secure: true });

async function uploadFile(filePath) {
    const options = {
        resource_type: 'raw',
        use_filename: true,
        unique_filename: false,
        overwrite: true,
    };

    try {
        const result = await cloudinary.uploader.upload(filePath, options);
        console.log(result);
        return result.secure_url;
    } catch (error) {
        console.error(error);
    }
};

const validateFolder = [
    body("folderName").trim()
        .isLength({ min: 1, max: 50 }).withMessage("Folder name must be between 1 and 50 characters.")
];

const newFolderPost = [
    validateFolder,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render('newFolder', {
                errors: errors.array()
            });
        }
        const { folderName } = req.body;
        const userId = req.user.id;
        const newFolder = {
            folderName: folderName,
            ownerId: userId
        }
        await db.createFolder(newFolder);
        res.redirect('/library');
    }
]

const editFolderPost = [
    validateFolder,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const folder = await getFolderInfo(req.params.id);
            return res.status(400).render('editFolder', {
                folder: folder,
                errors: errors.array()
            });
        }
        const { folderName } = req.body;
        const editedFolder = {
            folderName: folderName
        }
        await db.updateFolder(editedFolder, req.params.id);
        res.redirect(`/library/folder/${req.params.id}`);
    }
]

async function deleteFolderPost(folderId) {
    await db.deleteFolder(folderId);
}

async function getUserFolders(userId) {
    const folders = await db.showAllFolders(userId);
    return folders;
}

const validateFile = [
    // body("uploaded_file").notEmpty(),
    body("filename").trim()
        .isLength({ min: 1, max: 50 }).withMessage("Filename must be between 1 and 50 characters."),
    body("file_folder").trim().notEmpty()
];

const newFilePost = [
    validateFile,
    async (req, res) => {
        // Logic to upload to Cloudinary goes here..?
        // Replace url below with Cloudinary url when it's set up
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const folders = await db.showAllFolders(req.user.id);
            return res.status(400).render('uploadFile', {
                folders: folders,
                errors: errors.array()
            });
        }
        const fileURL = await uploadFile(req.file.path);
        const { filename, file_folder } = req.body;
        const fileType = req.file.mimetype;
        const ownerId = req.user.id;
        const newFile = {
            filename: filename,
            ownerId: ownerId,
            folderId: file_folder,
            fileType: fileType,
            url: fileURL
        }
        await db.createFile(newFile);
        res.redirect(`/library/folder/${file_folder}`);
    }
];

const validateUpdatedFile = [
    body("filename").trim()
        .isLength({ min: 1, max: 50 }).withMessage("Filename must be between 1 and 50 characters.")
]

const editFilePost = [
    validateUpdatedFile,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const file = await getFileInfo(req.params.id);
            return res.status(400).render('editFile', {
                file: file,
                errors: errors.array()
            });
        }
        const { filename } = req.body;
        const editedFile = {
            filename: filename
        }
        await db.updateFile(editedFile, req.params.id);
        res.redirect(`/library/folder/file/${req.params.id}`);
    }
];

async function deleteFilePost(fileId) {
    await db.deleteFile(fileId);
}

async function getFolderInfo(folderId) {
    const folder = await db.getFolderInfo(folderId);
    return folder;
}

async function getFolderFiles(folderId) {
    const files = await db.getFolderFiles(folderId);
    return files;
}

async function getFileInfo(fileId) {
    const file = await db.getSingleFile(fileId);
    return file;
}

module.exports = {
    newFolderPost,
    editFolderPost,
    deleteFolderPost,
    getUserFolders,
    newFilePost,
    editFilePost,
    deleteFilePost,
    getFolderInfo,
    getFolderFiles,
    getFileInfo,
}