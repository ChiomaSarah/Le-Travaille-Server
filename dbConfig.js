require("dotenv").config();
const { Pool } = require("pg");

const isProduction = process.env.NODE_ENV === "production";

const pool = new Pool(
  isProduction
    ? {
        connectionString: process.env.PGURL,
        ssl: { rejectUnauthorized: false },
      }
    : {
        user: process.env.PGUSER,
        host: process.env.PGHOST,
        database: process.env.PGDATABASE,
        password: process.env.PGPASSWORD,
        port: process.env.PGPORT,
      }
);

pool.connect((err, client, release) => {
  if (err) {
    console.error("Error acquiring client", err.stack);
    process.exit(1); // Exit if connection fails.
  }
  client.query("SELECT NOW()", (err) => {
    release();
    if (err) {
      console.error("Error executing query", err.stack);
      process.exit(1); // Exit if query fails.
    }
    console.log("Connected to the Database!");
  });
});

module.exports = pool;
