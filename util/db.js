// Import the PostgreSQL client
const { Pool } = require("pg");
const db_config = require("../config/configuration");
const queries = require("../model/schema");

// Create a connection pool postgresql://ps_skillcase_user:G03J1D285LMtGsaMJLwIwbc8Rp5UxPU8@dpg-d3ibbsc9c44c73akvpgg-a/ps_skillcase
const pool = new Pool({
  connectionString: "db://user:root@db:5432/skillcase",
  // ssl: {
  //   rejectUnauthorized: false, 
  // },
});
pool.connect()
  .then(client => {
    console.log("Connected to PostgreSQL DB");
    client.release();
  })
  .catch(err => console.error("DB connection failed:", err));

async function initDb(pool) {
  try {
    await pool.query(queries.createFlashCardSet);
    await pool.query(queries.createCards);
    await pool.query(queries.createUser);
    await pool.query(queries.createUserFlashSubmission);
    await pool.query(queries.createChTest);
    await pool.query(queries.createFinalTest);
    await pool.query(queries.createInterview);

    console.log("Tables created or already exist!");
  } catch (err) {
    console.error(`Error occurred while creating tables: ${err}`);
  }
}

module.exports = { pool, initDb };
