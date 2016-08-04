"use strict";
import ApiError from "../../util/apiError";
import Q from "q";
import merge from "deepmerge";

export class DrillService {

  constructor(genericRepo, loggerInstance, config) {
    this.genericRepo_ = genericRepo;
    this.loggerInstance = loggerInstance;
    this.config = config;
  }

  /* getDrillData(req) {
    this.loggerInstance.info("=========get Drill Data===========>", req.userId);
    let projection = `dashboard.${req.params.name}.groups`;

    args.collection = "drilldown_data";
    args.filter = {"_id": req.userId};
    args.projection[projection] = 1;

    return this.genericRepo_.retrieve(args);
  } */

  getDrillData(req) {
    let args = {
      "collection": "",
      "filter": {}
    };

    this.loggerInstance.info("=========get Drill Data===========>", req.userId);
    const pageNum = typeof req.params.pageNumber !== "undefined" ? Number(req.params.pageNumber) : 1;

    args.collection = "drilldown_data";
    args.filter = {"_id": req.userId};

    if (pageNum === 1) {
      args._start = 0;
    }else if (pageNum) {
      args._start = this.config.limit * (pageNum - 1);
    }
    args._end = this.config.limit;
    args._domain = req.params.name;
    args._group = Number(req.params.group);
    args._portlet = Number(req.params.portlet);

    return this.genericRepo_.paginate(args);
  }

  getDrillDataUsers(req) {
    let args = {
        "collection": "",
        "filter": {},
        "projection": {}
      },
      projection = `dashboard.${req.params.name}.groups`;

    this.loggerInstance.info("=========get Drill Data=====USERS======>");

    args.collection = "users";
    args.filter = {"_id": req.userId};
    args.projection[projection] = 1;
    args.projection.lastUpdatedDate = 1;

    return this.genericRepo_.retrieve(args);
  }

  getDrillPreferences(req) {
    let args = {
        "collection": "",
        "filter": {},
        "projection": {}
      },
      projection = `dashboard.${req.params.name}.groups`;

    this.loggerInstance.info("=========get Drill Preferences========>");

    args.collection = "preferences";
    args.filter = {"userId": req.userId};
    // _id in preferences collection indicates preference id. We don't need that.
    args.projection = {"_id": 0};
    args.projection[projection] = 1;

    return this.genericRepo_.retrieve(args);
  }

  getDrillDashboard(req, res, next) {
    this.loggerInstance.info("=========get Drill Dashboard========>");

    Q.all([
      this.getDrillDataUsers(req),
      this.getDrillPreferences(req),
      this.getDrillData(req)
    ])
    .then(response => {
      if (response) {
        let drillUsers = response[0].dashboard[req.params.name].groups[req.params.group].portlets[req.params.portlet],
          drillPref = response[1].dashboard[req.params.name].groups[req.params.group].portlets[req.params.portlet],
          output = merge(drillUsers, drillPref),
          totalPages = response[2][0].arrLength / this.config.limit,
          mod = response[2][0].arrLength % this.config.limit;

        output.numberOfResults = response[2][0].arrLength;
        output.limit = this.config.limit;
        output.pages = mod === 0 ? totalPages : Math.ceil(totalPages);
        output.drillDown = {
          "data": response[2][0].item
        };
        output.icon = response[1].dashboard[req.params.name].groups[req.params.group].icon;
        output.title = response[1].dashboard[req.params.name].groups[req.params.group].title;
        output.lastUpdatedDate = response[0].lastUpdatedDate;
        return res.status(200).send(output);
      }
      return next(new ApiError("ReferenceError", "Data not Found", response, 404));
    }, err => {
      console.log("Error Retreiving DrillDown data");
      return next(new ApiError("Internal Server Error", "DB error", err, 500));
    })
      .catch(error => {
        this.loggerInstance.debug(`Caught Error ${DrillService.name}.getDrillDashboard `, error);
        return res.status(500).send(error);
      })
    .done();
  }
}
