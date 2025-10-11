const { pool } = require("../util/db");

// GET FLASH SETS BY LANGUAGE
async function getFlashSetByProf(req, res) {
  const proficiency_level = req.params.prof_level;
  const user = req.user;

  try {
    const result = await pool.query(
      `SELECT f.*,u.user_id,u.test_status,u.last_reviewed,u.created_at,u.modified_at  
       FROM flash_card_set f
       LEFT JOIN user_chapter_submissions u
       ON f.set_id = u.set_id AND u.set_id IS NOT NULL
       WHERE f.proficiency_level = $1`,
      [proficiency_level]
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching results from DB");
  }
}

// GET FLASHCARDS BY SET
async function getFlahsCards(req, res) {
  const set_id = req.params.set_id;

  if (!set_id) {
    return res.status(400).send("No Chapter was selected");
  }

  try {
    const result = await pool.query(
      "SELECT * FROM card WHERE set_id = $1",
      [set_id]
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Couldn't fetch flash cards");
  }
}

// SAVE CARD STATE
async function saveCardState(req, res) {
  const { set_id, user: user_id, card_id, status } = req.body;

  if (!user_id || !card_id) {
    return res.status(400).send("User or card ID missing");
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Save or update card submission
    await client.query(
      `INSERT INTO user_card_submission (user_id, card_id, set_id, status, created_at, modified_at)
       VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       ON CONFLICT (user_id, card_id)
       DO UPDATE SET status = EXCLUDED.status,
                     modified_at = CURRENT_TIMESTAMP`,
      [user_id, card_id, set_id, status]
    );

    // Count known cards
    const knownResult = await client.query(
      `SELECT COUNT(*) AS known_count
       FROM user_card_submission
       WHERE set_id = $1 AND status = 'known'`,
      [set_id]
    );
    const known = parseInt(knownResult.rows[0].known_count, 10);

    // Total number of cards
    const totalResult = await client.query(
      "SELECT number_of_cards FROM flash_card_set WHERE set_id = $1",
      [set_id]
    );
    const total = totalResult.rows[0]?.number_of_cards || 0;

    const progress = total > 0 ? known / total : 0;

    // Insert or update chapter progress
    await client.query(
      `INSERT INTO user_chapter_submissions (user_id, set_id, last_reviewed, progress, created_at, modified_at)
       VALUES ($1, $2, CURRENT_TIMESTAMP, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       ON CONFLICT (user_id, set_id)
       DO UPDATE SET last_reviewed = CURRENT_TIMESTAMP,
                     progress = EXCLUDED.progress,
                     modified_at = CURRENT_TIMESTAMP`,
      [user_id, set_id, progress]
    );

    await client.query("COMMIT");
    res.status(200).send("ok");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).send("Error saving card state");
  } finally {
    client.release();
  }
}

async function saveUserChapterState(req,res){
  if (!req.user) return res.status(400).json({'msg':'no authenticated user provided'});
  const {user_id,set_id,status} = req.body;
  if (!user_id || !set_id || !status) {
    return res.status(400).json({ msg: 'Missing required fields' });
  }
  try{
    const results = await pool.query(`
      INSERT INTO user_chapter_submissions (user_id, set_id, test_status)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, set_id)
      DO UPDATE SET test_status = EXCLUDED.test_status
      `,[user_id,set_id,status])

      res.status(200).json({'msg':'ok'});
  }
  catch(err){
    console.log("error saving user chapter state:",err)
    res.status(500).json({'msg':'error saving user chapter state'});
  }
}

module.exports = { getFlashSetByProf, getFlahsCards, saveUserChapterState };
