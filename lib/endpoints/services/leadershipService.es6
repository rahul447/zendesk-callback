"use strict";
import ApiError from "../../util/apiError";

let args = {
  "collection": "",
  "filter": {},
  "projection": {}
};

export class LeaderShipService {

  constructor(genericRepo, loggerInstance, Q, merge) {
    this.merge = merge;
    this.genericRepo_ = genericRepo;
    this.loggerInstance = loggerInstance;
    this.Q = Q;
  }

  getLeadershipData(req) {
    args.collection = "users";
    args.filter = {"_id": req.userId};
    args.projection = {"dashboard.leadership": 1};

    return this.genericRepo_.retrieve(args);
  }

  getLeadershipPreferences(req) {
    args.collection = "preferences";
    args.filter = {"userId": req.userId};
    // _id in preferences collection indicates preference id. We don't need that.
    args.projection = {"dashboard.leadership": 1, "_id": 0};

    return this.genericRepo_.retrieve(args);
  }

  getLeadershipDashboard(req, res, next) {

    let content;

    this.Q.all([
      this.getLeadershipData(req),
      this.getLeadershipPreferences(req)
    ])
    .then(response => {
      if (response) {
        content = this.merge(response[0], response[1]);
        return res.status(200).send(content);
      }
      return next(new ApiError("ReferenceError", "Leadership Data not Found in Database", response, 401));
    }, err => {
      console.log("Error Retreiving leadership data");
      return next(new ApiError("Internal Server Error", "DB error", err, 500));
    })
    .done();
  }
}
