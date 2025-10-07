const dotenv = require('dotenv');

dotenv.config()

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
console.log("Secret ky"+JWT_SECRET_KEY);
const db_config = {
    connection_string:process.env.CON_STRING
};
console.log(db_config);

module.exports= {db_config,JWT_SECRET_KEY};
