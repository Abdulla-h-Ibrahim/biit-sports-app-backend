const express = require("express")
const router = express.Router()

const testController = require("../controllers/healthController")

router.get("/healthGeneral", testController.healthGeneral)

module.exports = router;