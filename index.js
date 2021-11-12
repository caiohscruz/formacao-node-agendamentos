const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const AppointmentService = require("./services/AppointmentService");

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/agendamento", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/agendamento", (req, res) => {
  res.render("create");
});

app.post("/create", async (req, res) => {
  var result = await AppointmentService.Create({
    name: req.body.name,
    email: req.body.email,
    cpf: req.body.cpf,
    description: req.body.description,
    date: req.body.date,
    time: req.body.time,
  });
  if (result.status == true) {
    res.redirect("/");
  } else {
    res.send(result.msg);
  }
});

app.get("/getcalendar", async (req, res) => {
  var result = await AppointmentService.GetAll(false);
  res.json(result);
});

app.get("/agendamento/:id", async (req, res) => {
  var id = req.params.id;

  var result = await AppointmentService.GetById(id);

  if (result.status == true) {
    res.status(200);
    res.render("event",{appo: result.data});
  } else {
    res.status(500)
    console.log(result.msg)
    res.redirect("/",{msg: result.msg})
  }
});

app.post("/finish", async (req,res) =>{
    var id =  req.body.id

    var result = await AppointmentService.Finish(id)

    if(result.status==true){
        res.status(200)
        res.redirect("/")
    }else{
        res.status(500)
        res.json({msg: result.msg})
    }
})

app.get("/list", async (req, res) => {
    var result = await AppointmentService.GetAll(true)
    res.render("list", {result})
})

app.get("/searchresult", async (req, res) => {
    var result = await AppointmentService.Search(req.query.search)
    if(result.status==true){
        res.status(200)
        res.render("list", {result: result.appos})

    }else{  
        res.status(500)
        res.json({msg: result.msg})
    }
})

var pollTime = 300000

setInterval(async ()=>{
    await AppointmentService.SendNotification()
}, pollTime)



app.listen(8080, () => {
  console.log("Rodando");
});
