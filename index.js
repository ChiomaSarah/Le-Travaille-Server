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

const userRouter = require("./routes/user");
app.use("/user", userRouter);

const apiRouter = require("./routes/jobs");
app.use("/api", apiRouter);

const PORT = process.env.PORT || 2005;
app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`Server is listening on port ${PORT}`);
});
