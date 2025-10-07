const express = require ("express");
const {getFlashSetByProf,getFlahsCards} = require("../controllers/practiceController")
const router = express.Router();


router.get('/allFlashSet/:prof_level',getFlashSetByProf);
router.get('/getFlashCards/:set_id',getFlahsCards);

module.exports=router;