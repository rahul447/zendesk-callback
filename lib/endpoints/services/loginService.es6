"use strict";

let args = {
  "collection": "accounts",
  "filter": {},
  "projection": {}
};

export class LoginService {

  constructor(genericRepo, loggerInstance) {
    this.genericRepo_ = genericRepo;
    this.loggerInstance = loggerInstance;
  }

  login(req, res) {

    args.filter = {"emailId": req.body.emailId,
                   "password": req.body.password};

    this.genericRepo_.retrieve(args)
      .then(result => {
        res.send(result);
      });
  }
}
