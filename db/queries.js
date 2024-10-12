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

async function createFile(fileInfo) {
  const { filename, ownerId, folderId, url } = fileInfo;
  await prisma.file.create({
      data: {
          filename: filename,
          ownerId: ownerId,
          folderId: folderId,
          url: url
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

async function getSingleFile(fileId) {
    const file = await prisma.file.findUnique({
        where: {
            id: fileId
        }
    })
    return file;
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
    createFile,
    getFolderFiles,
    getFolderInfo,
    getSingleFile,
}