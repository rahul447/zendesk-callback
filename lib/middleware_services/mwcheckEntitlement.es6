"use strict";
import ApiError from "../util/apiError";
let protectedEntitlementInstance;

export class MwcheckEntitlement {

  constructor(genericRepo, loggerInstance) {
    this.genericRepo = genericRepo;
    this.loggerInstance = loggerInstance;
  }

  getEntitlements(req, res, next) {

    this.loggerInstance.info(`$$$ ${MwcheckEntitlement.name} now getEntitlements() ==>`);
    if (req.user && req.user.entitlements.indexOf(req.params.name) > -1) {
      this.loggerInstance.debug(`$$$ ${MwcheckEntitlement.name} Authorized User`);
      return next();
    }
    this.loggerInstance.debug(`$$$ ${MwcheckEntitlement.name} User User is not authorised to access`);
    return next(
      new ApiError("ReferenceError",
        "User is not authorised to access",
        "Unauthorized", 401));
  }

  getLeaderAction(req, res, next) {
    this.loggerInstance.info(`$$$ ${MwcheckEntitlement.name} now getLeaderAction() ==>`);
    if (req.user && req.user.entitlements.indexOf("leadership") > -1) {
      this.loggerInstance.debug(`$$$ ${MwcheckEntitlement.name} Leadership Authorized User`);
      return next();
    }
    this.loggerInstance.debug(`$$$ ${MwcheckEntitlement.name} User User is not authorised to access Leadership`);
    return next(
      new ApiError("ReferenceError",
        "User is not authorised to access",
        "Unauthorized", 401));
  }
}

export function getEntitlementInstance(...args) {

  protectedEntitlementInstance = protectedEntitlementInstance || new MwcheckEntitlement(...args);

  return protectedEntitlementInstance;
}
