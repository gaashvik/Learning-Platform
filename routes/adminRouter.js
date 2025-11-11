const express = require("express");
const multer = require("multer");
const {addFlashSet,deleteFlashSet} = require("../controllers/flashCardController");
const {checkSetName,getChapters,checkPronounceSetName,getPronounceChapters} =  require('../controllers/util');
const {createChTest,createFinalTest} = require('../controllers/testController');
const {createInterview} =require('../controllers/interviewController');
const { addPronounceSet, deletePronounceSet } = require("../controllers/pronounceController");
const {getTest,deleteChTest,deleteFinalTest} = require('../controllers/testController')
const{getInterview,deleteInterview}= require("../controllers/interviewController");
const{getUserAnalytics} = require('../controllers/analyticsController');

const router=express.Router();

const upload = multer({ storage: multer.memoryStorage() });


router.post('/addFlashCardSet',upload.single("file"),addFlashSet);
router.post('/check',checkSetName);
router.post('/addChTest',createChTest);
router.post('/addFinalTest',createFinalTest);
router.post('/addInterview',createInterview)
router.post('/deleteFlashSet',deleteFlashSet);
router.get('/getChapters/:prof_level',getChapters);



router.post('/addPronounceCardSet',upload.single("file"),addPronounceSet);
router.post('/deletePronounceSet',deletePronounceSet);
router.post('/checkPronounce',checkPronounceSetName);
router.get('/getPronounceChapters/:prof_level',getPronounceChapters);


router.get('/getTest/:prof_level',getTest);
router.post('/deleteChTest',deleteChTest);
router.post('/deleteFinalTest',deleteFinalTest);


router.get('/getInterview/:prof_level',getInterview)
router.post('deleteInterview',deleteInterview)


router.get('/analytics',getUserAnalytics);





module.exports = router;