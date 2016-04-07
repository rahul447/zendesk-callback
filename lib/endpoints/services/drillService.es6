"use strict";

let args = {
  "collection": "users",
  "filter": {},
  "projection": {}
};

export class DrillService {

  constructor(genericRepo) {
    this.genericRepo_ = genericRepo;
  }

  getdrillDashboard(req, res) {
    args.filter = {"_id": 1};
    args.projection = {"dashboard.drillDown": 1};
    this.genericRepo_.retrieve(args)
      .then(result => {
        console.log(result);
        res.send(result);
      });
  }

  getdrillgrid(req, res) {
    res.send("sending grid");
  }
}
