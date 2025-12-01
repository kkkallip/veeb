const mysql = require("mysql2/promise");
const pool = require("../src/dbPool");

//@desc home page for photogallery
//@route GET /photogallery
//@access public

const galleryHome = async (req, res)=>{
	try {
		let sqlReq = "SELECT filename, alttext FROM galleryphotos_ta WHERE privacy >= ? AND deleted IS NULL";
		const privacy = 2;
		const [rows, fields] = await pool.execute(sqlReq, [privacy]);
		console.log(rows);
		let listData = [];
		for (let i = 0; i < rows.length; i ++){
			let altText = "Galeriipilt";
			if(rows[i].alttext != "") {
				altText = rows[i].alttext;
			}
			listData.push({src: rows[i].filename, alt: altText});
		}
		res.render("gallery", {listData: listData, imagehref: "gallery/thumbs/"});
	}
	catch(err){
		console.log(err);
		res.render("gallery", {listData: []});
	}
};

module.exports = {
	galleryHome
};