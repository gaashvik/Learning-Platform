// Import the PostgreSQL client
const { Pool } = require("pg");
const db_config = require("../config/configuration");
const queries = require("../model/schema");

// Create a connection pool postgresql://ps_skillcase_user:G03J1D285LMtGsaMJLwIwbc8Rp5UxPU8@dpg-d3ibbsc9c44c73akvpgg-a/ps_skillcase
const pool = new Pool({
  connectionString: "postgresql://ps_skillcase_20dl_user:MpjLxTVirnKUJ3iLXaLrwCEj0zgyqomZ@dpg-d3ips1p5pdvs73959460-a/ps_skillcase_20dl",
  ssl: {
    rejectUnauthorized: false, 
  },
});
// Test the connection
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
    await pool.query(queries.createUserCardSubmission);
    await pool.query(queries.createUserFlashSubmission);

    console.log("Tables created or already exist!");
  } catch (err) {
    console.error(`Error occurred while creating tables: ${err}`);
  }
}

module.exports = { pool, initDb };
