const express = require("express");
const multer = require("multer");
const {addFlashSet,deleteFlashSet} = require("../controllers/flashCardController");
const {checkSetName,getChapters} =  require('../controllers/util');
const router=express.Router();

const upload = multer({ storage: multer.memoryStorage() });


router.post('/addFlashCardSet',upload.single("file"),addFlashSet);
router.post('/check',checkSetName);
router.post('/deleteFlashSet',deleteFlashSet);
router.get('/getChapters/:prof_level',getChapters);


module.exports = router;