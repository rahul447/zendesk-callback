"use strict";
import ApiError from "../../util/apiError";
import {authenticator} from "otplib";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Q from "q";

let args = {
  "collection": "",
  "filter": {},
  "projection": {}
};

export class ResetPasswordService {
  constructor(genericRepo, loggerInstance, NodeMailer, config) {
    this.genericRepo_ = genericRepo;
    this.loggerInstance = loggerInstance;
    this.Nodemailer = NodeMailer;
    this.config = config;
  }

  requestchangePassword(req, res, next) {

    this.loggerInstance.info("=== post request change Password ====>");
    let code, secret, secretKey, apiErr;

    args.collection = "accounts";
    args.filter = {"emailID": req.body.emailId};
    args.projection = {};

    this.genericRepo_.retrieve(args)
      .then(response => {
        if (!response) {
          apiErr = new ApiError("ReferenceError", "User Data not Found", "", 404);
          return Q.reject(apiErr);
        }
        return Q("success");
      })
      .then(() => {
        secret = authenticator.generateSecret();
        code = authenticator.generate(secret);

        args.collection = "accounts";
        args.filter = {"emailID": req.body.emailId};
        args.projection = {
          "$set": {"resetPin": code}
        };
        this.genericRepo_.updateRecord(args).then(result => {
          if (!result) {
            return next(new ApiError("ReferenceError", "User Data not Found", "", 404));
          }
        });

        let claims = {
            "expiresIn": this.config.tokenExpireIn
          },
          payload = {
            "userEmail": "",
            "pin": code
          }, mailOption, encToken;

        secretKey = req.app.get("tokenSecret");
        payload.userEmail = req.body.emailId;
        this.createToken(payload, secretKey, claims)
          .then(Token => {
            if (!Token) {
              return next(new ApiError("ReferenceError", "User token not created", "", 401));
            }
            encToken = new Buffer(Token, "utf8").toString("base64");

            mailOption = {
              "to": req.body.emailId,
              "from": "info@cantahealth.com",
              "text": "Hello User",
              "html": `<footer>The Pin displayed in this email can be used to change the password ${code}.
            For any query or clarification please feel free to contact info@cantahealth.com.
            <P> <a href=${req.headers.origin}/#/changePassword?token=${encToken}>Click here to change password</a>
            </P></footer>`
            };

            this.Nodemailer.send(mailOption)
              .then(resp => {
                this.loggerInstance.debug("Mail sent Successfully");
                res.status(200).send(resp);
              }, err => {
                this.loggerInstance.debug("Mail can't be sent due to Error =>", err);
                return next(new ApiError("Internal Server Error", "Mail failure", err, 500));
              });
          });
      })
      .catch(err => {
        this.loggerInstance.debug(err);
        return next(err);
      });
  }

  validateUserToken(req, res, next) {

    this.loggerInstance.info("=== post request validate User Token ====>", req.body.token);
    let secretKey = req.app.get("tokenSecret"),
      decodeToken = new Buffer(req.body.token, "base64").toString("utf8"),
      verifiedToken, apiErr;

    verifiedToken = this.verifyToken(decodeToken, secretKey);

    if (!verifiedToken) {
      return next(new ApiError("Unauthorized Token", "User is not authorized to access", "", 401));
    }

    args.collection = "accounts";
    args.filter = {"emailID": verifiedToken.userEmail};
    args.projection = {
      "resetPin": 1
    };

    this.genericRepo_.retrieve(args).then(response => {
      if (!response) {
        apiErr = new ApiError("ReferenceError", "User Data not Found", "", 404);
        return next(apiErr);
      } else if (verifiedToken.pin !== response.resetPin) {
        apiErr = new ApiError("ReferenceError", "You already update Your password once with this link", "", 403);
        return next(apiErr);
      }
      res.status(200).send("done");
    });

  }

  changePassword(req, res, next) {
    let decodeToken,
      secretKey = req.app.get("tokenSecret");

    decodeToken = new Buffer(req.body.token, "base64").toString("utf8");
    decodeToken = this.verifyToken(decodeToken, secretKey);
    this.loggerInstance.info("=== post request change Password ====>", decodeToken);
    args.collection = "accounts";
    args.filter = {"emailID": decodeToken.userEmail};
    args.projection = {
      "resetPin": 1
    };
    this.genericRepo_.retrieve(args).then(response => {
      if (!response) {
        return next(new ApiError("ReferenceError", "User Data not Found", "", 404));
      } else if (req.body.Pin !== response.resetPin) {
        return next(new ApiError("ReferenceError", "You already update Your password with this OTP", "", 403));
      }
      args.collection = "accounts";
      args.filter = {"emailID": decodeToken.userEmail};
      args.projection = {
        "$set": {
          "password": crypto
            .createHash("md5")
            .update(req.body.Password)
            .digest("hex"),
          "resetPin": ""
        }
      };
      this.genericRepo_.updateRecord(args).then(result => {
        if (!result) {
          return next(new ApiError("ReferenceError", "User Data not Found", "", 404));
        }
        return res.status(200).send("done");
      });
    }).catch(err => {
      this.loggerInstance.debug(err);
    });
  }

  createToken(payload, secret, claims) {
    let defer = Q.defer();

    jwt.sign(payload, secret, claims, (error, token) => {
      if (!error) {
        this.loggerInstance.debug("Token Generated");
        defer.resolve(token);
      } else {
        this.loggerInstance.debug("token not generated", error);
        defer.reject(error);
      }
    });
    return defer.promise;
  }

  verifyToken(data, secretKey, next) {
    try {
      let decoded = jwt.verify(data, secretKey);

      return decoded;
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return next(new ApiError(err.name, err.message, 400));
      }
      return next(new ApiError(err.name, err.message, 401));
    }
  }
}

