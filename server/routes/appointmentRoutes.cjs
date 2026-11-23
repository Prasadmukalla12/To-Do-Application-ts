const { Router } = require("express")
const controller = require("../controllers/appointmentController.cjs")

const router = Router()

router.get("/appointments", controller.list)
router.get("/appointment/:id", controller.get)
router.get("/appointments/:user_id", controller.listByUser)
router.post("/add-appointment", controller.create)
router.put("/update-appointment/:id", controller.update)
router.delete("/delete-appointment/:id", controller.remove)

module.exports = router
