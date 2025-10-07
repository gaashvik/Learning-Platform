const { pool } = require("../util/db");
const stream = require("stream");
const csv = require("csv-parser");

async function addFlashSet(req, res) {
  if (!req.file) {
    return res.status(400).send("No file uploaded");
  }

  const { set_name, language, difficulty_level } = req.body;
  const results = [];

  const bufferStream = new stream.PassThrough();
  bufferStream.end(req.file.buffer);

  bufferStream
    .pipe(csv({ mapHeaders: ({ header }) => header.trim() }))
    .on("data", (row) => {
      results.push(row);
    })
    .on("end", async () => {
      const client = await pool.connect();

      try {
        await client.query("BEGIN");

        // 1️⃣ Insert into flash_card_set and get the new set_id
        const setInsert = await client.query(
          `INSERT INTO flash_card_set (set_name, language, difficulty_level, number_of_cards)
           VALUES ($1, $2, $3, $4)
           RETURNING set_id`,
          [set_name, language, difficulty_level, results.length]
        );

        const set_id = setInsert.rows[0].set_id;

        // 2️⃣ Build the parameterized insert for cards
        const cardRows = results.map((row) => [
          set_id,
          row.front_content,
          row.back_content,
          row.hint || null,
        ]);

        const values = [];
        const placeholders = [];

        cardRows.forEach((row, i) => {
          const baseIndex = i * 4;
          placeholders.push(
            `($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3}, $${baseIndex + 4})`
          );
          values.push(...row);
        });

        const insertQuery = `
          INSERT INTO card (set_id, front_content, back_content, hint)
          VALUES ${placeholders.join(",")}
        `;

        await client.query(insertQuery, values);

        await client.query("COMMIT");

        res.json({
          message: "Set and cards uploaded successfully",
          set_id,
          cardsInserted: cardRows.length,
        });
      } catch (err) {
        await client.query("ROLLBACK");
        console.error("Transaction error:", err);
        res.status(500).send("Error adding flashcard set");
      } finally {
        client.release();
      }
    })
    .on("error", (err) => {
      console.error("Error parsing CSV:", err);
      res.status(500).send("Error parsing CSV");
    });
}

module.exports = { addFlashSet };
