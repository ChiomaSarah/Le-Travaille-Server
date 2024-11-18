const parser = require("../utils/rssParser");

const getJobsFeed = async (req, res) => {
  try {
    parser.parseURL(
      "https://www.myjobmag.com/aggregate_feed.xml",
      (err, feed) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Failed to parse RSS feed", error: err.message });
        }
        res.json(feed);
      }
    );
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({
        message: "An error occurred while fetching jobs",
        error: error.message,
      });
  }
};

module.exports = { getJobsFeed };
