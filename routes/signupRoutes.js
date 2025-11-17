const express = require("express");
const router = express.Router();

//kontrollerid
const {
    signupPage,
    signupPost
} = require("../controllers/signupControllers");

router.route("/").get(signupPage);
router.route("/").post(signupPost);

module.exports = router;