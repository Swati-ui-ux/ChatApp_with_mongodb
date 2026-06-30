const express = require('express')
const { getUsers, register, login, getAllUsers } = require('../controllers/user')
const { sendMessage } = require('../controllers/message')
const authMiddleware = require("../middleware/authMiddleware")
const router = express.Router()

router.get("/all-user", authMiddleware,getUsers)
router.post('/register', register)
router.post("/login", login)
router.get('/all',authMiddleware,getAllUsers)
module.exports = router