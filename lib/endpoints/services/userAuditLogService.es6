"use strict";
import ApiError from "../../util/apiError";

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

    let projection = {};

    this.loggerInstance_.info("=== getAuditLogs User Audit Logs ====>");

    args.collection = "auditlogs";
    args.filter = {};
    args.projection[projection] = null;

    return this.get(args)
      .then(data => {

        let json2csv = require("json2csv"),
          fields = ["auditType", "auditAction", "auditActionParam", "user.emailID", "user.userName",
            "user.landingPage", "user.entitlements", "dashboardName", "fromState", "toState",
            "fromParams", "toParams", "preferredFilters", "dateRange", "gridColumns",
            "gridColumnFilters", "patientID", "recordDate", "timestamp", "auditLogVersion"],
          fieldNames = ["Audit Type", "Audit Action", "Action Parameters", "Email ID", "User Name",
            "Landing Page", "Entitlements", "Dashboard Name", "From State", "To State",
            "From Params", "To Params", "Preferred Filters", "Date Range", "Grid Columns",
            "Grid Columns Filters", "Patient ID", "Record Date", "Timestamp", "Log Version"],
          csv = json2csv({"data": data, "fields": fields, "fieldNames": fieldNames}, (error, convertedCSV) => {
            if (error) {
              this.loggerInstance_.error(error);
              res.status(412).send(error.stack);
            } else {
              res.status(200).send(convertedCSV);
            }
          });

        this.loggerInstance_.error("csv length: ", csv.length);

      }, err => {
        return next(new ApiError("Internal Server Error", "DB error", err, 500));
      });
  }
}
