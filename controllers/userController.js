const bcrypt =require("bycryptjs");
const jwt = require("jsonwebtoken");
const {pool} = require("../util/db");
const config = require()
import { v4 as uuidv4 } from "uuid";

async function signup(req,res){
    const {username,password}=req.body;
    try{
    const {rows} = await pool.query("Select * from user where username = ?",[username]);
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
    const token = jwt.sign({"user_id":newId,"username":username,"role":role},JWT_SECRET_KEY,{expiresIn:"60d"})

    res.status(200).json(
        {msg:"user successfully created",token});
    }
    catch(err){
        console.log(err);
        res.status(500).json({msg:"error while trying to create account"})

    }
}

async function login(req,res){

    if (!req.body){
        res.status(400).json({msg:"username or password missing"});
    }
    const {username,password}=req.body;
    try{
    const {rows} = await pool.query("Select * from user where username = ?",[username]);
     if(rows.length === 0){
        return res.status(400).json({msg:"invalid username or password"});
    }

    const user = rows[0];

    const isMatch=await bcrypt.compare(password,user.password);

    if (!isMatch){
        return res.status(400).json({ msg: "Invalid username or password" });
    }


    const token = jwt.sign({"user_id":user.user_id,"username":user.username,"role":user.role},JWT_SECRET_KEY,{expiresIn:"60d"});
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
    const token = jwt.sign({"user_id":newId,"username":username,"role":role},JWT_SECRET_KEY,{expiresIn:"1m"})

    res.status(200).json(
        {msg:"user successfully created",token});
    }
    catch(err){
        console.log(err);
        res.status(500).json({msg:"error while trying to create account"})

    }
}