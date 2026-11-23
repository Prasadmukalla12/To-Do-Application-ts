const database = require("../config/database.cjs")

const users = database.collection("users")

function findById(id) {
    return users.findOne({ user_id: id })
}

async function create(user) {
    await users.createIndex({ user_id: 1 }, { unique: true })
    return users.insertOne(user)
}

function upgradePassword(user, password) {
    return users.updateOne({ _id: user._id, password: user.password }, { $set: { password } })
}

module.exports = { findById, create, upgradePassword }
