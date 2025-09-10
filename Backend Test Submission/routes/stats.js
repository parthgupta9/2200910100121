const express = require("express");
const ShortUrl = require("../models/Url");

const router = express.Router();

router.get("/:code", async (req, res) => {
  try {
    const doc = await ShortUrl.findOne({ shortcode: req.params.code });
    if (!doc) return res.status(404).json({ error: "Not found" });

    res.json({
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
    });
  } catch (err) {
    req.log("fatal", "route", `Stats error: ${err.message}`);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
