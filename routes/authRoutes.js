const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

router.get('/home', authController.homePage)
router.post('/login', authController.login)
router.post('/register', authController.register)


module.exports = router;