const dbinfo = require("../../../vp2025config");
const mysql = require("mysql2/promise");
const fs = require("fs").promises;
const sharp = require("sharp");
const watermarkFile = "./public/images/vp_logo_small.png";

const dbConf = {
    host: dbinfo.configData.host,
    user: dbinfo.configData.user,
    password: dbinfo.configData.passWord,
    database: dbinfo.configData.dataBase
}
//@desc home page for uploading photos
//@route GET/galleryphotoupload
//@access public 
const photoUploadPage = (req, res)=> {
    res.render("galleryphotoupload");
};
//@desc page for uploading photos to gallery
//@route POST/galleryphotoupload
//@access public 
const photoUploadPost = async (req, res)=>{
    let conn;
    console.log(req.body);
    console.log(req.file);
    try {
        const fileName = "vp_" + Date.now() + ".jpg"
        console.log(fileName);
        await fs.rename(req.file.path, req.file.destination + fileName);

        const watermarkSettings = [{
            input: watermarkFile,
            gravity: "southeast"
        }];
		if (!await fs.access(watermarkFile).then(() => true).catch(() => false)) {
             console.log("Vesimأ¤rgi faili ei leitud!");
             // Tأ¼hjendame seaded, et vesimأ¤rki ei proovitaks lisada
             watermarkSettings.length = 0; 
        }
        let normalImageProcessor = await sharp(req.file.destination + fileName).resize(800, 600).jpeg({quality: 90});
        if (watermarkSettings.length > 0) {
            normalImageProcessor = await normalImageProcessor.composite(watermarkSettings);
        }
		await normalImageProcessor.toFile("./public/gallery/normal/" + fileName);

        //loon normaalsuuruse 800x600
        //await sharp(req.file.destination + fileName).resize(800, 600).jpeg({quality: 90}).toFile("./public/gallery/normal/" + fileName);
        //loon thumbnail pildi 100x100
        await sharp(req.file.destination + fileName).resize(100, 100).jpeg({quality: 90}).toFile("./public/gallery/thumbs/" + fileName);
        conn = await mysql.createConnection(dbConf);
        let sqlReq = "INSERT INTO galleryphotos_ta (filename, origname, alttext, privacy, userid) VALUES (?,?,?,?,?)";
        //Kuna kontosid pole siis userid = 1
        const userId = 1;
        const [result] = await conn.execute(sqlReq, [fileName, req.file.originalname, req.body.altInput, req.body.privacyInput, userId]);
        console.log("Salvestati kirje: " + result.insertId);
        res.render("galleryphotoupload"); 
    } catch (error) {
        console.log(error);
    } finally {
      if (conn) {
        await conn.end();
      }  
    }
    
};

module.exports = {
    photoUploadPage, photoUploadPost
}