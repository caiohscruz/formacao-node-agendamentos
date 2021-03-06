class AppointmentFactory {
    Build(appo){

        var day = appo.date.getDate()+1
        var month = appo.date.getMonth()
        var year = appo.date.getFullYear()
        var hour = Number.parseInt(appo.time.split(":")[0])
        var minutes = Number.parseInt(appo.time.split(":")[1])

        var startDate = new Date(year, month, day, hour, minutes, 0, 0)

        return {
            id: appo._id,
            title: `${appo.name} (${appo.description})`,
            email: appo.email,
            start: startDate,
            end: startDate,
            notified: appo.notified
        }
    }
}

module.exports =  new AppointmentFactory()