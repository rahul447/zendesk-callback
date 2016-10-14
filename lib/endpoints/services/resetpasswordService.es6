"use strict";
import ApiError from "../../util/apiError";
import otp from "otplib/lib/authenticator";

let args = {
  "collection": "",
  "filter": {},
  "projection": {}
};

export class ResetPasswordService {
  constructor(genericRepo, loggerInstance, NodeMailer) {
    this.genericRepo_ = genericRepo;
    this.loggerInstance = loggerInstance;
    this.Nodemailer = NodeMailer;
  }

  requestchangePassword(req, res, next) {
    this.loggerInstance.info("=== post request change Password ====>");
    let code, secret;

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
      args.collection = "accounts";
      args.filter = {"emailID": req.body.emailId};
      args.projection = {
        "$set": {"resetPin": code}
      };
      this.genericRepo_.updateRecord(args).then(result => {
        if (!result) {
          return next(new ApiError("ReferenceError", "User Data not Found", res, 404));
        }
      });
    }).then(() => {
      let mailOption = {
        "to": req.body.emailId,
        "from": "info@cantahealth.com",
        "text": "Hello User",
        "html": `<footer>
      The Pin displayed in this email can be used to change the password ${code}.
      For any query or clarification please feel free
      to contact info@cantahealth.com</footer>`
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
  }

  validateResetPin(req, res, next) {
    args.collection = "accounts";
    args.filter = {"emailID": req.body.emailId};
    args.projection = {"resetPin": 1};
    this.genericRepo_.retrieve(args).then(response => {
      if (!response) {
        return next(new ApiError("ReferenceError", "User Data not Found", res, 404));
      }
      return response.status(200).send();
    });
  }
}

