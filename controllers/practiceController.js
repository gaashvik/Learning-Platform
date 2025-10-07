const {pool} = require("../util/db");


async function getFlashSetByLanguage(req, res) {
  const language = req.query.language;
  const user_id = req.user?.user_id;
  if (!language) {
    return res.status(400).send("No language was selected");
  }

  try {
    const rows = await pool.query(
      `SELECT * FROM flash_card_set f
      LEFT JOIN user_chapter_submissions u
      on f.set_id = u.set_id AND u.user_id = ?
      WHERE f.language = ?`,
      [user_id,language]
    );

    console.log(rows); 
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching results from DB");
  }
}

async function getFlahsCards(req,res){
    const set_id = req.params.set_id;
    if(!set_id){
        return res.status(400).send("No Chapter was selected");
    }
    try{
    const results = await pool.query("SELECT * FROM card where set_id = ?",[set_id]);
    console.log(results);
    res.status(200).json(results);
    }
    catch(err){
        console.log(err);
        res.status(500).send("couldn't fetch flex cards");
    }
}

async function saveCardState(req,res){
  const set_id = req.body.set_id;
  const user_id = req.body.user;
  const card_id = req.body.card_id;
  const status = req.body.status;

  if (!user_id || !card_id) {
    return res.status(400).send("user or card id missing");
  }

  const con = await pool.getConnection();

  try {
    // Save or update card submission
    await con.query(
      `INSERT INTO user_card_submission (user_id, card_id, status)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE status = VALUES(status)`,
      [user_id, card_id, status]
    );

    // Count known cards for this set
    const [knownResult] = await con.query(
      `SELECT COUNT(*) AS No_of_Known
       FROM user_card_submission
       WHERE set_id = ? AND status = 'known'`,
      [set_id]
    );
    const known = knownResult[0].No_of_Known;

    // Get total number of cards in the set
    const [totalResult] = await con.query(
      "SELECT number_of_cards FROM flash_card_set WHERE set_id = ?",
      [set_id]
    );
    const total = totalResult[0].number_of_cards;

    // Calculate progress as fraction
    const progress = total > 0 ? known / total : 0;

    // Insert or update set progress
    await con.query(
      `INSERT INTO user_chapter_submissions (user_id, set_id, last_reviewed, progress)
       VALUES (?, ?, NOW(), ?)
       ON DUPLICATE KEY UPDATE
         last_reviewed = VALUES(last_reviewed),
         progress = VALUES(progress)`,
      [user_id, set_id, progress]
    );

    res.status(200).send("ok");
  } catch (err) {
    console.error(err);
    await con.rollback();
    res.status(500).send("error saving card state");
  } finally {
    await con.release();
  }
}


module.exports = {getFlashSetByLanguage,getFlahsCards,saveCardState};