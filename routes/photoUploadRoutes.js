const express = require("express");
const multer = require("multer");
const router = express.Router();

const loginCheck = require("../src/checkLogin");
router.use(loginCheck.isLogin);

//Seadistame vahevara fotode üleslaadimiseks kindalasse kataloogi
const upload = multer({dest: "./public/gallery/orig/"});
//kontrollerid
const {
    photoUploadPage,
    photoUploadPost
} = require("../controllers/photoUploadControllers");

router.route("/").get(photoUploadPage);
router.route("/").post(upload.single("photoInput"), photoUploadPost);

module.exports = router;