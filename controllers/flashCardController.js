const{pool} = require("../util/db");
const stream = require ("stream");
const csv = require("csv-parser");
const { buffer } = require("stream/consumers");
const { diff } = require("util");



async function addFlashSet(req,res){
    if (!req.file){
        return res.status(400).send("no file uploaded");
    }
    console.log("got here");
    console.log(req.body);
    const set_name = req.body.set_name;
    const language = req.body.language;
    const difficulty_level = req.body.difficulty_level;

    const results = [];

    const bufferStream =  new stream.PassThrough();
    bufferStream.end(req.file.buffer);

    bufferStream
    .pipe(csv({ mapHeaders: ({ header }) => header.trim()})).on("data",(row) => {
        console.log("parsed row:",row);
        results.push(row);
    })
    .on("end",async ()=>{
        const conn = await pool.getConnection();

        try{
            await conn.beginTransaction();
           
            const [set_result] =  await conn.query(`INSERT INTO flash_card_set(set_name,language,difficulty_level,number_of_cards) VALUES (?,?,?,?)`,[set_name,language,difficulty_level,results.length]);
            console.log(set_result);

            const set_id = set_result.insertId;
            console.log(results.map(r => Object.keys(r)));

            console.log(results[0]["front_content"])

            const cardRows = results.map(row => [set_id,row.front_content,row.back_content,row.hint]);

            await conn.query("INSERT INTO card(set_id,front_content,back_content,hint) VALUES ?",[cardRows])

            await conn.commit();

            res.json({
          message: "Set and cards uploaded successfully",
          set_id,
          cardsInserted: cardRows.length
        });
        }
        catch(err){
            await conn.rollback();
            console.error("Transaction error:", err);
            res.status(500).send("error adding flashcard set:",err);
        }
        finally{
            await conn.release();
        }
    })
    .on("error",(err)=>{
        console.error("Error parsing CSV:",err);
        res.status(500).send("Error Parsing CSV");
    });
}

module.exports = {addFlashSet};