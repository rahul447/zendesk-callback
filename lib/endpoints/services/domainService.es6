"use strict";

import ApiError from "../../util/apiError";

let args = {
  "collection": "users",
  "filter": {},
  "projection": {}
};

export class DomainService {

  constructor(genericRepo, loggerInstance) {
    this.genericRepo_ = genericRepo;
    this.loggerInstance = loggerInstance;
  }

  validateRequest(req) {
    console.log("===inside validate Request====>");

    if (!req || !req.params) {

      this.loggerInstance.debug("ValidationError: Request cannot be processed. Parameters missing");
      return new ApiError(
        "ValidationError", "Request cannot be processed. Parameter missing : Parameters missing", null, 400);

    } else if (!req.params.userId) {

      this.loggerInstance.debug("ValidationError: Request cannot be processed. Parameter missing : user id");
      return new ApiError(
        "ValidationError", "Request cannot be processed. Parameter missing : user id", null, 400);

    } else if (!req.params.name) {

      this.loggerInstance.debug("ValidationError: Request cannot be processed. Parameter missing : domain name");
      return new ApiError(
        "ValidationError", "Request cannot be processed. Parameter missing : domain name", null, 400);
    }

    return true;
  }

  getDashboard(req, res) {

    let validateReqError = this.validateRequest(req),
      projection;

    if (validateReqError instanceof ApiError) {
      return validateReqError;
    }

    if (validateReqError) {

      args.filter = {"_id": "6704fa09f15f4a8c73e05f83"};
      projection = `dashboard.${req.params.name}`;
      args.projection = {};
      args.projection[projection] = 1;
      console.log(args);

      this.genericRepo_.retrieve(args)
        .then(result => {
          res.send(result);
        }, err => {
          res.send(err);
        });
    }
  }
}
