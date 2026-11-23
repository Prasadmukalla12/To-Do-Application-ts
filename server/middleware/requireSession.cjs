const sessions = require("../models/sessionModel.cjs")

module.exports = async function requireSession(req, res, next) {
    const token = /^Bearer ([a-f0-9]{64})$/.exec(req.get("Authorization") ?? "")?.[1]
    const session = token && await sessions.find(token)
    if (!session) return res.status(401).json({ error: "Please sign in" })

    req.userId = session.userId
    req.sessionToken = token
    next()
}
