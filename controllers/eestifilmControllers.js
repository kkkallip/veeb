const mysql = require("mysql2/promise");
const dbinfo = require("../../../vp2025config");

const dbConf = {
    host: dbinfo.configData.host,
    user: dbinfo.configData.user,
    password: dbinfo.configData.passWord,
    database: dbinfo.configData.dataBase
}

//@desc home page for Estonian film section
//@route GET /eestifilm
//@access public
const eestifilm = (req, res)=> {
    res.render("eestifilm");
};

//@desc page for Estonian people involved in Film industry
//@route GET /eestifilm/inimesed
//@access public
const inimesed = async (req, res) => {
    let conn;
    const sqlReq = "SELECT * FROM person";
    try {
        conn = await mysql.createConnection(dbConf);
        console.log("Andmebaasi ühendus loodud");
        const [rows, fields] = await conn.execute(sqlReq);
        res.render("filmiinimesed", {personList: rows});

    } catch (err) {
        console.log(err);
        res.render("filmiinimesed", {personList: []});
    } finally {
        if (conn) {
            await conn.end();
            console.log("Andmebaasi ühendus suletud")
        }
    }
};

//@desc page for adding Estonian people involved in film industry
//@route GET /eestifilm/inimesed_add
//@access public
const inimesedAdd = (req, res) => {
    res.render("filmiinimesed_add", {notice: "Ootan sisestust"});
};

//@desc home page for Estonian film section
//@route POST /eestifilm/inimesed_add
//@access public
const inimesedAddPost = async (req, res) => {
    if (!req.body.firstNameInput || !req.body.lastNameInput || !req.body.bornInput || req.body.bornInput >= new Date()) {
        res.render("filmiinimesed_add", {notice: "Puudulikud või ebakorrektsed andmed!"});
    } else {
        let conn;
        let sqlReq = "INSERT INTO person (first_name, last_name, born, deceased) VALUES (?, ?, ?, ?)";
        try {
            conn = await mysql.createConnection(dbConf);
            console.log("Andmebaasi ühendus loodud");
            let deceasedDate = null
            if (req.body.deceasedInput != "") {
                deceasedDate = req.body.deceasedInput;
            }
            const [result] = await conn.execute(sqlReq, [req.body.firstNameInput, req.body.lastNameInput, req.body.bornInput, deceasedDate]);
            console.log("Salvestati kirje: " + result.insertId);
            res.render("filmiinimesed_add", {notice: "Andmed salvestatud"});

        } catch (err) {
            console.log(err);
            res.render("filmiinimesed_add", {notice: "Andmete salvestamine ebaõnnestus!"});

        } finally {
            if (conn) {
                await conn.end();
                console.log("Andmebaasi ühendus suletud")
            }
        }
    }
};

module.exports = {
    eestifilm,
    inimesed,
    inimesedAdd,
    inimesedAddPost
}