// Import the PostgreSQL client
const { Pool } = require("pg");
const db_config = require("../config/configuration");
const queries = require("../model/schema");

// Create a connection pool postgresql://ps_skillcase_user:G03J1D285LMtGsaMJLwIwbc8Rp5UxPU8@dpg-d3ibbsc9c44c73akvpgg-a/ps_skillcase
const pool = new Pool({
  host: "postgresql", // or your hostname / IP
  port: 5432, // default PostgreSQL port
  user: "ps_skillcase_user", // your DB user
  password: "G03J1D285LMtGsaMJLwIwbc8Rp5UxPU8@dpg-d3ibbsc9c44c73akvpgg-a", // your DB password
  database: "ps_skillcase", // your DB name
  max: 10, // connection pool size
  idleTimeoutMillis: 30000, // close idle clients after 30s
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
