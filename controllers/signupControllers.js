const pool = require("../src/dbPool");
const argon2 = require("argon2");
const mysql = require("mysql2/promise");
const validator = require("validator");

//@desc home page for signup
//@route GET/signup
//@access public 
const signupPage = (req, res)=> {
    res.render("signup", {notice: ""});
};

//@desc page for creating user account
//@route POST/signup
//@access public 
const signupPost = async (req, res)=>{
       //puhastame andmed
       const firstName = validator.escape(req.body.firstNameInput.trim());
       const lastName = validator.escape(req.body.lastNameInput.trim());
       const email = req.body.emailInput.trim();
       const birthDate = req.body.birthDateInput;
       const gender = req.body.genderInput;
       const password = req.body.passwordInput;
       const confirmPassword = req.body.confirmPasswordInput;

       let notice;
       if (!firstName || !lastName || !email || !birthDate ||!gender || !password || !confirmPassword) {
            notice = "Andmeid on puudu või on vigased!";
            console.log(notice);
            return res.render("signup", {notice: notice});
       }
       //kas email on korras
       if (!validator.isEmail(email)) {
            notice = "E-mail on vigane!";
            console.log(notice);
            return res.render("signup", {notice: notice});
       }
       //Kas parool on piisavalt tugev
       const passwordOptions = {minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1};
       if (!validator.isStrongPassword(password, passwordOptions)) {
            notice = "Parool pole piisavalt tugev!";
            console.log(notice);
            return res.render("signup", {notice: notice});
       }
       //kas paroolid klapivad
       if (password != confirmPassword) {
            notice = "Paroolid ei klapi!";
            console.log(notice);
            return res.render("signup", {notice: notice});
       }
       //kontrollime sünnikuupäeva
       if (!validator.isDate(birthDate) || validator.isAfter(birthDate)) {
            notice = "Sünnikuupäev on vale!";
            console.log(notice);
            return res.render("signup", {notice: notice});
       }

    try {
        //check if user exists
        let sqlReq = "SELECT id from users WHERE email = ?";
        const [users] = await pool.execute(sqlReq, [req.body.emailInput]);
        if (users.length > 0) {
            return res.render("signup", {notice: "Selline kasutaja on juba olemas!"});
        }

        //krüpteerime parooli
        const pwdHash = await argon2.hash(req.body.passwordInput);

        sqlReq = "INSERT INTO users (first_name, last_name, birth_date, gender, email, password) VALUES (?,?,?,?,?,?)";
        
        const [result] = await pool.execute(sqlReq, [req.body.firstNameInput, req.body.lastNameInput,
             req.body.birthDateInput, req.body.genderInput, req.body.emailInput, pwdHash]);
        res.render("signup", {notice: "Konto loodud"}); 
    } catch (error) {
        console.log(error);
        res.render("signup", {notice: "Tekkis viga"});
    }
    
};

module.exports = {
    signupPage, signupPost
}