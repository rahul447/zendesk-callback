"use strict";

import ApiError from "../../util/apiError";

let args = {
  "collection": "users",
  "filter": {},
  "projection": {}
};

export class DomainService {

  constructor(genericRepo,
              loggerInstance) {
    this.genericRepo_ = genericRepo;
    this.loggerInstance = loggerInstance;
  }

  validateRequest(req) {
    if (!req ||
      !req.params) {
      this.loggerInstance.debug("ValidationError: Request cannot be processed. Parameters missing");
      throw new ApiError(
        "ValidationError", "Request cannot be processed. Parameter missing : Parameters missing", null, 400);
    }

    if (!req.params.userId) {
      this.loggerInstance.debug("ValidationError: Request cannot be processed. Parameter missing : user id");
      throw new ApiError(
        "ValidationError", "Request cannot be processed. Parameter missing : user id", null, 400);
    }

    if (!req.params.name) {
      this.loggerInstance.debug("ValidationError: Request cannot be processed. Parameter missing : domain name");
      throw new ApiError(
        "ValidationError", "Request cannot be processed. Parameter missing : domain name", null, 400);
    }
  }

  getDashboard(req, res) {

    this.validateRequest(req);

    args.filter = {"_id": req.params.userId};
    let projection = `dashboard.${req.params.name}`;

    args.projection = {};
    args.projection[projection] = 1;
    console.log(args);
    this.genericRepo_.retrieve(args)
      .then(result => {
        res.send(result);
      });
  }
}
