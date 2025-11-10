const fs = require("fs");
const dateEt = require("../src/dateTimeET");

const regVisit = (req, res)=> {
    res.render("regvisit")
};
const regVisitPost = async (req, res)=>{
    try {
        file = await fs.openSync("public/txt/visitlog.txt");
        data = await fs.appendFileSync("public/txt/visitlog.txt", req.body.firstNameInput + " " + req.body.lastNameInput + ", " + dateEt.date() + " kell " + dateEt.fullTime() + ";");
        console.log("Salvestatud!");
        res.render("visitregistered", {visitor: req.body.firstNameInput + " " + req.body.lastNameInput});
    } catch (error) {
        console.log(error);
    }
};

const visitLog = async (req, res)=>{
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
};

module.exports = {
    regVisit, regVisitPost, visitLog
}