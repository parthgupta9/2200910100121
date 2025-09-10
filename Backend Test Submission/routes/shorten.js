const express = require("express");
const ShortUrl = require("../models/Url");

const router = express.Router();

function isValidUrl(u) {
  try { new URL(u); return true; } catch { return false; }
}
function genCode(len = 6) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

router.post("/", async (req, res) => {
  try {
    const { url, validityMinutes, shortcode } = req.body;
    if (!url || !isValidUrl(url)) {
      req.log("error", "handler", "Invalid URL provided");
      return res.status(400).json({ error: "Invalid URL" });
    }

    const minutes = validityMinutes && Number.isInteger(validityMinutes) ? validityMinutes : 30;
    const expiry = new Date(Date.now() + minutes * 60000);

    let code = shortcode || genCode();
    if (shortcode) {
      if (!/^[a-zA-Z0-9_-]{4,20}$/.test(shortcode)) {
        return res.status(400).json({ error: "Invalid shortcode format" });
      }
      const exists = await ShortUrl.findOne({ shortcode });
      if (exists) {
        return res.status(409).json({ error: "Shortcode already exists" });
      }
    } else {
      while (await ShortUrl.findOne({ shortcode: code })) code = genCode();
    }

    const doc = new ShortUrl({ shortcode: code, originalUrl: url, expiry });
    await doc.save();

    req.log("info", "db", `Created short URL ${code}`);
    res.json({ shortLink: `${req.protocol}://${req.get("host")}/${code}`, shortcode: code, expiry });
  } catch (err) {
    req.log("fatal", "handler", `Shorten error: ${err.message}`);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
