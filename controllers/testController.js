const {pool} = require('../util/db');

async function getTest(req, res) {
  const { prof_level } = req.params;

  if (!prof_level) {
    return res.status(400).json({ message: 'no proficiency level provided' });
  }

  try {
    const qResult = await pool.query(
      `SELECT * FROM test WHERE proficiency_level = $1`,
      [prof_level]
    );

    let finalTst = null;
    let chapTst = [];

    for (const row of qResult.rows) {
      if (row.type === 'final') {
        finalTst = row;
      } else {
        chapTst.push(row);
      }
    }

    res.status(200).json({
      results: {
        final: finalTst,
        chapter: chapTst,
      },
      message: 'results fetched successfully',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'could not fetch tests from db' });
  }
}


async function createTest(req, res) {
  const { type, prof_level, link, test_name, difficulty} = req.body;

  if (!type || !prof_level || !link || !test_name) {
    return res.status(400).json({ message: 'type, proficiency level, link, or test_name missing' });
  }

  try {
    await pool.query(
      `INSERT INTO test (type, proficiency_level, test_link, test_name, difficulty)
       VALUES ($1, $2, $3, $4,$5)
       ON CONFLICT (type, proficiency_level, test_name)
       DO UPDATE SET test_link = EXCLUDED.test_link, difficulty = EXCLUDED.difficulty`,
      [type, prof_level, link, test_name, difficulty]
    );
    res.status(200).json({ message: 'test added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'could not create test' });
  }
}

module.exports = {getTest,createTest};