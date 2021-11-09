const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

app.use(express.static('public'))

app.use(bodyParser.urlencoded({extended: true}))

app.use(bodyParser.json())

app.set('view engine', 'ejs')

mongoose.connect("mongoose://localhost:27017/agendamento", {useNewUrlParser: true, useUnifiedTopology: true})

app.get('/', (req, res) =>{
    res.send("Oi")
})

app.listen(8080, () => {})