const appointmentModel = require("../models/appointmentModel.cjs")

function readAppointment(body) {
    return {
        appointment_id: parseInt(body.appointment_id),
        title: body.title,
        description: body.description,
        date: new Date(body.date),
        user_id: body.user_id,
    }
}

async function list(req, res) {
    res.send(await appointmentModel.findAll())
}

async function get(req, res) {
    res.send(await appointmentModel.findById(parseInt(req.params.id)))
}

async function listByUser(req, res) {
    res.send(await appointmentModel.findByUserId(req.params.user_id))
}

async function create(req, res) {
    await appointmentModel.create(readAppointment(req.body))
    res.send("appointment added success")
}

async function update(req, res) {
    await appointmentModel.update(parseInt(req.params.id), readAppointment(req.body))
    res.send("appointment update success")
}

async function remove(req, res) {
    await appointmentModel.remove(parseInt(req.params.id))
    res.send("appointment deleted success")
}

module.exports = { list, get, listByUser, create, update, remove }
