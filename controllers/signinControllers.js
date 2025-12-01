const argon2 = require("argon2");
const pool = require("../src/dbPool");

//@desc home page for signin
//@route GET/signup
//@access public 
const signinPage = (req, res)=> {
    res.render("signin", {notice: ""});
};

//@desc page for signing in
//@route POST/signin
//@access public 
const signinPost = async (req, res)=>{
    console.log(req.body);
    if (!req.body.emailInput || !req.body.passwordInput) {
            let notice = "E-mail või parool puudu!";
            console.log(notice)
            return res.render("signin", {notice: notice});
        }
    try {
        //conn = await mysql.createConnection(dbConf);
        let sqlReq = "SELECT id, password FROM users where email = ?";

        const [users] = await pool.execute(sqlReq, [req.body.emailInput]);

        if (users.length === 0) {
            return res.render("signin", {notice: "Kasutajatunnus ja/või parool on vale!"});
        }

        const user = users[0];
        const match = await argon2.verify(user.password, req.body.passwordInput);
        if (match) {
            //logisime sisse
            //paneme sessiooni käima ja määrame sessiooni ühe muutuja
            req.session.userId = user.id;
            sqlReq = "SELECT first_name, last_name FROM users WHERE id = ?"
            const [users] = await pool.execute(sqlReq, [req.session.userId]);
            req.session.firstName = users[0].first_name;
            req.session.lastName = users[0].last_name;
            return res.redirect("/home");
        } else {
            //parool vale
            console.log("Vale parool")
            return res.render("signin", {notice: "Kasutajatunnus ja/või parool on vale!"});
        }
    } catch (error) {
        console.log(error);
        res.render("signin", {notice: "Tekkis viga"});
    }
};

module.exports = {
    signinPage, signinPost
}