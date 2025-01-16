const express = require('express')
const luxon = require('luxon')
const app = express()
app.use(express.json())
const port = 3000
const crypto = require("crypto");

let allAppointments = {}

app.get('/appointments', (req, res) => {
    let availableAppointments = {}
    if (Object.keys(allAppointments).length == 0)
        return res.status(200).json([]);
    Object.keys(allAppointments).reduce((_, key) => {
        if (allAppointments[key].reservedBy == null)
            availableAppointments[key] = allAppointments[key];
        else {
            if ((allAppointments[key].reservedDate + 1800 < luxon.DateTime.now().toUnixInteger()) && allAppointments[key].confirmed == false)
                availableAppointments.push(allAppointments[key]);
        }
    })
    res.status(200).json(availableAppointments)
})

app.post('/availability', (req, res) => {
    let startUnixInteger = luxon.DateTime.fromISO(req.body.start).toUnixInteger()
    let endUnixInteger = luxon.DateTime.fromISO(req.body.end).toUnixInteger()
    for (let i = startUnixInteger; i <= endUnixInteger-900; i += 900) {
        allAppointments[crypto.randomUUID()] = {
            providerName : req.body.providerName,
            start: i,
            end: i+900,
            created: luxon.DateTime.now(),
            confirmed: false,
            reservedBy: null,
            reservedDate: null,
        }
        console.log(`start is ${luxon.DateTime.fromSeconds(i)}`)
        console.log(`end is ${luxon.DateTime.fromSeconds(i+900)}`)
    }
    res.sendStatus(200)
})

app.post('/appointments/:appointmentID/reserve', (req, res) => {
    appointmentID = req.params.appointmentID
    allAppointments[appointmentID].reservedBy = req.body.name
    allAppointments[appointmentID].reservedDate = luxon.DateTime.now()
    res.sendStatus(200)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})