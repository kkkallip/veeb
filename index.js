const express = require("express");
require("dotenv").config();
const pool = require("./src/dbPool");
const dateEt = require("./src/dateTimeET");
const loginCheck = require("./src/checkLogin");
const fs = require("fs");
const textRef = "public/txt/vanasonad.txt";
const bodyParser = require("body-parser");
const dbinfo = require("../../vp2025config");
const session = require("express-session");

const app = express();
//app.use(session({secret: dbinfo.configData.sessionSecret, saveUninitialized: true, resave: true}));
app.use(session({secret: process.env.SES_SECRET, saveUninitialized: true, resave: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));

//Kui vormist ainult tekst -> false, muidu true
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", async (req, res)=> {
    //let conn;
    try {
        //conn = await mysql.createConnection(dbConf);
        let sqlReq = "SELECT filename, alttext FROM galleryphotos_ta WHERE id=(SELECT MAX(id) FROM galleryphotos_ta WHERE privacy=? AND deleted IS NULL)";
		const privacy = 3;
		//const [rows, fields] = await conn.execute(sqlReq, [privacy]);
        const [rows, fields] = await pool.execute(sqlReq, [privacy]);
		let imgAlt = "Avalik foto";
		if(rows[0].alttext != "") {
			imgAlt = rows[0].alttext; 
		}
		res.render("index", {imgFile: "gallery/normal/" + rows[0].filename, imgAlt: imgAlt});
    } catch (error) {
        console.log(error);
        res.render("index", {imgFile: "", imgAlt: "Pilt puudub"});
    }
});

app.get("/home", loginCheck.isLogin, (req, res) => {
    res.render("home", {user: req.session.firstName + " " + req.session.lastName});
});

app.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/");
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

const profileRouter = require("./routes/profileRoutes");
app.use("/profile", profileRouter);

const galleryRouter = require("./routes/galleryRoutes");
app.use("/photogallery", galleryRouter);

const photoUploadRouter = require("./routes/photoUploadRoutes");
app.use("/galleryphotoupload", photoUploadRouter);

const visitLogRouter = require("./routes/visitLogRoutes");
app.use("/visitlog", visitLogRouter);

const eestifilmRouter = require("./routes/eestifilmRoutes");
app.use("/eestifilm", eestifilmRouter);

const signupRouter = require("./routes/signupRoutes");
app.use("/signup", signupRouter);

const signinRouter = require("./routes/signinRoutes");
app.use("/signin", signinRouter);

//const newsRouter = require("./routes/newsRoutes");
//app.use("/news", newsRouter);

app.listen(5118);