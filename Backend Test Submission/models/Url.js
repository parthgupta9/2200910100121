const mongoose = require("mongoose");

const ClickSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  referrer: String,
  ip: String,
  country: String,
});

const ShortUrlSchema = new mongoose.Schema({
  shortcode: { type: String, unique: true, required: true, index: true },
  originalUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  expiry: { type: Date, required: true },
  clicks: { type: Number, default: 0 },
  clicksData: { type: [ClickSchema], default: [] },
});

module.exports = mongoose.model("ShortUrl", ShortUrlSchema);
