const mysql = require("mysql2/promise");
const pool = require("../src/dbPool");s

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
    const sqlReq = "SELECT * FROM person";
    try {
        console.log("Andmebaasi ühendus loodud");
        const [rows, fields] = await pool.execute(sqlReq);
        res.render("filmiinimesed", {personList: rows});

    } catch (err) {
        console.log(err);
        res.render("filmiinimesed", {personList: []});
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
        let sqlReq = "INSERT INTO person (first_name, last_name, born, deceased) VALUES (?, ?, ?, ?)";
        try {
            console.log("Andmebaasi ühendus loodud");
            let deceasedDate = null
            if (req.body.deceasedInput != "") {
                deceasedDate = req.body.deceasedInput;
            }
            const [result] = await pool.execute(sqlReq, [req.body.firstNameInput, req.body.lastNameInput, req.body.bornInput, deceasedDate]);
            console.log("Salvestati kirje: " + result.insertId);
            res.render("filmiinimesed_add", {notice: "Andmed salvestatud"});

        } catch (err) {
            console.log(err);
            res.render("filmiinimesed_add", {notice: "Andmete salvestamine ebaõnnestus!"});

        }
    }
};

module.exports = {
    eestifilm,
    inimesed,
    inimesedAdd,
    inimesedAddPost
}