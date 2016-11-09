"use strict";
import ApiError from "../../util/apiError";
import otp from "otplib/lib/authenticator";
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
    let code, secret, secretKey;

    args.collection = "accounts";
    args.filter = {"emailID": req.body.emailId};
    args.projection = {};

    this.genericRepo_.retrieve(args).then(response => {
      if (!response) {
        return next(new ApiError("ReferenceError", "User Data not Found", res, 404));
      }
    }).then(() => {
      secret = otp.generateSecret();
      code = otp.generate(secret);
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
            return next(new ApiError("ReferenceError", "User token not created", res, 401));
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
          console.log("createToken , >>>>>>>>>>", mailOption);

          this.Nodemailer.send(mailOption)
            .then(resp => {
              this.loggerInstance.debug("Mail sent Successfully");
              res.status(200).send(resp);
            }, err => {
              this.loggerInstance.debug("Mail can't be sent due to Error =>", err);
              return next(new ApiError("Internal Server Error", "Mail failure", err, 500));
            });
        });
    });
  }

  validateUserToken(req, res, next) {

    this.loggerInstance.info("=== post request validate User Token ====>", req.body.token);
    args.collection = "accounts";
    let secretKey = req.app.get("tokenSecret"),
      decodeToken = new Buffer(req.body.token, "base64").toString("utf8"),
      verifiedToken;

    verifiedToken = this.verifyToken(decodeToken, secretKey);
    if (!verifiedToken) {
      return next(new ApiError("Unauthorized Token", "User is not authorized to access", "", 401));
    }
    res.status(200).send(verifiedToken);
  }

  changePassword(req, res, next) {
    let decodeToken,
      secretKey = req.app.get("tokenSecret");

    decodeToken = new Buffer(req.body.token, "base64").toString("utf8");
    decodeToken = this.verifyToken(decodeToken, secretKey);
    this.loggerInstance.info("=== post request change Password ====>", decodeToken);
    args.collection = "accounts";
    args.filter = {"emailID": decodeToken.userEmail};
    this.genericRepo_.retrieve(args).then(response => {
      if (!response) {
        return next(new ApiError("ReferenceError", "User Data not Found", res, 404));
      }
      if (req.body.Pin === decodeToken.pin) {
        args.collection = "accounts";
        args.filter = {"emailID": decodeToken.userEmail};
        args.projection = {
          "$set": {"password": crypto
            .createHash("md5")
            .update(req.body.Password)
            .digest("hex")}
        };
        this.genericRepo_.updateRecord(args).then(result => {
          if (!result) {
            return next(new ApiError("ReferenceError", "User Data not Found", res, 404));
          }
          return res.status(200).send("done");
        });
      }
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

