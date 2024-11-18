const Parser = require("rss-parser");

const parser = new Parser({
  customFields: {
    item: [
      "id",
      "position",
      "company",
      "contract",
      "experience",
      "location",
      "expiryDate",
    ],
  },
});

module.exports = parser;
