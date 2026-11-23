const appointmentModel = require("../models/appointmentModel.cjs")

function readAppointment(body, userId) {
    return {
        appointment_id: parseInt(body.appointment_id),
        title: body.title,
        description: body.description,
        date: new Date(body.date),
        user_id: userId,
    }
}

async function list(req, res) {
    res.send(await appointmentModel.findByUserId(req.userId))
}

async function get(req, res) {
    const appointment = await appointmentModel.findById(parseInt(req.params.id), req.userId)
    if (!appointment) return res.sendStatus(404)
    res.send(appointment)
}

async function listByUser(req, res) {
    if (req.params.user_id !== req.userId) return res.sendStatus(403)
    return list(req, res)
}

async function create(req, res) {
    await appointmentModel.create(readAppointment(req.body, req.userId))
    res.send("appointment added success")
}

async function update(req, res) {
    const result = await appointmentModel.update(parseInt(req.params.id), readAppointment(req.body, req.userId))
    if (!result.matchedCount) return res.sendStatus(404)
    res.send("appointment update success")
}

async function remove(req, res) {
    const result = await appointmentModel.remove(parseInt(req.params.id), req.userId)
    if (!result.deletedCount) return res.sendStatus(404)
    res.send("appointment deleted success")
}

module.exports = { list, get, listByUser, create, update, remove }
