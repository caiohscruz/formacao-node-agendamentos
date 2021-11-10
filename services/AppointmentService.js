const appointment = require("../models/Appointment");
const mongoose = require("mongoose");

const Appo = mongoose.model("Appointment", appointment);
const AppointmentFactory = require("../factories/AppointmentFactory");

class AppointmentService {
  async Create(name, email, description, cpf, date, time) {
    var newAppo = new Appo({
      name,
      email,
      cpf,
      description,
      date,
      time,
      finished: false,
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
    } else {
      var appos = await Appo.find({ finished: false });
    }
    var appointments = [];

    appos.forEach((appointment) => {
      if (appointment.date != null)
        appointments.push(AppointmentFactory.Build(appointment));
    });

    return appointments;
  }
}

module.exports = new AppointmentService();
