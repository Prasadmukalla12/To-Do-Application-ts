const { Router } = require("express")
const controller = require("../controllers/userController.cjs")
const requireSession = require("../middleware/requireSession.cjs")

const router = Router()

router.post("/add-user", controller.create)
router.post("/login", controller.login)
router.post("/logout", requireSession, controller.logout)

module.exports = router
