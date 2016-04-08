"use strict";

function mwAuthenticate(req, res, next) {
  let uniqueIdPattern = new RegExp("^[0-9a-fA-F]{8}" +
    "-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"),
    getToken = req.headers.authorization.split(" ")[1];

  if (!uniqueIdPattern.test(getToken)) {
    return res.status(401).send("Unauthorized");
  }

  next();
}

export default mwAuthenticate;
