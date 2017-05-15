"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
function mwAllowCrossDomain(req, res, next) {

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.send();
  }
  next();
}

exports.default = mwAllowCrossDomain;
//# sourceMappingURL=mwAllowCrossDomain.js.map
