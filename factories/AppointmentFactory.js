class AppointmentFactory {
    Build(appo){

        var day = appo.date.getDate()+1
        var month = appo.date.getMonth()
        var year = appo.date.getFullYear()
        var hour = Number.parseInt(appo.time.split(":")[0])
        var minutes = Number.parseInt(appo.time.split(":")[1])

        var startDate = new Date(year, month, day, hour, minutes, 0, 0)
        startDate.setHours(startDate.getHours() - 3)

        return {
            id: appo._id,
            title: appo.name + ' ' + appo.description,
            start: startDate,
            end: startDate
        }
    }
}

module.exports =  new AppointmentFactory()