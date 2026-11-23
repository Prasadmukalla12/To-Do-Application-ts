const database = require("../config/database.cjs")

const users = database.collection("users")

function findAll() {
    return users.find({}).toArray()
}

function findById(id) {
    return users.findOne({ user_id: id })
}

function create(user) {
    return users.insertOne(user)
}

function update(id, user) {
    return users.updateOne({ user_id: id }, { $set: user })
}

function remove(id) {
    return users.deleteOne({ user_id: id })
}

module.exports = { findAll, findById, create, update, remove }
