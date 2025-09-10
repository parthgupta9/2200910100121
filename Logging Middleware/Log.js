const fetch = require("node-fetch");

const LOG_API_URL = process.env.LOG_API_URL;
const accessToken = process.env.LOG_API_TOKEN;

async function Log(stack, level, packageName, message) {
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
      console.error("Failed to log:", res.status, await res.text());
    }
  } catch (err) {
    console.error("Log() error:", err.message);
  }
}

module.exports = { Log };
