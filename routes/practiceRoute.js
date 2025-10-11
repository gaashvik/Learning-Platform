const express = require ("express");
const {getFlashSetByProf,getFlahsCards,saveUserChapterState} = require("../controllers/practiceController")
const router = express.Router();


router.get('/allFlashSet/:prof_level',getFlashSetByProf);
router.get('/getFlashCards/:set_id',getFlahsCards);
router.post('/saveFS',saveUserChapterState);
;
module.exports=router;