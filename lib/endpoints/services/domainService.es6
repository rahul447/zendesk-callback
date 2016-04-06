"use strict";

import ApiError from "../../util/apiError";
import Q from "q";

let args = {
  "collection": "users",
  "filter": {},
  "projection": {}
};

export class DomainService {

  constructor(genericRepo,
              loggerInstance, mongo) {
    this.genericRepo_ = genericRepo;
    this.loggerInstance = loggerInstance;
    this.mongoid = mongo.ObjectId;
  }

  validateRequest(req) {
    console.log("===inside valid====>");
    let defer = Q.defer();

    if (!req ||
      !req.params) {
      this.loggerInstance.debug("ValidationError: Request cannot be processed. Parameters missing");
      let serviceError = new ApiError(
        "ValidationError", "Request cannot be processed. Parameter missing : Parameters missing", null, 400);

      defer.reject(serviceError);

    }else if (!req.params.userId) {
      this.loggerInstance.debug("ValidationError: Request cannot be processed. Parameter missing : user id");
      let serviceError = new ApiError(
        "ValidationError", "Request cannot be processed. Parameter missing : user id", null, 400);

      defer.reject(serviceError);

    }else if (!req.params.name) {
      this.loggerInstance.debug("ValidationError: Request cannot be processed. Parameter missing : domain name");
      let serviceError = new ApiError(
        "ValidationError", "Request cannot be processed. Parameter missing : domain name", null, 400);

      defer.reject(serviceError);

    }else {
      console.log("resolved");
      defer.resolve();
    }

    return defer.promise;
  }

  getDashboard(req, resp) {
    let getDefer = Q.defer(),
      MongoId = this.mongoid;

    this.validateRequest(req)
      .then(res => {
        args.filter = {"_id": new MongoId(req.params.userId)};
        let projection = `dashboards.${req.params.name}`;

        args.projection = {};
        args.projection[projection] = 1;
        console.log(args);
        this.genericRepo_.retrieve(args)
          .then(result => {
            resp.send(result);
            getDefer.resolve(res);
          });
      }, err => {
        resp.send(err);
        getDefer.reject(err);
      });
    return getDefer.promise;
  }
}
