const express = require('express');
const { getInterview } = require('../controllers/interviewController');
const router = express.Router();


router.get('/get/:prof_level',getInterview);


module.exports = router;