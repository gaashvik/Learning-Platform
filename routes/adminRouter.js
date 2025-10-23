const express = require("express");
const multer = require("multer");
const {addFlashSet,deleteFlashSet} = require("../controllers/flashCardController");
const {checkSetName,getChapters} =  require('../controllers/util');
const {createChTest,createFinalTest} = require('../controllers/testController');
const {createInterview} =require('../controllers/interviewController');
const router=express.Router();

const upload = multer({ storage: multer.memoryStorage() });


router.post('/addFlashCardSet',upload.single("file"),addFlashSet);
router.post('/check',checkSetName);
router.post('/addChTest',createChTest);
router.post('/addFinalTest',createFinalTest);
router.post('/addInterview',createInterview)
router.post('/deleteFlashSet',deleteFlashSet);
router.get('/getChapters/:prof_level',getChapters);


module.exports = router;