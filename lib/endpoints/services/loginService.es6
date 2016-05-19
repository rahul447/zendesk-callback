"use strict";
import ApiError from "../../util/apiError";
import jwt from "jsonwebtoken";
import Q from "q";

let args = {
  "collection": "",
  "filter": {},
  "projection": {}
};

export class LoginService {

  constructor(genericRepo, loggerInstance, crypto, redis, config) {
    this.genericRepo_ = genericRepo;
    this.loggerInstance = loggerInstance;
    this.crypto = crypto;
    this.redis = redis;
    this.config = config;
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

  singleSignAuth(user) {
    let deferred = Q.defer();

    this.redis.getToken({
      "key": user
    })
      .then(result => {
        if (result) {
          console.log("success in getting token ");
          deferred.resolve(result);
        }else {
          console.log("Token not found");
          deferred.reject(result);
        }
      }, err => {
        console.log("Redis Error while getting token ", err);
        deferred.reject(err);
      });
    return deferred.promise;
  }

  authLogin(req, res, next) {
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
      "userId": 1
    };
    const secret = req.app.get("tokenSecret");

    this.singleSignAuth(req.body.emailID)
      .then(loggedIn => {
        console.log("User already logged in with other device ", loggedIn);
        return next(new ApiError("ReferenceError", "User is not authorised to access", "Unauthorized", 401));
      }, newUser => {
        console.log("First device", newUser);
        this.genericRepo_.retrieve(args)
          .then(user => {
            if (user) {
              let payload = {},
                redisStore = {},
                inactivityCheck = {};

              args.collection = "preferences";
              args.filter = {
                "_id": user.preferenceId
              };
              args.projection = {
                "_id": 0,
                "landingPage": 1,
                "entitlements": 1
              };

              this.genericRepo_.retrieve(args)
                .then(response => {
                  if (response) {
                    let content = Object.assign({}, user, response),
                      conf = {
                        "expiresIn": this.config.tokenExpireIn
                      };

                    payload.userId = user.userId;
                    payload.userEmail = req.body.emailID;
                    payload.preferenceId = user.preferenceId;
                    payload.landingPage = response.landingPage;
                    payload.entitlements = response.entitlements;
                    Reflect.deleteProperty(content, "preferenceId");
                    jwt.sign(payload, secret, conf, (err, token) => {
                      if (!err) {
                        console.log("Token Generated");
                        content.token = token;
                        inactivityCheck.token = token;
                        inactivityCheck.lastCheckIn = Math.round(new Date().getTime() / 1000);
                        redisStore.key = user.emailID;
                        redisStore.value = inactivityCheck;
                        this.redis.setToken(redisStore)
                          .then(done => {
                            console.log("Value added to redis", done);
                          }, fail => {
                            console.log("Error while adding value to redis", fail);
                          });
                        res.status(200).send(content);
                      }else {
                        console.log("token not generated", err);
                        res.status(200).send(content);
                      }
                    });
                  }else {
                    return next(new ApiError("ReferenceError", "User Data not Found", response, 404));
                  }
                }, err => {
                  console.log("Error Retreiving User login data");
                  return next(new ApiError("Internal Server Error", "DB error", err, 500));
                });
            }
          });
      });
  }
}
