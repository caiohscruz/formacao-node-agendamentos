const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const AppointmentService = require('./services/AppointmentService')

app.use(express.static('public'))

app.use(bodyParser.urlencoded({extended: false}))

app.use(bodyParser.json())

app.set('view engine', 'ejs')

mongoose.connect("mongodb://localhost:27017/agendamento", {useNewUrlParser: true, useUnifiedTopology: true})

app.get('/', (req, res) =>{
    res.render("index")
})

app.get('/register', (req, res) =>{
    res.render('create')
})

app.post('/create', async (req, res) =>{
    var result = await AppointmentService.Create(
        req.body.name,
        req.body.email,
        req.body.cpf,
        req.body.description,
        req.body.date,
        req.body.time,
    )
    if(result.status==true){
        res.redirect("/")
    }else{
        res.send(result.msg)
    }
})

app.get('/getcalendar', async (req,res) => {
    var result = await AppointmentService.GetAll(false)
    res.json(result)
})

app.listen(8080, () => {console.log("Rodando")})