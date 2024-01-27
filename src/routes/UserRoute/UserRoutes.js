const express = require('express');
const router = express.Router();
const UserController = require('../../controllers/UserController');

router.post('/create', UserController.CreateUser);
router.post('/update/:id', UserController.UpdateUser);

router.post('/login', UserController.LoginUser);

module.exports = router;