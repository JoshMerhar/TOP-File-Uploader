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
}