const express = require("express");

const authRoute = require("./auth");
const shortenRoute = require("./shorten");
const redirectRoute = require("./redirect");
const statsRoute = require("./stats");

const router = express.Router();

router.use("/auth", authRoute);         
router.use("/shorten", shortenRoute);   
router.use("/shorturls", statsRoute);    
router.use("/", redirectRoute);          

module.exports = router;
