const { Router } = require("express")
const controller = require("../controllers/appointmentController.cjs")
const requireSession = require("../middleware/requireSession.cjs")

const router = Router()

router.get("/appointments", requireSession, controller.list)
router.get("/appointment/:id", requireSession, controller.get)
router.get("/appointments/:user_id", requireSession, controller.listByUser)
router.post("/add-appointment", requireSession, controller.create)
router.put("/update-appointment/:id", requireSession, controller.update)
router.delete("/delete-appointment/:id", requireSession, controller.remove)

module.exports = router
