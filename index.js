const db = require("./util/db")
const express = require("express")
const adminRouter = require ("./routes/adminRouter");
const practiceRouter = require("./routes/practiceRoute");
const app = express();
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:5173', // React app
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // if you send cookies
}));

const pool = db.pool;

db.initDb(pool);

app.use(express.json());

app.get('/',(req,res) => {
    res.send('FlashCard API with MySQL ready!');
});

app.use('/api/admin',adminRouter);
app.use('/api/practice',practiceRouter);

app.listen(3000,()=>{
    console.log("server is running at http://localhost:3000")
});