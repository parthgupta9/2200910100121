const express = require("express");
const fetch = require("node-fetch");
const { setAccessToken } = require("../logging/Log");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const body = {
      email: process.env.REG_EMAIL,
      name: process.env.REG_NAME,
      rollNo: process.env.REG_ROLLNO,
      accessCode: process.env.ACCESS_CODE,
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
    };

    const response = await fetch(process.env.AUTH_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

  
    setAccessToken(data.access_token);

    return res.json({ token: data.access_token, expires_in: data.expires_in });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
