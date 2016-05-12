"use strict";
import ApiError from "../../util/apiError";

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

  login(req, res, next) {

    let encryptedPassword = this.crypto
      .createHash("md5")
      .update(req.body.password)
      .digest("hex");

    args.collection = "accounts";
    args.filter = {
      "emailID": req.body.emailID,
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
        if (result) {
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
              if (response) {
                let content = Object.assign({}, result, response);

                Reflect.deleteProperty(content, "preferenceId");
                return res.status(200).send(content);
              }
              return next(new ApiError("ReferenceError", "User Data not Found", response, 404));
            }, err => {
              console.log("Error Retreiving User login data");
              return next(new ApiError("Internal Server Error", "DB error", err, 500));
            });
        }else {
          return next(new ApiError("ReferenceError", "User Data not Found", result, 404));
        }

      }, err => {
        console.log("Error from DB");
        return next(new ApiError("Internal Server Error", "DB error", err, 500));
      });
  }
}
