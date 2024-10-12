const db = require('../db/queries');
const { body, validationResult } = require("express-validator");

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
        const { filename, file_folder } = req.body;
        const ownerId = req.user.id;
        const url = req.file.filename;
        const newFile = {
            filename: filename,
            ownerId: ownerId,
            folderId: file_folder,
            url: url
        }
        console.log(newFile);
        await db.createFile(newFile);
        res.redirect(`/library/folder/${file_folder}`);
    }
];

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
    getUserFolders,
    newFilePost,
    getFolderInfo,
    getFolderFiles,
    getFileInfo,
}