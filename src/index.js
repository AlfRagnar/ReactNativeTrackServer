require('./models/User')
require('./models/Track')
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const authRoutes = require('./routes/authRoutes')
const trackRoutes = require('./routes/trackRoutes')
const requireAuth = require('./middlewares/requireAuth')

const app = express()

app.use(bodyParser.json())
app.use(authRoutes)
app.use(trackRoutes)

// ***REMOVED***

const mongoUri = '' // YOUR LINK TO YOUR MONGODB, I USE MONGODB ON CLOUD
if (!mongoUri) {
  throw new Error('You need to provide a valid MongoURI')
}
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
})
mongoose.connection.on('connected', () => {
  console.log('Connected to mongo instance')
})
mongoose.connection.on('error', (err) => {
  console.error('Error connecting to mongo', err)
})

app.get('/', requireAuth, (req, res) => {
  res.send(`Your email is ${req.user.email}`)
})

const port = 3000

app.listen(port, () => {
  console.log('Listening on port 3000')
})
