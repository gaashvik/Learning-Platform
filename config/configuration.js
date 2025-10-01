const dotenv = require('dotenv');

dotenv.config()

const host = process.env.DB_HOST;
const port = process.env.DB_PORT;
const username= process.env.DB_USER;
const password = process.env.DB_PASS;
const database = process.env.DB_DATABASE;

const db_config = {
    "host": host,
    "user":username,
    "password":password,
    "database":database,
    "port":port,
};
console.log(db_config);

module.exports= {db_config};
