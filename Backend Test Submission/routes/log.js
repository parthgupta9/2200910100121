const express = require("express");
const { Log } = require("../../Logging Middleware/Log");

const router = express.Router();

router.post("/", async (req, res) => {
  const { stack, level, packageName, message } = req.body;
  try {
    await Log(stack, level, packageName, message);
    res.json({ status: "ok" });
  } catch (err) {
    console.error("Backend log forwarding failed:", err.message);
    res.status(500).json({ error: "Log forwarding failed" });
  }
});

module.exports = router;
