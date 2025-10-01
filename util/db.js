const mysql = require ("mysql2");
const db_config = require("../config/configuration")
const queries = require("../model/schema")
let pool;

 pool = mysql.createPool({
      host:"db",
      port:3306,
      user: "user",
      password: "root",
      database: "skillcase",
      waitForConnections: true,
      connectionLimit: 10,  
      queueLimit: 0
}).promise();

pool.getConnection()
    .then(conn => {
        console.log("Connected to DB");
        conn.release();
    })
    .catch(err => console.error("DB connection failed:", err));




async function initDb(pool){
    try{
        await pool.query(queries.createFlashCardSet);
        await pool.query(queries.createCards);
        await pool.query(queries.createCardSides);
        console.log("tables created/already exist!");
        console.log(res);
    }
    catch (err){
        console.log(`error occured while trying to create tables:${err}`);
    }
}


module.exports = {pool, initDb}