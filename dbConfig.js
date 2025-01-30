require("dotenv").config();
const { Pool } = require("pg");
const CronJob = require("cron").CronJob;

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

// Create a cron job that runs every 10 minutes.
const job = new CronJob(
  "*/10 * * * *",
  function () {
    console.log("Cron job started at:", new Date().toLocaleString());
    pool.query("SELECT NOW()", (err) => {
      if (err) {
        console.error("Error keeping DB alive", err.stack);
      } else {
        console.log(
          "Cron Job: DB Keep-alive query executed at:",
          new Date().toLocaleString()
        );
      }
    });
  },
  null,
  true,
  "UTC"
);

job.start();

module.exports = pool;
