const express = require('express')
const {upload} = require('../util/multer')
const router = express.Router()
const {asses} = require("../controllers/pronounceController")

router.post('/asses',upload.single('audio'),asses)

module.exports = router