const { createHash, randomBytes } = require("node:crypto")
const database = require("../config/database.cjs")

const sessions = database.collection("sessions")
const sessionDuration = 24 * 60 * 60 * 1000

function hashToken(token) {
    return createHash("sha256").update(token).digest("hex")
}

async function create(userId) {
    await sessions.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })
    const token = randomBytes(32).toString("hex")
    await sessions.insertOne({
        _id: hashToken(token),
        userId,
        expiresAt: new Date(Date.now() + sessionDuration),
    })
    return token
}

function find(token) {
    return sessions.findOne({ _id: hashToken(token), expiresAt: { $gt: new Date() } })
}

function remove(token) {
    return sessions.deleteOne({ _id: hashToken(token) })
}

module.exports = { create, find, remove }
