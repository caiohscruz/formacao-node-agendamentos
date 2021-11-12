const appointment = require("../models/Appointment");
const mongoose = require("mongoose");

const Appo = mongoose.model("Appointment", appointment);
const AppointmentFactory = require("../factories/AppointmentFactory");

class AppointmentService {
  async Create(obj) {
    var newAppo = new Appo({
      name: obj.name,
      email: obj.email,
      cpf: obj.cpf,
      description: obj.description,
      date: obj.date,
      time: obj.time,
      finished: false,
      notified: false
    });
    try {
      await newAppo.save();
      return {
        status: true,
        msg: "Salvo com sucesso",
      };
    } catch (err) {
      return {
        status: false,
        msg: "Erro - " + err,
      };
    }
  }

  async GetAll(showFinished) {
    if (showFinished == true) {
      var appos = await Appo.find();
      return appos;
    } else {
      var appos = await Appo.find({ finished: false });
      var appointments = [];
  
      appos.forEach((appointment) => {
        if (appointment.date != null)
          appointments.push(AppointmentFactory.Build(appointment));
      });
  
      return appointments;
    }
  }

  async GetById(id){
    try{
      var event =  await Appo.findOne({'_id': id})

      return {
        status: true,
        data: event
      }

    }catch(err){

      return {
        status: false,
        msg: err
      }
    }
  }

  async Finish(id){
    try{
      await Appo.findByIdAndUpdate(id, {finished: true})
      return{
        status:true
      }
    }catch(err){
      console.log(err)
      return{
        status: false,
        msg: err
      }
    }
  }

  async Search(query){
  try{
    var result = await Appo.find().or([{email: query}, {cpf: query}])
    return {
      status: true,
      appos: result
    }
  } catch(err){
    console.log(err)
    return {
      status:false,
      msg: err
    }
  }   
  }

  async SendNotification(){
    var result = await this.GetAll(false)
  }
}

module.exports = new AppointmentService();
