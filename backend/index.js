const connectToMango = require('./db')
const express = require('express')
var cors = require('cors')


connectToMango();
var app = express()
const port = 5000
// var app = express()

app.use(cors())
app.use(express.json())
//Available routes
app.use('/api/auth', require("./routes/auth"))
app.use('/api/notes', require("./routes/notes"))

app.listen(port, () => {
    console.log(`iNotebook backend listening at http://localhost:${port}`)
})