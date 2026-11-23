const database = require("../config/database.cjs")

const appointments = database.collection("appointments")

function findAll() {
    return appointments.find({}).toArray()
}

function findById(id) {
    return appointments.findOne({ appointment_id: id })
}

function findByUserId(userId) {
    return appointments.find({ user_id: userId }).toArray()
}

function create(appointment) {
    return appointments.insertOne(appointment)
}

function update(id, appointment) {
    return appointments.updateOne({ appointment_id: id }, { $set: appointment })
}

function remove(id) {
    return appointments.deleteOne({ appointment_id: id })
}

module.exports = { findAll, findById, findByUserId, create, update, remove }
