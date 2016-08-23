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

  getDrillDown(req) {
    this.loggerInstance.info("=========get Drill Data===========>", req.userId);
    let args = {
      "collection": "",
      "filter": {}
    };

    args.collection = "drilldown_data";
    args.filter = {"_id": req.userId};
    args._domain = req.params.name;
    args._group = req.params.group;
    args._portlet = req.params.portlet;

    return this.genericRepo_.retrieve(args);
  }

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

  getLimitedDrill(req) {
    let args = {
      "collection": "",
      "filter": {}
    };

    this.loggerInstance.info(`$$$ ${DrillService.name} getLimitedDrill for =>`, req.userId);

    args.collection = "drilldown_data";
    args.filter = {"_id": req.userId};
    args._domain = req.params.name;
    args._group = req.params.group;
    args._portlet = req.params.portlet;
    args._limit = this.config.drillLimit;

    return this.genericRepo_.getLimitedDrill(args);
  }

  getDrillDataUsers(req) {
    let args = {
        "collection": "",
        "filter": {},
        "projection": {}
      },
      projection = `dashboard.${req.params.name}.groups`;

    this.loggerInstance.info(`$$$ ${DrillService.name} getDrillDataUsers() ===>`);

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

    this.loggerInstance.info(`$$$ ${DrillService.name} getDrillPreferences() ==>`);

    args.collection = "preferences";
    args.filter = {"userId": req.userId};
    // _id in preferences collection indicates preference id. We don't need that.
    args.projection = {"_id": 0};
    args.projection[projection] = 1;

    return this.genericRepo_.retrieve(args);
  }

  getDrillDashboard(req, res, next) {
    this.loggerInstance.info(`$$$ ${DrillService.name} getDrillDashboard() ==>`);

    Q.all([
      this.getDrillDataUsers(req),
      this.getDrillPreferences(req),
      this.getLimitedDrill(req)
    ])
    .then(response => {
      if (response) {
        let drillUsers = response[0].dashboard[req.params.name].groups[req.params.group].portlets[req.params.portlet],
          drillPref = response[1].dashboard[req.params.name].groups[req.params.group].portlets[req.params.portlet],
          output = merge(drillUsers, drillPref);

        output.numberOfResults = response[2][0].arrLength;
        output.drillDown = {
          "data": response[2][0].item
        };
        output.icon = response[1].dashboard[req.params.name].groups[req.params.group].icon;
        output.title = response[1].dashboard[req.params.name].groups[req.params.group].title;
        output.lastUpdatedDate = response[0].lastUpdatedDate;
        return res.status(200).send(output);
      }
      this.loggerInstance.debug(`$$$ ${DrillService.name} getDrillDashboard() => Data not Found`);
      return next(new ApiError("ReferenceError", "Data not Found", response, 404));
    }, err => {
      this.loggerInstance.debug("Error Retreiving DrillDown data for => %s Error %s", req.userId, err);
      return next(new ApiError("Internal Server Error", "DB error", err, 500));
    })
      .catch(error => {
        this.loggerInstance.debug(`Caught Error ${DrillService.name}.getDrillDashboard `, error.stack);
        return res.status(500).send(error);
      })
    .done();
  }

  getAllDrill(req, res, next) {
    let args = {
      "collection": "",
      "filter": {}
    };

    this.loggerInstance.info(`$$$ ${DrillService.name} getAllDrill for =>`, req.userId);

    args.collection = "drilldown_data";
    args.filter = {"_id": req.userId};
    args._domain = req.params.name;
    args._group = req.params.group;
    args._portlet = req.params.portlet;

    return this.genericRepo_.getAllDrill(args)
      .then(result => {
        if (result.length) {
          this.loggerInstance.debug(`$$$ ${DrillService.name} getAllDrill Query Result`, req.userId);

          let data = typeof result[0] !== "undefined" && result[0].item.length > 0 ? result[0].item : "No drill Data";

          return res.status(200).send(data);
        }
        return next(new ApiError("ReferenceError", "Drill Data not Found", result, 404));
      })
      .catch(err => {
        this.loggerInstance.debug(`$$$ ${DrillService.name} getAllDrill Error `, err);
        return next(new ApiError("Internal Server Error", "getAllDrill Catch()", err, 500));
      });
  }
}
