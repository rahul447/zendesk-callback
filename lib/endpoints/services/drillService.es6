"use strict";
import ApiError from "../../util/apiError";

let args = {
  "collection": "",
  "filter": {},
  "projection": {}
};

export class DrillService {

  constructor(genericRepo, loggerInstance, Q, merge) {
    this.merge = merge;
    this.genericRepo_ = genericRepo;
    this.loggerInstance = loggerInstance;
    this.Q = Q;
  }

  getDrillData(req) {

    let projection = `dashboard.${req.params.name}.groups`;

    args.collection = "users";
    args.filter = {"_id": req.userId};
    args.projection[projection] = 1;

    return this.genericRepo_.retrieve(args);
  }

  getDrillPreferences(req) {

    let projection = `dashboard.${req.params.name}.groups`;

    args.collection = "preferences";
    args.filter = {"userId": req.userId};
    // _id in preferences collection indicates preference id. We don't need that.
    args.projection = {"_id": 0};
    args.projection[projection] = 1;

    return this.genericRepo_.retrieve(args);
  }

  getDrillDashboard(req, res, next) {
    let content;

    this.Q.all([
      this.getDrillData(req),
      this.getDrillPreferences(req)
    ])
    .then(response => {
      if (response) {
        content = this.merge(response[0], response[1]);
        content = content.dashboard[req.params.name].groups[req.params.group].portlets[req.params.portlet];
        content.icon = response[1].dashboard[req.params.name].groups[req.params.group].icon;
        content.title = response[1].dashboard[req.params.name].groups[req.params.group].title;
        return res.status(200).send(content);
      }
      return next(new ApiError("ReferenceError", "Drill Data not Found in Database", response, 401));
    }, err => {
      console.log("Error Retreiving DrillDown data");
      return next(new ApiError("Internal Server Error", "DB error", err, 500));
    })
    .done();
  }
}
