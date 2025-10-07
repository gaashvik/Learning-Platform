const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { pool } = require("../util/db");
const config = require("../config/configuration");
const { v4: uuidv4 } = require("uuid");

// SIGNUP
async function signup(req, res) {
  const { username, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM app_user WHERE username = $1", [username]);
    const rows = result.rows;

    if (rows.length > 0) {
      return res.status(400).json({ msg: "User already exists" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Error while searching user" });
  }

  const hashed = await bcrypt.hash(password, 10);
  const newId = uuidv4();
  const role = "user";

  try {
    await pool.query(
      "INSERT INTO app_user (user_id, username, password, role) VALUES ($1, $2, $3, $4)",
      [newId, username, hashed, role]
    );

    const token = jwt.sign(
      { user_id: newId, username, role },
      config.JWT_SECRET_KEY,
      { expiresIn: "60d" }
    );

    res.status(200).json({
      user: { user_id: newId, username, role },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error while trying to create account" });
  }
}

// LOGIN
async function login(req, res) {
  if (!req.body) {
    return res.status(400).json({ msg: "Username or password missing" });
  }

  const { username, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM app_user WHERE username = $1", [username]);
    const rows = result.rows;

    if (rows.length === 0) {
      return res.status(400).json({ msg: "Invalid username or password" });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid username or password" });
    }

    const token = jwt.sign(
      { user_id: user.user_id, username: user.username, role: user.role },
      config.JWT_SECRET_KEY,
      { expiresIn: "60d" }
    );

    res.status(200).json({
      user: { user_id: user.user_id, username: user.username, role: user.role },
      token,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Error while searching user" });
  }
}

// ME
async function me(req, res) {
  if (!req.user) {
    return res.status(401).json({ msg: "Unauthorized: no user logged in" });
  }

  const { user_id } = req.user;

  try {
    const result = await pool.query("SELECT * FROM app_user WHERE user_id = $1", [user_id]);
    const rows = result.rows;

    if (rows.length === 0) {
      return res.status(404).json({ msg: "User not found" });
    }

    const user = rows[0];

    res.status(200).json({
      user: { user_id: user.user_id, username: user.username, role: user.role },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error while accessing DB");
  }
}

module.exports = { login, signup, me };
