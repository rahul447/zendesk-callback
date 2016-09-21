"use strict";
import ApiError from "../../util/apiError";
import Q from "q";
import merge from "deepmerge";

let args = {
  "collection": "",
  "filter": {},
  "projection": {}
};

export class LeaderShipService {

  constructor(genericRepo, loggerInstance) {
    this.genericRepo_ = genericRepo;
    this.loggerInstance = loggerInstance;
  }

  getLeadershipData() {
    this.loggerInstance.info(`$$$ ${LeaderShipService.name} getLeadershipData() call`);
    args.collection = "leadership";
    args.filter = {};
    args.projection = {"dashboard.leadership": 1};
    args.projection.lastUpdatedDate = 1;

    return this.genericRepo_.retrieve(args);
  }

  getLeadershipPreferences(req) {
    this.loggerInstance.info(`$$$ ${LeaderShipService.name} getLeadershipPreferences() call`);
    args.collection = "preferences";
    args.filter = {"_id": req.user.preferenceId};
    // _id in preferences collection indicates preference id. We don't need that.
    args.projection = {"dashboard.leadership": 1, "_id": 0};

    return this.genericRepo_.retrieve(args);
  }

  getLeadershipDashboard(req, res, next) {
    this.loggerInstance.info(`$$$ ${LeaderShipService.name} getLeadershipDashboard() call`);

    let content;

    Q.all([
      this.getLeadershipData(req),
      this.getLeadershipPreferences(req)
    ])
    .then(response => {
      if (response) {
        this.loggerInstance.debug(`$$$ ${LeaderShipService.name} Q.all promise success`);
        console.log(response);
        content = merge(response[0], response[1]);
        return res.status(200).send(content);
      }
      this.loggerInstance.debug(`$$$ ${LeaderShipService.name} getLeadershipDashboard() Data not Found`);
      return next(new ApiError("ReferenceError", "Data not Found", response, 404));
    }, err => {
      this.loggerInstance.debug("Error Retreiving leadership data");
      return next(new ApiError("Internal Server Error", "DB error", err, 500));
    })
    .done();
  }
}
