const dbinfo = require("../../../vp2025config");
const argon2 = require("argon2");
const mysql = require("mysql2/promise");

const dbConf = {
    host: dbinfo.configData.host,
    user: dbinfo.configData.user,
    password: dbinfo.configData.passWord,
    database: dbinfo.configData.dataBase
}
//@desc home page for signup
//@route GET/signup
//@access public 
const signupPage = (req, res)=> {
    res.render("signup", {notice: "Ootan andmeid"});
};

//@desc page for creating user account
//@route POST/signup
//@access public 
const signupPost = async (req, res)=>{
    let conn;
    console.log(req.body);
    if(
		!req.body.firstNameInput ||
		!req.body.lastNameInput ||
		!req.body.birthDateInput ||
		!req.body.genderInput ||
		!req.body.emailInput ||
		req.body.passwordInput.length < 8 ||
		req.body.passwordInput !== req.body.confirmPasswordInput
	) {
            let notice = "Andmeid on puudu või on vigased!";
            console.log(notice)
            return res.render("signup", {notice: notice});
        }
    try {
        //krüpteerime parooli
        const pwdHash = await argon2.hash(req.body.passwordInput);
        console.log(pwdHash);

        conn = await mysql.createConnection(dbConf);
        let sqlReq = "INSERT INTO users (first_name, last_name, birth_date, gender, email, password) VALUES (?,?,?,?,?,?)";
        
        const [result] = await conn.execute(sqlReq, [req.body.firstNameInput, req.body.lastNameInput,
             req.body.birthDateInput, req.body.genderInput, req.body.emailInput, pwdHash]);
        res.render("signup", {notice: "Konto loodud"}); 
    } catch (error) {
        console.log(error);
        res.render("signup", {notice: "Tekkis viga"});
    } finally {
      if (conn) {
        await conn.end();
      }  
    }
    
};

module.exports = {
    signupPage, signupPost
}