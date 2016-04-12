"use strict";

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

  getDrillDashboard(req, res) {
    let content;

    this.Q.all([
      this.getDrillData(req),
      this.getDrillPreferences(req)
    ])
    .then(response => {
      content = this.merge(response[0], response[1]);
      content = content.dashboard[req.params.name].groups[req.params.group].portlets[req.params.portlet];
      res.send(content);
    })
    .done();
  }
}
