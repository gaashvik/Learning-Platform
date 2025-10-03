const express = require("express");
const multer = require("multer");
const {addFlashSet} = require("../controllers/flashCardController");

const router=express.Router();

const upload = multer({ storage: multer.memoryStorage() });


router.post('/addFlashCardSet',upload.single("file"),addFlashSet);


module.exports = router;