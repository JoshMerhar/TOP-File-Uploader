const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function createUser(userInfo) {
    const { username, password } = userInfo;
    await prisma.user.create({
        data: {
            username: username,
            password: password
        }
    })
}

async function checkUsername(username) {
    const usernameTaken = await prisma.user.findUniqueOrThrow({
        where: {
            username: username
        }
    })
    return usernameTaken;
}

async function showAllFolders(userId) {
    const userFolders = await prisma.folder.findMany({
      where: {
        ownerId: userId
      },
      orderBy: {
        folderName: 'asc'
      }
    })
    return userFolders;
}

async function createFolder(folderInfo) {
    const { folderName, ownerId } = folderInfo;
    await prisma.folder.create({
        data: {
            folderName: folderName,
            ownerId: ownerId
        }
    })
}

async function deleteFolder(folderId) {
    await prisma.folder.delete({
        where: {
            id: folderId
        }
    })
}

async function createFile(fileInfo) {
  const { filename, ownerId, folderId, fileType, fileSize, url, publicId } = fileInfo;
  await prisma.file.create({
      data: {
          filename: filename,
          ownerId: ownerId,
          folderId: folderId,
          fileType: fileType,
          fileSize: fileSize,
          url: url,
          publicId: publicId
      }
  })
}

async function deleteFile(fileId) {
    await prisma.file.delete({
        where: {
            id: fileId
        }
    })
}

async function getFolderFiles(folderId) {
  const files = await prisma.file.findMany({
      where: {
          folderId: folderId
      }
  })
  return files;
}

async function getFolderInfo(folderId) {
    const folder = await prisma.folder.findUnique({
        where: {
            id: folderId
        }
    })
    return folder;
}

async function updateFolder(editedFolder, folderId) {
    const { folderName } = editedFolder;
    await prisma.folder.update({
        where: {
            id: folderId
        },
        data: {
            folderName: folderName
        },
    })
}

async function countFolderFiles(folderId) {
    const fileCount = await prisma.file.count({
        where: {
            folderId: folderId
        }
    })
    return fileCount;
}

async function getSingleFile(fileId) {
    const file = await prisma.file.findUnique({
        where: {
            id: fileId
        }
    })
    return file;
}

async function updateFile(editedFile, fileId) {
    const { filename } = editedFile;
    await prisma.file.update({
        where: {
            id: fileId
        },
        data: {
            filename: filename
        },
    })
}

/* main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  }) */

module.exports = {
    createUser,
    checkUsername,
    showAllFolders,
    createFolder,
    deleteFolder,
    createFile,
    deleteFile,
    getFolderFiles,
    getFolderInfo,
    updateFolder,
    countFolderFiles,
    getSingleFile,
    updateFile,
}