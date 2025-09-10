require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
const bodyParser = require("body-parser");
const requestIp = require("request-ip");

const loggingMiddleware = require("./middlewares/loggingMiddleware");
const routes = require("./routes");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(requestIp.mw());
app.use(loggingMiddleware);

app.use("/", routes);

app.get("/health", (req, res) => res.json({ status: "ok" }));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
