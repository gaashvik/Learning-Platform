const db = require("./util/db")
const express = require("express")


const app = express();
const pool = db.pool;

db.initDb(pool);

app.use(express.json());

app.get('/',(req,res) => {
    res.send('FlashCard API with MySQL ready!');
});

app.listen(3000,()=>{
    console.log("server is running at http://localhost:3000")
});