const express = require ("express");
const {getFlashSetByLanguage,getFlahsCards} = require("../controllers/practiceController")
const router = express.Router();


router.get('/allFlashSet',getFlashSetByLanguage);
router.get('/getFlashCards/:set_id',getFlahsCards);

module.exports=router;