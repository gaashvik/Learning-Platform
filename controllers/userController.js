const bcrypt =require("bcryptjs");
const jwt = require("jsonwebtoken");
const {pool} = require("../util/db");
const config = require("../config/configuration")
const { v4 : uuidv4 } =require( "uuid");

async function signup(req,res){
    const {username,password}=req.body;
    try{
    const [rows] = await pool.query("Select * from user where username = ?",[username]);
    console.log(rows);
     if(rows.length > 0){
        return res.status(400).json({msg:"user already exists"});
    }
    }
    catch(err){
        console.log(err);
        return res.status(500).json({msg:"error while searching user"});
    }
    const hashed = await bcrypt.hash(password,10);
    const newId = uuidv4();
    const role = "user";
    try{
    await pool.query("INSERT INTO user(user_id,username,password,role) values(?,?,?,?)",[newId,username,hashed,role]);
    const token = jwt.sign({"user_id":newId,"username":username,"role":role},config.JWT_SECRET_KEY,{expiresIn:"60d"})

    res.status(200).json(
        { "user":{
            "user_id":newId,"username":username,"role":role
        },token});
    }
    catch(err){
        console.log(err);
        res.status(500).json({msg:"error while trying to create account"})

    }
}

async function login(req,res){

    if (!req.body){
        return res.status(400).json({msg:"username or password missing"});
    }
    const {username,password}=req.body;
    try{
    const [rows] = await pool.query("Select * from user where username = ?",[username]);
     if(rows.length === 0){
        return res.status(400).json({msg:"invalid username or password"});
    }

    const user = rows[0];

    const isMatch=await bcrypt.compare(password,user.password);

    if (!isMatch){
        return res.status(400).json({ msg: "Invalid username or password" });
    }

    const token = jwt.sign({"user_id":user.user_id,"username":user.username,"role":user.role},config.JWT_SECRET_KEY,{expiresIn:"60d"});

    res.status(200).json({
        "user":{
            "user_id":user.user_id,"username":user.username,"role":user.role
        },
        token});
    }
    catch(err){
        console.log(err);
        return res.status(500).json({msg:"error while searching user"});
    }

    }
async function me(req,res) {
    if (!req.user){
        return res.status(401).json({ msg: "Unauthorized: no user logged in" });
    }
    const {user_id} = req.user;
    try{
    const rows = await pool.query("SELECT * FROM user where user_id = ?",[user_id]);
    if(rows.length === 0){
        return res.status(404).json({msg:"user not found"});
    }
    const user = rows[0];

    res.status(200).json({ "user":{
            "user_id":user.user_id,"username":user.username,"role":user.role
        }});
    
    }
    catch(err){
        return res.status(500).send("error while accesisng db");
    }

}

    module.exports = {login,signup,me}