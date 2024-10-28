const express = require("express");

const app = express();
const cors = require("cors");
const fileUpload = require("express-fileupload");

app.use(cors("*"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(fileUpload({ useTempFiles: true }));

const authRouter = require("./routes/auth");
app.use("/auth", authRouter);

const dashboardRouter = require("./routes/dashboard");
app.use("/user", dashboardRouter);

const apiRouter = require("./routes/jobApi");
app.use("/api", apiRouter);

// Connect to PostgreSQL
pool.connect((err, client, release) => {
  if (err) {
    console.error("Error acquiring client", err.stack);
    process.exit(1); // Exit if connection fails
  }
  client.query("SELECT NOW()", (err) => {
    release();
    if (err) {
      console.error("Error executing query", err.stack);
      process.exit(1); // Exit if query fails
    }
    console.log("Connected to the Database!");
  });
});

const PORT = process.env.PORT || 2005;
app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`Server is listening on port ${PORT}`);
});
