"use strict";

import merge from "deepmerge";
import express from "express";
import mongodb from "mongodb";
import Q from "q";
import loggerInstance from "../util/FocusApiLogger";
import {getGenericRepoInstance} from "../endpoints/generic/GenericRepository";
import {DomainService} from "./services/domainService";
// import {getGenericServiceInstance} from "./services/GenericService";
import {DrillService} from "./services/drillService";
import {EmailService} from "./services/emailService";
import {LeaderShipService} from "./services/leadershipService";
import {LoginService} from "./services/loginService";

let router = express.Router(),
  {NODE_ENV} = process.env,
  nodeEnv = NODE_ENV || "local",
  config = Object.freeze(require("../../config/" + nodeEnv)),
  domainRoute = router.route("/domain/:name"),
  drillRoute = router.route("/domain/:name/:group/:portlet"),
  leadershipRoute = router.route("/leadership"),
  emailRoute = router.route("/sendemail"),
// leadershipActionableRoute = router.route("/actionable/:id"),
  loginRoute = router.route("/login"),
  genericRepo = getGenericRepoInstance({"config": config, "mongodb": mongodb, "loggerInstance": loggerInstance}),
  // genericService = getGenericServiceInstance(genericRepo, loggerInstance, mongodb),
  domainService = new DomainService(genericRepo, loggerInstance, Q, merge),
  loginService = new LoginService(genericRepo, loggerInstance),
  leadershipService = new LeaderShipService(genericRepo, loggerInstance, Q, merge),
  drillService = new DrillService(genericRepo, loggerInstance, Q, merge),
  emailService = new EmailService(loggerInstance);

domainRoute
  .get(domainService.getDomainDashboard.bind(domainService));

loginRoute
  .post(loginService.login.bind(loginService));

leadershipRoute
  .get(leadershipService.getLeadershipDashboard.bind(leadershipService));

drillRoute
  .get(drillService.getDrillDashboard.bind(drillService));

emailRoute
  .get(emailService.sendmail.bind(emailService));

export {router};
