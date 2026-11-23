const express = require("express")
const cors = require("cors")
const database = require("./config/database.cjs")
const userRoutes = require("./routes/userRoutes.cjs")
const appointmentRoutes = require("./routes/appointmentRoutes.cjs")

const app = express()

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get("/health", async (req, res) => {
    try {
        await database.command({ ping: 1 }, { timeoutMS: 5000 })
        res.json({ status: "ok" })
    } catch {
        res.status(503).json({ status: "database unavailable" })
    }
})

app.use(userRoutes)
app.use(appointmentRoutes)

app.use((req, res) => {
    res.status(404).type("text/plain").send("404 - Not found")
})

module.exports = app
