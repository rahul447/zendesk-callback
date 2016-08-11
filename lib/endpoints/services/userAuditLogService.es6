"use strict";
import ApiError from "../../util/apiError";
import json2csv from "json2csv";

let insertArgs = {
    "collection": "",
    "docs": []
  },
  args = {
    "collection": "",
    "filter": {},
    "projection": {}
  };

export class UserAuditLogService {

  constructor(genericRepo, loggerInstance) {
    this.genericRepo_ = genericRepo;
    this.loggerInstance_ = loggerInstance;
  }

  add(req, res) {

    let data = req.body || {};

    this.loggerInstance_.info("===post User Audit Log====>");

    insertArgs.collection = "auditlogs";
    insertArgs.docs = Array.of(data);

    this.genericRepo_.insertMany(insertArgs);
    return res.status(201).send("Audit Done");
  }

  get(selectArgs) {

    return this.genericRepo_.retrieveMany(selectArgs)
      .then(response => {
        return response;
      }, err => {
        return err;
      });
  }

  getAuditLogs(req, res, next) {

    this.loggerInstance_.info("in getAuditLogs===", req.isAuditTrail);

    if (req.isAuditTrail) {
      let projection = {};

      this.loggerInstance_.info("=== getAuditLogs User Audit Logs ====>");

      args.collection = "auditlogs";
      args.filter = {};
      args.projection[projection] = null;

      this.get(args)
        .then(data => {

          let fields = ["auditType",
              "auditAction",
              "auditActionParam",
              "user.emailID",
              "user.userName",
              "user.landingPage",
              "user.entitlements",
              "dashboardName",
              "fromState",
              "toState",
              "fromParams",
              "toParams",
              "preferredFilters",
              "dateRange",
              "gridColumns",
              "gridColumnFilters",
              "patientID",
              "recordDate",
              "timestamp",
              "auditLogVersion"],
            fieldNames = ["Audit Type",
              "Audit Action",
              "Action Parameters",
              "Email ID",
              "User Name",
              "Landing Page",
              "Entitlements",
              "Dashboard Name",
              "From State",
              "To State",
              "From Params",
              "To Params",
              "Preferred Filters",
              "Date Range",
              "Grid Columns",
              "Grid Columns Filters",
              "Patient ID",
              "Record Date",
              "Timestamp",
              "Log Version"];

          json2csv({"data": data, "fields": fields, "fieldNames": fieldNames}, (error, convertedCSV) => {
            if (error) {
              this.loggerInstance_.error(error);
              res.status(500).send(error.stack);
            } else {
              res.status(200).send(convertedCSV);
            }
          });
        }, err => {
          next(new ApiError("Internal Server Error", "DB error", err, 500));
        });
    } else {
      console.log("in getAuditLogs=== else");
    }
  }

  authenticateAuditLogs(req, res, next) {
    let projection = {};

    this.loggerInstance_.info("=== authenticateAuditLogs User Audit Logs ====>");
    args.collection = "accounts";
    args.filter = {
      "emailID": req.body.emailID
    };
    args.projection[projection] = null;
    return this.genericRepo_.retrieve(args)
      .then(data => {
        if (data.isAuditTrail) {
          this.loggerInstance_.debug("====== User Authenticate for Audit Trail successfully===>", data);
          req.isAuditTrail = true;
          return next();
        }
      }, err => {
        this.loggerInstance_.debug("===Error while Authenticate for Audit Trail=>", err);
        next(new ApiError("Internal Server Error", "Mongo server Error for Audit Trail", err, 500));
      })
      .catch(error => {
        this.loggerInstance_.debug("===Error while Authenticate for Audit Trail=>", error);
        next(new ApiError("Internal Server Error", "Mongo server Error for Audit Trail", error, 500));
      })
      .done();
  }
}
