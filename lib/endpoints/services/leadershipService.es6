"use strict";

let args = {
  "collection": "users",
  "filter": {},
  "projection": {}
};

export class LeaderShipService {

  constructor(genericRepo) {
    this.genericRepo_ = genericRepo;
  }

  getLeadershipDashboard(req, res) {
    args.filter = {"_id": 1};
    args.projection = {"dashboard.leadership": 1};
    this.genericRepo_.retrieve(args)
      .then(result => {
        console.log(result);
        res.send(result);
      });
  }
}
