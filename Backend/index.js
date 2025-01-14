const connectToMongo = require('./db');
const express = require('express')
var cors = require('cors');

connectToMongo();
const app = express()
const port = 5000

app.use(cors())
app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ limit: '500mb', extended: true }));

app.get('/', (req, res) => {
  res.send('Hello User!') 
})


app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/todolist', require('./routes/todolist'));



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})