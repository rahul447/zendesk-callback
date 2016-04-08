"use strict";

let args = {
  "collection": "",
  "filter": {},
  "projection": {}
};

export class DomainService {

  constructor(genericRepo, loggerInstance, Q, merge) {
    this.merge = merge;
    this.genericRepo_ = genericRepo;
    this.loggerInstance = loggerInstance;
    this.Q = Q;
  }

  /*
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
*/

  getDomainData(req) {
    let projection = `dashboard.${req.params.name}`;

    args.collection = "users";
    args.filter = {"_id": req.userId};
    args.projection[projection] = 1;
    console.log(args);
    return this.genericRepo_.retrieve(args);
  }

  getDomainPreferences(req) {
    let projection = `dashboard.${req.params.name}`;

    args.collection = "preferences";
    args.filter = {"userId": req.userId};
    // _id in preferences collection indicates preference id. We don't need that.
    args.projection = {"_id": 0};
    args.projection[projection] = 1;
    console.log(args);
    return this.genericRepo_.retrieve(args);
  }

  getDomainDashboard(req, res) {
    console.log(req.params);
    let content;

    this.Q.all([
      this.getDomainData(req),
      this.getDomainPreferences(req)
    ])
    .then(response => {
      content = this.merge(response[0], response[1]);
      res.send(content);
    })
    .done();
  }

  /*
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
  */

}
