const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const { getBalance, addDeposit, createWithdrawal } = require('./walletModel')
const { createUser, getUser, getUserTest, getAllUsers } = require('./userModel')

const app = express()
app.use(morgan('dev'))
app.use(cors())
app.use(express.json())


app.post('/auth', async (req, res, next) => {
  const { username, accountNumber, id } = req.body
  let accountNumberDigits = Number(accountNumber)
  if (!username || !accountNumber) {
    res.status(400).json("Username or account number is missing")
    return
  }
  try {
    const user = await getUser({ username, accountNumberDigits })
    res.status(201).json({ message: "User found", user })
  } catch (error) {
    throw (error)
  }
})
app.get('/usertest', async (req, res, next) => {
  const { username } = req.body
  if (!username) {
    res.status(400).json("Username or account number is missing")
    return
  }
  try {
    const user = await getUserTest({ username })
    res.status(201).json({ message: "User found", user })
  } catch (error) {
    throw (error)
  }
})

app.post('/user', async (req, res, next) => {
  try {
    const username = req.body.username
    const fullName = req.body.fullName
    const user = await getUserTest({ username })
    if (user && user.username === username) {
      return res.status(300).json("User name already exists")
    }
    const newUser = await createUser(username, fullName)
    console.log(req.body)
    res.status(201).json({ message: 'User created', entry: newUser })
  } catch (err) {
    res.status(400).json({ error: 'Failed to create a user' })
    next(err)
  }
})

app.get('/balance', async (req, res, next) => {
  if (!req.body.userId) {
    return
  }
  try {
    const transactions = await getBalance({ userId: req.body.userId })
    const balance = transactions.reduce(
      (acc, curVal) => acc + Number(curVal.amount),
      0
    )
    const transaction = {
      balance: balance,
      currency: '€',
      transactions: transactions,
    }
    res.status(201).json(transaction)
  } catch (err) {
    res.status(400).json({ error: 'Failed to fetch authors' })
    next(err)
  }
})
app.post('/deposit', async (req, res, next) => {
  const { amount, userId } = req.body
  if (!amount) {
    res.status(400).json({ error: `Amount missing or incorrect format.` })
    return
  }
  try {
    const newEntry = await addDeposit(amount, userId)
    const formattedEntry = {
      id: newEntry.id,
      userId,
      amount: newEntry.amount.toFixed(2),
      type: newEntry.type,
      createdAt: newEntry.createdAt.toISOString(),
    }
    res.status(201).json({ message: 'Amount added', entry: formattedEntry })
  } catch (error) {
    console.log(error)
    res.status(400).json('Something went wrong')
  }
})
app.post('/withdrawal', async (req, res, next) => {
  const { amount, userId } = req.body
  const numberUserId = Number(userId)
  if (!amount) {
    res.status(400).json({ error: `Amount missing or incorrect format.` })
    return
  }
  try {
    const transactions = await getBalance(numberUserId)
    console.log("withdrawl", transactions)
    const balance = transactions.reduce(
      (acc, curVal) => acc + Number(curVal.amount),
      0
    )
    if (Number(amount) > Number(balance)) {
      res.status(400).json('Withdrawn amount is greater than balance')
      return
    }
    const newEntry = await createWithdrawal(amount, userId)
    const formattedEntry = {
      id: newEntry.id,
      userId,
      amount: newEntry.amount.toFixed(2),
      type: newEntry.type,
      createdAt: newEntry.createdAt.toISOString(),
    }
    res.status(201).json({ message: 'Amount withdrawn', entry: formattedEntry })
  } catch (error) {
    console.log(error)
    res.status(400).json('Something went wrong')
  }
})

app.get('/users', async (_, res, next) => {
  const users = await getAllUsers()
  res.json(users)
})

module.exports = app
