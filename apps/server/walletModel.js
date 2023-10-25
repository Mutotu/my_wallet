const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const getBalance = async (userId) => {
  console.log(userId)
  const transactions = await prisma.transaction.findMany()
  return transactions.filter(t => t.userId === userId)
}
const addDeposit = async (amount, userId) => {
  try {
    const newEntry = await prisma.transaction.create({
      data: {
        amount,
        type: 'DEPOSIT',
        userId
      },
    })
    return newEntry
  } catch (error) {
    throw error
  }
}

const createWithdrawal = async (amount, userId) => {
  try {
    const newEntry = await prisma.transaction.create({
      data: {
        amount: amount * -1,
        type: 'WITHDRAWAL',
        userId
      },
    })
    return newEntry
  } catch (error) {
    throw error
  }
}

module.exports = { getBalance, addDeposit, createWithdrawal }
