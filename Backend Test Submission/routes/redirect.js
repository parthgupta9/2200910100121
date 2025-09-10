const express = require("express");
const ShortUrl = require("../models/ShortUrl");
const geoip = require("geoip-lite");

const router = express.Router();

router.get("/:code", async (req, res) => {
  try {
    const doc = await ShortUrl.findOne({ shortcode: req.params.code });
    if (!doc) {
      req.log("warn", "route", "Shortcode not found");
      return res.status(404).json({ error: "Not found" });
    }
    if (new Date() > doc.expiry) {
      req.log("info", "route", "Shortcode expired");
      return res.status(410).json({ error: "Expired" });
    }

    const ip = req.clientIp;
    const geo = geoip.lookup(ip) || {};
    doc.clicks++;
    doc.clicksData.push({ ip, country: geo.country || "unknown", referrer: req.get("referer") });
    await doc.save();

    req.log("info", "route", `Redirecting ${doc.shortcode} → ${doc.originalUrl}`);
    res.redirect(doc.originalUrl);
  } catch (err) {
    req.log("fatal", "route", `Redirect error: ${err.message}`);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
