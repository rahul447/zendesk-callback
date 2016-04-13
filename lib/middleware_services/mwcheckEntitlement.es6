"use strict";
import localConfig from "../../config/local";
import ApiError from "../util/apiError";

function mwcheckEntitlement(req, res, next) {
  console.log("check entitle");
  console.log(req.params);
  console.log(localConfig.preferences.entitlements);
  if (localConfig.preferences.entitlements.indexOf(req.params.name) !== -1) {
    return next();
  }
  return next(new ApiError("entitlement"));

}

export default mwcheckEntitlement;
