const db = require("./util/db")
const express = require("express")
const adminRouter = require ("./routes/adminRouter");
const practiceRouter = require("./routes/practiceRoute");
const userRouter = require("./routes/userRouter");
const interviewRouter = require("./routes/interviewRouter");
const testRouter = require("./routes/testRouter");
const pronounceRouter = require("./routes/pronounceRoute")
const {authMiddleware,authorizeRole,optionalAuth} = require("./middlewares/auth_middleware");
const app = express();
const cors = require('cors');
const allowed_orgins=["https://skillcase-fronend-k4z5.vercel.app","http://localhost:5173","https://learner.skillcase.in"]
app.use(cors({
  origin: allowed_orgins, 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, 
}));

const pool = db.pool;

db.initDb(pool);

app.use(express.json());

app.get('/',(req,res) => {
    res.send('FlashCard API with MySQL ready!');
});

app.use('/api/admin',authMiddleware,authorizeRole("admin"),adminRouter);
app.use('/api/pronounce',authMiddleware,pronounceRouter)
app.use('/api/practice',optionalAuth,practiceRouter);
app.use('/api/user',userRouter);
app.use('/api/test',testRouter);
app.use('/api/interview',interviewRouter);

app.listen(3000,()=>{
    console.log("server is running at http://localhost:3000")
});