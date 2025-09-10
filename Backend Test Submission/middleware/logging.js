const { Log } = require("../logging/Log");

function loggingMiddleware(req, res, next) {
  req.log = (level, pkg, msg) => {
    const detail = `${req.method} ${req.originalUrl} - ${msg}`;
    Log("backend", level, pkg, detail);
  };

  req.log("info", "route", "Incoming request");
  next();
}

module.exports = loggingMiddleware;
