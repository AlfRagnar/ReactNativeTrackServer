const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = mongoose.model('User')

const router = express.Router()

router.post('/signup', async (req, res) => {
  const { email, password } = req.body

  try {
    const newUser = new User({ email, password })
    // Check if user already exists
    const checkEmail = await User.findOne({ email })
    if (checkEmail === null) {
      await newUser.save()
      const token = jwt.sign({ userId: newUser._id }, 'MY_SECRET_KEY')
      res.send({ token })
    } else {
      return res.status(404).send({ message: 'User already exists' })
    }
  } catch (err) {
    return res.status(422).send({ message: 'Error: ' + err.message })
  }
})

router.post('/signin', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res
      .status(422)
      .send({ error: 'Must provide email and password' })
  }

  const user = await User.findOne({ email })
  if (!user) {
    return res.status(422).send({ error: 'Invalid password or email' })
  }

  try {
    await user.comparePassword(password)
    const token = jwt.sign({ userId: user._id }, 'MY_SECRET_KEY')
    res.send({ token })
  } catch (err) {
    return res.status(422).send({ error: 'Invalid password or email' })
  }
})

module.exports = router
