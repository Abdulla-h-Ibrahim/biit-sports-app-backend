const express = require("express")
const router = express.Router()

const testController = require("../controllers/testController")

router.get("/testGeneral", testController.testGeneral)
router.get("/testDatabase", testController.testDatabaseConnection)

module.exports = router;