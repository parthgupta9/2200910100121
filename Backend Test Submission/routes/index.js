const express = require("express");

const shorten = require("./shorten");
const redirect = require("./redirect");
const stats = require("./stats");

const router = express.Router();

router.use("/shorten", shorten);
router.use("/shorturls", stats);
router.use("/", redirect);

module.exports = router;
