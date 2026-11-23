const database = require("../config/database.cjs")

const appointments = database.collection("appointments")

function findById(id, userId) {
    return appointments.findOne({ appointment_id: id, user_id: userId })
}

function findByUserId(userId) {
    return appointments.find({ user_id: userId }).toArray()
}

function create(appointment) {
    return appointments.insertOne(appointment)
}

function update(id, appointment) {
    return appointments.updateOne({ appointment_id: id, user_id: appointment.user_id }, { $set: appointment })
}

function remove(id, userId) {
    return appointments.deleteOne({ appointment_id: id, user_id: userId })
}

module.exports = { findById, findByUserId, create, update, remove }
