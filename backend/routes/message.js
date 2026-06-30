const express = require('express')
const { sendMessage, getMessage } = require('../controllers/message')
const authMiddleware = require('../middleware/authMiddleware')


const router = express.Router()

router.post("/msg",authMiddleware, sendMessage)
router.get('/:receiverId',authMiddleware,getMessage)

module.exports = router