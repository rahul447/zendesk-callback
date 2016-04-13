"use strict";

let args = {
  "collection": "",
  "filter": {},
  "projection": {}
};

export class LoginService {

  constructor(genericRepo, loggerInstance, crypto) {
    this.genericRepo_ = genericRepo;
    this.loggerInstance = loggerInstance;
    this.crypto = crypto;
  }

  login(req, res) {

    let encryptedPassword = this.crypto
      .createHash("md5")
      .update(req.body.password)
      .digest("hex");

    args.collection = "accounts";
    args.filter = {
      "emailID": req.body.emailId,
      "password": encryptedPassword
    };
    args.projection = {
      "_id": 0,
      "preferenceId": 1,
      "emailID": 1,
      "token": 1
    };

    this.genericRepo_.retrieve(args)
      .then(result => {

        args.collection = "preferences";
        args.filter = {
          "_id": result.preferenceId
        };
        args.projection = {
          "_id": 0,
          "landingPage": 1,
          "entitlements": 1
        };

        this.genericRepo_.retrieve(args)
        .then(response => {

          let content = Object.assign({}, result, response);

          Reflect.deleteProperty(content, "preferenceId");
          res.send(content);
        });
      });
  }
}
