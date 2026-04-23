const express = require('express');
const router = express.Router();
const userController = require('../controllers/model controllers/userController');

router.post('/addUser', userController.createUser);
router.get('/getAllUsers', userController.getAllUsers);
router.get('/getUserById/:id', userController.getUserById);
router.put('/updateUserById/:id', userController.updateUserById);
router.delete('/deleteUserById/:id', userController.deleteUserById);

module.exports = router;