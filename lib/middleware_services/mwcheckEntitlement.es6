"use strict";
import localConfig from "../../config/local";

function mwcheckEntitlement(req, res, next) {
  console.log("check entitle");
  console.log(req.params);
  console.log(localConfig.preferences.entitlements);
  next();
  return localConfig.preferences.entitlements.indexOf(req.params.name) !== -1 ? res.send(true) : res.send(false);
}

export default mwcheckEntitlement;
