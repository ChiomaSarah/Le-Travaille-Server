require("dotenv").config();

// logic to connect to elephant.sql
let pg = require("pg");
let client = new pg.Client(process.env.PGURL);

client.connect(function (err) {
  if (err) {
    return console.error("could not connect to postgres", err);
  }
  client.query('SELECT NOW() AS "theTime"', function (err, result) {
    if (err) {
      return console.error("error running query", err);
    }
    console.log("Connection established!");
  });
});

module.exports = client;
