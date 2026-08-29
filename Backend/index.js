require('dotenv').config({ path: __dirname + '/.env' });
const connectToMongo = require('./db');
const express = require('express')
var cors = require('cors');
const rateLimit = require('express-rate-limit');

connectToMongo();
const app = express()
const port = process.env.PORT || 5000

const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:3000'];
app.use(cors({ origin: allowedOrigins, credentials: true }))
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: { error: "Too many attempts, try again after 15 minutes" } });

app.get('/', (req, res) => {
  res.send('Hello User!') 
})


app.use('/api/auth', authLimiter, require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/todolist', require('./routes/todolist'));



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})