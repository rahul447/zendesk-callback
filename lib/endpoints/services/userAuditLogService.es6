"use strict";
// import ApiError from "../../util/apiError";

let insertArgs = {
  "collection": "",
  "docs": []
};

export class UserAuditLogService {

  constructor(genericRepo, loggerInstance) {
    this.genericRepo_ = genericRepo;
    this.loggerInstance = loggerInstance;
  }

  add(req, res) {

    let data = req.body || {};

    this.loggerInstance.info("===post User Audit Log====>");

    insertArgs.collection = "auditlogs";
    insertArgs.docs = Array.of(data);

    // return this.genericRepo_.insertMany(insertArgs);
    this.genericRepo_.insertMany(insertArgs);
    return res.status(201).send("Audit Done");
  }
}
