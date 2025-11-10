const express = require("express");
const dateEt = require("./src/dateTimeET");
const fs = require("fs");
const textRef = "public/txt/vanasonad.txt";
const bodyParser = require("body-parser");
const dbinfo = require("../../vp2025config");
const mysql = require("mysql2/promise");

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
//Kui vormist ainult tekst -> false, muidu true
app.use(bodyParser.urlencoded({extended: true}));

const dbConf = {
    host: dbinfo.configData.host,
    user: dbinfo.configData.user,
    password: dbinfo.configData.passWord,
    database: dbinfo.configData.dataBase
}

app.get("/", async (req, res)=> {
    let conn;
    try {
        conn = await mysql.createConnection(dbConf);
        let sqlReq = "SELECT filename, alttext FROM galleryphotos_ta WHERE id=(SELECT MAX(id) FROM galleryphotos_ta WHERE privacy=? AND deleted IS NULL)";
		const privacy = 3;
		const [rows, fields] = await conn.execute(sqlReq, [privacy]);
		let imgAlt = "Avalik foto";
		if(rows[0].alttext != ""){
			imgAlt = rows[0].alttext;
		}
		res.render("index", {imgFile: "gallery/normal/" + rows[0].filename, imgAlt: imgAlt});
    } catch (error) {
        console.log(error);
        res.render("index", {imgFile: "", imgAlt: "Pilt puudub"});
    } finally {
        if(conn) {
			await conn.end();
		}
    }
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

const galleryRouter = require("./routes/galleryRoutes");
app.use("/photogallery", galleryRouter);

const photoUploadRouter = require("./routes/photoUploadRoutes");
app.use("/galleryphotoupload", photoUploadRouter);

const visitLogRouter = require("./routes/visitLogRoutes");
app.use("/visitlog", visitLogRouter);

//eestifilmi marsruudid
const eestifilmRouter = require("./routes/eestifilmRoutes");
app.use("/eestifilm", eestifilmRouter);

app.listen(5118);