const express = require('express')
const luxon = require('luxon')
const app = express()
app.use(express.json())
const port = 3000
const crypto = require("crypto");

let allAppointments = []

app.get('/appointments', (req, res) => {
    let availableAppointments = []
    for (const appointmentIndex in allAppointments){
        let appointment = allAppointments[appointmentIndex];
        // If the reservation hasn't been reserved, add to those displayed
        if (appointment.reservedBy == null)
        {
            availableAppointments.push(appointment);
        }
        else {
            // The reservation has been reserved, but it's been 30 minutes, and it hasn't been confirmed. Add to those displayed.
            if ((appointment.reservedDate.toUnixInteger() +
                    1800 < luxon.DateTime.now().toUnixInteger()) &&
                    appointment.confirmed == false) {
                // Since we are re-adding this to the displayed options, let's remove the expired reservation information
                allAppointments[appointmentIndex].reservedBy = null;
                allAppointments[appointmentIndex].reservedDate = null;
                availableAppointments.push(appointment);
            }
        }
    }
    res.status(200).json(availableAppointments)
})

app.post('/availability', (req, res) => {
    let startUnixInteger = luxon.DateTime.fromISO(req.body.start).toUnixInteger()
    let endUnixInteger = luxon.DateTime.fromISO(req.body.end).toUnixInteger()
    for (let i = startUnixInteger; i <= endUnixInteger-900; i += 900) {
        allAppointments.push({
            id: crypto.randomUUID(),
            providerName : req.body.providerName,
            start: i,
            end: i+900,
            created: luxon.DateTime.now().toUnixInteger(),
            confirmed: false,
            reservedBy: null,
            reservedDate: null,
        })
    }
    res.sendStatus(200)
})

app.post('/appointments/:appointmentID/reserve', (req, res) => {
    let appointmentID = req.params.appointmentID
    let appointmentIndex = allAppointments.findIndex(
        (appt) => {
            return appt.id == appointmentID
        })
    if(appointmentIndex == -1){
        return res.status(400).json({"error": "Appointment not found"})
    }
    let appointment = allAppointments[appointmentIndex];
    if(luxon.DateTime.fromSeconds(appointment.start) < luxon.DateTime.now().plus({ hours: 24 })){
        return res.status(400).json({error: "Appointments must be reserved at least 24 hours in advance."})
    }
    appointment.reservedBy = req.body.name
    appointment.reservedDate = luxon.DateTime.now()
    res.sendStatus(200)
})

app.post('/appointments/:appointmentID/confirm', (req, res) => {
    let appointmentID = req.params.appointmentID
    let appointmentIndex = allAppointments.findIndex(appointment => {return appointment.id == appointmentID})
    if(appointmentIndex == -1){
        return res.status(400).json({"error": "Appointment not found"})
    }
    allAppointments[appointmentIndex].confirmed = true
    res.sendStatus(200)
})

app.listen(port, () => {
    console.log(`Reservation API listening on port ${port}`)
})
