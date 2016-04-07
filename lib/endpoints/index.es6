"use strict";

import express from "express";
import {DomainService} from "./services/domainService";
import {LeaderShipService} from "./services/leadershipService";
import {DrillService} from "./services/drillService";
import {EmailService} from "./services/emailService";
import mongodb from "mongodb";
import loggerInstance from "../util/FocusApiLogger";
import {getGenericRepoInstance} from "../endpoints/generic/GenericRepository";

let router = express.Router(),

  domainRoute = router.route("/domain/:name"),
  domainPortletRoute = router.route("/domain/:name/:groupId/:portletId"),
  gridRoute = router.route("/grid/:Id"),
  leadershipRoute = router.route("/leadership"),
  emailRoute = router.route("/sendemail"),

// leadershipActionableRoute = router.route("/actionable/:id"),
// loginRoute = router.route("/login");
  {NODE_ENV} = process.env,
  nodeEnv = NODE_ENV || "local",
  config = Object.freeze(require("../../config/" + nodeEnv)),
  genericRepo, domainService, leadershipService, drillService, emailService;

genericRepo = getGenericRepoInstance({"config": config, "mongodb": mongodb, "loggerInstance": logger});
domainService = new DomainService(genericRepo);
leadershipService = new LeaderShipService(genericRepo);
drillService = new DrillService(genericRepo);
emailService = new EmailService();

domainRoute
  .get(domainService.getDashboard.bind(domainService));


leadershipRoute
  .get(leadershipService.getLeadershipDashboard.bind(leadershipService));

domainPortletRoute
  .get(drillService.getdrillDashboard.bind(drillService));

gridRoute
  .get(drillService.getdrillgrid.bind(drillService));

emailRoute
  .get(emailService.sendmail.bind(emailService));

export default router;

