const appointment = require('../models/Appointment')
const mongoose = require('mongoose')

const Appo = mongoose.model("Appointment", appointment)

class AppointmentService {

    async Create(name, email, description, cpf, date, time){
        var newAppo = new Appo({
            name,
            email,
            cpf,
            description,
            date,
            time,
            finished: false
        })
        try{
            await newAppo.save()
            return {
                status: true,
                msg: "Salvo com sucesso"
            }
        }catch(err){
            return {
                status: false,
                msg: "Erro - " +  err
            }
        }
    }

}

module.exports= new AppointmentService()