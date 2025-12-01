const express = require("express");
const loginCheck = require("../src/checkLogin");

const router = express.Router();
router.use(loginCheck.isLogin);

//kontrollerid
const {
    profilePage,
    profileHome
} = require("../controllers/profileGalleryControllers");

router.route("/").get(profilePage);
router.route("/:page").get(profileHome); //peab olema viimane

module.exports = router;