const express = require("express");
const dateEt = require("./src/dateTimeET");
const fs = require("fs");
const textRef = "public/txt/vanasonad.txt";
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const dbinfo = require("../../vp2025config");
//Anna nimi app ja pane tööle
const app = express();
//määran veebilehtede renderdamise mootori
app.set("view engine", "ejs");
//määran ühe katalogi avalikult kättesaadavaks
app.use(express.static("public"));
//parse request URL, flag flase if only txt, true if theres other data
app.use(bodyParser.urlencoded({extended: false}));

//loon andmebaasi ühenduse
const conn = mysql.createConnection({
    host: dbinfo.configData.host,
    user: dbinfo.configData.user,
    password: dbinfo.configData.passWord,
    database: dbinfo.configData.dataBase
});

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
app.post("/regvisit", (req, res)=>{
	console.log(req.body);
	//avan tekstifaili kirjutamiseks sellisel moel, et kui teda pole, luuakse (parameeter "a")
	fs.open("public/txt/visitlog.txt", "a", (err, file)=>{
		if(err){
			throw(err);
		}
		else {
			//faili senisele sisule lisamine
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
app.get("/eestifilm", (req, res) => {
    const sqlReq = "SELECT * FROM movie";
    conn.execute(sqlReq, (err, sqlres)=> {
        if (err) {
            throw(err);
        } else {
            res.render("eestifilm", {listData: sqlres, notice: "Ootan sisestust"});
        }
    });
});

app.post("/eestifilm", (req, res) => {
    console.log(req.body);
    //kas andmed on olemas
    if (!req.body.titleInput || !req.body.productionYearInput || !req.body.durationInput) {
        res.render("eestifilm", {notice: "Puudulikud või ebakorrektsed andmed!"});
    } else {
        let sqlReq = "INSERT INTO movie (title, production_year, duration, description) VALUES (?, ?, ?, ?)";
        conn.execute(sqlReq, [req.body.titleInput, req.body.productionYearInput, req.body.durationInput, req.body.descriptionInput], (err, sqlres)=> {
            if (err) {
                console.log(err);
                res.render("eestifilm", {listData: [], notice: "Andmete salvestamine ebaõnnestus!"});
            } else {
                res.render("eestifilm", {listData: sqlres, notice: "Andmed salvestatud"});
            }
        });
    }
});

app.get("/eestifilm/inimesed_add", (req, res) => {
    res.render("filmiinimesed_add", {notice: "Ootan sisestust"});
});

app.post("/eestifilm/inimesed_add", (req, res) => {
    console.log(req.body);
    //kas andmed on olemas
    if (!req.body.firstNameInput || !req.body.lastNameInput || !req.body.bornInput || req.body.bornInput >= new Date()) {
        res.render("filmiinimesed_add", {notice: "Puudulikud või ebakorrektsed andmed!"});
    } else {
        let sqlReq = "INSERT INTO person (first_name, last_name, born, deceased) VALUES (?, ?, ?, ?)";
        conn.execute(sqlReq, [req.body.firstNameInput, req.body.lastNameInput, req.body.bornInput, req.body.deceasedInput], (err, sqlres)=> {
            if (err) {
                res.render("filmiinimesed_add", {notice: "Andmete salvestamine ebaõnnestus!"});
            } else {
                res.render("filmiinimesed_add", {notice: "Andmed salvestatud"});
            }
        });
    }
});

app.get("/eestifilm/inimesed", (req, res) => {
    const sqlReq = "SELECT * FROM person";
    conn.execute(sqlReq, (err, sqlres)=> {
        if (err) {
            throw(err);
        } else {
            res.render("filmiinimesed", {personList: sqlres});
        }
    });

});



app.listen(5118);