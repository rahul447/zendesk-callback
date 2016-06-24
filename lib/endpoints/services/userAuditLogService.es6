"use strict";
// import ApiError from "../../util/apiError";

require("babel-polyfill");

let insertArgs = {
  "collection": "",
  "docs": []
};

export class UserAuditLogService {

  constructor(genericRepo, loggerInstance, Q, merge) {
    this.merge = merge;
    this.genericRepo_ = genericRepo;
    this.loggerInstance = loggerInstance;
    this.Q = Q;
  }

  add(req, res) {

    let data = req.body || {};

    this.loggerInstance.info("===post User Audit Log====>");

    insertArgs.collection = "auditlogs";
    insertArgs.docs = [data];

    // return this.genericRepo_.insertMany(insertArgs);
    this.genericRepo_.insertMany(insertArgs);
    return res.status(201).send("Audit Done");
  }
}
