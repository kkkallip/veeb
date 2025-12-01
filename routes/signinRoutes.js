const express = require("express");
const router = express.Router();

//kontrollerid
const {
    signinPage,
    signinPost
} = require("../controllers/signinControllers");

router.route("/").get(signinPage);
router.route("/").post(signinPost);

module.exports = router;