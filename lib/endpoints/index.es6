"use strict";

import express from "express";
import {LeaderShipService} from "./services/leadershipService";
import {DrillService} from "./services/drillService";
import {EmailService} from "./services/emailService";
import mongodb from "mongodb";
import loggerInstance from "../util/FocusApiLogger";
import {getGenericRepoInstance} from "../endpoints/generic/GenericRepository";
import {DomainService} from "./services/domainService";
import {LoginService} from "./services/loginService";

let router = express.Router(),
  {NODE_ENV} = process.env,
  nodeEnv = NODE_ENV || "local",
  config = Object.freeze(require("../../config/" + nodeEnv)),
  domainRoute = router.route("/domain/:name"),
  domainPortletRoute = router.route("/domain/:name/:groupId/:portletId"),
  gridRoute = router.route("/grid/:Id"),
  leadershipRoute = router.route("/leadership"),
  emailRoute = router.route("/sendemail"),
// leadershipActionableRoute = router.route("/actionable/:id"),
  loginRoute = router.route("/login"),
  genericRepo = getGenericRepoInstance({"config": config, "mongodb": mongodb, "loggerInstance": loggerInstance}),
  domainService = new DomainService(genericRepo, loggerInstance, mongodb),
  loginService = new LoginService(genericRepo, loggerInstance),
  leadershipService = new LeaderShipService(genericRepo),
  drillService = new DrillService(genericRepo),
  emailService = new EmailService();

domainRoute
  .get(domainService.getDashboard.bind(domainService));

loginRoute
  .post(loginService.login.bind(loginService));

leadershipRoute
  .get(leadershipService.getLeadershipDashboard.bind(leadershipService));

domainPortletRoute
  .get(drillService.getdrillDashboard.bind(drillService));

gridRoute
  .get(drillService.getdrillgrid.bind(drillService));

emailRoute
  .get(emailService.sendmail.bind(emailService));

export {router};
