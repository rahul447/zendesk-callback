"use strict";
import localConfig from "../../config/local";
function mwAuthenticate(req, res, next) {
  console.log("========mwAuth====================");
  let uniqueIdPattern = new RegExp("^[0-9a-fA-F]{8}" +
    "-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$");

  if (localConfig.publicUrls.indexOf(req.url) === -1 && req.headers.authorization) {
    console.log("no not here");
    let token = req.headers.authorization.split(" ")[1];

    if (!uniqueIdPattern.test(token)) {
      return res.status(401).send("Unauthorized");
    }
    req.userId = token;
  }
  console.log("yes");

  next();
}

export default mwAuthenticate;
