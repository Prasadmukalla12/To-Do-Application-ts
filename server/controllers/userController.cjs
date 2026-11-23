const userModel = require("../models/userModel.cjs")

function readUser(body) {
    return {
        user_id: body.user_id,
        user_name: body.user_name,
        password: body.password,
        email: body.email,
    }
}

async function list(req, res) {
    res.send(await userModel.findAll())
}

async function get(req, res) {
    res.send(await userModel.findById(req.params.user_id))
}

async function create(req, res) {
    await userModel.create(readUser(req.body))
    res.send("user added success")
}

async function update(req, res) {
    await userModel.update(req.params.id, readUser(req.body))
    res.send("user updated success")
}

async function remove(req, res) {
    await userModel.remove(req.params.id)
    res.send("user deleted success")
}

module.exports = { list, get, create, update, remove }
