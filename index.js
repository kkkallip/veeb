const express = require("express");
const dateEt = require("./src/dateTimeET");
const fs = require("fs");
const textRef = "public/txt/vanasonad.txt";
const bodyParser = require("body-parser");

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: false}));

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
app.get("/regvisit", (req, res)=> {
    res.render("regvisit")
});
app.post("/regvisit", (req, res)=>{
	console.log(req.body);
	fs.open("public/txt/visitlog.txt", "a", (err, file)=>{
		if(err){
			throw(err);
		}
		else {
			fs.appendFile("public/txt/visitlog.txt", req.body.firstNameInput + " " + req.body.lastNameInput + ", " + dateEt.date() + " kell " + dateEt.fullTime() + ";", (err)=>{
				if(err){
					throw(err);
				}
				else {
					console.log("Salvestatud!");
					res.render("visitregistered", {visitor: req.body.firstNameInput + " " + req.body.lastNameInput});
				}
			});
		}
	});
});

app.get("/visitlog", (req, res)=>{
	let listData = [];
	fs.readFile("public/txt/visitlog.txt", "utf8", (err, data)=>{
		if(err){
			res.render("genericlist", {heading: "Registreeritud külastused", listData: ["Ei leidnud ühtegi külastust!"]});
		}
		else {
			listData = data.split(";");
            let correctListData = [];
            for (let i = 0; i < listData.length - 1; i++) {
                correctListData.push(listData[i]);
                
            }
			res.render("genericlist", {heading: "Registreeritud külastused", listData: correctListData});
		}
	});
});

//eestifilmi marsruudid
const eestifilmRouter = require("./routes/eestifilmRoutes");
app.use("/eestifilm", eestifilmRouter);

app.listen(5118);