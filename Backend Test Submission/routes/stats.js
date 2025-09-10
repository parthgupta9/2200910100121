const express = require("express");
const ShortUrl = require("../models/ShortUrl");

const router = express.Router();

router.get("/:code", async (req, res) => {
  try {
    const doc = await ShortUrl.findOne({ shortcode: req.params.code });
    if (!doc) {
      req.log("warn", "route", "Stats requested for missing shortcode");
      return res.status(404).json({ error: "Not found" });
    }

    const data = {
      shortcode: doc.shortcode,
      originalUrl: doc.originalUrl,
      createdAt: doc.createdAt,
      expiry: doc.expiry,
      totalClicks: doc.clicks,
      clicks: doc.clicksData.map(c => ({
        timestamp: c.timestamp,
        referrer: c.referrer,
        country: c.country,
      })),
    };

    req.log("info", "route", `Stats returned for ${doc.shortcode}`);
    res.json(data);
  } catch (err) {
    req.log("fatal", "route", `Stats error: ${err.message}`);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
