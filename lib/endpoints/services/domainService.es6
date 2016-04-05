"use strict";

let args = {
  "collection": "users",
  "filter": {},
  "projection": {}
};

export class DomainService {

  constructor(genericRepo) {
    console.log("inside DomainService ctor", genericRepo);
    this.genericRepo_ = genericRepo;
  }

  getDashboard(req, res) {
    console.log("inside getDashboard ==>", this.genericRepo_);
    args.filter = {"_id": 1};
    args.projection = {"dashboard.financial": 1};
    this.genericRepo_.retrieve(args)
      .then(result => {
        console.log(result);
        res.send(result);
      });
  }
}
