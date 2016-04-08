"use strict";

function mwAuthenticate(req, res, next) {
  console.log("error here");
  let uniqueIdPattern = new RegExp("^[0-9a-fA-F]{8}" +
    "-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"),
    getToken = typeof req.headers !== "undefined" ? req.headers.authorization.split(" ")[1] : "";

  if (!uniqueIdPattern.test(getToken)) {
    return res.status(401).send("Unauthorized");
  }

  next();
}

export default mwAuthenticate;
