const {pool} = require("../util/db")

async function getUserAnalytics(req,res) {
    try{
        const result = await pool.query(`
            SELECT * FROM user_analytics
            `)
        res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching results from DB");
  }
}

async function refreshAnalytics(req,res) {
    try{
        const result = await pool.query(`
            REFRESH MATERIALIZED VIEW CONCURRENTLY user_analytics;
            `)
        res.status(200).json({message:"view refreshed successfully"});
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching results from DB");
  }
}


module.exports = {getUserAnalytics,refreshAnalytics}