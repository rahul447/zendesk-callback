"use strict";

function mwAuthenticate(req, res, next) {
  console.log("========mwAuth====================");
  let uniqueIdPattern = new RegExp("^[0-9a-fA-F]{8}" +
    "-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"),
    token = req.headers.authorization.split(" ")[1];

  if (req.url.indexOf("login") === -1 && !uniqueIdPattern.test(token)) {
    return res.status(401).send("Unauthorized");
  }

  req.userId = token;

  next();
}

export default mwAuthenticate;
