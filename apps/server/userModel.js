const { PrismaClient } = require('@prisma/client')
const { getBalance } = require("./walletModel")


const prisma = new PrismaClient()

const createUser = async (username, fullName) => {
  try {
    const newUser = await prisma.user.create({
      data: {
        username,
        fullName,
        accountNumber: Math.floor(Math.random() * (9000 - 900) + 1),

      }
    })
    return newUser
  } catch (error) {
    throw (error)
  }
}


const getUserTest = async ({ username }) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        username
      }
    })
    return user
  } catch (error) {
    throw (error)
  }
}


const getUser = async ({ username, accountNumber }) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        username,
        accountNumber
      }
    })

    const transactions = await getBalance(user.id)
    return { user, transactions }
  } catch (error) {
    throw (error)
  }
}

const getAllUsers = async () => {
  const users = await prisma.user.findMany()
  return users
  // const usersWithTransactions = await Promise.all(users.map(async (user) => {
  //   const transactions = await getBalance(Number(user.id));
  //   return { user, transactions };
  // }));

  // return usersWithTransactions
}

module.exports = { createUser, getUser, getUserTest, getAllUsers }