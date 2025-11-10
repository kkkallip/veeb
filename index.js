const express = require("express");
const dateEt = require("./src/dateTimeET");
const fs = require("fs");
const textRef = "public/txt/vanasonad.txt";
const bodyParser = require("body-parser");

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
//Kui vormist ainult tekst -> false, muidu true
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res)=> {
    res.render("index")
});

app.get("/timenow", (req, res)=> {
    const weekDayNow = dateEt.weekDay();
    const dateNow = dateEt.date();
    res.render("timenow", {weekDayNow: weekDayNow, dateNow: dateNow});
});

app.get("/vanasonad", (req, res)=> {
    let folkWisdom = [];
    fs.readFile(textRef, "utf-8", (err, data)=> {
        if (err) {
            res.render("genericlist", {heading: "Vanasõnad", listData: ["Ei leidnud ühtegi vanasõna"]});
        } else {
            folkWisdom = data.split(";");
            res.render("genericlist", {heading: "Vanasõnad", listData: folkWisdom});
        }
    });
});

const photoUploadRouter = require("./routes/photoUploadRoutes");
app.use("/galleryphotoupload", photoUploadRouter);

const visitLogRouter = require("./routes/visitLogRoutes");
app.use("/visitlog", visitLogRouter);

//eestifilmi marsruudid
const eestifilmRouter = require("./routes/eestifilmRoutes");
app.use("/eestifilm", eestifilmRouter);

app.listen(5118);