const appointment = require("../models/Appointment");
const mongoose = require("mongoose");
const AppointmentFactory = require("../factories/AppointmentFactory");
const mailer = require("nodemailer");

const Appo = mongoose.model("Appointment", appointment);

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
      notified: false,
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

  async GetById(id) {
    try {
      var event = await Appo.findOne({ _id: id });

      return {
        status: true,
        data: event,
      };
    } catch (err) {
      return {
        status: false,
        msg: err,
      };
    }
  }

  async Finish(id) {
    try {
      await Appo.findByIdAndUpdate(id, { finished: true });
      return {
        status: true,
      };
    } catch (err) {
      console.log(err);
      return {
        status: false,
        msg: err,
      };
    }
  }

  async Search(query) {
    try {
      var result = await Appo.find().or([{ email: query }, { cpf: query }]);
      return {
        status: true,
        appos: result,
      };
    } catch (err) {
      console.log(err);
      return {
        status: false,
        msg: err,
      };
    }
  }

  async SendNotification() {
    var result = await this.GetAll(false);

    var transporter = mailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "bcdfcdf114fff9",
        pass: "737d26c42fbb4d"
      }
    });

    result.forEach((appo) => {
      var date = appo.start.getTime();
      var interval = 60 * 60 * 1000;
      var gap = date - Date.now();

      if (gap <= interval && appo.notified == false) {
        transporter
          .sendMail({
            from: "Agendamento <agendamento@agendamento.com>",
            to: appo.email,
            subject: "Lembrete de consulta",
            text: `Você possui uma consulta dentro de ${
              interval / 60000
            } minutos`,
          })
          .then(async () => {
            try{
              await Appo.findByIdAndUpdate(appo.id, { notified: true });
              console.log("atualizado")
            }catch(err){
              console.log(err)
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  }
}

module.exports = new AppointmentService();
