const mysql = require("mysql2/promise");

//Loome andmebaasiühenduste kogumi - pool
/*const pool = mysql.createPool({
    host: dbinfo.configData.host,
    user: dbinfo.configData.user,
    password: dbinfo.configData.passWord,
    database: dbinfo.configData.dataBase,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});*/

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;