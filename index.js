const express = require("express");
const dateEt = require("./src/dateTimeET");
const fs = require("fs");
const textRef = "public/txt/vanasonad.txt";
const bodyParser = require("body-parser");

//Anna nimi app ja pane tööle
const app = express();
//määran veebilehtede renderdamise mootori
app.set("view engine", "ejs");
//määran ühe katalogi avalikult kättesaadavaks
app.use(express.static("public"));
//parse request URL, flag flase if only txt, true if theres other data
app.use(bodyParser.urlencoded({extended: false}));

app.get("/", (req, res)=> {
    //res.send("Express.js käivitus ja serveerib veebi");
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
app.get("/regvisit", (req, res)=> {
    //res.send("Express.js käivitus ja serveerib veebi");
    res.render("regvisit")
});
app.post("/regvisit", (req, res)=> {
    console.log(req.body);
    //Avan tekstifaili kirjutamiseks või loon kui seda pole (parameter 'a')
    fs.open("public/txt/visitlog.txt", "a", (err, file)=> {
        if (err) {
            throw err;
        } else {
            //faili senisele sisule lisamine
            fs.appendFile("public/txt/visitlog.txt", req.body.nameInput + ";", (err)=> {
                if (err) {
                    throw err;
                } else {
                    console.log("Saved");
                }
            });
        }
    });
});

app.listen(5118);