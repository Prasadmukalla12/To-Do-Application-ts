const { randomBytes, scrypt, timingSafeEqual } = require("node:crypto")
const { promisify } = require("node:util")
const userModel = require("../models/userModel.cjs")
const sessions = require("../models/sessionModel.cjs")

const deriveKey = promisify(scrypt)

async function hashPassword(password) {
    const salt = randomBytes(16).toString("hex")
    const key = await deriveKey(password, salt, 64)
    return `scrypt:${salt}:${key.toString("hex")}`
}

async function verifyPassword(password, stored) {
    if (typeof stored !== "string") return false
    // Existing accounts use plaintext. Upgrade them after a successful login.
    if (!stored.startsWith("scrypt:")) return password === stored.trim()

    const [, salt, hash] = stored.split(":")
    if (!salt || !/^[a-f0-9]{128}$/.test(hash ?? "")) return false
    const key = await deriveKey(password, salt, 64)
    return timingSafeEqual(key, Buffer.from(hash, "hex"))
}

async function create(req, res) {
    const { user_id, user_name, email, password } = req.body ?? {}
    if (![user_id, user_name, email, password].every(value =>
        typeof value === "string" && value.trim().length > 0 && value.length <= 254
    )) {
        return res.status(400).json({ error: "Invalid account details" })
    }

    try {
        await userModel.create({ user_id, user_name, email, password: await hashPassword(password.trim()) })
        res.status(201).json({ user_id })
    } catch (error) {
        if (error.code !== 11000) throw error
        res.status(409).json({ error: "User ID already exists" })
    }
}

async function login(req, res) {
    const { user_id, password } = req.body ?? {}
    if (typeof user_id !== "string" || typeof password !== "string" || user_id.length > 254 || password.length > 254) {
        return res.status(400).json({ error: "Invalid credentials" })
    }

    const user = await userModel.findById(user_id)
    if (!user || !await verifyPassword(password.trim(), user.password)) {
        return res.status(401).json({ error: "Invalid user ID or password" })
    }

    if (!user.password.startsWith("scrypt:")) {
        await userModel.upgradePassword(user, await hashPassword(password.trim()))
    }

    const token = await sessions.create(user.user_id)
    res.set("Cache-Control", "no-store").json({ user_id: user.user_id, token })
}

async function logout(req, res) {
    await sessions.remove(req.sessionToken)
    res.sendStatus(204)
}

module.exports = { create, login, logout }
