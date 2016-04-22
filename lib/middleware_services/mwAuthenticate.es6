"use strict";
import localConfig from "../../config/local";
import ApiError from "../util/apiError";
function mwAuthenticate(req, res, next) {
  let uniqueIdPattern = new RegExp("^[0-9a-fA-F]{8}" +
    "-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$");

  if (localConfig.publicUrls.indexOf(req.url) === -1 && req.headers.authorization) {
    let token = req.headers.authorization.split(" ")[1];

    if (!uniqueIdPattern.test(token)) {
      return res.status(401).send("Unauthenticated");
    }
    req.userId = token;
    return next();
  }

  if (localConfig.publicUrls.indexOf(req.url) > -1) {
    return next();
  }

  next(new ApiError("Unauthorized", "User is not authorized to access", "", 401));
}

export default mwAuthenticate;
