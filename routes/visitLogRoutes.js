const express = require("express");
const router = express.Router();

//kontrollerid
const {
    regVisit,
    regVisitPost,
    visitLog
} = require("../controllers/visitLogControllers");

router.route("/").get(visitLog);
router.route("/regvisit").get(regVisit);
router.route("/regvisit").post(regVisitPost);

module.exports = router;