const express = require("express");
const router = express.Router();
const { getJobsFeed } = require("../controllers/jobsController");
const verifyToken = require("../middleware/verifyToken");

router.get("/jobs", verifyToken, getJobsFeed);

module.exports = router;
