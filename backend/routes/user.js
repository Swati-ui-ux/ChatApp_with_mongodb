const express = require('express')
const { getUsers, register, login, getAllUsers } = require('../controllers/user')
const { sendMessage } = require('../controllers/message')
const authMiddleware = require("../middleware/authMiddleware")
const upload = require('../middleware/multer')
const router = express.Router()

router.get("/all-user", authMiddleware,getUsers)
router.post("/register", upload.single("profilePic"),register);
router.post("/login", login)
router.get('/all',authMiddleware,getAllUsers)
module.exports = router