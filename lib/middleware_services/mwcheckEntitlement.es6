"use strict";
import ApiError from "../util/apiError";
let protectedEntitlementInstance,
  repoObj = {
    "collection": "",
    "filter": {},
    "projection": {}
  };

export class MwcheckEntitlement {

  constructor(genericRepo, loggerInstance) {
    this.genericRepo = genericRepo;
    this.loggerInstance = loggerInstance;
  }

  getEntitlements(req, res, next) {
    repoObj.collection = "preferences";
    repoObj.filter = {
      "userId": req.userId
    };
    repoObj.projection = {
      "entitlements": 1
    };
    this.genericRepo.retrieve(repoObj)
      .then(response => {
        if (response && response.entitlements.indexOf(req.params.name) > -1) {
          return next();
        }
        return next(
          new ApiError("ReferenceError", "Entitlement is not present in preferences", "Missing Entitlement", 401));
      }, err => {
        this.loggerInstance.debug("Error while getting entitles", err);
        return next(new ApiError("Internal Server Error", "DB error", err, 500));
      });
  }
}

export function getEntitlementInstance(...args) {

  protectedEntitlementInstance = protectedEntitlementInstance || new MwcheckEntitlement(...args);

  return protectedEntitlementInstance;
}
