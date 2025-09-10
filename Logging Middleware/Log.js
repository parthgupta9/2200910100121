// logging/Log.js
const fetch = require("node-fetch");

const LOG_API_URL = process.env.LOG_API_URL;  // set in .env
let accessToken = ""; // will be injected after /auth


async function Log(stack, level, packageName, message) {
  if (!accessToken) {
    console.error("⚠️ No access token available for logging");
    return;
  }

  try {
    const body = { stack, level, package: packageName, message };

    const res = await fetch(LOG_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      console.error("❌ Failed to log:", res.status, await res.text());
    }
  } catch (err) {
    console.error("Log() error:", err.message);
  }
}

/**
 * Update the bearer token after /auth
 */
function setAccessToken(token) {
  accessToken = token;
}

module.exports = { Log, setAccessToken };
