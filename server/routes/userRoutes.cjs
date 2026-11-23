const { Router } = require("express")
const controller = require("../controllers/userController.cjs")

const router = Router()

router.get("/users", controller.list)
router.get("/users/:user_id", controller.get)
router.post("/add-user", controller.create)
router.put("/update-user/:id", controller.update)
router.delete("/delete-user/:id", controller.remove)

module.exports = router
